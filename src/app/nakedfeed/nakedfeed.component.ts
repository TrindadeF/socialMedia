import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'database';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swiper from 'swiper';



@Component({
  selector: 'app-nakedfeed',
  templateUrl: './nakedfeed.component.html',
  styleUrls: ['./nakedfeed.component.css'],
})
export class NakedFeedComponent implements OnInit {
  users: User[] = [];
  currentUser!: User;
  mutualLikes: { [key: string]: boolean } = {};
  hasActiveSubscription: boolean | undefined;
  showOverlay: boolean = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.getCurrentUser();
    this.checkUserSubscriptionStatus();
  }
  initializeSwiper(): void {
    new Swiper('.swiper-container', {
      loop: true,
      autoplay: {
        delay: 2500,
      },
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
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

  checkUserSubscriptionStatus(): void {
    console.log('Iniciando verificação de status de assinatura...');
    const currentUserId = this.getLoggedUserId();

    if (!currentUserId) {
      console.error('ID do usuário atual não encontrado.');
      return;
    }

    this.apiService.checkSubscriptionStatus(currentUserId).subscribe(
      (response) => {
        console.log('Resposta de status de assinatura:', response);
        this.hasActiveSubscription = response.hasActiveSubscription;

        if (!this.hasActiveSubscription) {
          this.showOverlay = true;

          this.snackBar
            .open(
              'É preciso assinar um plano para usar esta página.',
              'Assinar Agora',
              {
                duration: 5000,
                verticalPosition: 'top',
              }
            )
            .onAction()
            .subscribe(() => {
              this.showOverlay = false;
              this.router.navigate(['/payments']);
            });
        }
      },
      (error) => {
        console.error('Erro ao verificar status da assinatura:', error);
        const errorMessage =
          error.error?.message || 'Erro ao verificar status da assinatura.';

        this.showOverlay = true;

        this.snackBar
          .open(errorMessage, 'Assinar Agora', {
            duration: 5000,
            verticalPosition: 'top',
          })
          .onAction()
          .subscribe(() => {
            this.showOverlay = false;
            this.router.navigate(['/payments']);
          });
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
    if (!this.currentUser || !this.currentUser._id) {
      console.error('Usuário atual não encontrado.');
      return;
    }

    this.apiService
      .getOrCreateChat(this.currentUser._id, otherUserId)
      .subscribe({
        next: (response) => {
          const chatId = response.chatId;
          this.router.navigate(['/chat', chatId]);
        },
        error: (error) => {
          console.error('Erro ao iniciar ou obter conversa:', error);
        },
      });
  }

  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }
}
