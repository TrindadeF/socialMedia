import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent {
  @Input() label: string = 'Check me'; 
  isChecked: boolean = false; 
  selectedFile: File | null = null; 

 
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  
  onSubmit(): void {
    if (this.isChecked && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('termsAccepted', String(this.isChecked));

      
      console.log('Enviando formulário:', formData);
     
    } else {
      console.log('Por favor, aceite os termos e selecione um arquivo.');
    }
  }
}
