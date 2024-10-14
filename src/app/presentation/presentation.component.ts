import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit {
  images = [
    { src: 'assets/ERO 1.jpg', alt: 'Imagem 1', description: 'Encontrar a nossa alma gêmea é sempre complicado...' },
    // Adicione mais imagens aqui
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
