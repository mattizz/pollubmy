import { DashboardService } from './../../dashboard.service';
import { NgForm } from '@angular/forms';
import { Comment } from './../comment.model';
import { Post } from './../post.model';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-postdetail',
  templateUrl: './postdetail.component.html',
  styleUrls: ['./postdetail.component.css']
})
export class PostdetailComponent implements OnInit {

  addPointStyle = 'black';
  subtractPointStyle = 'black';
  points: number;
  pointAdded: boolean;
  pointSubtracted: boolean;
  postId: string;
  selectedPost: Post;
  comments: Comment[];
  filterComments = '';
  constructor(private route: ActivatedRoute, private postService: PostsService, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params)=>{
         this.postId = params['id'];
         this.postService.getAllPosts().subscribe(
          res=>{
            let filterPosts = res.filter(x=>{
              return x.forumPostId === this.postId;
            }); 
            this.selectedPost = filterPosts[0];
            this.points = this.selectedPost.points;
            console.log(this.selectedPost);
          }
         );
      }
    );  
  }
  addPoint(){
    if(this.pointSubtracted){
      this.points++;
      this.addPointStyle = 'blue';
      this.pointSubtracted = false;
      this.subtractPointStyle = 'black';
      console.log('Added'+this.pointAdded)
    }
    if(this.pointAdded){
      this.points--;
      this.addPointStyle = 'black';
      this.pointAdded = false;
      this.pointSubtracted = false;
      console.log('Added'+this.pointAdded)
    }
    else{
      this.points++;
      this.pointAdded = true;
      this.pointSubtracted = false;
      this.addPointStyle = 'blue';
      this.subtractPointStyle= 'black';
      console.log('Added'+this.pointAdded)

    }
  }
  subtractPoint(){
    if(this.pointAdded){
      this.points--;
      this.subtractPointStyle = 'red';
      this.pointAdded = false;
      this.addPointStyle = 'black';
    }
    if(this.pointSubtracted){
      this.points++;
      this.subtractPointStyle = 'black';
      this.pointSubtracted = false;
      this.pointAdded = false;
      console.log('Subtract'+this.pointSubtracted);
    }
    else{
      this.points--;
      this.pointSubtracted = true;
      this.pointAdded = false;
      this.subtractPointStyle = 'red';
      this.addPointStyle = 'black';
      console.log('Subtract'+this.pointSubtracted)
    }
  }
  addComment(comment: NgForm){
    // const text = comment.value.text;  
    // const date = new Date();
    // console.log(text);
    // let newComment = new Comment(5,text,0,date.toString(),this.selectedPost.postID);
    // this.postService.addComment(newComment);
    // this.selectedPost = this.postService.getPostById(this.postID);
    // this.comments = this.postService.getCommentsById(this.postID);
    // this.commentCount = this.postService.getCommentCountByID(this.postID);
  }


  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  selectedSort(event){
    const value = event.target.value;
    if(value === 'popular'){
      this.comments.sort((a,b)=> b.point - a.point);
    }
    else if(value === 'old'){
      this.comments.sort((a,b)=> (a.date > b.date) ? 1 : (b.date > a.date) ? -1 : 0);
    }
    else if(value === 'new'){
      this.comments.sort((a,b)=> (b.date > a.date) ? 1 : (a.date > b.date) ? -1 : 0);
    }
  }
}
