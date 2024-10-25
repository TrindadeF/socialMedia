import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit {
  images = [
  { 
    src: 'assets/imagems/ERO 1.jpg', 
    alt: 'Imagem 1', 
    description: 'Encontrar a nossa alma gémea é sempre complicado.' 
  },
  { 
    src: 'assets/imagems/ERO 2.jpg', // Adicione a URL da segunda imagem
    alt: 'Imagem 2', 
    description: 'Existem várias aplicações, redes sociais, sites de encontro e mesmo assim, continuámos à procura do verdadeiro amor.' 
  },
  { 
    src: 'assets/imagems/ERO 3.jpg', // Adicione a URL da terceira imagem
    alt: 'Imagem 3', 
    description: 'Quando se fala de amor e da pessoa certa, perder tempo para quê? No Naked Love, livrámo-nos de todos os filtros e roupas para ver se existe uma forma mais instintiva de o encontrar.' 
  },
  { 
    src: 'assets/imagems/ERO 4.jpg', // Adicione a URL da quarta imagem
    alt: 'Imagem 4', 
    description: 'Como encontramos a pessoa certa? Seria bom poder evitar erros, surpresas desagradáveis e sobretudo perda de tempo. No Naked Love, temos a forma ideal para encontrar a sua alma gémea.' 
  },
  { 
    src: 'assets/imagems/ERO 5.jpg', // Adicione a URL da quinta imagem
    alt: 'Imagem 5', 
    description: 'O que é preciso para nos apaixonarmos, o que desencadeia a faísca e o que nos influencia na escolha de um parceiro? No Naked Love, temos a oportunidade de descobrir um parceiro e começar como terminamos, nus.' 
  },
  { 
    src: 'assets/imagems/ERO 6.jpg', // Adicione a URL da sexta imagem
    alt: 'Imagem 6', 
    description: 'Quanto tempo demoramos para nos apaixonarmos? Para a ciência, segundos; para os poetas, uma vida inteira não é suficiente.' 
  },
];
  currentIndex: number = 0;
  isLoading: boolean = true;
  slideshowInterval: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.startSlideshow();
    }, 2000); // Simula um carregamento inicial de 2 segundos
  }

  startSlideshow(): void {
    this.slideshowInterval = setInterval(() => {
      this.nextImage();
    }, 5000); // Troca a imagem a cada 5 segundos
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number): void {
    this.currentIndex = index;
    clearInterval(this.slideshowInterval); // Para o slideshow automático ao clicar manualmente
  }

  goToHomePage(): void {
    this.router.navigate(['/home']); // Navega para a página inicial
  }
}
