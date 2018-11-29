import { FormsModule, NgForm } from '@angular/forms';
import { UserAddress } from './../../user-models/user-address';
import { UserDetails } from './../../user-models/user-details';
import { Component, OnInit } from '@angular/core';
import { User } from '../../user-models/user-model';
import { DashboardService } from '../../dashboard.service';
@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {

  disabled = true;
  public user: User[] = [];
  public currentUser: User;
  public editedUser: User;
  isEdited = false;
  constructor(public dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getUser()
    .subscribe(res=>{
      this.user.push(res);
      this.currentUser = res;
      console.log(res);
    },err=>console.log(err));
  }

  filterUserDetails(){
    return this.user.map(x=>x.userDetails);
  }
  filterUserAddress(){
    return this.user.map(x=>x.userAddress);
  }

  onEditDetails(put: NgForm){
    const editedUser = put.value;
    
    if(editedUser.login === this.currentUser.login){
      editedUser.login = null;
    }
    if(editedUser.emailPollub === this.currentUser.emailPollub){
      editedUser.emailPollub = null;
    }
    console.log(editedUser);
    console.log(editedUser.login);
    console.log(editedUser.emailPollub);
    this.dashboardService.editUser(editedUser).subscribe(
      res=>{
        this.isEdited = true;
        this.dashboardService.getUser().subscribe(
          res=>{
            console.log(res);
            // window.location.reload();
          }
        );
      },err=>{
        console.log(err);
      }
    )
  }


}

