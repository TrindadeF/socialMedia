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
    const userId = this.getUserId();
    if (!userId) {
      this.router.navigate(['/']);
    }
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || '';
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
      this.loading = true;
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
          this.errorMessage = 'Erro ao carregar o perfil do usuário';
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      console.error('ID do usuário não encontrado na URL');
      this.errorMessage = 'ID do usuário não encontrado';
    }
  }

  fetchUserPosts() {
    const userId = this.route.snapshot.paramMap.get('id');
    const loggedUserId = this.getUserId();

    this.loading = true;

    if (userId && userId !== loggedUserId) {
      this.apiService.getPostsByUserId(userId).subscribe({
        next: (response: Post[]) => {
          this.posts = response.filter((post) => post.media.length > 0);
        },
        error: (err) => {
          console.error('Erro ao buscar posts do usuário selecionado:', err);
          this.errorMessage =
            'Erro ao carregar os posts do usuário selecionado';
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.apiService.getPostsByLoggedUser().subscribe({
        next: (response: Post[]) => {
          this.posts = response.filter((post) => post.media.length > 0);
        },
        error: (err) => {
          console.error('Erro ao buscar posts do usuário logado:', err);
          this.errorMessage = 'Erro ao carregar os posts do usuário logado';
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

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

    const url =
      event.feedType === 'primaryFeed'
        ? 'http://localhost:3000/primaryFeed/'
        : 'http://localhost:3000/secondFeed/';

    this.http.post<Post>(url, formData).subscribe({
      next: (response: Post) => {
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
        this.closeModal();
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
