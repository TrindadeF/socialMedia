import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from 'database';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  posts: Post[] = [];
  profileForm: FormGroup;
  profilePicUrl: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  showModal: boolean = false;
  title: string = 'NakedFeed';
  modalContent: string = '';
  postContent: string = '';
  currentFeedType: 'primaryFeed' | 'secondFeed' = 'secondFeed';
  isFollowing: boolean = false;
  isModalOpen: boolean = false;
  selectedImageUrl: string = '';
  selectedImage: string = '';
  showImageViewer: boolean = false;
  selectedPost: string = '';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.checkUserLogin();
    this.fetchUserProfile();
    this.fetchUserPosts();
  }

  private checkUserLogin() {
    const userId = this.getUserId();
    if (!userId) {
      this.router.navigate(['/']);
    }
  }

  public getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  fetchUserProfile() {
    const userId = this.route.snapshot.paramMap.get('id');
    const loggedUserId = this.getUserId();

    if (userId) {
      this.loading = true;
      this.apiService.getUserById(userId).subscribe({
        next: (response) => {
          this.user = response;
          this.profilePicUrl = this.user.profilePic || '';
          this.profileForm.patchValue({
            name: this.user.name,
            description: this.user.description,
          });
          this.user.followerCount = this.user.followers.length;
          this.apiService.isFollowing(loggedUserId, userId).subscribe({
            next: (isFollowing) => {
              this.isFollowing = isFollowing;
            },
            error: (err) => {
              console.error('Erro ao verificar o estado de seguir:', err);
            },
          });
        },
        error: (err) => {
          console.error('Erro ao buscar perfil do usuário:', err);
          this.errorMessage = 'Erro ao carregar o perfil do usuário';
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      console.error('ID do usuário não encontrado na URL');
      this.errorMessage = 'ID do usuário não encontrado';
    }
  }

  toggleFollow() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.apiService.toggleFollow(userId).subscribe({
        next: (response) => {
          this.isFollowing = !this.isFollowing;
          this.alertMessage = response.message;
          this.alertType = 'success';
        },
        error: (err) => {
          console.error('Erro ao seguir/desseguir usuário:', err);
          this.alertMessage = 'Erro ao seguir/desseguir o usuário.';
          this.alertType = 'error';
        },
      });
    }
  }

  fetchUserPosts() {
    const userId = this.route.snapshot.paramMap.get('id');
    const loggedUserId = this.getUserId();

    this.loading = true;

    if (userId && userId !== loggedUserId) {
      this.apiService.getPostsByUserId(userId).subscribe({
        next: (response: Post[]) => {
          this.posts = response.filter((post) => post.media.length > 0);
        },
        error: (err) => {
          console.error('Erro ao buscar posts do usuário selecionado:', err);
          this.errorMessage =
            'Erro ao carregar os posts do usuário selecionado';
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.apiService.getPostsByLoggedUser().subscribe({
        next: (response: Post[]) => {
          this.posts = response.filter((post) => post.media.length > 0);
        },
        error: (err) => {
          console.error('Erro ao buscar posts do usuário logado:', err);
          this.errorMessage = 'Erro ao carregar os posts do usuário logado';
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  onPublish(event: {
    content: string | null;
    media: File[];
    feedType: 'primaryFeed' | 'secondFeed';
  }) {
    this.publishPost(event.content, event.media, event.feedType);
  }

  publishPost(
    content: string | null,
    media: File[],
    feedType: 'primaryFeed' | 'secondFeed'
  ) {
    const formData = new FormData();

    if (content) {
      formData.append('content', content);
    }

    
    const resizedImagesPromises = media.map((file) =>
      this.resizeImage(file, 800, 800) 
    );

    Promise.all(resizedImagesPromises)
      .then((resizedImages) => {
        resizedImages.forEach((resizedFile) => {
          formData.append('image', resizedFile);
        });

        const url =
          feedType === 'primaryFeed'
            ? 'https://nakedlove.eu/api/primaryFeed/'
            : 'https://nakedlove.eu/api/secondFeed/';

        this.http.post<Post>(url, formData).subscribe({
          next: (response: Post) => {
            this.posts.unshift(response);
            this.snackBar.open('Post publicado com sucesso!', 'Fechar', {
              duration: 3000,
            });
            this.alertType = 'success';
            this.closeModal();
            this.fetchUserProfile();
          },
          error: (err) => {
            console.error('Erro ao publicar o post:', err);
            this.alertMessage = 'Erro ao publicar o post.';
            this.alertType = 'error';
          },
          complete: () => (this.loading = false),
        });
      })
      .catch((err) => {
        console.error('Erro ao redimensionar as imagens:', err);
        this.alertMessage = 'Erro ao redimensionar as imagens.';
        this.alertType = 'error';
      });
  }

  deletePost(postId: string): void {
    this.apiService.deletePostFromSecondFeed(postId).subscribe({
      next: (response) => {
        this.snackBar.open('Post deletado com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.getPosts();
      },
      error: (error) => {
        console.error('Erro ao deletar post:', error);
        this.snackBar.open('Erro ao deletar post', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
  getPosts() {
    this.apiService.getPostsFromSecondFeed().subscribe({
      next: (posts: Post[]) => {
        if (posts) {
          this.posts = posts
            .map((post) => {
              return {
                ...post,
                likes: post.likes || [],
              };
            })
            .sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os posts';
        console.error(error);
      },
    });
  }

  isOwner(postOwnerId: any): boolean {
    if (
      typeof postOwnerId === 'object' &&
      postOwnerId !== null &&
      '_id' in postOwnerId
    ) {
      postOwnerId = postOwnerId._id;
    }

    if (typeof postOwnerId !== 'string') {
      console.error('postOwnerId deve ser uma string', postOwnerId);
      return false;
    }
    const currentUserId = this.getUserIdFromAuthService();
    const isOwner = currentUserId === String(postOwnerId);

    return isOwner;
  }

  getUserIdFromAuthService(): string {
    return localStorage.getItem('userId') || '';
  }




  resetForm() {
    this.alertMessage = '';
    this.postContent = '';
  }

  isImage(url: string): boolean {
    return (
      url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.webp') || url.endsWith('.bmp') || url.endsWith('.ico') || url.endsWith('.svg') || url.endsWith('.heif') || url.endsWith('.heic') || url.endsWith('.tiff')
    );
  }

  openImageViewer(postId: string) {
    this.selectedPost = postId;
    this.showImageViewer = true;
  }

  closeImageViewer() {
    this.showImageViewer = false;
  }

  likePost(postId: string) {
    this.apiService.likePostInSecondFeed(postId).subscribe(
      (updatedPost: Post) => {
        if (updatedPost) {
          this.posts = this.posts.map((post) => {
            if (post._id === updatedPost._id) {
              return {
                ...post,
                likes: updatedPost.likes,
              };
            }
            return post;
          });
        }
      },
      (error) => {
        console.error('Erro ao curtir o post:', error);
      }
    );
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const ctx = canvas.getContext('2d');
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            });
            resolve(resizedFile);
          } else {
            reject('Erro ao redimensionar a imagem');
          }
        }, file.type);
      };

      img.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
