import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css'],
})
export class PresentationComponent implements OnInit, OnDestroy {
  images = [
    {
      src: 'assets/imagems/mamaco 1.jpg',
      alt: 'Imagem 1',
      description: 'Finding our soulmate is always complicated.',
    },
    {
      src: 'assets/imagems/mamaco 2.jpg',
      alt: 'Imagem 2',
      description:
        'There are many apps, social networks, and dating sites, yet we still keep searching for true love.',
    },
    {
      src: 'assets/imagems/mamaco 3.jpg',
      alt: 'Imagem 3',
      description:
      'When it comes to love and the right person, why waste time? At Naked Love, we strip away all filters and clothes to see if there’s a more instinctive way to find it.',
    },
    {
      src: 'assets/imagems/mamaco 4.jpg',
      alt: 'Imagem 4',
      description:
        'How do we find the right person? It would be great to avoid mistakes, unpleasant surprises, and especially wasting time. At Naked Love, we have the perfect way to help you find your soulmate.',
    },
    {
      src: 'assets/imagems/mamaco 5.jpg',
      alt: 'Imagem 5',
      description:
        'What does it take for us to fall in love? What sparks the connection, and what influences our choice of a partner? At Naked Love, we have the opportunity to discover a partner and start as we end—naked.',
    },
    {
      src: 'assets/imagems/ERO 6.jpg',
      alt: 'Imagem 6',
      description:
        'How long does it take for us to fall in love? For science, just seconds; for poets, an entire lifetime is not enough.',
    },
  ];
  currentIndex: number = 0;
  isLoading: boolean = true;
  slideshowInterval: any;

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.startSlideshow();
    }, 2000);
  }

  startSlideshow(): void {
    this.slideshowInterval = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  nextImage(): void {
    if (this.currentIndex === this.images.length - 1) {
      this.router.navigate(['/login']); // Redireciona para a página de login
      clearInterval(this.slideshowInterval); // Para o slideshow
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }

  prevImage(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number): void {
    this.currentIndex = index;
    clearInterval(this.slideshowInterval);
  }

  goToHomePage(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    clearInterval(this.slideshowInterval); // Evita vazamentos de memória
  }
}
