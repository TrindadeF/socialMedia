import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/auth';
  private apiPost = 'http://localhost:3000/post';

  constructor(private http: HttpClient) {}
  private isLoggedIn: boolean = false;

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiPost}/`);
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  publishPost(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/post`, formData);
  }

  userIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/edit/${userId}`, profileData);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${userId}`);
  }
}
