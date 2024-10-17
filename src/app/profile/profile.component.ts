import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  posts: any[] = [];
  selectedTab: string = 'threads';
  profileForm: FormGroup;
  modalOpen: boolean = false;
  profilePicUrl: string = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.fetchUserProfile();
    this.fetchUserPosts();
  }

  fetchUserProfile() {
    this.apiService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response;
        this.profilePicUrl = this.user.profilePic ? this.user.profilePic : '';

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
    this.apiService.getPosts().subscribe((response: any[]) => {
      const userId = this.getUserId();
      this.posts = response.filter((post) => post.userId === userId);
    });
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
