import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
})
export class RulesComponent {
  currentIndex = 0;

  items = [
    {
      title: this.translate.instant('RULES.WELCOME.TITLE'),
      description: this.translate.instant('RULES.WELCOME.DESCRIPTION'),
    },
    {
      title: this.translate.instant('RULES.BE_YOURSELF.TITLE'),
      description: this.translate.instant('RULES.BE_YOURSELF.DESCRIPTION'),
    },
    {
      title: this.translate.instant('RULES.BE_CAUTIOUS.TITLE'),
      description: this.translate.instant('RULES.BE_CAUTIOUS.DESCRIPTION'),
    },
    {
      title: this.translate.instant('RULES.SECURE_CONVERSATIONS.TITLE'),
      description: this.translate.instant(
        'RULES.SECURE_CONVERSATIONS.DESCRIPTION'
      ),
    },
    {
      title: this.translate.instant('RULES.BE_PROACTIVE.TITLE'),
      description: this.translate.instant('RULES.BE_PROACTIVE.DESCRIPTION'),
    },
  ];

  constructor(private router: Router, private translate: TranslateService) {
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
      // Ao terminar as regras, redireciona para o perfil
      this.router.navigate(['/edit-profile']);
    }
  }

  isActive(index: number) {
    return this.currentIndex === index;
  }
}
