import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-love',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
  constructor(private http: HttpClient, private router: Router) {}

  navigateToPayment() {
    this.http
      .post<{ url: string }>('http://localhost:3000/stripe/checkout', {})
      .subscribe(
        (response) => {
          window.location.href = response.url;
        },
        (error) => {
          console.error('Erro ao criar a sessão de checkout:', error);
        }
      );
  }
}
