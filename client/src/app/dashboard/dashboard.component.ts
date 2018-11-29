import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { UserDetails } from './user-models/user-details';
import { User } from './user-models/user-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public userDetails: User;
  public firstName: string;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getUser();
  }
}
