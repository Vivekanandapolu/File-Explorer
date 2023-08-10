import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BucketsComponent } from './components/buckets/buckets.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { TrashComponent } from './components/trash/trash.component';
import { LoginComponent } from './login/login.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { GroupsComponent } from './components/groups/groups.component';
import { LoaderComponent } from './loader/loader.component';

const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'buckets',
    component: BucketsComponent
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
  },
  {
    path: 'groups',
    component: GroupsComponent
  },
  {
    path: 'trash',
    component: TrashComponent
  }, {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPassComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
