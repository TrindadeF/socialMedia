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
  };
  alertMessage: string = '';
  alertType: string = '';
  previewImage: string | ArrayBuffer | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userId = 'id_do_usuario';
    this.apiService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        if (user.profilePic) {
          this.previewImage = user.profilePic;
        }
      },
      error: (error) => {
        this.alertMessage = 'Erro ao carregar os dados do usuário.';
        this.alertType = 'error';
      },
    });
  }

  onSubmit() {
    const updateUser: User = {
      ...this.user,
      profilePic: this.previewImage as string,
    };

    this.apiService.updateUserProfile(updateUser).subscribe({
      next: () => {
        this.alertMessage = 'Perfil atualizado com sucesso!';
        this.alertType = 'success';
      },
      error: (error) => {
        this.alertMessage = 'Erro ao atualizar o perfil.';
        this.alertType = 'error';
      },
    });
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }
}
