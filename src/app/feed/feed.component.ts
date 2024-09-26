import { Component, OnInit } from '@angular/core';

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
  errorMessage: string = '';

  async fetchPosts(): Promise<Post[]> {
    return fetch('/api/posts').then((response) => response.json());
  }

  async getPosts() {
    try {
      const posts = await this.fetchPosts();
      this.posts = posts;
    } catch (error) {
      this.errorMessage = 'Erro ao carregar os posts';
      console.error(error);
    }
  }

  ngOnInit() {
    this.getPosts();
  }
}
