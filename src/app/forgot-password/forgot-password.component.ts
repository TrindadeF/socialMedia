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
  token: string = '';


  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    this.email = this.email.trim();

    if (!this.email) {
      this.errorMessage = 'Por favor, insira um e-mail válido.';
      return;
    }

    this.apiService.forgotPassword( this.email).subscribe({
      next: () => {
        this.successMessage = 'Verifique seu e-mail para redefinir sua senha.';
        this.errorMessage = '';
      },
      error: (err: any) => {
        console.error('Erro ao tentar redefinir a senha:', err);
        this.errorMessage =
          'E-mail não encontrado ou erro no servidor. Tente novamente.';
        this.successMessage = '';
      },
    });
  }
}
