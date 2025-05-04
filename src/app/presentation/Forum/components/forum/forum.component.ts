import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CommentCreateDTO,
  CommentReadDTO,
} from '../../../../domain/models/Forum/comment.model';
import {
  PostCreateDTO,
  PostReadDTO,
} from '../../../../domain/models/Forum/post.model';
import { Sub } from '../../../../domain/models/Forum/sub.model';
import {
  VoteCreateDTO,
  VoteReadDTO,
} from '../../../../domain/models/Forum/vote.model';
import { AuthService } from '../../../../services/auth.service';
import { CommentService } from '../../../../services/Forum/comment.service';
import { PostService } from '../../../../services/Forum/post.service';
import { SubService } from '../../../../services/Forum/sub.service';
import { VoteService } from '../../../../services/Forum/vote.service';
import { NotificationService } from '../../../../services/Notification/notification.service';
@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent implements OnInit {
  //check if its in profile or not
  isProfilePage: boolean = false;
  userOfPosts: string = '';
  loading: boolean = true;

  posts: PostReadDTO[] = [];
  commentsMap: { [postId: number]: CommentReadDTO[] } = {};
  subs: Sub[] = [];
  commentVisibility: Set<number> = new Set();

  newPost: PostCreateDTO = { title: '', content: '', userId: '', subId: 7 };
  selectedImage: File | null = null;

  editingPostId: number | null = null;
  editingCommentId: number | null = null;
  editPostData: PostCreateDTO = {
    title: '',
    content: '',
    userId: '',
    subId: 0,
  };
  editCommentContent: string = '';
  editSelectedImage: File | null = null;

  showPostForm: boolean = false;

  userVotesMap: {
    [postId: number]: { isUpvote: boolean; voteId: number } | null;
  } = {};
  userCommentVotesMap: {
    [commentId: number]: { isUpvote: boolean; voteId: number } | null;
  } = {};
  currentUserId: any = null;
  constructor(
    private subService: SubService,
    private postService: PostService,
    private commentService: CommentService,
    private voteService: VoteService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private elementRef: ElementRef,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = this.authService.getUserId();
    console.log(this.currentUserId);
    //check if its in profile or not
    const currentUrl = this.router.url;
    this.isProfilePage = currentUrl.includes('/profile/');

    if (this.isProfilePage) {
      this.route.parent?.paramMap.subscribe((params) => {
        const id = params.get('userId');
        if (id) {
          this.userOfPosts = id;
        } else {
          this.userOfPosts = this.currentUserId;
        }
      });
    }

    try {
      // await this.loadCurrentUser();
      if (this.isProfilePage) {
        this.loadPostsByUserId(this.userOfPosts);
      } else {
        this.loadPosts();
        this.loadSubs();
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // Redirect to login
    }
  }
  // loadCurrentUser(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.postService.getCurrentUserId().subscribe({
  //       next: (response) => {
  //         if (response.success) {
  //           this.currentUserId = response.userId;
  //           resolve();
  //         } else {
  //           reject('Not authenticated');
  //         }
  //       },
  //       error: (err) => reject(err)
  //     });
  //   });
  // }

  loadSubs(): void {
    this.subService.getAll().subscribe((res) => (this.subs = res));
  }

  loadPosts(): void {
    this.postService.getAll().subscribe((posts) => {
      console.log(posts);
      this.posts = posts;

      this.posts.forEach((post) => {
        this.loadComments(post.id);
        this.voteService.getByPost(post.id).subscribe((votes) => {
          const userVote = votes.find((v) => v.userId === this.currentUserId);
          if (userVote) {
            this.userVotesMap[post.id] = {
              isUpvote: userVote.isUpvote,
              voteId: userVote.id,
            };
          } else {
            this.userVotesMap[post.id] = null;
          }
          this.loading = false;
        });
      });
    });
  }

  loadPostsByUserId(userId: string): void {
    this.postService.getByUser(userId).subscribe((posts) => {
      this.posts = posts;
      this.posts.forEach((post) => {
        this.loadComments(post.id);
        this.voteService.getByPost(post.id).subscribe((votes) => {
          const userVote = votes.find((v) => v.userId === this.currentUserId);
          if (userVote) {
            this.userVotesMap[post.id] = {
              isUpvote: userVote.isUpvote,
              voteId: userVote.id,
            };
          } else {
            this.userVotesMap[post.id] = null;
          }
        });
      });
    });
  }

  loadComments(postId: number): void {
    this.commentService.getByPost(postId).subscribe((comments) => {
      this.commentsMap[postId] = comments;

      comments.forEach((comment) => {
        this.voteService.getByComment(comment.id).subscribe((votes) => {
          const userVote = votes.find((v) => v.userId === this.currentUserId);
          if (userVote) {
            this.userCommentVotesMap[comment.id] = {
              isUpvote: userVote.isUpvote,
              voteId: userVote.id,
            };
          } else {
            this.userCommentVotesMap[comment.id] = null;
          }
        });
      });
    });
  }

  handleImageUpload(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  createPost(): void {
    this.newPost.userId = this.currentUserId;
    this.postService
      .create(this.newPost, this.selectedImage!)
      .subscribe((post) => {
        this.posts.unshift(post);
        this.commentsMap[post.id] = [];
        this.loadComments(post.id);
        this.newPost = {
          title: '',
          content: '',
          userId: this.currentUserId,
          subId: 0,
        };
        this.selectedImage = null;
      });
    this.showPostForm = false;
  }

  createComment(postId: number, content: string): void {
    const comment: CommentCreateDTO = {
      content,
      userId: this.currentUserId,
      postId,
    };

    this.commentService.create(comment).subscribe((newComment) => {
      this.commentsMap[postId].push(newComment);
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.commentCount += 1;
      }
    });
  }
  editPost(post: PostReadDTO): void {
    this.editingPostId = post.id;
    this.editPostData = {
      title: post.title,
      content: post.content,
      subId: post.subId,
      userId: post.userId,
    };
  }

  updatePost(postId: number): void {
    this.postService
      .update(postId, this.editPostData, this.editSelectedImage!)
      .subscribe((updatedPost) => {
        const index = this.posts.findIndex((p) => p.id === postId);
        if (index !== -1) this.posts[index] = updatedPost;
        this.editingPostId = null;
        this.editSelectedImage = null;
      });
  }

  handleEditImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.editSelectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.editPostData.imgUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  deletePost(postId: number): void {
    this.postService.delete(postId).subscribe(() => {
      this.posts = this.posts.filter((p) => p.id !== postId);
      delete this.commentsMap[postId];
    });
  }

  editComment(comment: CommentReadDTO): void {
    this.editingCommentId = comment.id;
    this.editCommentContent = comment.content;
  }

  updateComment(commentId: number, postId: number): void {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    const updated = {
      content: this.editCommentContent,
      userId: this.currentUserId,
      postId: post.id,
    };

    this.commentService
      .update(commentId, updated)
      .subscribe((updatedComment) => {
        const commentIndex = this.commentsMap[postId].findIndex(
          (c) => c.id === commentId
        );
        if (commentIndex !== -1) {
          this.commentsMap[postId][commentIndex] = updatedComment;
        }
        this.editingCommentId = null;
      });
  }

  deleteComment(commentId: number, postId: number): void {
    this.commentService.delete(commentId).subscribe(() => {
      this.commentsMap[postId] = this.commentsMap[postId].filter(
        (c) => c.id !== commentId
      );
      const post = this.posts.find((p) => p.id === postId);
      if (post) post.commentCount -= 1;
    });
  }

  voteOnPost(postId: number, isUpvote: boolean): void {
    const userVote = this.userVotesMap[postId];
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    if (userVote && userVote.isUpvote === isUpvote) {
      // If same vote clicked again delete it
      this.voteService.delete(userVote.voteId).subscribe(() => {
        if (isUpvote) post.upvoteCount--;
        else post.downvoteCount--;
        this.userVotesMap[postId] = null;
      });
    } else {
      this.notificationService
        .sendNotification(post.userId, 'You have upvoted a post', 'asd')
        .subscribe();
      // Remove existing vote if different direction
      if (userVote) {
        this.voteService.delete(userVote.voteId).subscribe(() => {
          if (userVote.isUpvote) post.upvoteCount--;
          else post.downvoteCount--;
          this.createVote(postId, isUpvote, post);
        });
      } else {
        this.createVote(postId, isUpvote, post);
      }
    }
  }

  createVote(postId: number, isUpvote: boolean, post: PostReadDTO): void {
    const vote: VoteCreateDTO = {
      userId: this.currentUserId,
      postId,
      isUpvote,
    };
    this.voteService.create(vote).subscribe((newVote) => {
      if (isUpvote) post.upvoteCount++;
      else post.downvoteCount++;
      this.userVotesMap[postId] = {
        isUpvote: isUpvote,
        voteId: newVote.id,
      };
    });
  }

  voteOnComment(commentId: number, postId: number, isUpvote: boolean): void {
    const userVote = this.userCommentVotesMap[commentId];
    const comment = this.commentsMap[postId]?.find((c) => c.id === commentId);
    if (!comment) return;

    if (userVote && userVote.isUpvote === isUpvote) {
      //If same vote clicked again delete it
      this.voteService.delete(userVote.voteId).subscribe(() => {
        if (isUpvote) comment.upvoteCount--;
        else comment.downvoteCount--;
        this.userCommentVotesMap[commentId] = null;
      });
    } else {
      // Remove opposite vote if exists
      if (userVote) {
        this.voteService.delete(userVote.voteId).subscribe(() => {
          if (userVote.isUpvote) comment.upvoteCount--;
          else comment.downvoteCount--;

          this.createCommentVote(commentId, postId, isUpvote, comment);
        });
      } else {
        this.createCommentVote(commentId, postId, isUpvote, comment);
      }
    }
  }

  createCommentVote(
    commentId: number,
    postId: number,
    isUpvote: boolean,
    comment: CommentReadDTO
  ): void {
    const vote: VoteCreateDTO = {
      userId: this.currentUserId,
      commentId,
      isUpvote,
    };
    this.voteService.create(vote).subscribe((newVote) => {
      if (isUpvote) comment.upvoteCount++;
      else comment.downvoteCount++;

      this.userCommentVotesMap[commentId] = {
        isUpvote: isUpvote,
        voteId: newVote.id,
      };
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
    this.postService.getBySub(subIdNum).subscribe((posts) => {
      this.posts = posts;
      this.commentsMap = {};
      this.posts.forEach((post) => this.loadComments(post.id));
    });
  }

  filterTopRated(): void {
    this.postService.getTopRated().subscribe((posts) => {
      this.posts = posts;
      this.commentsMap = {};
      this.posts.forEach((post) => this.loadComments(post.id));
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
  hoveredVotes: VoteReadDTO[] = [];

  showVoters(targetId: number, isUpvote: boolean, isPost: boolean = true) {
    if (isPost) {
      this.voteService.getByPost(targetId).subscribe((votes) => {
        this.hoveredPostId = targetId;
        this.hoveredCommentId = null;
        this.hoveredVotes = votes.filter((v) => v.isUpvote === isUpvote);
      });
    } else {
      this.voteService.getByComment(targetId).subscribe((votes) => {
        this.hoveredCommentId = targetId;
        this.hoveredPostId = null;
        this.hoveredVotes = votes.filter((v) => v.isUpvote === isUpvote);
      });
    }
  }

  hideVoters() {
    this.hoveredPostId = null;
    this.hoveredCommentId = null;
    this.hoveredVotes = [];
  }

  // Close when clicking outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showPostForm = false;
    }
  }
}
