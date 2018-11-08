import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterService} from './register.service';
import { Router } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('f') signupForm: NgForm;
 
  constructor(private registerService: RegisterService,private router: Router) { }
  ngOnInit() {
  }  
  onSubmit(f:NgForm ) {
    console.log(f);
    this.registerService.storeUsers(f.value)
      .subscribe(
      (response) => console.log(response);
      (error) => console.log(error);
    );
    this.signupForm.reset();
    this.router.navigate(['/login']);
  }
  

}

