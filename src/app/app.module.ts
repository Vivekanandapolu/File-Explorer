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
import { InterceptorInterceptor } from './interceptor.interceptor';
import { AuthGuardGuard } from './auth-guard.guard';
import { LoaderComponent } from './loader/loader.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogsComponent } from './components/logs/logs.component';
// import { CanvasJSAngularChartsModule } from 'canvasjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GoogleChartsModule } from 'angular-google-charts';
import { ApplicationLogsComponent } from './components/application-logs/application-logs.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
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
    LoaderComponent,
    DashboardComponent,
    LogsComponent,
    ApplicationLogsComponent,
  ],
  imports: [
    BsDatepickerModule,
    NgSelectModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    NgxChartsModule,
    GoogleChartsModule,
    NgxPaginationModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorInterceptor,
      multi: true,
    },
    AuthGuardGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
