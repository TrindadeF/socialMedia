import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  showAgeVerification = true; // Controla a exibição do container de verificação de idade
  
  constructor(private renderer: Renderer2, private router: Router) {
    this.redirectIfLoggedIn();
  }

  ngAfterViewInit(): void {
    this.setupSmoothScroll();
    this.setupDomContentLoaded();
  }

  private redirectIfLoggedIn() {
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      this.router.navigate(['/profile']); 
    }
  }

  setupSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      this.renderer.listen(anchor, 'click', (e) => {
        e.preventDefault();
        const targetElement = document.querySelector(
          (anchor as HTMLAnchorElement).getAttribute('href') as string
        );
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
          });
        }
      });
    });
  }

  setupDomContentLoaded() {
    this.renderer.listen('document', 'DOMContentLoaded', () => {
      console.log('DOM totalmente carregado e analisado.');
      
      // Alerta de boas-vindas
      alert('Bem-vindo ao NakedLove!');

      const contentWrapper = document.getElementById('content-wrapper');
      if (contentWrapper) {
        const randomX = Math.random() * 2 - 1;
        const randomY = Math.random() * 2 - 1;
        contentWrapper.style.setProperty('--random-x', randomX.toString());
        contentWrapper.style.setProperty('--random-y', randomY.toString());

        setTimeout(() => {
          contentWrapper.style.opacity = '1';
          contentWrapper.style.transform = 'scale(1)';
        }, 100);
      }
    });
  }

  // Método para aceitar a verificação de idade
  acceptAgeVerification(): void {
    localStorage.setItem('ageVerified', 'true'); // Salva a aceitação
    this.showAgeVerification = false; // Fecha o container de verificação
  }

  // Método para recusar e redirecionar o usuário
  declineAgeVerification(): void {
    window.location.href = 'https://www.google.com'; // Redireciona para outro site
  }

  // Verifica se o usuário já aceitou a verificação de idade
  ngOnInit() {
    const ageVerified = localStorage.getItem('ageVerified');
    if (ageVerified) {
      this.showAgeVerification = false; // Esconde o container caso já tenha aceitado
    }
  }
}
