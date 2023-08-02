import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BucketsComponent } from './components/buckets/buckets.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { TrashComponent } from './components/trash/trash.component';

const routes: Routes = [

  {
    path: '',
    component: BucketsComponent
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
  },
  {
    path: 'policies',
    component: PoliciesComponent
  },
  {
    path: 'trash',
    component: TrashComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
