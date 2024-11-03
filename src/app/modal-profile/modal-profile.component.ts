import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from 'database';

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

  comments: string[] = []; // Lista de comentários
  newComment: string = ''; // Comentário que está sendo adicionado

  open() {
    this.show = true;
  }

  close() {
    this.show = false;
    this.closeEvent.emit();
  }
}
