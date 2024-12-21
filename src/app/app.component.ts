import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userId: string | null = null;

  constructor(private router: Router, private translate: TranslateService) {
    this.translate.addLangs(['en', 'pt', 'fr', 'es', 'de', 'it', 'zh', 'ru']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(
      browserLang && this.translate.getLangs().includes(browserLang)
        ? browserLang
        : 'en'
    );
  }

  ngOnInit() {
    this.loadUserId();
  }

  private loadUserId() {
    this.userId = localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!this.userId;
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  logout() {
    const confirmLogout = confirm('Deseja mesmo sair?');
    
    if (confirmLogout) {
      // Se o usuário confirmar o logout
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    } else {
      // Se o usuário cancelar o logout, nada acontece
      console.log('Logout cancelado');
    }
  }
}
