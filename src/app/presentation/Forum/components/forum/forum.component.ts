import { Component } from '@angular/core';
import { CommentReadDTO, CommentCreateDTO } from '../../../../domain/models/Forum/comment.model';
import { PostReadDTO, PostCreateDTO } from '../../../../domain/models/Forum/post.model';
import { Sub } from '../../../../domain/models/Forum/sub.model';
import { VoteCreateDTO, VoteReadDTO } from '../../../../domain/models/Forum/vote.model';
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
  commentVisibility: Set<number> = new Set();

  newPost: PostCreateDTO = { title: '', content: '', userId: '', subId: 7 };
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
      this.commentsMap[post.id] = []; // Initialize comments for the new post
      this.loadComments(post.id); // Load comments for the new post 
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
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.commentCount += 1;
      }
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
      if (post && vote.isUpvote) {
        post.upvoteCount += 1;
      }
      if (post && !vote.isUpvote) {
        post.downvoteCount += 1;
      }
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
      if (comment && vote.isUpvote) {
        comment.upvoteCount += 1;
      }
      if (comment && !vote.isUpvote) {
        comment.downvoteCount += 1;
      }
    });
  }
  
  filterBySub(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const subId = selectElement.value;
    if (!subId) {
      this.loadPosts();
      return;
    }
  
    const subIdNum = Number(subId);
    this.postService.getBySub(subIdNum).subscribe(posts => {
      this.posts = posts;
      this.commentsMap = {};
      this.posts.forEach(post => this.loadComments(post.id));
    });
  }
  
  filterTopRated(): void {
    this.postService.getTopRated().subscribe(posts => {
      this.posts = posts;
      this.commentsMap = {};
      this.posts.forEach(post => this.loadComments(post.id));
    });
  }

  toggleComments(postId: number): void {
    if (this.commentVisibility.has(postId)) {
      this.commentVisibility.delete(postId);
    } else {
      this.commentVisibility.add(postId);
    }
  }
  hoveredPostId: number | null = null;
hoveredCommentId: number | null = null;
hoveredVotes: VoteReadDTO[] = []; // adjust type if needed

showVoters(targetId: number, isUpvote: boolean, isPost: boolean = true) {
  if (isPost) {
    this.voteService.getByPost(targetId).subscribe(votes => {
      this.hoveredPostId = targetId;
      this.hoveredCommentId = null;
      this.hoveredVotes = votes.filter(v => v.isUpvote === isUpvote);
    });
  } else {
    this.voteService.getByComment(targetId).subscribe(votes => {
      this.hoveredCommentId = targetId;
      this.hoveredPostId = null;
      this.hoveredVotes = votes.filter(v => v.isUpvote === isUpvote);
    });
  }
}

hideVoters() {
  this.hoveredPostId = null;
  this.hoveredCommentId = null;
  this.hoveredVotes = [];
}


  

  

}
