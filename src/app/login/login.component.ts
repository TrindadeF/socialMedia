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

  constructor(private apiService: ApiService, private router: Router) {
    // Verifica se o usuário está logado ao abrir a página
    const isSessionActive = sessionStorage.getItem('sessionActive');
    if (!isSessionActive && localStorage.getItem('token')) {
      // Se o token está no localStorage mas não há sessão ativa, deslogar o usuário
      this.logout();
    }
  }

  onSubmit() {
    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log(response);
        // Salva dados no localStorage
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);

        // Marca a sessão ativa no sessionStorage
        sessionStorage.setItem('sessionActive', 'true');

        console.log('Login bem-sucedido', response);
        this.router.navigate(['/rules']);
      },
      error: (err) => {
        this.errorMessage = 'E-mail ou senha inválidos. Tente novamente.';
        console.error('Erro no login:', err);
      },
    });
  }

  logout() {
    // Apenas remove a sessão ativa, sem apagar o localStorage
    sessionStorage.removeItem('sessionActive');
    this.router.navigate(['/login']);
  }
}
