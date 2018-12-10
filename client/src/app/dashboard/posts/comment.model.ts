export class Comment{
    constructor(
        public commentID: number,
        public text: string,
        public point: number,
        public date: string,
        public postID: number
    ){}
}