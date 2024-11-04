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

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.postId = this.route.snapshot.paramMap.get('postId') || '';
    console.log('ID do post:', this.postId);
  }

  ngOnInit(): void {
    if (this.postId) {
      this.loadPostDetails();
      this.loadComments();
    } else {
      this.error = 'ID do post não encontrado na rota.';
      this.loading = false;
    }
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

  likePost(): void {
    this.apiService.likePostInFirstFeed(this.postId).subscribe(
      () => {
        console.log('Post curtido com sucesso!');
        this.loadPostDetails();
      },
      (error: any) => {
        console.error('Erro ao curtir o post:', error);
      }
    );
  }

  deletePost(): void {
    this.apiService.deletePostFromFirstFeed(this.postId).subscribe(
      () => {
        console.log('Post apagado com sucesso!');
      },
      (error: any) => {
        console.error('Erro ao apagar o post:', error);
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
