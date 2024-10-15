import { Component } from '@angular/core';

interface Message {
  sender: string;
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userName: string = '';
  isLoggedIn: boolean = false;
  newMessage: string = '';
  messages: Message[] = [];

  login() {
    if (this.userName.trim()) {
      this.isLoggedIn = true;
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message: Message = {
        sender: this.userName,
        content: this.newMessage
      };
      this.messages.push(message);
      this.newMessage = ''; // Limpa a caixa de entrada
    }
  }
}
