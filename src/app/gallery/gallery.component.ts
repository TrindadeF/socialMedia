import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, User } from 'database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgIfContext } from '@angular/common';

@Component({
  selector: 'app-nakedfeed',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  users: User[] = [];
  user: any = {};
  userId: string = '';
  posts: Post[] = [];
  currentUser: User | null = null;
  mutualLikes: { [key: string]: boolean } = {};
  hasActiveSubscription: boolean | undefined;
  showOverlay: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  postContent: string = '';
  selectedImageUrl: string = '';
  selectedImage: string = '';
  selectedPostId: string = '';
  showImageViewer: boolean = false;
  profilePicUrl: string = '';
  secondPosts?: Post[] = [];
  gender: string = 'all';
  filteredUsers: User[] = [];
  currentIndex: number = 0;
  swipeDirection: string | null = null;
  restrictedInfo!: TemplateRef<NgIfContext<boolean>> | null;
  searchQuery: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserSecondPosts();
    this.checkUserSubscriptionStatus();
    this.getCurrentUser();
    this.fetchUserPosts();
    this.checkMutualLikes();
  }

  openImageViewer(postId: string) {
    this.selectedPostId = postId;
    this.showImageViewer = true;
  }

  loadUserSecondPosts(): void {
    const userId = this.getLoggedUserId();
    this.apiService.getUserSecondPosts(userId).subscribe({
      next: (data: Post[]) => {
        this.secondPosts = data;
      },
      error: (error) => {
        console.error('Erro ao carregar os posts secundários:', error);
        this.errorMessage = 'Erro ao carregar os posts secundários.';
      },
    });
  }

  loadUsers(): void {
    const currentUserId = this.getLoggedUserId();
    console.log('ID do usuário logado:', currentUserId);

    this.apiService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data.filter(user => user._id !== currentUserId);
        this.filteredUsers = [...this.users]; // Inicializa com todos os usuários
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      },
    });
  }
  onGenderChange(gender: string): void {
    this.gender = gender;
    this.loadUsers();
  }
  filterUsers(): void {
    if (this.searchQuery) {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users]; // Se não houver busca, mostra todos os usuários
    }
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

  checkUserSubscriptionStatus(): void {
    console.log('Iniciando verificação de status de assinatura...');
    const currentUserId = this.getLoggedUserId();
    if (!currentUserId) {
      console.error('ID do usuário atual não encontrado.');
      return;
    }

    this.apiService.checkSubscriptionStatus(currentUserId).subscribe(
      (response) => {
        console.log('Resposta de status de assunatura:', response);
        this.hasActiveSubscription = response.hasActiveSubscription;
        if (!this.hasActiveSubscription) {
          this.showOverlay = true;
          this.snackBar
            .open(
              'É preciso assinar um plano para usar esta página.',
              'Assinar Agora',
              {
                duration: 5000,
                verticalPosition: 'top',
              }
            )
            .onAction()
            .subscribe(() => {
              this.showOverlay = false;
              this.router.navigate(['/payments']);
            });
        }
      },
      (error) => {
        console.error('Erro ao verificar status da assinatura:', error);
        const errorMessage =
          error.error?.message || 'Erro ao verificar status da assinatura.';
        this.showOverlay = true;
        this.snackBar
          .open(errorMessage, 'Assinar Agora', {
            duration: 5000,
            verticalPosition: 'top',
          })
          .onAction()
          .subscribe(() => {
            this.showOverlay = false;
            this.router.navigate(['/payments']);
          });
      }
    );
  }

  checkMutualLikes(): void {
    if (!this.currentUser) return;

    this.users.forEach((user) => {
      this.apiService
        .checkMutualLike(this.currentUser!._id, user._id)
        .subscribe(
          (response) => {
            this.mutualLikes[user._id] = response.mutualLike;
          },
          (error) => {
            console.error('Erro ao verificar reciprocidade de likes:', error);
          }
        );
    });
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
        this.addNotification(likedUserId);
        this.checkMutualLikes();
      },
      (error) => {
        console.error('Erro ao registrar o like:', error);
      }
    );
  }

  addNotification(likedUserId: string): void {
    const notificationsKey = `notifications_${likedUserId}`;
    const notifications = JSON.parse(
      localStorage.getItem(notificationsKey) || '[]'
    );

    const notificationExists = notifications.some(
      (n: any) => n.userId === this.currentUser!._id
    );

    if (!notificationExists) {
      const newNotification = {
        userId: this.currentUser!._id,
        message: `${this.currentUser!.name} Está de olho em você!.`,
        timestamp: new Date().toISOString(),
      };
      notifications.push(newNotification);

      localStorage.setItem(notificationsKey, JSON.stringify(notifications));

      console.log('Notificação adicionada:', newNotification);
    } else {
      console.log('Notificação já existente, nenhuma ação realizada.');
    }
  }

  getNotifications(): any[] {
    if (!this.currentUser || !this.currentUser._id) {
      console.error('Usuário atual não encontrado.');
      return [];
    }

    const notificationsKey = `notifications_${this.currentUser._id}`;
    return JSON.parse(localStorage.getItem(notificationsKey) || '[]');
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

  goToChat(otherUserId: string): void {
    if (!this.currentUser || !this.currentUser._id) {
      console.error('Usuário atual não encontrado.');
      return;
    }

    this.apiService
      .getOrCreateChat(this.currentUser._id, otherUserId)
      .subscribe({
        next: (response) => {
          const chatId = response.chatId;
          this.router.navigate(['/chat', chatId]);
        },
        error: (error) => {
          console.error('Erro ao iniciar ou obter conversa:', error);
        },
      });
  }

  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  public getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  fetchUserPosts(): void {
    const userId = this.route.snapshot.paramMap.get('id') || this.getUserId();
    this.loading = true;

    this.apiService.getPostsByUserId(userId).subscribe({
      next: (response: Post[]) => {
        this.posts = response
          .filter((post) => post.media.length > 0)
          .map((post) => ({
            ...post,
            ownerId: post.ownerId || userId,
          }));
      },
      error: (err) => {
        console.error('Erro ao buscar posts:', err);
        this.errorMessage = `Erro ao carregar os posts.`;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getPosts() {
    this.apiService.getPostsFromSecondFeed().subscribe({
      next: (posts: Post[]) => {
        if (posts) {
          console.log(posts);
          this.posts = posts
            .map((post) => {
              return {
                ...post,
                likes: post.likes || [],
              };
            })
            .sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os posts';
        console.error(error);
      },
    });
  }

  isOwner(postOwnerId: any): boolean {
    if (
      typeof postOwnerId === 'object' &&
      postOwnerId !== null &&
      '_id' in postOwnerId
    ) {
      console.log(postOwnerId);
      postOwnerId = postOwnerId._id;
      console.log(postOwnerId);
    }
    if (typeof postOwnerId !== 'string') {
      console.error('postOwnerId deve ser uma string', postOwnerId);
      console.log('chegou a segunda condição');
      console.log(postOwnerId);
      return false;
    }

    const currentUserId = this.getUserIdFromAuthService();
    console.log('O id do usuário atual é :');
    console.log(currentUserId);

    return currentUserId === String(postOwnerId);
  }

  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }

  isImage(url: string): boolean {
    return (
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.png') ||
      url.endsWith('.gif') ||
      url.endsWith('.webp') ||
      url.endsWith('.bmp') ||
      url.endsWith('.ico') ||
      url.endsWith('.svg') ||
      url.endsWith('.heif') ||
      url.endsWith('.heic') ||
      url.endsWith('.tiff')
    );
  }
}
