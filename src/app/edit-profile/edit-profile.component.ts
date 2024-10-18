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
    this.apiService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response;
        this.originalUser = { ...response };
        if (response.profilePic) {
          this.previewImage = response.profilePic;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar perfil do usuário:', err);
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

    const userId = this.getLoggedInUserId();
    this.apiService.updateUserProfile(userId, formData).subscribe({
      next: () => {
        this.alertMessage = 'Perfil atualizado com sucesso!';
        this.alertType = 'success';
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

  getUpdatedFields(): Partial<User> {
    const updatedFields: Partial<User> = {};

    if (this.user.name !== this.originalUser?.name) {
      updatedFields.name = this.user.name;
    }
    if (this.user.age !== this.originalUser?.age) {
      updatedFields.age = this.user.age;
    }
    if (this.user.gender !== this.originalUser?.gender) {
      updatedFields.gender = this.user.gender;
    }
    if (this.user.email !== this.originalUser?.email) {
      updatedFields.email = this.user.email;
    }
    if (this.user.nickName !== this.originalUser?.nickName) {
      updatedFields.nickName = this.user.nickName;
    }
    if (this.user.description !== this.originalUser?.description) {
      updatedFields.description = this.user.description;
    }
    return updatedFields;
  }

  private getLoggedInUserId(): string {
    return localStorage.getItem('userId') || '';
  }
}
