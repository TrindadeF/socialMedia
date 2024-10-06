import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  posts: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchUserProfile();
    this.fetchUserPosts();
  }

  fetchUserProfile() {
    this.apiService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (err) => {
        console.error('Erro ao buscar perfil do usuário:', err);
      },
    });
  }

  fetchUserPosts() {
    this.apiService.getPosts().subscribe((response: any[]) => {
      const userId = this.getUserId();
      this.posts = response.filter((post) => post.userId === userId);
    });
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || '';
  }
}
