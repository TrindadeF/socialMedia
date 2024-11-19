import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.css']
})
export class ModalAlertComponent {
  
  @Input() isModalVisible = false;  // Recebe a visibilidade do modal do componente pai
  @Output() accept = new EventEmitter<void>();  // Emite evento quando o usuário aceita
  @Output() decline = new EventEmitter<void>();  // Emite evento quando o usuário recusa

  hideModal() {
    this.isModalVisible = false;  
  }

  acceptAction(): void {
    this.accept.emit();  // Notifica o pai que a ação foi aceita
    this.hideModal();  
  }

  declineAction(): void {
    this.decline.emit();  // Notifica o pai que a ação foi recusada
    this.hideModal();  
  }
}
