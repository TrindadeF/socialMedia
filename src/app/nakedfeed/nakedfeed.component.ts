import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'database';

@Component({
  selector: 'app-nakedfeed',
  templateUrl: './nakedfeed.component.html',
  styleUrls: ['./nakedfeed.component.css'],
})
export class NakedFeedComponent implements OnInit {
  users: User[] = [];
  currentUser: User | null = null;
  selectedUser: User | null = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadUsers();
    this.getCurrentUser();
    this.loadSelectedUser();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data;
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
      },
      (error) => {
        console.error('Erro ao carregar o perfil do usuário atual:', error);
      }
    );
  }

  loadSelectedUser(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      this.apiService.getUserById(userId).subscribe(
        (data: User) => {
          this.selectedUser = data;
        },
        (error) => {
          console.error(
            'Erro ao carregar o perfil do usuário selecionado:',
            error
          );
        }
      );
    }
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
      },
      (error) => {
        console.error('Erro ao registrar o like:', error);
      }
    );
  }

  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }
}

