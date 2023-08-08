import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BucketsComponent } from './components/buckets/buckets.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { TrashComponent } from './components/trash/trash.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { GlobalHeaderComponent } from './global-header/global-header.component';
import { LoginComponent } from './login/login.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { FormsModule } from '@angular/forms';
import { GroupsComponent } from './components/groups/groups.component';
import { ToastrModule } from 'ngx-toastr';
import { InterceptorInterceptor } from './interceptor.interceptor';
import { AuthGuardGuard } from './auth-guard.guard';
@NgModule({
  declarations: [
    // NgMultiSelectDropDownModule.forRoot(),
    AppComponent,
    SideNavComponent,
    BucketsComponent,
    UserManagementComponent,
    TrashComponent,
    HeaderComponent,
    GlobalHeaderComponent,
    LoginComponent,
    ForgotPassComponent,
    GroupsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true
    }, AuthGuardGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
