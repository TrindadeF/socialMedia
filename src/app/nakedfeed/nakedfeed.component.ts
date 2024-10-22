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
  myPosts: Post[] = [];
  otherPosts: Post[] = [];
  postContent: string = '';
  selectedImage: File | null = null;
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.apiService.getPostsFromSecondFeed().subscribe({
      next: (posts: Post[]) => {
        const currentUserId = this.getCurrentUserId().toString();
        this.myPosts = posts.filter(
          (post: Post) => post.owner === currentUserId
        );
        this.otherPosts = posts.filter(
          (post: Post) => post.owner !== currentUserId
        );
      },
      error: (error) => {
        console.error('Erro ao carregar os posts', error);
      },
    });
  }

  publishPost() {}

  onImageSelected(event: Event) {}

  getCurrentUserId(): number {
    return 1;
  }

  goToUserProfile(userId: string) {
    const numericUserId = +userId;
    this.router.navigate(['/user-profile', numericUserId]);
  }

  likePost(post: Post) {
    const currentUserId = this.getCurrentUserId().toString();

    const hasLiked = post.likes.includes(currentUserId);

    if (!hasLiked) {
      post.likes.push(currentUserId);
      console.log(`Usuário ${currentUserId} curtiu a postagem ${post._id}.`);

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
}
