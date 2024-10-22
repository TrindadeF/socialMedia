import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Post } from 'database';
import { Router } from '@angular/router';

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
  otherPosts!: Post[];

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPosts();
    this.userId = this.getCurrentUserId();
  }

  getPosts() {
    this.apiService.getPostsFromSecondFeed().subscribe({
      next: (posts: Post[]) => {
        const currentUserId = this.userId;
        this.posts = posts.filter((post: Post) => post.owner === currentUserId);
        this.otherPosts = posts.filter(
          (post: Post) => post.owner !== currentUserId
        );
      },
      error: (error) => {
        console.error('Erro ao carregar os posts', error);
      },
    });
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
      .post<Post>('http://localhost:3000/secondFeed', formData)
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
      this.postContent.trim().length > 0 || this.selectedMedia.length > 0;
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
    previewImage.style.display = 'none';
    previewVideo.style.display = 'none';
    this.alertMessage = '';
    this.alertType = '';
  }



  getCurrentUserId(): string {
    const userId = localStorage.getItem('userId');
    return userId && !isNaN(Number(userId)) ? userId : '';
  }

  isImage(mediaUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(mediaUrl);

  }

  goToUserProfile(userId: string) {
    const numericUserId = +userId;
    if (!isNaN(numericUserId) && numericUserId > 0) {
      this.router.navigate(['/profile', numericUserId]);
    } else {
      console.error('ID de usuário inválido:', userId);
    }
  }

  likePost(post: Post) {
    const currentUserId = this.getCurrentUserId().toString();
    const hasLiked = post.likes.includes(currentUserId);

    if (!hasLiked) {
      post.likes.push(currentUserId);
      console.log(`Usuário ${currentUserId} curtiu a postagem ${post._id}.`);



      this.apiService.likePostInSecondFeed(post._id).subscribe(
        (updatedPost: Post) => {
          if (updatedPost) {
            this.posts = this.posts.map((p) =>
              p._id === updatedPost._id ? updatedPost : p
            );
            this.otherPosts = this.otherPosts.map((p) =>
              p._id === updatedPost._id ? updatedPost : p
            );
          }
        },
        (error: any) => {
          console.error('Erro ao curtir o post:', error);
        }
      );




      const otherUserId = post.owner;

      if (post.likes.includes(otherUserId)) {
        const wantsToChat = confirm('Deseja iniciar uma conversa?');
        if (wantsToChat) {
          this.router.navigate(['/chat']);
        } else {
          console.log('Usuário escolheu não iniciar a conversa.');
        }
      }
    } else {
      console.log('Usuário já curtiu esta postagem.');
    }
  }

  deletePost(postId: string) {
    if (confirm('Você tem certeza que deseja deletar este post?')) {
      this.apiService.deletePostFromSecondFeed(postId).subscribe(
        (response) => {
          console.log('Post deletado com sucesso:', response);
          // Remove o post deletado da lista
          this.posts = this.posts.filter((post) => post._id !== postId);
          this.otherPosts = this.otherPosts.filter(
            (post) => post._id !== postId
          );
          this.alertMessage = 'Post deletado com sucesso!';
          this.alertType = 'success';
        },
        (error) => {
          console.error('Erro ao deletar o post:', error);
          this.alertMessage = 'Erro ao deletar o post.';
          this.alertType = 'error';
        }
      );
    }
  }
}
