import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from 'database';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  user: User = {
    name: '',
    age: 0,
    profilePic: 'default',
    gender: 'NB',
    email: '',
    password: '',
    nickName: '',
    description: '',
    _id: '',
    isAnonymous: false,
    media: [],
    blockedUsers: [],
    unblockedUsers: [],
    followerCount: 0,
    primaryPosts: [],
    secondPosts: [],
    resetPasswordToken: '',
    resetPasswordExpires:0,
   

    
  };
 

  originalUser: User | null = null;  
  alertMessage: string = '';
  alertType: string = '';
  previewImage: string | ArrayBuffer | null = null;

  fileToUpload: File | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    const userId = this.getLoggedInUserId();
    this.apiService.getUserById(userId).subscribe({
      next: (response) => {
        this.originalUser = { ...response }; // Sempre armazena os dados originais do perfil
  
        if (response.isAnonymous) {
          this.alertMessage = 'Este perfil é anônimo e não pode ser visualizado.';
          this.alertType = 'warning';
          this.user = { ...response }; // Mantém os dados do usuário
          return;
        }
  
        this.user = response; // Carrega os dados do usuário se não for anônimo
        if (response.profilePic) {
          this.previewImage = response.profilePic; // Mostra a imagem de perfil, se houver
        }
      },
      error: (err) => {
        console.error('Erro ao buscar perfil do usuário:', err);
        this.alertMessage = 'Erro ao carregar o perfil.';
        this.alertType = 'error';
      },
    });
  }
  

  
  onSubmit() {
    const formData = new FormData();

    if (this.fileToUpload) {
      formData.append('image', this.fileToUpload, this.fileToUpload.name);
    }
    formData.append('name', this.user.name);
    formData.append('age', this.user.age.toString());
    formData.append('gender', this.user.gender);
    formData.append('email', this.user.email);
    formData.append('nickName', this.user.nickName);
    formData.append('description', this.user.description);
    formData.append('isAnonymous', this.user.isAnonymous?.toString() ?? 'false');

    const userId = this.getLoggedInUserId();
    this.apiService.updateUserProfile(userId, formData).subscribe({
      next: () => {
        this.alertMessage = 'Perfil atualizado com sucesso!';
        this.alertType = 'success';
        window.location.reload();
      },
      error: (error) => {
        console.error('Erro ao atualizar o perfil:', error);
        this.alertMessage = 'Erro ao atualizar o perfil.';
        this.alertType = 'error';
      },
    });
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.fileToUpload = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  private getLoggedInUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  confirmDelete() {
    if (confirm('Tem certeza de que deseja deletar seu perfil? Esta ação não pode ser desfeita.')) {
      const userId = this.getLoggedInUserId();
      this.deleteProfile(userId);
    }
  }

  deleteProfile(userId: string) {
    this.apiService.deleteprofile(userId).subscribe({
      next: () => {
        this.alertMessage = 'Perfil deletado com sucesso!';
        this.alertType = 'success';
        window.location.reload();
      },
      error: (error) => {
        console.error('Erro ao deletar perfil:', error);
        this.alertMessage = 'Erro ao deletar perfil.';
        this.alertType = 'error';
      },
    });
  }

  toggleAnonymous(isAnonymous: boolean | undefined): void {
    this.user.isAnonymous = isAnonymous ?? false;
  
    if (this.user.isAnonymous) {
      // Configura o perfil para o estado anônimo
      this.user.nickName = 'Anônimo';
      this.user.name = 'Anônimo';
      this.previewImage = 'default-anonymous.png'; // Usa uma imagem padrão de anônimo, se necessário
    } else if (this.originalUser) {
      // Restaura os dados do usuário original ao sair do modo anônimo
      this.user.name = this.originalUser.name;
      this.user.description = this.originalUser.description;
      this.user.nickName = this.originalUser.nickName;
      this.user.age = this.originalUser.age;
      this.user.gender = this.originalUser.gender;
      this.user.email = this.originalUser.email;
      this.previewImage = this.originalUser.profilePic; // Restaura a imagem original
    }
  }
  
}
  

