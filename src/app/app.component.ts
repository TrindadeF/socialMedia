import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Post } from 'database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app-love';

  posts: Post[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: (data) => (this.posts = data),
      error: (error) => {
        console.log(error);
      },
    });
  }
}
