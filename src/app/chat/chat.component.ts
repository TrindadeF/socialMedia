import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Message, User, Chat } from 'database';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

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
  participants: {
    isAnonymous: any;
    id: string;
    nickname: string;
  }[] = [];
  selectedChat: Chat | null = null;
  chats: Chat[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    this.socket = io('https://nakedlove.eu/api');
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
    if (participant) {
      const isCurrentUser = senderId === this.currentUser._id;
      const isAnonymous = isCurrentUser
        ? this.currentUser.isAnonymous
        : participant.isAnonymous;
      if (isAnonymous && !isCurrentUser) {
        return 'Anônimo';
      }
      return isAnonymous ? 'Anônimo' : participant.nickname;
    }
    return 'Desconhecido';
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
            profilePic: user.profilePic,
            isAnonymous: user.isAnonymous,
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

  deleteSelectedChat() {
    if (!this.selectedChat) return;

    const userId1 = this.currentUser._id;
    const userId2 = this.selectedChat.participants.find(
      (p: any) => p._id !== userId1
    )?._id;

    if (!userId2) {
      console.error('Usuário destinatário não encontrado.');
      return;
    }

    this.apiService.deleteChat(userId1, userId2).subscribe(
      () => {
        this.chats = this.chats.filter((chat) => chat !== this.selectedChat);
        this.selectedChat = null as any;
        this.messages = [];
        console.log('Chat deletado com sucesso');
      },
      (error) => {
        console.error('Erro ao deletar chat:', error);
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
          this.loadMessagesForChat;
        },
        error: (error) => {
          console.error('Erro ao enviar mensagem:', error);
        },
      });
  }
  getParticipantNames(chat: Chat): string {
    return chat.participants
      .map((p) => {
        const isCurrentUser = p._id === this.currentUser._id;

        if (isCurrentUser) {
          // Para o próprio usuário logado
          if (this.currentUser.isAnonymous) {
            return 'Você (Anônimo)';
          } else {
            return `Você (${this.currentUser.nickName})`;
          }
        } else {
          // Para o outro participante
          if (this.currentUser.isAnonymous) {
            // Se o usuário logado é anônimo, vê o outro normalmente
            return p.nickName;
          } else if (p.isAnonymous) {
            // Se o outro participante é anônimo
            return 'Anônimo';
          } else {
            // Se nenhum é anônimo, exibe o nome
            return p.nickName;
          }
        }
      })
      .join(', ');
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
