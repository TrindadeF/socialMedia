// chat.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  messages: Message[] = [];
  senderId: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.apiService.getUserById(userId).subscribe((user: User) => {
        this.currentUser = user;
        this.senderId = user._id;
        this.loadChats();
      });
    }

    this.socket.on('receiveMessage', (message: Message) => {
      this.handleIncomingMessage(message);
    });
  }

  loadChats(): void {
    this.apiService
      .getChats(this.senderId, this.senderId)
      .subscribe((chats: Chat[]) => {
        this.chats = chats;
      });
  }

  selectChat(chat: Chat): void {
    console.log('Chat selecionado:', chat);
    this.selectedChat = chat;

    const receiverId =
      chat.participants.find((p) => p._id !== this.currentUser._id)?._id || '';
    if (receiverId) {
      console.log('Receiver ID encontrado:', receiverId);
      this.loadMessagesForChat(receiverId);
    } else {
      console.warn('Receiver não encontrado');
    }
  }

  loadMessagesForChat(receiverId: string): void {
    this.apiService
      .getChats(this.senderId, receiverId)
      .subscribe((chats: Chat[]) => {
        if (chats.length > 0) {
          this.messages = chats[0].messages;
        }
      });
  }

  sendMessage(): void {
    if (!this.selectedChat) {
      console.warn('Chat não selecionado');
      return;
    }

    if (this.newMessage.trim() === '') {
      console.warn('Mensagem vazia');
      return;
    }

    const receiverId =
      this.selectedChat.participants.find((p) => p._id !== this.currentUser._id)
        ?._id || '';

    if (receiverId) {
      const messageData: Message = {
        sender: this.currentUser._id,
        receiver: receiverId,
        content: this.newMessage,
        timestamp: new Date(),
      };

      this.apiService
        .sendMessage(this.currentUser._id, receiverId, this.newMessage)
        .subscribe({
          next: (response: Message) => {
            console.log('Mensagem enviada com sucesso:', response);
            this.newMessage = '';
            this.messages.push(response);
            this.socket.emit('sendMessage', response);
          },
          error: (error) => {
            console.error('Erro ao enviar mensagem:', error);
          },
        });
    } else {
      console.warn('Receiver não encontrado');
    }
  }

  private handleIncomingMessage(message: Message) {
    const chat = this.chats.find((c) =>
      c.participants.some(
        (p) => p._id === message.sender || p._id === message.receiver
      )
    );

    if (chat) {
      chat.messages.push(message);
      chat.lastMessage = message;

      if (
        this.selectedChat?.participants.some(
          (p) => p._id === message.sender || p._id === message.receiver
        )
      ) {
        this.messages.push(message);
      }
    } else {
      this.loadChats();
    }
  }
  getParticipantName(chat: Chat): string {
    const participant = chat.participants.find(
      (p) => p._id !== this.currentUser._id
    );
    return participant ? participant.name : 'Desconhecido';
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
