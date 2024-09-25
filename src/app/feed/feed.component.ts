import { Component } from '@angular/core';

interface Post {
  username: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
}

@Component({
  selector: 'app-love',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent {
  posts: Post[] = [
    {
      username: 'c_gato_preto',
      avatar: 'assets/avatar1.jpg',
      time: '2h',
      content:
        'Gente, porque as pessoas têm tanto preconceito com vídeo game? É um hobby como qualquer outro.',
      likes: 119,
      comments: 56,
    },
    {
      username: 'harrietintech',
      avatar: 'assets/avatar2.jpg',
      time: '8h',
      content: "I need more developer friends! Let's connect ⚡",
      likes: 128,
      comments: 55,
    },
    {
      username: 'sophiearuiva',
      avatar: 'assets/avatar3.jpg',
      time: '1h',
      content:
        'Kakakakaka vi um post de um guri colocando uma perda de 300 reais da bolsa...',
      likes: 5,
      comments: 12,
    },
  ];
}
