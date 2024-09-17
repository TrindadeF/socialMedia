import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css'],
})
export class MatchComponent {
  likedUsers: number[] = [];
  currentIndex: number = 0;

  @ViewChildren('card') cards!: QueryList<ElementRef>;

  likeUser(userId: number): void {
    if (this.likedUsers.includes(userId)) {
      this.showMatchMessage();
    } else {
      this.likedUsers.push(userId);
      alert(`Você curtiu ${userId}! Espere que eles curtam de volta.`);
    }
  }

  private showMatchMessage(): void {
    const matchMessage = document.getElementById('matchMessage');
    if (matchMessage) {
      matchMessage.style.display = 'block';
    }
  }

  startChat(): void {
    alert('Iniciando conversa...');
    const matchMessage = document.getElementById('matchMessage');
    if (matchMessage) {
      matchMessage.style.display = 'none';
    }
  }

  showNextCard(): void {
    const cardArray = this.cards.toArray();
    if (cardArray.length === 0) return;

    cardArray[this.currentIndex].nativeElement.classList.add('hidden');
    this.currentIndex = (this.currentIndex + 1) % cardArray.length;
    cardArray[this.currentIndex].nativeElement.classList.remove('hidden');
  }
}
