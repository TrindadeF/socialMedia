import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router'; // Importa o Router para redirecionar

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, private router: Router) {
    this.redirectIfLoggedIn(); // Chama a função de redirecionamento no construtor
  }

  ngAfterViewInit(): void {
    this.setupSmoothScroll();
    this.setupDomContentLoaded();
  }

  // Verifica se o usuário está logado e redireciona se necessário
  private redirectIfLoggedIn() {
    const userId = localStorage.getItem('userId'); // Verifique como você armazena o estado de login
    if (userId) {
      // Se o userId existir, redireciona para outra página
      this.router.navigate(['/profile']); // Altere para a rota que deseja redirecionar, por exemplo, o perfil
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
}
