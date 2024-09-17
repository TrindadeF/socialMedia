import { Component, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setupGenderSelectListener();
    this.setupFileInputListener();
    this.setupBirthdateListener();
    this.setupAnimationEndListener();
  }

  setupGenderSelectListener(): void {
    const genderSelect = document.getElementById(
      'gender-select'
    ) as HTMLSelectElement;
    const formContainer = document.getElementById('form-container');

    if (genderSelect && formContainer) {
      this.renderer.listen(genderSelect, 'change', (event) => {
        const value = (event.target as HTMLSelectElement).value;
        if (value === 'female') {
          formContainer.classList.add('feminine');
        } else {
          formContainer.classList.remove('feminine');
        }
      });
    }
  }

  setupFileInputListener(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const profilePicture = document.getElementById('profile-picture');

    if (fileInput && profilePicture) {
      this.renderer.listen(fileInput, 'change', () => {
        const file = fileInput.files ? fileInput.files[0] : null;

        if (file) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              profilePicture.style.backgroundImage = `url(${e.target.result})`;
              profilePicture.classList.add('has-photo');
            }
          };
          reader.readAsDataURL(file);
        } else {
          profilePicture.style.backgroundImage =
            'url("https://via.placeholder.com/120")';
          profilePicture.classList.remove('has-photo');
        }
      });
    }
  }

  setupBirthdateListener(): void {
    const birthdateInput = document.getElementById(
      'birthdate'
    ) as HTMLInputElement;
    const ageError = document.getElementById('age-error');

    if (birthdateInput && ageError) {
      this.renderer.listen(birthdateInput, 'change', () => {
        const birthdate = new Date(birthdateInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDiff = today.getMonth() - birthdate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthdate.getDate())
        ) {
          age--;
        }

        if (age < 18) {
          ageError.style.display = 'block';
        } else {
          ageError.style.display = 'none';
        }
      });
    }
  }

  setupAnimationEndListener(): void {
    const formContainer = document.getElementById('form-container');
    const sexyImage = document.getElementById('sexy-image');

    if (formContainer && sexyImage) {
      this.renderer.listen(
        formContainer,
        'animationend',
        (event: AnimationEvent) => {
          if (event.animationName === 'fadeInContainer') {
            sexyImage.classList.add('show');
          }
        }
      );
    }
  }
}
