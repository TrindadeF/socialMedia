import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Post, User } from 'database';

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
  userId: string = '';
  users: User[] = [];
  currentUser!: User;
  mutualLikes: { [key: string]: boolean } = {};
  detailedComments: any;
  authService: any;


  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.postId = this.route.snapshot.paramMap.get('postId') || '';
    console.log('ID do post:', this.postId);
  }

  public getuserid() {
    this.userId = localStorage.getItem('userId') || '';
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

  deleteComment(commentId: string): void {
    console.log('Comentário ID:', commentId); 
    if (!commentId) {
      console.error('ID do comentário não fornecido');
      return; 
    }
  
    this.apiService.deleteComment(commentId).subscribe(
      (response) => {
        console.log('Comentário deletado com sucesso', response);
        this.comments = this.comments.filter(comment => comment._id !== commentId);
        this.loadPostDetails();

      },
      (error) => {
        console.error('Erro ao deletar comentário', error);
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
