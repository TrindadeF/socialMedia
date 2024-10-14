import { Component } from '@angular/core';

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css']
})
export class RulesComponent {
    currentIndex = 0;
    items = [0, 1, 2, 3, 4]; // Número de itens

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    next() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
        }
    }

    isActive(index: number) {
        return this.currentIndex === index;
    }
}
