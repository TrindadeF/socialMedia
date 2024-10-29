// nakedfeed.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'database';

@Component({
  selector: 'app-nakedfeed',
  templateUrl: './nakedfeed.component.html',
  styleUrls: ['./nakedfeed.component.css'],
})
export class NakedFeedComponent implements OnInit {
  users: User[] = [];
  currentUser!: User;
  mutualLikes: { [key: string]: boolean } = {};

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.getCurrentUser();
  }

  loadUsers(): void {
    const currentUserId = this.getLoggedUserId();
    this.apiService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data.filter((user) => user._id !== currentUserId);
      },
      (error) => {
        console.error('Erro ao carregar os usuários:', error);
      }
    );
  }

  getCurrentUser(): void {
    const currentUserId = this.getLoggedUserId();
    this.apiService.getUserById(currentUserId).subscribe(
      (data: User) => {
        this.currentUser = data;
        this.checkMutualLikes();
      },
      (error) => {
        console.error('Erro ao carregar o perfil do usuário atual:', error);
      }
    );
  }

  checkMutualLikes(): void {
    if (!this.currentUser) return;

    this.users.forEach((user) => {
      this.apiService.checkMutualLike(this.currentUser._id, user._id).subscribe(
        (response) => {
          this.mutualLikes[user._id] = response.mutualLike;
        },
        (error) => {
          console.error('Erro ao verificar reciprocidade de likes:', error);
        }
      );
    });
  }

  likeUser(likedUserId: string): void {
    if (!this.currentUser || !this.currentUser._id) {
      console.error('Usuário atual não encontrado.');
      return;
    }

    const userId = this.currentUser._id;
    this.apiService.likeUser(userId, likedUserId).subscribe(
      (response) => {
        console.log('Like registrado com sucesso!', response);
        this.checkMutualLikes();
      },
      (error) => {
        console.error('Erro ao registrar o like:', error);
      }
    );
  }

  goToChat(otherUserId: string): void {
    if (!this.currentUser) {
      console.error('Usuário não encontrado.');
      return;
    }
    this.router.navigate(['/chat', otherUserId]);
  }

  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }
}
