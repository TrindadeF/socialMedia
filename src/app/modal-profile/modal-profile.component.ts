import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { Post, User } from 'database';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.css'],
})
export class ModalProfileComponent {
  @Input() imageSrc!: string; 
  @Input() show: boolean = false; 
  @Output() closeEvent = new EventEmitter<void>();
  @Input() post!: Post;
  userId: string = '';
  selectedPostId: string = '';
  posts: Post[] = [];
  users: User[] = [];
  currentUser!: User;
  mutualLikes: { [key: string]: boolean } = {};
  @Input() postContent: string = '';
  @Input() postId: string = '';
  @Input() feedType: 'primaryFeed' | 'secondFeed' = 'secondFeed'
  

  comments: string[] = []; 
  newComment: string = ''; 
  @Output() publish = new EventEmitter<{ content: string | null; media: File[]; feedType: 'primaryFeed' | 'secondFeed' }>();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getPosts();
    this.userId = this.getUserIdFromAuthService();
  }
  getUserIdFromAuthService(): string {
    throw new Error('Method not implemented.');
  }
  
  getPosts() {
    throw new Error('Method not implemented.');
  }


  open() {
    this.show = true;
  }


  close() {
    this.show = false;
    this.closeEvent.emit();
  }
  


  likePost(postId: string)  {
    this.apiService.likePostInSecondFeed(postId).subscribe({
      next: () => console.log(`Post ${postId} curtido com sucesso!`),
      error: (error:any) => console.error(`Erro ao curtir o post:`, error),
    });
  }

  
  loadComments(): void {
    this.apiService.getPostWithComments(this.postId).subscribe(
      (data: { comments: any[] }) => {
        this.comments = data.comments;
      },
      (error: any) => {
        console.error('Erro ao carregar comentários:', error);
      }
    );
  }



  addComment(): void {
    if (this.newComment.trim()) {
      this.apiService
        .addCommentInSecondFeed(this.postId, this.newComment)
        .subscribe(
          () => {
            console.log('Comentário adicionado com sucesso!');
            this.loadComments();
            this.newComment = '';
          },
          (error: any) => {
            console.error('Erro ao adicionar comentário:', error);
          }
        );
    } else {
      console.error('O comentário não pode estar vazio.');
    }
  }


 

  























}
