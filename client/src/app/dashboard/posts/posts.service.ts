import { HttpClient } from '@angular/common/http';
import { Comment } from './comment.model';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }
  
  getAllPosts(){
    return this.http.get<Post[]>('http://localhost:8080/post',{
      headers: {
      'Authorization' : localStorage.getItem('token'),
      'Content-Type' : 'application/json'
      }
    });
  }
  getUserPosts(){
    return this.http.get<Post[]>('http://localhost:8080/post/my',{
      headers: {
      'Authorization' : localStorage.getItem('token'),
      'Content-Type' : 'application/json'
      }
    });
  }

  addPost(category: string, postText: string){
    return this.http.post('http://localhost:8080/post',
    {
      category: category,
      postText: postText
    },{
      headers: {
      'Authorization' : localStorage.getItem('token'),
      'Content-Type' : 'application/json'
      }
    });
  }
  deletePost(postId: string){
    return this.http.patch('http://localhost:8080/post/'+postId,'',{
      headers: {
      'Authorization' : localStorage.getItem('token')
      }
    });
  }
}

