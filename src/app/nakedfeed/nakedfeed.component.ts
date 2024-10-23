import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Post } from 'database';

@Component({
  selector: 'app-love',
  templateUrl: './nakedfeed.component.html',
  styleUrls: ['./nakedfeed.component.css'],
})
export class NakedFeedComponent implements OnInit {
  posts: Post[] = [];
  postContent: string = '';
  selectedMedia: File[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  canPublish: boolean = false;
  userId: string = '';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngOnInit() {
    this.getPosts();
    this.userId = this.getUserIdFromAuthService();
  }

  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }

  getPosts() {
    this.apiService.getPostsFromSecondFeed().subscribe({
      next: (posts: Post[]) => {
        if (posts) {
          this.posts = posts
            .map((post) => ({
              ...post,
              likes: post.likes || [],
            }))
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

  likePost(postId: string) {
    this.apiService.likePostInSecondFeed(postId).subscribe(
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
        }
      },
      (error) => {
        console.error('Erro ao curtir o post:', error);
      }
    );
  }

  publishPost() {
    this.loading = true;
    const formData = new FormData();
    if (!this.postContent.trim() && this.selectedMedia.length === 0) {
      this.alertMessage = 'O conteúdo do post ou mídia são obrigatórios!';
      this.alertType = 'error';
      this.loading = false;
      return;
    }

    formData.append('content', this.postContent);
    this.selectedMedia.forEach((file) => {
      formData.append('image', file);
    });

    console.log('FormData:', formData);

    this.http
      .post<Post>('http://localhost:3000/secondFeed/', formData)
      .subscribe({
        next: (response: Post) => {
          console.log('Post publicado com sucesso:', response);
          this.posts.unshift(response);
          this.resetForm();
          this.alertMessage = 'Post publicado com sucesso!';
          this.alertType = 'success';
        },
        error: (error) => {
          console.error('Erro ao publicar o post:', error);
          this.alertMessage = 'Erro ao publicar o post.';
          this.alertType = 'error';
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  onMediaSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedMedia = Array.from(fileInput.files);

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
    return /\.(jpg|jpeg|png|gif)$/i.test(mediaUrl);
  }
  deletePostFromFirstFeed(postId: string) {
    this.apiService.deletePostFromFirstFeed(postId).subscribe(
      (response) => {
        console.log('Post deletado com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao deletar o post:', error);
      }
    );
  }
}
