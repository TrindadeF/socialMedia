import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Para redirecionar após o login
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private ApiService: ApiService, private router: Router) {}

  onSubmit() {
    this.ApiService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Salva o token se o login for bem-sucedido
        this.router.navigate(['/perfil']); // Redireciona para a página de perfil
      },
      error: (err) => {
        console.error('Erro no login:', err);
      },
    });
  }
}
