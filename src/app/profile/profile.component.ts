import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from 'database';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  posts: Post[] = [];
  profileForm: FormGroup;
  profilePicUrl: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  showModal: boolean = false;
  title: string = 'Aqui é o título do modal feed';
  modalContent: string = '';
  postContent: string = '';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.checkUserLogin();
    this.fetchUserProfile();
    this.fetchUserPosts();
  }

  private checkUserLogin() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/']);
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  fetchUserProfile() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.apiService.getUserById(userId).subscribe({
        next: (response) => {
          this.user = response;
          this.profilePicUrl = this.user.profilePic || '';
          this.profileForm.patchValue({
            name: this.user.name,
            description: this.user.description,
          });
        },
        error: (err) => {
          console.error('Erro ao buscar perfil do usuário:', err);
        },
      });
    } else {
      console.error('ID do usuário não encontrado na URL');
    }
  }

  fetchUserPosts() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.apiService.getPostsByLoggedUser().subscribe({
        next: (response: Post[]) => {
          this.posts = response.filter((post) => post.media.length > 0);
        },
        error: (err) => {
          console.error('Erro ao buscar posts do usuário:', err);
        },
      });
    } else {
      console.error('ID do usuário não encontrado');
    }
  }

  // Novo método para publicar post
  onPublish(event: {
    content: string;
    media: File[];
    feedType: 'primaryFeed' | 'secondFeed';
  }) {
    this.loading = true;
    const formData = new FormData();

    if (!event.content.trim() && event.media.length === 0) {
      this.alertMessage = 'O conteúdo do post ou mídia são obrigatórios!';
      this.alertType = 'error';
      this.loading = false;
      return;
    }

    formData.append('content', event.content);
    event.media.forEach((file) => {
      formData.append('media', file);
    });

    console.log('FormData:', formData);

    const url =
      event.feedType === 'primaryFeed'
        ? 'http://localhost:3000/primaryFeed/'
        : 'http://localhost:3000/secondFeed/';

    this.http.post<Post>(url, formData).subscribe({
      next: (response: Post) => {
        console.log('Post publicado com sucesso:', response);
        this.posts.unshift(response);
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
        this.closeModal(); // Fecha o modal após a publicação
      },
    });
  }

  resetForm() {
    this.alertMessage = '';
  }

  isImage(mediaUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(mediaUrl);
  }
}
