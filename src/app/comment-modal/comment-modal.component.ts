import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css'],
})
export class CommentModalComponent {
  @Input() postId!: string;
  @Input() feedType!: 'primaryFeed' | 'secondFeed';
  @Output() commentAdded = new EventEmitter<void>();

  commentText: string = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  postComment() {
    if (!this.commentText.trim()) {
      return;
    }

    const url =
      this.feedType === 'primaryFeed'
        ? `http://localhost:3000/primaryFeed/posts/${this.postId}/comments`
        : `http://localhost:3000/secondFeed//posts/${this.postId}/comments`;

    this.http.post(url, { content: this.commentText }).subscribe({
      next: () => {
        this.snackBar.open('Comentário adicionado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.commentAdded.emit();
        this.commentText = '';
      },
      error: (err) => {
        console.error('Erro ao adicionar comentário:', err);
        this.snackBar.open('Erro ao adicionar comentário', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
}
