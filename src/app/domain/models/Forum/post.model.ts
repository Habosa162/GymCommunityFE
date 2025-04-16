export interface PostReadDTO {
    id: number;
    title: string;
    content: string;
    imgUrl: string;
    createdAt: string;
    userId: string;
    userName: string;
    subId: number;
    subName: string;
    commentCount: number;
    voteCount: number;
  }
  
  export interface PostCreateDTO {
    title: string;
    content: string;
    userId: string;
    subId: number;
    imgUrl?: string;
  }
  