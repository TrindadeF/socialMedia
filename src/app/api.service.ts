import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Chat, Message, Post, User } from 'database';
import { LikesResponse } from 'response.types';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiDev = environment.apiUrl;
  private apiUrl = `${this.apiDev}/auth`;
  private apiFirstFeed = `${this.apiDev}/primaryFeed`;
  private apiSecondFeed = `${this.apiDev}/secondFeed`;
  private api = `${this.apiDev}`;

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(
    email: string,
    password: string,
    name: string,
    gender: string,
    age: number
  ): Observable<any> {
    const userData = { name, email, password, gender, age };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/register`, userData, { headers });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.api}/reset-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http
      .post(`${this.api}/reset-password/ ${token}`, { token, password })
      .pipe(
        catchError((error) => {
          console.error('Erro ao redefinir a senha:', error);
          return throwError(() => new Error('Erro ao redefinir a senha.'));
        })
      );
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

  getFollowers(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/new-followers/${userId}`);
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
    return this.http.delete(`${this.apiFirstFeed}/${postId}`, { headers });
  }

  deletePostFromSecondFeed(postId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.apiSecondFeed}/${postId}`, {
      headers,
    });
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/users`);
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

  checkMutualLike(
    userId: string,
    otherUserId: string
  ): Observable<{ mutualLike: boolean }> {
    return this.http.get<{ mutualLike: boolean }>(
      `${this.apiUrl}/profile/check-mutual-like?userId=${userId}&otherUserId=${otherUserId}`
    );
  }

  sendMessage(
    senderId: string,
    receiverId: string,
    content: string
  ): Observable<any> {
    const url = `${this.apiUrl}/send-message`;
    const body = { sender: senderId, receiver: receiverId, content };
    return this.http.post<any>(url, body);
  }

  getChatByUsers(userId1: String, userId2: String): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/chats/${userId1}/${userId2}`);
  }
  getChatsByUserId(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chats`);
  }
  toggleFollow(targetUserId: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/profile/${targetUserId}/follow`;
    return this.http.post<{ message: string }>(url, {});
  }
  deleteprofile(userId: string): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/profile/${userId}`);
  }
  isFollowing(loggedUserId: string, targetUserId: string): Observable<boolean> {
    const url = `${this.apiUrl}/profile/${loggedUserId}/isFollowing/${targetUserId}`;
    return this.http.get<boolean>(url);
  }
  addCommentInFirstFeed(postId: string, content: string): Observable<any> {
    const url = `${this.apiFirstFeed}/posts/${postId}/comments`;
    return this.http.post(url, { content });
  }
  addCommentInSecondFeed(postId: string, content: string): Observable<any> {
    const url = `${this.apiSecondFeed}/posts/${postId}/comments`;
    return this.http.post(url, { postId, content });
  }
  getOrCreateChat(userId1: string, userId2: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chats`, { userId1, userId2 });
  }
  deleteChat(userId1: string, userId2: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiSecondFeed}/chats/${userId1}/${userId2}`
    );
  }
  getPostWithComments(postId: string): Observable<any> {
    return this.http.get<any>(`${this.apiFirstFeed}/posts/${postId}/comments`);
  }
  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.apiFirstFeed}/comments/${commentId}`);
  }
  deleteCommentSecondFeed(commentId: string): Observable<any> {
    const url = `${this.apiSecondFeed}/comments/${commentId}`;
    return this.http.delete(url);
  }
  checkSubscriptionStatus(
    userId: string
  ): Observable<{ hasActiveSubscription: boolean }> {
    return this.http.get<{ hasActiveSubscription: boolean }>(
      `${this.api}/stripe/subscription-status/${userId}`
    );
  }

  getPostDetails(postId: string): Observable<any> {
    return this.http.get<any>(`${this.apiSecondFeed}/posts/${postId}/comments`);
  }
  cancelSubscription(subscriptionId: string): Observable<any> {
    return this.http.post<any>(
      `${this.api}/stripe-webhook/cancel-subscription`,
      { subscriptionId }
    );
  }

  getUserSecondPosts(userId: string): Observable<any> {
    return this.http.get(`${this.apiSecondFeed}/posts?userId=${userId}`);
  }
  getUserPrimaryPosts(userId: string): Observable<any> {
    return this.http.get(`${this.apiFirstFeed}/posts?userId=${userId}`);
  }

  blockUser(blockUserId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post(`${this.apiUrl}/block/${blockUserId}`, null, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erro ao bloquear usuário:', error);
          return throwError(() => new Error('Erro ao bloquear o usuário.'));
        })
      );
  }
  unblockUser(unblockUserId: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post(`${this.apiUrl}/unblock/${unblockUserId}`, null, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erro ao desbloquear usuário:', error);
          return throwError(() => new Error('Erro ao desbloquear o usuário.'));
        })
      );
  }

  reportUser(reportUserId: string, reason: string): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post(`${this.apiUrl}/report`, { reportUserId, reason }, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erro ao reportar usuário:', error);
          return throwError(() => new Error('Erro ao reportar o usuário.'));
        })
      );
  }
}
