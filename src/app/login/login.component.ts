import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setupLoginForm();
  }

  setupLoginForm(): void {
    const loginForm = document.getElementById('login-form') as HTMLFormElement;

    if (loginForm) {
      this.renderer.listen(loginForm, 'submit', (event: Event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore');

        if (!hasLoggedInBefore) {
          localStorage.setItem('hasLoggedInBefore', 'true');
          window.location.href = 'regras.html';
        } else {
          window.location.href = '/18 rl p2/rl/Perfil/Perfil.html';
        }
      });
    }
  }
}
