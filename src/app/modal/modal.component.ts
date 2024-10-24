import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from 'database';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() showModal: boolean = false;
  @Input() postContent: string = '';
  @Input()
  feedType!: 'primaryFeed' | 'secondFeed'; // Adicione esta linha
  @Output() close = new EventEmitter<void>();
  @Output() publish = new EventEmitter<{
    content: string;
    media: File[];
    feedType: 'primaryFeed' | 'secondFeed';
  }>();

  posts: Post[] = [];
  modalContent: string = '';
  canPublish: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;
  selectedMedia: File[] = [];
  alertMessage: string = '';
  alertType: string = '';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  onPublishPost() {
    this.publish.emit({
      content: this.postContent,
      media: this.selectedMedia,
      feedType: this.feedType,
    });
  }

  publishPost(feedType: 'primaryFeed' | 'secondFeed') {
    this.loading = true;
    const formData = new FormData();

    if (!this.postContent.trim() && this.selectedMedia.length === 0) {
      this.alertMessage = 'O conteúdo do post ou mídia são obrigatórios!';
      this.alertType = 'error';
      this.loading = false;
      return;
    }

    formData.append('content', this.postContent);
    this.selectedMedia.forEach((file) => {
      formData.append('image', file);
    });

    console.log('FormData:', formData);

    const url =
      feedType === 'primaryFeed'
        ? 'http://localhost:3000/primaryFeed/'
        : 'http://localhost:3000/secondFeed/';

    this.http.post<Post>(url, formData).subscribe({
      next: (response: Post) => {
        console.log('Post publicado com sucesso:', response);
        this.posts.unshift(response);
        this.resetForm();
        this.alertMessage = 'Post publicado com sucesso!';
        this.alertType = 'success';
      },
      error: (error) => {
        console.error('Erro ao publicar o post:', error);
        this.alertMessage = 'Erro ao publicar o post.';
        this.alertType = 'error';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onMediaSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedMedia = Array.from(fileInput.files);

      const previewImage = document.getElementById(
        'preview-image'
      ) as HTMLImageElement;
      const previewVideo = document.getElementById(
        'preview-video'
      ) as HTMLVideoElement;

      this.selectedMedia.forEach((file) => {
        const fileReader = new FileReader();

        if (file.type.startsWith('image/')) {
          fileReader.onload = () => {
            previewImage.src = fileReader.result as string;
            previewImage.style.display = 'block';
            previewVideo.style.display = 'none';
          };
          fileReader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          fileReader.onload = () => {
            previewVideo.src = fileReader.result as string;
            previewVideo.style.display = 'block';
            previewImage.style.display = 'none';
          };
          fileReader.readAsDataURL(file);
        }
      });

      this.checkFormValidity();
    }
  }

  checkFormValidity() {
    this.canPublish =
      !!this.postContent.trim() || this.selectedMedia.length > 0;
  }

  resetForm() {
    this.postContent = '';
    this.selectedMedia = [];
    const previewImage = document.getElementById(
      'preview-image'
    ) as HTMLImageElement;
    const previewVideo = document.getElementById(
      'preview-video'
    ) as HTMLVideoElement;
    previewImage.src = '';
    previewImage.style.display = 'none';
    previewVideo.src = '';
    previewVideo.style.display = 'none';
    this.alertMessage = '';
    this.canPublish = false;
  }

  isImage(mediaUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(mediaUrl);
  }

  closeModal() {
    this.close.emit();
  }
}
