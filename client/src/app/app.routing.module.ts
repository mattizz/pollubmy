import { ChangePasswordComponent } from './dashboard/user-details/change-password/change-password.component';
import { LoginService } from './auth/login/login.service';
import { LoginGuard } from './auth/login/login-guard.service';
import { RegisterComponent } from './auth/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDetailsComponent } from './dashboard/user-details/user-details.component';
import { FileUploadComponent } from './dashboard/file-upload/file-upload.component';
const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard',
    children: [
      {path: '', component: DashboardComponent},
      {path: 'resources', component: FileUploadComponent},
      {path: 'details',component: UserDetailsComponent},
      {path: 'changePassword', component: ChangePasswordComponent}]
    ,canActivate: [LoginGuard]}
   ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [LoginService,LoginGuard],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }