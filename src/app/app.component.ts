import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app-love';

  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService) {}

  // Método para realizar login
  login() {
    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido', response);
        // Aqui você pode redirecionar o usuário ou armazenar o token de autenticação
      },
      error: (error) => {
        console.error('Erro no login:', error);
      },
    });
  }

  // Método para realizar registro
  register() {
    this.apiService.register(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido', response);
        // Você pode notificar o usuário de que o registro foi bem-sucedido
      },
      error: (error) => {
        console.error('Erro no registro:', error);
      },
    });
  }
}
