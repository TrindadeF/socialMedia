import { Component, OnInit } from '@angular/core';

interface Image {
  src: string;
  text: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
})
export class IntroComponent implements OnInit {
  images: Image[] = [
    {
      src: 'assests/images/ERO 1.jpg',
      text: 'Encontrar a nossa alma gémea é sempre complicado...',
    },
    {
      src: 'assests/images/ERO 2.jpg',
      text: 'Quanto tempo demoramos para nos apaixonarmos...?',
    },
    {
      src: 'assests/images/ERO 3.jpg',
      text: 'Como encontramos a pessoa certa...?',
    },
    {
      src: 'assests/images/ERO 4.jpg',
      text: 'Quando se falar de amor e da pessoa certa...?',
    },
    {
      src: 'assests/images/ERO 5.jpg',
      text: 'O que é preciso para nos apaixonarmos...?',
    },
  ];

  currentIndex: number = 0;
  loading: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.initializeCarousel();
  }

  updateSlide(): void {
    const imageElement = document.querySelector<HTMLImageElement>(
      '.image-container img'
    );
    const overlayElement = document.querySelector<HTMLElement>('.overlay');
    const dots = document.querySelectorAll<HTMLElement>('.dot');
    const specialButton = document.getElementById('specialButton');

    if (imageElement && overlayElement && specialButton) {
      imageElement.src = this.images[this.currentIndex].src;
      overlayElement.textContent = this.images[this.currentIndex].text;

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentIndex);
      });

      if (this.currentIndex === this.images.length - 1) {
        specialButton.classList.add('show');
      } else {
        specialButton.classList.remove('show');
      }
    }
  }

  showPreviousSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateSlide();
  }

  showNextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateSlide();
  }

  initializeCarousel(): void {
    const loadingElement = document.getElementById('loading');
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (loadingElement && carouselWrapper) {
      setTimeout(() => {
        loadingElement.style.opacity = '0';
        setTimeout(() => {
          loadingElement.style.display = 'none';
          carouselWrapper.classList.add('visible');
        }, 1000);
      }, 2000);
    }
  }
}
