export interface VoteCreateDTO {
    userId: string;
    postId?: number;
    commentId?: number;
    isUpvote: boolean;
}

export interface VoteReadDTO {
    id: number;
    userId: string;
    postId?: number;
    commentId?: number;
    isUpvote: boolean;
}
