import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Post, User } from 'database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  users: User[] = [];
  user: any = {};
  posts: Post[] = [];
  postContent: string = '';
  selectedMedia: File[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  canPublish: boolean = false;
  userId: string = '';
  showModal: boolean = false;
  modalContent: string = '';
  title: string = 'Aqui é o título do modal feed';
  currentFeedType: 'primaryFeed' | 'secondFeed' = 'primaryFeed';
  showCommentModal = false;
  selectedPostId: string = '';
  primaryPosts?: Post[] = [];
  showReportModal: boolean = false;
  reportReason: string = '';
  selectedUserId: string = '';
  blockedUsers: string[] = [];
  unblockedUsers: string[] = [];
  blockedUsersData: any[] = []; // Array para armazenar os dados completos dos usuários bloqueados
  notifications: string[] = [];

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    const loggedUserId = this.getLoggedUserId(); // Obtém o ID do usuário logado

    const blockedUsers = localStorage.getItem(`blockedUsers_${loggedUserId}`);
    const unblockedUsers = localStorage.getItem(
      `unblockedUsers_${loggedUserId}`
    );

    if (blockedUsers) {
      this.blockedUsers = JSON.parse(blockedUsers);
    } else {
      this.blockedUsers = [];
    }

    if (unblockedUsers) {
      this.unblockedUsers = JSON.parse(unblockedUsers);
    } else {
      this.unblockedUsers = [];
    }

    this.getPosts();
    this.userId = loggedUserId;
    this.loadBlockedUsers();
    this.loadNotifications(loggedUserId);
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  closeCommentModal() {
    this.showCommentModal = false;
    this.resetForm();
  }

  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }

  isOwner(postOwnerId: any): boolean {
    // Verifica se postOwnerId é um objeto e extrai o _id
    if (
      typeof postOwnerId === 'object' &&
      postOwnerId !== null &&
      '_id' in postOwnerId
    ) {
      postOwnerId = postOwnerId._id;
    }

    // Verifica se postOwnerId é uma string
    if (typeof postOwnerId !== 'string') {
      console.error('postOwnerId deve ser uma string', postOwnerId);
      return false;
    }

    const currentUserId = this.getUserIdFromAuthService();
    return currentUserId === postOwnerId; // Comparação direta de strings
  }

  viewPostDetails(postId: string): void {
    this.router.navigate([`primaryFeed/posts/${postId}/comments`]);
  }
  loadBlockedUsers() {
    this.blockedUsers.forEach((userId) => {
      this.getUserById(userId); // Faz a requisição para obter os dados de cada usuário bloqueado
    });
  }

  openCommentModal(postId: string, feedType: 'primaryFeed' | 'secondFeed') {
    this.selectedPostId = postId;
    this.currentFeedType = feedType;
    this.showCommentModal = true;
  }
  onCommentAdded() {
    this.showCommentModal = false;
  }

  getPosts() {
    this.apiService.getPostsFromFirstFeed().subscribe({
      next: (posts: Post[]) => {
        if (posts) {
          const loggedUserId = this.getLoggedUserId();
          this.blockedUsers = this.blockedUsers || [];

          // Filtra posts, excluindo apenas os de usuários bloqueados, mas mantendo os do usuário logado
          this.posts = posts
            .filter((post) => {
              const postOwnerId =
                typeof post.owner === 'object' ? post.owner._id : post.owner;
              return (
                postOwnerId === loggedUserId ||
                !this.blockedUsers.includes(post.owner._id)
              );
            })
            .map((post) => ({
              ...post,
              likes: post.likes || [], // Garante que a propriedade likes exista
            }))
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ); // Ordenação
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os posts';
        console.error(error);
      },
    });
  }
  getUserById(userId: string): void {
    this.apiService.getUserById(userId).subscribe({
      next: (user) => {
        this.blockedUsersData.push(user); // Armazena os dados completos do usuário bloqueado
        console.log('Dados do usuário:', user); // Exibe os dados no console (opcional)
      },
      error: (error) => {
        console.error('Erro ao carregar os dados do usuário:', error);
        this.errorMessage = 'Erro ao carregar os dados do usuário';
      },
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
          const postOwnerId =
            typeof updatedPost.owner === 'object'
              ? updatedPost.owner._id
              : updatedPost.owner;
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
        const notifications = JSON.parse(
          localStorage.getItem(notificationsKey) || '[]'
        );

        // Adiciona nova notificação
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
  loadNotifications(userId: string) {
    const notificationsKey = `notifications_${userId}`;
    const notifications = JSON.parse(
      localStorage.getItem(notificationsKey) || '[]'
    );

    if (notifications.length > 0) {
      // Exibir as notificações de forma apropriada, talvez usando uma variável de estado
      this.notifications = notifications;
      // Exibir as notificações de alguma forma, como com um `snackBar` ou em um componente dedicado
      notifications.forEach((notification: string) => {
        this.snackBar.open(notification, 'Fechar', { duration: 3000 });
      });
    }
  }

  openModal(feedType: 'primaryFeed' | 'secondFeed') {
    this.currentFeedType = feedType;
    this.showModal = true;
  }

  onPublish(event: { content: string; media: File[] }) {
    this.publishPost(event.content, event.media, this.currentFeedType);
  }

  publishPost(
    content: string,
    media: File[],
    feedType: 'primaryFeed' | 'secondFeed'
  ) {
    const formData = new FormData();
    formData.append('content', content);
    media.forEach((file) => formData.append('image', file));

    const url =
      feedType === 'primaryFeed'
        ? 'https://nakedlove.eu/api/primaryFeed/'
        : 'https:/nakedlove.eu/api/secondFeed/';

    this.loading = true;

    this.http.post<Post>(url, formData).subscribe({
      next: (response: Post) => {
        this.posts.unshift(response);
        this.snackBar.open('Post publicado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.alertMessage = 'Post publicado com sucesso!';
        this.alertType = 'success';
        window.location.reload();
      },
      error: () => {
        this.alertMessage = 'Erro ao publicar o post.';
        this.alertType = 'error';
      },
      complete: () => {
        this.loading = false;
        this.resetForm();
      },
    });
  }

  onMediaSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedMedia = Array.from(fileInput.files);
      const file = fileInput.files[0];
      const MAX_FILE_SIZE = 60 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        alert('O arquivo é muito grande. O tamanho máximo permitido é 60MB.');
        return;
      }

      const previewImage = document.getElementById(
        'preview-image'
      ) as HTMLImageElement;
      const previewVideo = document.getElementById(
        'preview-video'
      ) as HTMLVideoElement;

      this.selectedMedia.forEach((file) => {
        const fileReader = new FileReader();

        if (file.type.startsWith('image/')) {
          fileReader.onload = () => {
            previewImage.src = fileReader.result as string;
            previewImage.style.display = 'block';
            previewVideo.style.display = 'none';
          };
          fileReader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          fileReader.onload = () => {
            previewVideo.src = fileReader.result as string;
            previewVideo.style.display = 'block';
            previewImage.style.display = 'none';
          };
          fileReader.readAsDataURL(file);
        }
      });

      this.checkFormValidity();
    }
  }

  checkFormValidity() {
    this.canPublish =
      !!this.postContent.trim() || this.selectedMedia.length > 0;
  }

  resetForm() {
    this.postContent = '';
    this.selectedMedia = [];
    const previewImage = document.getElementById(
      'preview-image'
    ) as HTMLImageElement;
    const previewVideo = document.getElementById(
      'preview-video'
    ) as HTMLVideoElement;

    previewImage.src = '';
    previewImage.style.display = 'none';
    previewVideo.src = '';
    previewVideo.style.display = 'none';
    this.alertMessage = '';
    this.canPublish = false;
  }

  isImage(mediaUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|bmp|ico|svg|heif|heic|tiff)$/i.test(
      mediaUrl
    );
  }

  deletePost(postId: string): void {
    this.apiService.deletePostFromFirstFeed(postId).subscribe({
      next: (response) => {
        this.snackBar.open('Post deletado com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.getPosts();
      },
      error: (error) => {
        console.error('Erro ao deletar post:', error);
        this.snackBar.open('Erro ao deletar post', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  blockUser(userId: string): void {
    if (this.blockedUsers.includes(userId)) {
      this.snackBar.open('Usuário já está bloqueado', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.apiService.blockUser(userId).subscribe({
      next: () => {
        this.snackBar.open('Usuário bloqueado com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.blockedUsers.push(userId);

        // Remove o usuário da lista de desbloqueados caso ele esteja lá
        this.unblockedUsers = this.unblockedUsers.filter((id) => id !== userId);

        // Salva as atualizações no localStorage
        const loggedUserId = this.getLoggedUserId();
        localStorage.setItem(
          `blockedUsers_${loggedUserId}`,
          JSON.stringify(this.blockedUsers)
        );
        localStorage.setItem(
          `unblockedUsers_${loggedUserId}`,
          JSON.stringify(this.unblockedUsers)
        );

        // Atualiza os posts
        window.location.reload();

        this.getPosts();
      },
      error: (error) => {
        console.error('Erro ao bloquear usuário:', error);
        this.snackBar.open('Erro ao bloquear usuário', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  unblockUser(userId: string): void {
    // Verifique se o usuário está realmente bloqueado
    if (!this.blockedUsers.includes(userId)) {
      this.snackBar.open('Usuário não está bloqueado', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    // Remove o usuário da lista de bloqueados
    this.blockedUsers = this.blockedUsers.filter((id) => id !== userId);

    // Adiciona à lista de desbloqueados
    this.unblockedUsers.push(userId);

    // Atualiza o localStorage
    const loggedUserId = this.getLoggedUserId();
    localStorage.setItem(
      `blockedUsers_${loggedUserId}`,
      JSON.stringify(this.blockedUsers)
    );
    localStorage.setItem(
      `unblockedUsers_${loggedUserId}`,
      JSON.stringify(this.unblockedUsers)
    );

    // Exibe a mensagem de sucesso
    this.snackBar.open('Usuário desbloqueado com sucesso', 'Fechar', {
      duration: 3000,
    });

    // Atualiza os posts para refletir a mudança
    window.location.reload();

    this.getPosts(); // Certifique-se de que os posts estão sendo atualizados após o desbloqueio
  }

  reportUser(userId: string, reason: string): void {
    this.apiService.reportUser(userId, reason).subscribe({
      next: (response) => {
        this.snackBar.open('Usuário denunciado com sucesso', 'Fechar', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Erro ao denunciar usuário:', error);
        this.snackBar.open('Erro ao denunciar usuário', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }
}
