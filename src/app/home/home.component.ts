import { Component, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.setupSmoothScroll();
    this.setupDomContentLoaded();
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
