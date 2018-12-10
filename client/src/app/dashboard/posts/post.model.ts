import { Comment } from './comment.model';

export class Post{
    constructor(
        public forumPostId: string,
        public comments: Comment[],
        public category: string,
        public addPostTime: string,
        public points: number,
        public postText: string,
        public userLogin: string
    ){}
}