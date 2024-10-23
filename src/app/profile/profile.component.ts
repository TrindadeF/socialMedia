import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from 'database';

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

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
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

  fetchUserProfile() {
    this.apiService.getUserProfile().subscribe({
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
  }

  fetchUserPosts() {
    const userId = this.getUserId();
    this.apiService
      .getPostsFromSecondFeed(userId)
      .subscribe((response: Post[]) => {
        this.posts = response.filter((post) => post.imageUrl);
      });
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || '';
  }
}
