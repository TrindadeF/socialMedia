import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { User, Post } from 'database';

interface LikesResponse {
  content: string;
  likes: User[];
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  usersWhoLikedPosts: LikesResponse[] = [];
  usersWhoLikedProfile: User[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    this.apiService.getUsersWhoLikedProfile(userId).subscribe((users) => {
      this.usersWhoLikedProfile = users;
    });
  }

  loadLikesForPost(postId: string): void {
    this.apiService
      .getUsersWhoLikedPost(postId)
      .subscribe((response: LikesResponse) => {
        this.usersWhoLikedPosts.push({
          content: response.content,
          likes: response.likes,
        });
      });
  }
}
