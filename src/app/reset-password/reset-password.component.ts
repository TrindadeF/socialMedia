import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';


  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Captura o token da URL
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      this.snackBar.open(this.errorMessage, 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      this.snackBar.open(this.errorMessage, 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
    }

    const resetData = {
      token: this.token,
      password: this.password,
    };

    this.apiService.resetPassword(this.token,this.password).subscribe({
      next: (response) => {
        console.log('Senha redefinida com sucesso!', response);
        this.snackBar.open('Senha redefinida com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.router.navigate(['/login']);  // Redireciona para a página de login
      },
      error: (error) => {
        console.error('Erro ao redefinir a senha:', error);
        this.errorMessage = 'Erro ao redefinir a senha. Tente novamente.';
        this.snackBar.open(this.errorMessage, 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }
}
