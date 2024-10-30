import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Post } from 'database';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
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

  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngOnInit() {
    this.getPosts();
    this.userId = this.getUserIdFromAuthService();
  }

  closeModal() {
    this.resetForm(); // Limpa o formulário ao fechar o modal
    this.showModal = false;
  }

  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }

  getPosts() {
    this.apiService.getPostsFromFirstFeed().subscribe({
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
    this.apiService.likePostInFirstFeed(postId).subscribe(
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
    media.forEach((file) => formData.append('media', file));

    const url =
      feedType === 'primaryFeed'
        ? 'http://localhost:3000/primaryFeed/'
        : 'http://localhost:3000/secondFeed/';

    this.loading = true; // Indica que a publicação está em progresso

    this.http.post<Post>(url, formData).subscribe({
      next: (response: Post) => {
        this.posts.unshift(response);
        this.alertMessage = 'Post publicado com sucesso!';
        this.alertType = 'success';
      },
      error: () => {
        this.alertMessage = 'Erro ao publicar o post.';
        this.alertType = 'error';
      },
      complete: () => {
        this.loading = false; // Indica que a publicação foi concluída
        this.resetForm(); // Limpa o formulário após a publicação
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
        this.posts = this.posts.filter((post) => post._id !== postId); // Usando post._id
      },
      (error) => {
        console.error('Erro ao deletar o post:', error);
      }
    );
  }
  
}
