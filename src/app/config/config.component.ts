import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Post, User } from 'database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit {
  users: User[] = [];
  user: any = {};
  posts: Post[] = [];
  postContent: string = '';
  selectedMedia: File[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  canPublish: boolean = false;
  userId: string = '';
  showModal: boolean = false;
  modalContent: string = '';
  title: string = 'Aqui é o título do modal feed';
  currentFeedType: 'primaryFeed' | 'secondFeed' = 'primaryFeed';
  showCommentModal = false;
  selectedPostId: string = '';
  primaryPosts?: Post[] = [];
  showReportModal: boolean = false;
  reportReason: string = '';
  selectedUserId: string = '';
  unblockedUsers: string[] = [];
  blockedUsersData: any[] = []; // Array para armazenar os dados completos dos usuários bloqueados

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadBlockedUsers();
  }

  loadBlockedUsers() {
    // Obtém os IDs dos usuários bloqueados do localStorage
    const loggedUserId = this.getLoggedUserId();
    const storedBlockedUsers = localStorage.getItem(
      `blockedUsers_${loggedUserId}`
    );

    if (storedBlockedUsers) {
      this.blockedUsers = JSON.parse(storedBlockedUsers);
      this.blockedUsers.forEach((userId) => {
        this.getUserById(userId); // Faz a requisição para obter os dados de cada usuário bloqueado
      });
    }
  }

  getUserById(userId: string): void {
    this.apiService.getUserById(userId).subscribe({
      next: (user) => {
        this.blockedUsersData.push(user); // Armazena os dados completos do usuário bloqueado
        console.log('Dados do usuário:', user); // Exibe os dados no console (opcional)
      },
      error: (error) => {
        console.error('Erro ao carregar os dados do usuário:', error);
        this.errorMessage = 'Erro ao carregar os dados do usuário';
      },
    });
  }

  unblockUser(userId: string): void {
    if (!this.blockedUsers.includes(userId)) {
      this.snackBar.open('Usuário não está bloqueado', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    // Remove o usuário da lista de bloqueados
    this.blockedUsers = this.blockedUsers.filter((id) => id !== userId);

    // Adiciona à lista de desbloqueados
    const loggedUserId = this.getLoggedUserId();
    const unblockedUsers = JSON.parse(
      localStorage.getItem(`unblockedUsers_${loggedUserId}`) || '[]'
    );
    unblockedUsers.push(userId);

    // Atualiza o localStorage
    localStorage.setItem(
      `blockedUsers_${loggedUserId}`,
      JSON.stringify(this.blockedUsers)
    );
    localStorage.setItem(
      `unblockedUsers_${loggedUserId}`,
      JSON.stringify(unblockedUsers)
    );

    this.snackBar.open('Usuário desbloqueado com sucesso', 'Fechar', {
      duration: 3000,
    });

    // Atualiza a lista de usuários bloqueados
    this.blockedUsersData = this.blockedUsersData.filter(
      (user) => user._id !== userId
    );
  }

  getLoggedUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  getPosts() {
    this.apiService.getPostsFromFirstFeed().subscribe({
      next: (posts: Post[]) => {
        if (posts) {
          const loggedUserId = this.getLoggedUserId();
          this.blockedUsers = this.blockedUsers || [];

          // Filtra posts, excluindo apenas os de usuários bloqueados, mas mantendo os do usuário logado
          this.posts = posts
            .filter((post) => {
              const postOwnerId =
                typeof post.owner === 'object' ? post.owner._id : post.owner;
              return (
                postOwnerId === loggedUserId ||
                !this.blockedUsers.includes(post.owner._id)
              );
            })
            .map((post) => ({
              ...post,
              likes: post.likes || [], // Garante que a propriedade likes exista
            }))
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ); // Ordenação
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os posts';
        console.error(error);
      },
    });
  }

  openHelpDocument(): void {
    // Caminho para o arquivo
    const fileUrl = 'assets/docs/Central de Ajuda.pdf';

    // Criar um link temporário para disparar o download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Central_de_Ajuda.pdf'; // Nome do arquivo a ser baixado
    link.click(); // Simula o clique para iniciar o download
  }

  openPoliticUse(): void {
    // Caminho para o arquivo
    const fileUrl = 'assets/docs/Politica de Privacidade.pdf';

    // Criar um link temporário para disparar o download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Politica_de_Privacidade.pdf'; // Nome do arquivo a ser baixado
    link.click(); // Simula o clique para iniciar o download
  }

  openTermsUse(): void {
    // Caminho para o arquivo
    const fileUrl = 'assets/docs/TERMOS DE USO.pdf';

    // Criar um link temporário para disparar o download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'TERMOS_DE_USO.pdf'; // Nome do arquivo a ser baixado
    link.click(); // Simula o clique para iniciar o download
  }

  preferencesVisible: boolean = false;

  // Controle para as notificações (ativo/desativado)
  notificationsEnabled: boolean = true;

  // Lista de usuários bloqueados (exemplo)
  blockedUsers: string[] = ['Usuário 1', 'Usuário 2', 'Usuário 3'];

  // Alterna a visibilidade das preferências
  togglePreferences(): void {
    this.preferencesVisible = !this.preferencesVisible;
  }
  goToNotifications(): void {
    this.router.navigate(['/notifications']); // Substitua '/notifications' pela rota correta do seu componente
  }
}
