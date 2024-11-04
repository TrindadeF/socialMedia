import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { Post, User } from 'database';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.css'],
})
export class ModalProfileComponent {
  @Input() imageSrc!: string; // URL da imagem a ser exibida
  @Input() show: boolean = false; // Controle de visibilidade
  @Output() closeEvent = new EventEmitter<void>(); // Evento de fechamento
  @Input() post!: Post;
  userId: string = '';
  selectedPostId: string = '';
  posts: Post[] = [];
  users: User[] = [];
  currentUser!: User;
  mutualLikes: { [key: string]: boolean } = {};
  @Input() postContent: string = '';
  @Input() feedType: 'primaryFeed' | 'secondFeed' = 'primaryFeed'

  comments: string[] = []; // Lista de comentários
  newComment: string = ''; // Comentário que está sendo adicionado
  apiService: any;
  @Output() publish = new EventEmitter<{ content: string | null; media: File[]; feedType: 'primaryFeed' | 'secondFeed' }>();

  open() {
    this.show = true;
  }

  close() {
    this.show = false;
    this.closeEvent.emit();
  }

  likePost(postId: string) {
    this.apiService.likePostInSecondFeed(postId).subscribe({
      next: () => console.log(`Post ${postId} curtido com sucesso!`),
      error: (error:any) => console.error(`Erro ao curtir o post:`, error),
    });
  }

  
  addComment() {
    if (this.newComment.trim() !== '') {
      this.comments.push(this.newComment);
      this.newComment = '';
    }
  }

 

  























}
