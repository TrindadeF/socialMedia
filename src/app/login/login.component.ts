import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);
        console.log('Login bem-sucedido', response);
        this.router.navigate(['/rules']); // Redireciona para a página de regras
      },
      error: (err) => {
        this.errorMessage = 'E-mail ou senha inválidos. Tente novamente.';
        console.error('Erro no login:', err);
      },
    });
  }
}
