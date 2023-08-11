import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BucketsComponent } from './components/buckets/buckets.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { TrashComponent } from './components/trash/trash.component';
import { LoginComponent } from './login/login.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { GroupsComponent } from './components/groups/groups.component';
import { AuthGuardGuard } from './auth-guard.guard';

const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'buckets',
    component: BucketsComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [AuthGuardGuard]

  },
  {
    path: 'groups',
    component: GroupsComponent,
    canActivate: [AuthGuardGuard]

  },
  {
    path: 'trash',
    component: TrashComponent,
    canActivate: [AuthGuardGuard]

  },
  {
    path: 'forgot',
    component: ForgotPassComponent,
    canActivate: [AuthGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
