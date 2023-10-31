import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationLogsComponent } from './application-logs.component';

describe('ApplicationLogsComponent', () => {
  let component: ApplicationLogsComponent;
  let fixture: ComponentFixture<ApplicationLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationLogsComponent]
    });
    fixture = TestBed.createComponent(ApplicationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
