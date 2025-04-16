export interface CommentCreateDTO {
    content: string;
    userId: string;
    postId: number;
  }
  
  export interface CommentReadDTO {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    userId: string;
    postId: number;
    voteCount: number;
  }
  