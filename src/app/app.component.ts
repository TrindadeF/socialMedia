import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userId: string | null = null;
  notifications: string[] = [];
  unreadNotificationsCount: number = 0;

  constructor(private router: Router, private translate: TranslateService, private snackBar: MatSnackBar) {
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
    const userId = this.getUserIdFromAuthService();
    if (userId) {
        this.getUnreadNotificationsCount(userId);
    }
  }
  getUnreadNotificationsCount(userId: string): void {
    const notificationsKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
    this.unreadNotificationsCount = notifications.filter((n: any) => !n.read).length;
}
getUserIdFromAuthService(): string {
  return localStorage.getItem('userId') || '';
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
 
  
  loadNotifications(userId: string): void {
    const notificationsKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
  
    this.notifications = notifications;
    this.unreadNotificationsCount = notifications.filter(
      (notification: any) => !notification.read
    ).length;
  
    if (notifications.length > 0) {
      notifications.forEach((notification: any) => {
        if (!notification.read) {
          this.snackBar.open(notification.message, 'Fechar', { duration: 3000 });
        }
      });
    }
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
