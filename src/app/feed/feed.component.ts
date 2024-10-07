import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

interface Post {
  id: number;
  title: string;
  content: string;
}

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

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getPosts() {
    this.apiService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os posts';
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.getPosts();
  }

  logout(): void {
    this.apiService.logout();
    window.location.href = '/login';
  }

  publishPost() {
    this.loading = true;
    const formData = new FormData();
    formData.append('content', this.postContent);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.http.post<Post>('http://localhost:3000/posts/', formData).subscribe({
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

  resetForm() {
    this.postContent = '';
    this.selectedImage = null;
    const previewImage = document.getElementById(
      'preview-image'
    ) as HTMLImageElement;
    previewImage.src = '';
    previewImage.style.display = 'none';
    this.alertMessage = '';
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }
}
