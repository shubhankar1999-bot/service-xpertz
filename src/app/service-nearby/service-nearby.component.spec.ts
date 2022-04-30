import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceNearbyComponent } from './service-nearby.component';

describe('ServiceNearbyComponent', () => {
  let component: ServiceNearbyComponent;
  let fixture: ComponentFixture<ServiceNearbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceNearbyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceNearbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
