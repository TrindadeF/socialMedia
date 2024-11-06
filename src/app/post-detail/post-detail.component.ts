import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Post } from 'database';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  postId: string;
  post: Post | null = null;
  comments: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  newComment: string = '';
  userId: string | undefined;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.postId = this.route.snapshot.paramMap.get('postId') || '';
    console.log('ID do post:', this.postId);
  }

  ngOnInit(): void {
    this.userId = this.getUserIdFromAuthService();
    console.log('ID do usuário logado:', this.userId);

    if (this.postId) {
      this.loadPostDetails();
      this.loadComments();
    } else {
      this.error = 'ID do post não encontrado na rota.';
      this.loading = false;
    }
  }

  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }

  isCommentOwner(commentOwnerId: string): boolean {
    const isOwner = commentOwnerId === this.userId;
    return isOwner;
  }

  deleteComment(commentId: string) {
    this.apiService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(
          (comment) => comment._id !== commentId
        );
        console.log('Comentário deletado com sucesso.');
      },
      (error) => {
        console.error('Erro ao deletar o comentário:', error);
      }
    );
  }

  loadPostDetails(): void {
    this.apiService.getPostWithComments(this.postId).subscribe(
      (data: { post: Post | null }) => {
        this.post = data.post;
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Erro ao carregar os detalhes do post.';
        console.error(error);
        this.loading = false;
      }
    );
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

  addComment(): void {
    if (this.newComment.trim()) {
      this.apiService
        .addCommentInFirstFeed(this.postId, this.newComment)
        .subscribe(
          () => {
            console.log('Comentário adicionado com sucesso!');
            this.loadComments();
            this.newComment = '';
          },
          (error: any) => {
            console.error('Erro ao adicionar comentário:', error);
          }
        );
    } else {
      console.error('O comentário não pode estar vazio.');
    }
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  }
}
