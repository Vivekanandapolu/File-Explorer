import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BucketsComponent } from './components/buckets/buckets.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { TrashComponent } from './components/trash/trash.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { GlobalHeaderComponent } from './global-header/global-header.component';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    BucketsComponent,
    UserManagementComponent,
    PoliciesComponent,
    TrashComponent,
    HeaderComponent,
    GlobalHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
