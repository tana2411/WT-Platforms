import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMemberLocationComponent } from './admin-member-location.component';

describe('AdminMemberLocationComponent', () => {
  let component: AdminMemberLocationComponent;
  let fixture: ComponentFixture<AdminMemberLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMemberLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMemberLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
