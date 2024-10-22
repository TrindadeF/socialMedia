import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  token: string = ''; // Adiciona uma variável para armazenar o token

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    // Remove espaços em branco no início e no final do e-mail
    this.email = this.email.trim();

    console.log('E-mail enviado:', this.email); // Log para verificar o e-mail

    this.apiService.resetPassword(this.email).subscribe({
      next: (response: any) => {
        // Supondo que o token seja retornado na resposta
        if (response.token) {
          this.token = response.token; // Armazena o token recebido
          localStorage.setItem('resetToken', this.token); // Armazena o token no localStorage
        }
        this.successMessage = 'Verifique seu e-mail para redefinir sua senha.';
        this.errorMessage = '';
      },
      error: (err: any) => {
        console.error('Erro ao tentar redefinir a senha:', err); // Log para verificar o erro
        this.errorMessage = 'E-mail não encontrado. Tente novamente.';
        this.successMessage = '';
      },
    });
  }
}
