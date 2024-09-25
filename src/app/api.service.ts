import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from 'database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getData(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/post`);
  }
}
