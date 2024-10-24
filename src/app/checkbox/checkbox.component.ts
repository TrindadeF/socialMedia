import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent {
  @Input() label: string = 'Check me'; // Texto da label
  isChecked: boolean = false; // Estado da checkbox
  selectedFile: File | null = null; // Armazena o arquivo selecionado

  // Método para lidar com a mudança de arquivo
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  // Método para enviar o formulário
  onSubmit(): void {
    if (this.isChecked && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('termsAccepted', String(this.isChecked));

      // Aqui você pode fazer uma requisição HTTP para enviar o arquivo e o estado da checkbox
      console.log('Enviando formulário:', formData);
      // Exemplo: this.yourService.uploadFile(formData).subscribe(...)
    } else {
      console.log('Por favor, aceite os termos e selecione um arquivo.');
    }
  }
}
