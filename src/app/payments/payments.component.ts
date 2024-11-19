import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Para notificações

@Component({
  selector: 'app-love',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  userId: string = '';
  userEmail: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar // Para notificações
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.apiService.getUserById(userId).subscribe(
        (response: { userId: string; email: string }) => {
          this.userId = response.userId;
          this.userEmail = response.email;
        },
        (error) => {
          console.error('Erro ao buscar perfil do usuário:', error);
        }
      );
    } else {
      console.error('User ID não encontrado no localStorage');
    }
  }

  subscribeToPlan(planId: string) {
    const requestBody = {
      userId: this.userId,
      email: this.userEmail,
    };

    this.http
      .post<{ url: string }>(
        `https://nakedlove.eu/api/stripe/checkout/${planId}`,
        requestBody
      )
      .subscribe(
        (response) => {
          window.location.href = response.url;
        },
        (error) => {
          console.error('Erro ao criar a sessão de checkout:', error);
        }
      );
  }

  plan1() {
    this.subscribeToPlan('plan1');
  }

  plan2() {
    this.subscribeToPlan('plan2');
  }

  plan3() {
    this.subscribeToPlan('plan3');
  }
<<<<<<< HEAD
  cancelSubscription() {
 
    console.log('Assinatura cancelada');
    alert('Sua assinatura foi cancelada com sucesso.');
=======

  cancelSubscription(): void {
    if (!this.userId) {
      console.error('ID do usuário não está definido.');
      return;
    }

    const confirmation = confirm(
      'Tem certeza que deseja cancelar sua assinatura?'
    );
    if (!confirmation) {
      return;
    }

    this.http
      .delete<{ message: string }>(
        `https://nakedlove.eu/api/stripe/cancel-subscription/${this.userId}`
      )
      .subscribe(
        (response) => {
          console.log('Assinatura cancelada com sucesso:', response.message);
          this.snackBar.open('Assinatura cancelada com sucesso.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        },
        (error) => {
          console.error('Erro ao cancelar a assinatura:', error);
          const errorMessage =
            error.error?.message || 'Erro ao cancelar a assinatura.';
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        }
      );
>>>>>>> ebe4ed9f5a0f07720752abe2df2211086c4cb194
  }
}
