import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { User, Post } from 'database';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface LikesResponse {
  content: string;
  likes: User[];
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  usersWhoLikedPosts: LikesResponse[] = [];
  usersWhoLikedProfile: User[] = [];
  notifications: string[] = [];
  posts: Post[] = [];
  users: User[] = [];
  user: any = {};
  userId: string = '';
  currentUser!: User;
  followers: any[] = [];
  mutualLikes: { [key: string]: boolean } = {};
  unreadNotificationsCount: number = 0;


  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const notificationsEnabled = this.getNotificationsStatus();

    if (notificationsEnabled) {
      const userId = this.getUserIdFromAuthService();
      if (userId) {
        this.loadNotifications(userId);
        this.getNewFollowers(userId);
        
      }
    }

    this.getCurrentUser();
    const userId = this.getUserIdFromAuthService();
    if (userId) {
        this.getUnreadNotificationsCount(userId);
    }

  }

  loadLikesForPost(postId: string): void {
    this.apiService
      .getUsersWhoLikedPost(postId)
      .subscribe((response: LikesResponse) => {
        this.usersWhoLikedPosts.push({
          content: response.content,
          likes: response.likes,
        });
      });
  }
  markNotificationsAsRead(userId: string): void {
    const notificationsKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');

    notifications.forEach((n: any) => (n.read = true));
    localStorage.setItem(notificationsKey, JSON.stringify(notifications));

    this.unreadNotificationsCount = 0;
    console.log('Todas as notificações foram marcadas como lidas.');
}

  getUnreadNotificationsCount(userId: string): void {
    const notificationsKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
    this.unreadNotificationsCount = notifications.filter((n: any) => !n.read).length;
}


  likePost(postId: string) {
    this.apiService.likePostInFirstFeed(postId).subscribe(
      (updatedPost: Post) => {
        if (updatedPost) {
          this.posts = this.posts.map((post) => {
            if (post._id === updatedPost._id) {
              return {
                ...post,
                likes: updatedPost.likes,
              };
            }
            return post;
          });

          const postOwnerId =
            typeof updatedPost.owner === 'object'
              ? updatedPost.owner._id
              : updatedPost.owner;
          const currentUserId = this.getUserIdFromAuthService();

          if (postOwnerId !== currentUserId) {
            this.notifyUser(postOwnerId, currentUserId);
          }
        }
      },
      (error) => {
        console.error('Erro ao curtir o post:', error);
      }
    );
  }
  notifiUser(postOwnerId: string, likerId: string) {
    
    this.apiService.getUserById(likerId).subscribe({
      next: (liker: User) => {
        const notificationMessage = `${liker.name} Não resistiu e curtiu sua foto mais provocante!`;
  
        // Recupera notificações existentes
        const notificationsKey = `notifications_${postOwnerId}`;
        const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
  
        // Adiciona nova notificação
        notifications.push(notificationMessage);
        localStorage.setItem(notificationsKey, JSON.stringify(notifications));
  
        console.log(`Notificação enviada para o usuário ${postOwnerId}: ${notificationMessage}`);
      },
      error: (error) => {
        console.error('Erro ao obter informações do usuário que curtiu:', error);
      },
    });
  }

  notifyUser(postOwnerId: string, likerId: string) {
    this.apiService.getUserById(likerId).subscribe({
      next: (liker: User) => {
        const notificationMessage = `${liker.name} curtiu seu Post!`;

        const notificationsKey = `notifications_${postOwnerId}`;
        const notifications = JSON.parse(
          localStorage.getItem(notificationsKey) || '[]'
        );

        notifications.push(notificationMessage);
        localStorage.setItem(notificationsKey, JSON.stringify(notifications));

        console.log(
          `Notificação enviada para o usuário ${postOwnerId}: ${notificationMessage}`
        );
      },
      error: (error) => {
        console.error(
          'Erro ao obter informações do usuário que curtiu:',
          error
        );
      },
    });
  }
  loadNotifications(userId: string): void {
    const notificationsKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
  
    this.notifications = notifications;
    this.unreadNotificationsCount = notifications.filter(
      (notification: any) => !notification.read
    ).length;
  
    if (notifications.length > 0) {
      notifications.forEach((notification: any) => {
        if (!notification.read) {
          this.snackBar.open(notification.message, 'Fechar', { duration: 3000 });
        }
      });
    }
  }
  
  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }
  
  likeUser(likedUserId: string): void {
    if (!this.currentUser || !this.currentUser._id) {
      console.error('Usuário atual não encontrado.');
      return;
    }
  
    const userId = this.currentUser._id;
  
    this.apiService.likeUser(userId, likedUserId).subscribe(
      (response) => {
        console.log('Like registrado com sucesso!', response);
  
        
        const notificationMessage = 'Parece que alguém está de olho em você!';
        this.notifications.push(notificationMessage);
  
       
        const notificationsKey = `notifications_${likedUserId}`;
        const existingNotifications: string[] = JSON.parse(
          localStorage.getItem(notificationsKey) || '[]'
        );
        existingNotifications.push(notificationMessage);
        localStorage.setItem(
          notificationsKey,
          JSON.stringify(existingNotifications)
        );
  
        this.checkMutualLikes(); 
      },
      (error) => {
        console.error('Erro ao registrar o like:', error);
      }
    );
  }
  

  checkMutualLikes(): void {
    if (!this.currentUser) return;

    this.users.forEach((user) => {
      this.apiService.checkMutualLike(this.currentUser._id, user._id).subscribe(
        (response) => {
          this.mutualLikes[user._id] = response.mutualLike;
        },
        (error) => {
          console.error('Erro ao verificar reciprocidade de likes:', error);
        }
      );
    });
  }


  clearNotifications(): void {
    if (!this.currentUser || !this.currentUser._id) {
      console.error('Usuário atual não encontrado.');
      return;
    }

    const notificationsKey = `notifications_${this.currentUser._id}`;
    localStorage.removeItem(notificationsKey);
    console.log('Notificações limpas para o usuário logado.');
  }

  getCurrentUser(): void {
    const currentUserId = this.getLoggedUserId();
    if (!currentUserId) {
      console.error('Nenhum usuário logado encontrado.');
      return;
    }

    this.apiService.getUserById(currentUserId).subscribe(
      (data: User) => {
        this.currentUser = data;
        console.log('Usuário atual carregado:', this.currentUser);
        this.checkMutualLikes();
      },
      (error) => {
        console.error('Erro ao carregar o perfil do usuário atual:', error);
      }
    );
  }

  toggleNotifications(status: boolean): void {
    const notificationsEnabled = this.getNotificationsStatus();
    const newStatus = !notificationsEnabled;

    localStorage.setItem('notificationsEnabled', JSON.stringify(newStatus));

    this.snackBar.open(
      newStatus ? 'Notificações ativadas' : 'Notificações desativadas',
      'Fechar',
      { duration: 3000 }
    );
    window.location.reload();
  }

  getNotificationsStatus(): boolean {
    const status = localStorage.getItem('notificationsEnabled');
    return status ? JSON.parse(status) : true;
  }

  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  getNewFollowers(userId: string): void {
    if (!userId) {
      console.error('ID do usuário não fornecido.');
      return;
    }

    this.apiService.getFollowers(userId).subscribe({
      next: (followers: any[]) => {
        if (followers && followers.length > 0) {
          this.followers = followers;
          console.log('Seguidores carregados:', this.followers);
        } else {
          this.followers = [];
          console.log('Nenhum seguidor encontrado.');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar seguidores:', err);
      },
    });
  }
}
