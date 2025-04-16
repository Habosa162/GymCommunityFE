import { Component } from '@angular/core';
import { CommentReadDTO, CommentCreateDTO } from '../../../../domain/models/Forum/comment.model';
import { PostReadDTO, PostCreateDTO } from '../../../../domain/models/Forum/post.model';
import { Sub } from '../../../../domain/models/Forum/sub.model';
import { VoteCreateDTO } from '../../../../domain/models/Forum/vote.model';
import { CommentService } from '../../../../services/Forum/comment.service';
import { PostService } from '../../../../services/Forum/post.service';
import { SubService } from '../../../../services/Forum/sub.service';
import { VoteService } from '../../../../services/Forum/vote.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forum',
  imports: [CommonModule,
    FormsModule],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent {
  posts: PostReadDTO[] = [];
  commentsMap: { [postId: number]: CommentReadDTO[] } = {};
  subs: Sub[] = [];

  newPost: PostCreateDTO = { title: '', content: '', userId: '', subId: 0 };
  selectedImage: File | null = null;

  currentUserId = '093d1b41-312f-4b85-bdb4-0346940eda2c'; // Replace with actual user ID

  constructor(
    private subService: SubService,
    private postService: PostService,
    private commentService: CommentService,
    private voteService: VoteService
  ) {}

  ngOnInit(): void {
    this.loadSubs();
    this.loadPosts();
  }

  loadSubs(): void {
    this.subService.getAll().subscribe(res => this.subs = res);
  }

  loadPosts(): void {
    this.postService.getAll().subscribe(posts => {
      this.posts = posts;
      this.posts.forEach(post => this.loadComments(post.id));
    });
  }

  loadComments(postId: number): void {
    this.commentService.getByPost(postId).subscribe(comments => {
      this.commentsMap[postId] = comments;
      console.log(comments);
    });
  }

  handleImageUpload(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  createPost(): void {
    this.newPost.userId = this.currentUserId;
    this.postService.create(this.newPost, this.selectedImage!).subscribe(post => {
      this.posts.unshift(post);
      this.newPost = { title: '', content: '', userId: this.currentUserId, subId: 0 };
      this.selectedImage = null;
    });
  }

  createComment(postId: number, content: string): void {
    const comment: CommentCreateDTO = {
      content,
      userId: this.currentUserId,
      postId
    };
    this.commentService.create(comment).subscribe(newComment => {
      this.commentsMap[postId].push(newComment);
    });
  }

  voteOnPost(postId: number, isUpvote: boolean): void {
    const vote: VoteCreateDTO = {
      userId: this.currentUserId,
      postId,
      isUpvote
    };
    this.voteService.create(vote).subscribe(() => {
      const post = this.posts.find(p => p.id === postId);
      if (post) post.voteCount += isUpvote ? 1 : -1;
    });
  }

  voteOnComment(commentId: number, postId: number, isUpvote: boolean): void {
    const vote: VoteCreateDTO = {
      userId: this.currentUserId,
      commentId,
      isUpvote
    };
    this.voteService.create(vote).subscribe(() => {
      const comment = this.commentsMap[postId].find(c => c.id === commentId);
      if (comment) comment.voteCount += isUpvote ? 1 : -1;
    });
  }

}
