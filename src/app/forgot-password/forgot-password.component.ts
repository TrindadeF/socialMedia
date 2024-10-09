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

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    this.apiService.resetPassword(this.email).subscribe({
      next: (response: any) => {
        this.successMessage = 'Verifique seu e-mail para redefinir sua senha.';
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.errorMessage = 'E-mail não encontrado. Tente novamente.';
        this.successMessage = '';
      },
    });
  }
}
