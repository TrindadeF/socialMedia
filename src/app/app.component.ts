import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userId: string | null = null;

  constructor(private router: Router) {}

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

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
