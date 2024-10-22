import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'database';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/auth';
  private apiFirstFeed = 'http://localhost:3000/primaryFeed';
  private apiSecondFeed = 'http://localhost:3000/secondFeed';

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
  }

  getPostsFromFirstFeed(): Observable<any> {
    return this.http.get(`${this.apiFirstFeed}/`);
  }

  publishPostToFirstFeed(formData: FormData): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.apiFirstFeed}/post`, formData, {
      headers,
    });
  }

  likePostInFirstFeed(postId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(
      `${this.apiFirstFeed}/${postId}/like`,
      {},
      { headers }
    );
  }

  getPostsFromSecondFeed(): Observable<any> {
    return this.http.get(`${this.apiSecondFeed}/`);
  }

  publishPostToSecondFeed(formData: FormData): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.apiSecondFeed}/post`, formData, {
      headers,
    });
  }

  likePostInSecondFeed(postId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(
      `${this.apiSecondFeed}/${postId}/like`,
      {},
      { headers }
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  getUserProfile(): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  updateUserProfile(userId: string, profileData: FormData): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(`${this.apiUrl}/profile/edit/${userId}`, profileData, {
      headers,
    });
  }

  getUserById(userId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/profile/${userId}`, { headers });
  }
}
