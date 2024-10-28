import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Message, User, Chat } from 'database';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chats: Chat[] = [];
  selectedChat: Chat | null = null;
  currentUser!: User;
  newMessage: string = '';
  socket: Socket;
  mutualLike: any;
  messages: Message[] = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.apiService.getUserById(userId).subscribe((user: User) => {
        this.currentUser = user;
        this.loadChats();
      });
    }

    this.socket.on('receiveMessage', (message: Message) => {
      const chat = this.chats.find((c) =>
        c.participants.some((p: User) => p._id === message.sender)
      );
      if (chat) {
        chat.messages.push(message);
        chat.lastMessage = message;
        if (
          this.selectedChat?.participants.some((p) => p._id === message.sender)
        ) {
          this.messages.push(message);
        }
      }
    });
  }

  loadChats() {
    const userId = this.currentUser._id;
    this.apiService.getChats(userId).subscribe(
      (chats: Chat[]) => {
        this.chats = chats;
      },
      (error: any) => {
        console.error('Erro ao carregar chats:', error);
      }
    );
  }

  loadMessages(receiverId: string): void {
    const senderId = this.currentUser._id;

    this.apiService.getMessagesBetweenUsers(senderId, receiverId).subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      },
      (error) => {
        console.error('Erro ao carregar mensagens:', error);
      }
    );
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
    const receiverId =
      chat.participants.find((p) => p._id !== this.currentUser._id)?._id || '';
    this.loadMessages(receiverId);
    console.log('Chat selecionado:', this.selectedChat);
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedChat) {
      const receiverId =
        this.selectedChat.participants.find(
          (p) => p._id !== this.currentUser._id
        )?._id || '';

      if (receiverId) {
        this.apiService
          .sendMessage(this.currentUser._id, receiverId, this.newMessage)
          .subscribe({
            next: (response) => {
              console.log('Mensagem enviada com sucesso:', response);
              this.newMessage = '';
              const messageData: Message = {
                sender: this.currentUser._id,
                receiver: receiverId,
                content: this.newMessage,
                timestamp: new Date(),
              };
              this.socket.emit('sendMessage', messageData);
            },
            error: (error) => {
              console.error('Erro ao enviar mensagem:', error);
            },
          });
      } else {
        console.warn('Receiver não encontrado');
      }
    } else {
      console.warn('Mensagem vazia ou chat não selecionado');
    }
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
