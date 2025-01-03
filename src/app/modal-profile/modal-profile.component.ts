import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { Post, User } from 'database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.css'],
})
export class ModalProfileComponent {
  @Input() imageSrc!: string;
  @Input() show: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Input() postContent: string = '';
  @Input() feedType: 'primaryFeed' | 'secondFeed' = 'primaryFeed';
  @Input() postId!: string;
  @Output() publish = new EventEmitter<{
    content: string | null;
    media: File[];
    feedType: 'primaryFeed' | 'secondFeed';
  }>();

  userId: string = '';
  users: User[] = [];
  currentUser!: User;
  mutualLikes: { [key: string]: boolean } = {};
  comments: any[] = [];
  newComment: string = '';
  post!: Post;
  detailedComments: any;
  authService: any;
  notifications: string[] = [];
  posts: Post[] = [];


  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const loggedUserId = this.getLoggedUserId();
    this.getuserid();
    this.loadNotifications(loggedUserId);

    if (this.postId) {
      this.getPostDetails(this.postId);
      console.log('User ID:', this.userId);
    } else {
      console.error('Post ID is not provided');
    }
  }

  public getuserid(): void {
    this.userId = localStorage.getItem('userId') || '';
  }

  close(): void {
    this.show = false;
    this.closeEvent.emit();
  }

  likePost(postId: string): void {
    if (postId) {
      this.apiService.likePostInSecondFeed(postId).subscribe({
        next: (updatedPost: Post) => {
          console.log(`Post ${postId} curtido com sucesso!`);
  
          // Atualiza o post no modal
          this.getPostDetails(postId);
  
          // Atualiza a lista de posts no feed com os novos "likes"
          this.posts = this.posts.map((post) => {
            if (post._id === updatedPost._id) {
              return {
                ...post,
                likes: updatedPost.likes, // Atualiza os likes do post
              };
            }
            return post;
          });
  
          // Identifica o dono da postagem e envia uma notificação
          const postOwnerId = typeof updatedPost.owner === 'object' ? updatedPost.owner._id : updatedPost.owner;
          const currentUserId = this.getUserIdFromAuthService(); // Usuário que curtiu
  
          if (postOwnerId !== currentUserId) {
            this.notifiUser(postOwnerId, currentUserId); // Envia notificação se o dono não for o atual usuário
          }
        },
        error: (error: any) => {
          console.error('Erro ao curtir o post:', error);
        },
      });
    }
  }
  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }
  
  notifiUser(postOwnerId: string, likerId: string) {
    // Obtem informações do usuário que curtiu
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
  loadNotifications(userId: string) {
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
  
  

  loadPostDetails(): void {
    this.apiService.getPostDetails(this.post._id).subscribe({
      next: (response) => {
        this.post = response.post;
        console.log('Post carregado:', this.post);
        this.comments = response.comments;
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do post:', error);
      },
    });
  }

  loadComments(): void {
    this.apiService.getPostWithComments(this.postId).subscribe({
      next: (data: { comments: any[] }) => {
        this.comments = data.comments;
        console.log('Comentários atualizados:', this.comments);
      },
      error: (error: any) => {
        console.error('Erro ao carregar comentários:', error);
      },
    });
  }

  addComment(postId: string, content: string): void {
    if (!content.trim()) {
      console.warn('Comentário vazio, não será enviado.');
      return;
    }

    this.apiService.addCommentInSecondFeed(postId, content).subscribe({
      next: (newComment) => {
        console.log('Comentário adicionado com sucesso');
        this.comments.push(newComment); // Limpa o campo de entrada
        this.newComment = ''; // Atualiza os comentários no modal
        this.getPostDetails(postId); // Atualiza o post no modal
      },
      error: (error) => {
        console.error('Erro ao adicionar o comentário:', error);
      },
    });
  }

  getPostDetails(postId: string): void {
    if (!postId) {
      console.error('Post ID não fornecido ou inválido');
      return;
    }

    this.apiService.getPostDetails(postId).subscribe(
      (response: { post: Post; comments: any[] }) => {
        if (response?.post) {
          this.post = response.post;

          // Verificação explícita do ownerId
          if (!this.post.postOwnerId) {
            console.warn('Post carregado sem ownerId:', this.post);
          }

          this.comments = response.comments || [];
          console.log(
            'Post e comentários carregados:',
            this.post,
            this.comments
          );
        } else {
          console.warn('Resposta não contém informações do post:', response);
        }
      },
      (error: any) => {
        console.error('Erro ao carregar post e comentários:', error);
      }
    );
  }

  canDeleteComment(commentOwnerId: string): boolean {
    // Permite deletar se o usuário for o autor do comentário ou o dono do post
    return (
      this.userId === commentOwnerId || this.isOwner(this.post.postOwnerId)
    );
  }

  deleteComment(commentId: string): void {
    if (!commentId) {
      console.error('ID do comentário não fornecido');
      return;
    }

    this.apiService.deleteCommentSecondFeed(commentId).subscribe({
      next: () => {
        console.log('Comentário deletado com sucesso');
        this.comments = this.comments.filter(
          (comment) => comment._id !== commentId
        );
        // Atualiza os detalhes do post após a exclusão
        this.getPostDetails(this.postId);
      },
      error: (error) => {
        console.error('Erro ao deletar comentário:', error);
      },
    });
  }

  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }

  deletePost(postId: string): void {
    if (!postId) {
      console.error('ID do post não fornecido');
      return;
    }

    this.apiService.deletePostFromSecondFeed(postId).subscribe({
      next: () => {
        this.snackBar.open('Post deletado com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.publish.emit(); // Notifica o componente pai
        this.close(); // Fecha o modal
      },
      error: (error) => {
        console.error('Erro ao deletar post:', error);
        this.snackBar.open('Erro ao deletar post', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  isOwner(postOwnerId: User | string | null): boolean {
    if (!postOwnerId) {
      console.error('Post Owner ID é nulo ou indefinido');
      return false;
    }

    if (typeof postOwnerId === 'object' && postOwnerId._id) {
      postOwnerId = postOwnerId._id; // Converte para string se for um objeto
    } else if (typeof postOwnerId === 'object') {
      console.error('Objeto Post Owner não possui a propriedade _id');
      return false;
    }

    const currentUserId = this.getUserIdFromAuthService();
    const isOwner = currentUserId === String(postOwnerId);

    console.log('Post Owner ID:', postOwnerId);
    console.log('Current User ID:', currentUserId);
    console.log('É dono do post?', isOwner);
    return isOwner;
  }
}
