import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Post } from 'database';

@Component({
  selector: 'app-love',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  postContent: string = '';
  selectedImage: File | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  canPublish: boolean = false;

  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.apiService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.sort((a: any, b: any) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os posts';
        console.error(error);
      },
    });
  }

  likePost(post: Post) {
    post.likes += 1;
  }

  publishPost() {
    this.loading = true;
    const formData = new FormData();

    if (!this.postContent.trim()) {
      this.alertMessage = 'O conteúdo do post é obrigatório!';
      this.alertType = 'error';
      this.loading = false;
      return;
    }

    formData.append('content', this.postContent);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.http.post<Post>('http://localhost:3000/post/', formData).subscribe({
      next: (response: Post) => {
        console.log('Post publicado com sucesso:', response);
        this.posts.push(response);
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

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const previewImage = document.getElementById(
          'preview-image'
        ) as HTMLImageElement;
        previewImage.src = reader.result as string;
        previewImage.style.display = 'block';
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }
  checkFormValidity() {
    this.canPublish = !!this.postContent.trim() || !!this.selectedImage;
  }

  resetForm() {
    this.postContent = '';
    this.selectedImage = null;
    const previewImage = document.getElementById(
      'preview-image'
    ) as HTMLImageElement;
    previewImage.src = '';
    previewImage.style.display = 'none';
    this.alertMessage = '';
    this.canPublish = false;
  }
}
