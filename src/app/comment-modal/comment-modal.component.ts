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
  @Input() content: any;
  @Input() postContent: any;
  @Input() showModal: boolean = false;
  @Input() title: string = '';
  @Output() closeEvent = new EventEmitter<void>();
  isModalOpen: boolean = false;
  selectedPost: any;
  selectedPostId: string | null = null;
  canPublish: boolean = false;
  commentText: string = '';
  selectedMedia: any;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  closeModal() {
    this.closeEvent.emit();
    this.showModal = false;
    this.isModalOpen = false;
  }

  checkFormValidity() {
    this.canPublish =
      !!this.postContent.trim() || this.selectedMedia.length > 0;
  }

  postComment() {
    if (!this.commentText.trim()) {
      return;
    }

    const url =
      this.feedType === 'primaryFeed'
        ? `https://nakedlove.eu/api/primaryFeed/posts/${this.postId}/comments`
        : `https://nakedlove.eu/api/secondFeed//posts/${this.postId}/comments`;

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
