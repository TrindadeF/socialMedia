import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { Post, User } from 'database';
import { MatIconModule } from '@angular/material/icon';

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

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    if (this.postId) {
      this.getPostDetails(this.postId);
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
        this.comments = response.comments;
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do post:', error);
      },
    });
  }
  addComment(postId: string, content: string) {
    this.apiService.addCommentInSecondFeed(postId, content).subscribe({
      next: (response) => {
        console.log('Comentário adicionado com sucesso:', response);
        this.loadPostDetails;
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

  deleteComment(commentId: string) {
    this.apiService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(
          (comment) => comment._id !== commentId
        );
      },
      error: (error) => {
        console.error('Erro ao excluir comentário:', error);
      },
    });
  }
}
