import { Component, Renderer2, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  gender: string = '';
  age: number | undefined;
  errorMessage: string = '';
  termsAccepted: boolean = false;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setupGenderSelectListener();
    this.setupFileInputListener();
    this.setupAnimationEndListener();
  }

  setupGenderSelectListener(): void {
    const genderSelect = document.getElementById(
      'gender-select'
    ) as HTMLSelectElement;
    const formContainer = document.getElementById('form-container');

    if (genderSelect && formContainer) {
      this.renderer.listen(genderSelect, 'change', (event) => {
        const value = (event.target as HTMLSelectElement).value;
        this.gender = value;
        if (value === 'female') {
          formContainer.classList.add('feminine');
        } else {
          formContainer.classList.remove('feminine');
        }
      });
    }
  }

  setupFileInputListener(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const profilePicture = document.getElementById('profile-picture');

    if (fileInput && profilePicture) {
      this.renderer.listen(fileInput, 'change', () => {
        const file = fileInput.files ? fileInput.files[0] : null;
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              profilePicture.style.backgroundImage = `url(${e.target.result})`;
              profilePicture.classList.add('has-photo');
            }
          };
          reader.readAsDataURL(file);
        } else {
          profilePicture.style.backgroundImage =
            'url("https://via.placeholder.com/120")';
          profilePicture.classList.remove('has-photo');
        }
      });
    }
  }

  setupAnimationEndListener(): void {
    const formContainer = document.getElementById('form-container');
    const sexyImage = document.getElementById('sexy-image');

    if (formContainer && sexyImage) {
      this.renderer.listen(
        formContainer,
        'animationend',
        (event: AnimationEvent) => {
          if (event.animationName === 'fadeInContainer') {
            sexyImage.classList.add('show');
          }
        }
      );
    }
  }

  registerUser(): void {
    if (!this.termsAccepted) {
      this.errorMessage = 'Você deve aceitar os termos para se registrar.';
      this.snackBar.open(this.errorMessage, 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      this.snackBar.open(this.errorMessage, 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
    }

    if (!this.name || !this.email || !this.password || !this.gender || !this.age) {
      this.errorMessage = 'Todos os campos são obrigatórios.';
      this.snackBar.open(this.errorMessage, 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
    }

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      gender: this.gender,
      age: this.age,
    };

    this.apiService
      .register(
        userData.email,
        userData.password,
        userData.name,
        userData.gender,
        userData.age
      )
      .subscribe({
        next: (response) => {
          console.log('Usuário registrado com sucesso!', response);
          this.snackBar.open('Usuário registrado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.router.navigate(['/presentation']);
        },
        error: (error) => {
          console.error('Erro ao registrar o usuário:', error);
          this.errorMessage = 'Erro ao registrar. Tente novamente.';
          this.snackBar.open(this.errorMessage, 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
      });
  }

  
}
