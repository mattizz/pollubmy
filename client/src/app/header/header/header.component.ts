import { DashboardService } from './../../dashboard/dashboard.service';
import { LoginService } from './../../auth/login/login.service';
import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { User } from '../../dashboard/user-models/user-model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  name: string;
  user: User;
  constructor(public loginService: LoginService, public dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getUser().subscribe(
      res=>{
        this.name = res.firstName;
        console.log(this.name);
      } 
    );
  }
  
}
