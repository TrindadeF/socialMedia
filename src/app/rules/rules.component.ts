import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
})
export class RulesComponent {
  currentIndex = 0;
  items = [
    {
      title: 'Bem-vindo(a) ao NakedLove',
      description: 'Siga estas Regras da casa:',
    },
    {
      title: 'Seja você mesmo',
      description:
        'Certifique-se de que as suas fotos, idade e biografia são fiéis à sua pessoa.',
    },
    {
      title: 'Seja prudente',
      description: 'Não tenha muita pressa em dar os seus dados pessoais.',
    },
    {
      title: 'Tenha Conversas virtuais seguras',
      description:
        'Seja simpático. Respeite os outros e trate-os como gostaria de ser tratado.',
    },
    {
      title: 'Seja proativo',
      description: 'Denuncie sempre os comportamentos incorretos.',
    },
  ];

  constructor(private router: Router) {
    if (!sessionStorage.getItem('rulesReloaded')) {
      sessionStorage.setItem('rulesReloaded', 'true');
      window.location.reload();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else {
      this.router.navigate(['/edit-profile']);
    }
  }

  isActive(index: number) {
    return this.currentIndex === index;
  }
}
