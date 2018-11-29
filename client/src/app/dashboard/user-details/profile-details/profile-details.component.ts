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

  public user: User[] = [];
  public editedUser: User;
  isEdited = false;
  constructor(public dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getUser()
    .subscribe(res=>{
      this.user.push(res);
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
    
    this.dashboardService.editUser(editedUser).subscribe(
      res=>{
        this.isEdited = true;
        this.dashboardService.getUser().subscribe(
          res=>console.log(res)
        );
      },err=>{
        console.log(err);
      }
    )
  }


}

