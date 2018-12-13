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

  selectedCommentId: string;
  editable = false;
  userLogin: string;

  addPointStyle = 'black';
  subtractPointStyle = 'black';
  commentAddPointStyle = 'black';
  commentSubtractPointStyle = 'black';
  
  points: number;
  commentPoints: number;

  pointAdded: boolean;
  pointSubtracted: boolean;
  commentPointAdded: boolean;
  commentPointSubtracted: boolean;
  
  postId: string;
  selectedPost: Post;
  comments: Comment[];
  commentsLength: number;
  constructor(private route: ActivatedRoute, private postService: PostsService, private dashboardService: DashboardService) { }

  ngOnInit(){
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
            this.comments = this.selectedPost.commentsDTO;
            this.commentsLength = this.selectedPost.commentsDTO.length;
            console.log(this.selectedPost);
          }
         );
      }
    );  
    this.dashboardService.getUser().subscribe(
      res=>{
        this.userLogin = res.login;
      }
    );
  }
  addPostPoint(){
    this.addPoint(this.points);
  }
  subtractPostPoint(){
    this.subtractPoint(this.points);
  }
  addCommentPoint(commentId: string){
    console.log(commentId);
    let commentPoints = this.comments.find(x=>x.commentId === commentId).points;
    if(this.commentPointSubtracted){
      if(commentPoints === this.points){
        this.postService.rateComment(commentId,'plus').subscribe(
          res=>{
            commentPoints++;
            this.addPointStyle = 'blue';
            // this.commentPointSubtracted = false;
            this.subtractPointStyle = 'black';
            console.log('Added'+this.pointAdded);
            this.ngOnInit();
          },err=>{
            console.log(err);
          }
        );
      }
      
    }
    if(this.commentPointAdded){
      this.postService.rateComment(commentId,'minus').subscribe(
        res=>{
          commentPoints--;
          this.addPointStyle = 'black';
          // this.commentPointAdded = false;
          // this.commentPointSubtracted = false;
          console.log('Added'+this.commentPointAdded);
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );     
    }
    else{
      this.postService.rateComment(commentId,'plus').subscribe(
        res=>{
          commentPoints++;
          // this.commentPointAdded = true;
          // this.commentPointSubtracted = false;
          this.addPointStyle = 'blue';
          this.subtractPointStyle= 'black';
          console.log('Added'+this.commentPointAdded);
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );
    }
  }
  subtractCommentPoint(commentId: string){
    console.log(commentId);
    let commentPoints = this.comments.find(x=>x.commentId === commentId).points;
    if(this.commentPointAdded){
      this.postService.rateComment(commentId,'minus').subscribe(
        res=>{
          commentPoints--;
          this.subtractPointStyle = 'red';
          // this.commentPointAdded = false;
          this.addPointStyle = 'black';
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );
      
    }
    if(this.commentPointSubtracted){
      this.postService.rateComment(commentId,'plus').subscribe(
        res=>{
          commentPoints++;
          this.subtractPointStyle = 'black';
          // this.commentPointSubtracted = false;
          // this.commentPointAdded = false;
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );      
    }
    else{
      this.postService.rateComment(commentId,'minus').subscribe(
        res=>{
          commentPoints--;
          // this.commentPointSubtracted = true;
          // this.commentPointAdded = false;
          this.subtractPointStyle = 'red';
          this.addPointStyle = 'black';
          console.log('Subtract'+this.commentPointSubtracted);
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );
      
      
    }
  }
    
  addComment(comment: NgForm){
    console.log(comment.value);
    const text = comment.value.text;
    console.log(text);
    this.postService.addComment(this.postId,text).subscribe(
      res=>{
        console.log(res);
        this.ngOnInit();
      },
      err=>{
        console.log(err);
      }
    );
  }
  deleteComment(commentId: string){
    if(confirm('Czy na pewno chcesz usunąć ten komentarz?')){
      this.postService.deleteComment(commentId).subscribe(
        res=>{
          console.log(res);
          this.ngOnInit();
        },
        err=>{
          console.log(err);
        }
      );
    }
  }
  allowEdit(commentId: string){
    console.log(commentId);
    this.selectedCommentId = commentId;
    this.editable = true;
  }
  editComment(commentText: string){
    console.log(commentText);
    this.postService.editComment(this.selectedCommentId,commentText).subscribe(
      res=>{
        this.editable = false;
        this.ngOnInit();
      },err=>{
        console.log(err);
      }
    );
  }


  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  selectedSort(event){
    const value = event.target.value;
    if(value === 'popular'){
      this.comments.sort((a,b)=> b.points - a.points);
    }
    else if(value === 'old'){
      this.comments.sort((a,b)=> (a.postTime > b.postTime) ? 1 : (b.postTime > a.postTime) ? -1 : 0);
    }
    else if(value === 'new'){
      this.comments.sort((a,b)=> (b.postTime > a.postTime) ? 1 : (a.postTime > b.postTime) ? -1 : 0);
    }
  }


  addPoint(points: number){
    if(this.pointSubtracted){
      if(points === this.points){
        this.postService.ratePost(this.postId,'plus').subscribe(
          res=>{
            points++;
            this.addPointStyle = 'blue';
            // this.pointSubtracted = false;
            this.subtractPointStyle = 'black';
            console.log('Added'+this.pointAdded);
            this.ngOnInit();
          },err=>{
            console.log(err);
          }
        );
      }
      
    }
    if(this.pointAdded){
      this.postService.ratePost(this.postId,'minus').subscribe(
        res=>{
          points--;
          this.addPointStyle = 'black';
          // this.pointAdded = false;
          // this.pointSubtracted = false;
          console.log('Added'+this.pointAdded);
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );     
    }
    else{
      this.postService.ratePost(this.postId,'plus').subscribe(
        res=>{
          points++;
          // this.pointAdded = true;
          // this.pointSubtracted = false;
          this.addPointStyle = 'blue';
          this.subtractPointStyle= 'black';
          console.log('Added'+this.pointAdded);
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );
    }
  }
  subtractPoint(points: number){
    if(this.pointAdded){
      this.postService.ratePost(this.postId,'minus').subscribe(
        res=>{
          points--;
          this.subtractPointStyle = 'red';
          // this.pointAdded = false;
          this.addPointStyle = 'black';
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );
      
    }
    if(this.pointSubtracted){
      this.postService.ratePost(this.postId,'plus').subscribe(
        res=>{
          points++;
          this.subtractPointStyle = 'black';
          // this.pointSubtracted = false;
          // this.pointAdded = false;
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );      
    }
    else{
      this.postService.ratePost(this.postId,'minus').subscribe(
        res=>{
          points--;
          // this.pointSubtracted = true;
          // this.pointAdded = false;
          this.subtractPointStyle = 'red';
          this.addPointStyle = 'black';
          console.log('Subtract'+this.pointSubtracted);
          this.ngOnInit();
        },err=>{
          console.log(err);
        }
      );
      
      
    }
  }
}
