import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  currentEditingPost: any = null;
  likedPosts: { [key: string]: boolean } = {};
  postComments: { [key: string]: string[] } = {};
  posts: Array<{ id: string; text: string; imageSrc?: string }> = [];

  updatePreviewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const previewImage = document.getElementById(
        'preview-image'
      ) as HTMLImageElement;
      if (e.target?.result) {
        previewImage.src = e.target.result as string;
        previewImage.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  createPost(text: string, imageSrc?: string): void {
    const postId = Date.now().toString();
    this.posts.push({ id: postId, text, imageSrc });
  }

  updatePost(postId: string, text: string, imageSrc?: string): void {
    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.text = text;
      post.imageSrc = imageSrc;
    }
  }

  deletePost(postId: string): void {
    this.posts = this.posts.filter((p) => p.id !== postId);
  }

  likePost(postId: string): void {
    if (!this.likedPosts[postId]) {
      this.likedPosts[postId] = true;
    }
  }

  addComment(postId: string, commentText: string): void {
    if (commentText.trim()) {
      if (!this.postComments[postId]) {
        this.postComments[postId] = [];
      }
      this.postComments[postId].push(commentText);
    }
  }

  undoLastComment(postId: string): void {
    if (this.postComments[postId] && this.postComments[postId].length > 0) {
      this.postComments[postId].pop();
    }
  }
}
