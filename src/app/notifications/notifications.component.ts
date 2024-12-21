import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { User, Post } from 'database';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


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
  mutualLikes: { [key: string]: boolean } = {};

  


  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const notificationsEnabled = this.getNotificationsStatus();

      if (notificationsEnabled) {
    const userId = this.getUserIdFromAuthService();
    if (userId) {
      this.loadNotifications(userId); // Carrega as notificações apenas se estiverem ativadas
    }
  }

  this.getCurrentUser();
    
   
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
  
  

  likePost(postId: string) {
    this.apiService.likePostInFirstFeed(postId).subscribe(
      (updatedPost: Post) => {
        if (updatedPost) {
          this.posts = this.posts.map((post) => {
            if (post._id === updatedPost._id) {
              // Atualiza os likes no post
              return {
                ...post,
                likes: updatedPost.likes,
              };
            }
            return post;
          });
  
          // Identifica o dono da postagem e envia uma notificação
          const postOwnerId = typeof updatedPost.owner === 'object' ? updatedPost.owner._id : updatedPost.owner;
          const currentUserId = this.getUserIdFromAuthService(); // Usuário que curtiu
  
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
  
  notifyUser(postOwnerId: string, likerId: string) {
    // Obtem informações do usuário que curtiu
    this.apiService.getUserById(likerId).subscribe({
      next: (liker: User) => {
        const notificationMessage = `${liker.name} curtiu seu Post!`;
  
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
  loadNotifications(userId: string) {
    const notificationsEnabled = this.getNotificationsStatus();
    const notificationsKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
   
    if (notifications.length > 0) {
      // Exibir as notificações de forma apropriada, talvez usando uma variável de estado
      this.notifications = notifications;
      // Exibir as notificações de alguma forma, como com um `snackBar` ou em um componente dedicado
      notifications.forEach((notification: string) => {
        this.snackBar.open(notification, 'Fechar', { duration: 3000 });


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
  
        // Adiciona notificação para o usuário curtido
        this.addNotification(likedUserId);
  
        this.checkMutualLikes(); // Verifica se há um match
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
  // Método para adicionar uma notificação ao localStorage
  addNotification(likedUserId: string): void {
    // Verifica se as notificações estão ativadas antes de proceder
    const notificationsEnabled = this.getNotificationsStatus();
    if (!notificationsEnabled) {
      console.log('Notificações desativadas. Nenhuma notificação será adicionada.');
      return; // Se as notificações estiverem desativadas, não adiciona a notificação
    }
  
    const notificationsKey = `notifications_${likedUserId}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
  
    // Verifica se a notificação já existe
    const notificationExists = notifications.some(
      (n: any) => n.userId === this.currentUser._id
    );
  
    if (!notificationExists) {
      // Cria a notificação
      const newNotification = {
        userId: this.currentUser._id,
        message: `${this.currentUser.name} curtiu seu perfil.`,
        timestamp: new Date().toISOString(),
      };
  
      // Adiciona a notificação à lista existente
      notifications.push(newNotification);
  
      // Salva no localStorage
      localStorage.setItem(notificationsKey, JSON.stringify(notifications));
  
      console.log('Notificação adicionada:', newNotification);
    } else {
      console.log('Notificação já existente, nenhuma ação realizada.');
    }
  }
  
  // Método para obter notificações do usuário logado
  getNotifications(): any[] {
    if (!this.currentUser || !this.currentUser._id) {
      console.error('Usuário atual não encontrado.');
      return [];
    }
  
    const notificationsKey = `notifications_${this.currentUser._id}`;
    return JSON.parse(localStorage.getItem(notificationsKey) || '[]');
  }
  
  // Método para limpar notificações do usuário logado
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
    this.apiService.getUserById(currentUserId).subscribe(
      (data: User) => {
        this.currentUser = data;
        this.checkMutualLikes();
      },
      (error) => {
        console.error('Erro ao carregar o perfil do usuário atual:', error);
      }
    );
  }
  // Método para ativar ou desativar notificações
toggleNotifications(): void {
  const notificationsEnabled = this.getNotificationsStatus();
  const newStatus = !notificationsEnabled; // Se estiver ativado, desativa, e vice-versa
  
  // Salva a nova configuração no localStorage
  localStorage.setItem('notificationsEnabled', JSON.stringify(newStatus));
  
  // Mostra um feedback visual sobre a mudança
  this.snackBar.open(newStatus ? 'Notificações ativadas' : 'Notificações desativadas', 'Fechar', { duration: 3000 });
  window.location.reload();
}

// Método para verificar se as notificações estão ativadas ou desativadas
getNotificationsStatus(): boolean {
  const status = localStorage.getItem('notificationsEnabled');
  return status ? JSON.parse(status) : true; // Por padrão, as notificações estão ativadas
}



  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }


  












  
}
