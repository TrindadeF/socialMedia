import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'database';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/auth'; // URL para autenticação
  private apiPost = 'http://localhost:3000/post'; // URL para posts

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken'); // Recupera o token de autenticação do localStorage
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

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiPost}/`); // Retorna todos os posts
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Remove o token do localStorage
  }

  getUserProfile(): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token ao cabeçalho da requisição
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  publishPost(formData: FormData): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token ao cabeçalho da requisição
    });
    return this.http.post<any>(`${this.apiUrl}/post`, formData, { headers });
  }

  updateUserProfile(userId: string, profileData: FormData): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token ao cabeçalho da requisição
    });
    return this.http.put(`${this.apiUrl}/profile/edit/${userId}`, profileData, {
      headers,
    });
  }

  getUserById(userId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token ao cabeçalho da requisição
    });
    return this.http.get(`${this.apiUrl}/profile/${userId}`, { headers });
  }

  likePost(postId: string, currentUserId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token ao cabeçalho da requisição
    });
    const body = { userId: currentUserId }; // Envia o ID do usuário no corpo da requisição (se necessário)
    return this.http.post(`${this.apiPost}/${postId}/like`, body, { headers }); // Faz a requisição para curtir a postagem
  }
}
