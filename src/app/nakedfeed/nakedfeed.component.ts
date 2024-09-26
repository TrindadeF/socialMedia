import { Component, OnInit } from '@angular/core';

interface Post {
  user: string;
  time: string;
  content: string;
  likes: number;
  shares: number;
}

@Component({
  selector: 'app-love',
  templateUrl: './nakedfeed.component.html',
  styleUrls: ['./nakedfeed.component.css'],
})
export class NakedFeedComponent implements OnInit {
  posts: Post[] = [];
  errorMessage: string = '';

  constructor() {}

  async fetchPosts() {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados');
      }
      this.posts = await response.json();
    } catch (error) {
      console.error('Erro:', error);
      this.errorMessage = 'Erro ao carregar os posts';
    }
  }

  ngOnInit() {
    this.fetchPosts();
  }
}
