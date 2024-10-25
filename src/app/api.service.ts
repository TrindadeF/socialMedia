import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, User } from 'database';
import { LikesResponse } from 'response.types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/auth';
  private apiFirstFeed = 'http://localhost:3000/primaryFeed';
  private apiSecondFeed = 'http://localhost:3000/secondFeed';
  private api = 'http://localhost:3000';

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
    return this.http.post(`${this.api}/reset-password`, { email });
  }

  getPostsFromFirstFeed(userId?: string): Observable<any> {
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

  getPostsFromSecondFeed(userId?: string): Observable<any> {
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

  getUserProfile(userId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/profile/${userId}`, { headers });
  }

  publishPost(formData: FormData): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.apiUrl}/post`, formData, { headers });
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
    return this.http.get(`${this.api}/users/${userId}`, { headers });
  }
  deletePostFromFirstFeed(postId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.apiFirstFeed}/post/${postId}`, { headers });
  }

  deletePostFromSecondFeed(postId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.apiSecondFeed}/post/${postId}`, {
      headers,
    });
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/users');
  }
  likeUser(userId: string, likedUserId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${this.apiUrl}/like-user`,
      { userId, likedUserId },
      { headers }
    );
  }
  getPostsByLoggedUser(): Observable<Post[]> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuário não logado');
    }
    return this.http.get<Post[]>(
      `${this.apiSecondFeed}/posts?userId=${userId}`
    );
  }

  getPostsByUserId(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(
      `${this.apiSecondFeed}/posts?userId=${userId}`
    );
  }

  getPostsFromFirstFeedByUserId(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiFirstFeed}/posts?userId=${userId}`);
  }

  getPostsFromSecondFeedByUserId(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(
      `${this.apiSecondFeed}/posts?userId=${userId}`
    );
  }

  getUsersWhoLikedPost(postId: string): Observable<LikesResponse> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<LikesResponse>(`${this.apiUrl}/${postId}/likes`, {
      headers,
    });
  }

  getUsersWhoLikedProfile(userId: string): Observable<User[]> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User[]>(`${this.apiUrl}/profile/${userId}/likes`, {
      headers,
    });
  }
}
