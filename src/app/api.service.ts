import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'database';

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
  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
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

  updateUserProfile(userId: string, profileData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/edit/${userId}`, profileData, {
      headers: {},
    });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${userId}`);
  }
  likePost(postId: string) {
    return this.http.post<Post>(
      `http://localhost:3000/post/${postId}/like`,
      {}
    );
  }
}
