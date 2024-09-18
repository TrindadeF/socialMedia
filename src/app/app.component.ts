import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app-love';
  message: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe((data) => {
      this.message = data.message;
    });
  }
}
