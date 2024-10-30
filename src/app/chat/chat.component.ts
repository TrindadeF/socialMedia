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
  currentUser!: User;
  messages: Message[] = [];
  newMessage: string = '';
  socket: Socket;
  participants: { id: string; nickname: string }[] = [];
  selectedChat!: Chat;
  chats: Chat[] = [];

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
  }

  loadChats(): void {
    this.apiService.getChatsByUserId().subscribe(
      (chats: Chat[]) => {
        this.chats = chats;
        if (this.chats.length > 0) {
          this.selectChat(this.chats[0]);
        }
      },
      (error) => {
        console.error('Erro ao carregar chats:', error);
      }
    );
  }

  getParticipantNickname(senderId: string): string {
    const participant = this.participants.find((p) => p.id === senderId);
    return participant ? participant.nickname : 'Desconhecido';
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
    const receiverId = chat.participants.find(
      (p) => p._id !== this.currentUser._id
    )?._id;

    if (receiverId) {
      this.loadMessagesForChat(receiverId);
    } else {
      console.warn('Receiver não encontrado');
    }
  }

  loadMessagesForChat(receiverId: string): void {
    this.apiService.getChatByUsers(this.currentUser._id, receiverId).subscribe(
      (chat: Chat) => {
        if (chat) {
          this.messages = chat.messages;
          this.participants = chat.participants.map((user: User) => ({
            id: user._id,
            nickname: user.nickName,
          }));
        } else {
          this.messages = [];
        }
      },
      (error) => {
        console.error('Erro ao carregar mensagens:', error);
      }
    );
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return;
    }

    const messageData: Message = {
      sender: this.currentUser._id,
      receiver:
        this.participants.find((p) => p.id !== this.currentUser._id)?.id || '',
      content: this.newMessage,
      timestamp: new Date(),
    };

    this.apiService
      .sendMessage(this.currentUser._id, messageData.receiver, this.newMessage)
      .subscribe({
        next: (response: Message) => {
          this.newMessage = '';
          this.messages.push(response);
          this.socket.emit('sendMessage', response);
        },
        error: (error) => {
          console.error('Erro ao enviar mensagem:', error);
        },
      });
  }

  getParticipantNames(chat: Chat): string {
    return chat.participants.map((p) => p.nickName).join(', ');
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
