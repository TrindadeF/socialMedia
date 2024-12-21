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
      description: 'Encontrar a nossa alma gémea é sempre complicado.',
    },
    {
      src: 'assets/imagems/mamaco 2.jpg',
      alt: 'Imagem 2',
      description:
        'Existem várias aplicações, redes sociais, sites de encontro e mesmo assim, continuámos à procura do verdadeiro amor.',
    },
    {
      src: 'assets/imagems/mamaco 3.jpg',
      alt: 'Imagem 3',
      description:
        'Quando se fala de amor e da pessoa certa, perder tempo para quê? No Naked Love, livrámo-nos de todos os filtros e roupas para ver se existe uma forma mais instintiva de o encontrar.',
    },
    {
      src: 'assets/imagems/mamaco 4.jpg',
      alt: 'Imagem 4',
      description:
        'Como encontramos a pessoa certa? Seria bom poder evitar erros, surpresas desagradáveis e sobretudo perda de tempo. No Naked Love, temos a forma ideal para encontrar a sua alma gémea.',
    },
    {
      src: 'assets/imagems/mamaco 5.jpg',
      alt: 'Imagem 5',
      description:
        'O que é preciso para nos apaixonarmos, o que desencadeia a faísca e o que nos influencia na escolha de um parceiro? No Naked Love, temos a oportunidade de descobrir um parceiro e começar como terminamos, nus.',
    },
    {
      src: 'assets/imagems/ERO 6.jpg',
      alt: 'Imagem 6',
      description:
        'Quanto tempo demoramos para nos apaixonarmos? Para a ciência, segundos; para os poetas, uma vida inteira não é suficiente.',
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
