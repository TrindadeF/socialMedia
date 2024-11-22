import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { Post, User } from 'database';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  public getuserid() {
    this.userId = localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    this.getuserid();
  
    if (this.postId) {
      this.getPostDetails(this.postId);
      console.log('User ID:', this.userId);
    } else {
      console.error('Post ID is not provided');
    }
  }
  

  close() {
    this.show = false;
    this.closeEvent.emit();
  }

  likePost(postId: string) {
    if (postId)
      this.apiService.likePostInSecondFeed(postId).subscribe({
        next: () => console.log(`Post ${postId} curtido com sucesso!`),
        error: (error: any) => console.error(`Erro ao curtir o post:`, error),
      });
  }

  loadPostDetails() {
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
    this.apiService.getPostWithComments(this.postId).subscribe(
      (data: { comments: any[] }) => {
        this.comments = data.comments;
      },
      (error: any) => {
        console.error('Erro ao carregar comentários:', error);
      }
    );
  }

  addComment(postId: string, content: string) {
    this.apiService.addCommentInSecondFeed(postId, content).subscribe({
      next: (response) => {
        console.log('Comentário adicionado com sucesso:', response);
        this.loadComments();
      },
      error: (error) => {
        console.error('Erro ao adicionar o comentário:', error);
      },
    });
  }

  getPostDetails(postId: string): void {
    if (postId) {
      this.apiService.getPostDetails(postId).subscribe(
        (response: { post: Post; comments: string[] }) => {
          this.post = response.post;
          this.comments = response.comments;
        },
        (error: any) => {
          console.error('Erro ao carregar post e comentários:', error);
        }
      );
    }
  }

  canDeleteComment(commentOwnerId: string): boolean {
    return this.userId === commentOwnerId;
  }

  deleteComment(commentId: string): void {
    console.log('Comentário ID:', commentId);
    if (!commentId) {
      console.error('ID do comentário não fornecido');
      return;
    }

    this.apiService.deleteCommentSecondFeed(commentId).subscribe(
      (response) => {
        console.log('Comentário deletado com sucesso', response);
        this.comments = this.comments.filter(
          (comment) => comment._id !== commentId
        );
        this.loadComments();
      },
      (error) => {
        console.error('Erro ao deletar comentário', error);
      }
    );
  }

  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }

  deletePost(postId: string): void {
    console.log('Post ID:', postId);
    if (!postId) {
      console.error('ID do post não fornecido');
      return;
    }
    this.apiService.deletePostFromSecondFeed(postId).subscribe({
      next: (response) => {
        this.snackBar.open('Post deletado com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.getPostDetails(postId);
        this.publish.emit();
        this.close();
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
  
    if (typeof postOwnerId === 'object' && postOwnerId !== null && '_id' in postOwnerId) {
      postOwnerId = postOwnerId._id;
    }
  
    const currentUserId = this.getUserIdFromAuthService();
    const isOwner = currentUserId === String(postOwnerId);
  
    console.log('Post Owner ID:', postOwnerId);
    console.log('Is owner:', isOwner);
  
    return isOwner;
  }
  
  
  
}
