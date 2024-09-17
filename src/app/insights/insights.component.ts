import { Component, Renderer2, OnInit } from '@angular/core';

interface User {
  name: string;
  banned: boolean;
}

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css'],
})
export class InsightsComponent implements OnInit {
  users: User[] = [
    { name: 'John Doe', banned: false },
    { name: 'Jane Smith', banned: true },
  ];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initDashboard();
  }

  displayUsers(): void {
    const userTable = document.getElementById('userTable') as HTMLTableElement;

    if (userTable) {
      userTable.innerHTML = '';

      this.users.forEach((user, index) => {
        const row = this.renderer.createElement('tr');

        const nameCell = this.renderer.createElement('td');
        const nameText = this.renderer.createText(user.name);
        this.renderer.appendChild(nameCell, nameText);

        const statusCell = this.renderer.createElement('td');
        const statusText = this.renderer.createText(
          user.banned ? 'Banido' : 'Ativo'
        );
        this.renderer.appendChild(statusCell, statusText);

        const actionCell = this.renderer.createElement('td');
        const actionButton = this.renderer.createElement('button');
        const buttonText = this.renderer.createText(
          user.banned ? 'Desbanir' : 'Banir'
        );
        this.renderer.appendChild(actionButton, buttonText);
        this.renderer.listen(actionButton, 'click', () =>
          this.toggleBan(index)
        );
        this.renderer.appendChild(actionCell, actionButton);

        this.renderer.appendChild(row, nameCell);
        this.renderer.appendChild(row, statusCell);
        this.renderer.appendChild(row, actionCell);

        this.renderer.appendChild(userTable, row);
      });
    }
  }

  toggleBan(index: number): void {
    this.users[index].banned = !this.users[index].banned;
    this.displayUsers();
  }

  initDashboard(): void {
    this.displayUsers();
  }
}
