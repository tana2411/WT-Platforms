import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersDetailComponent } from './offers-detail.component';

describe('OffersDetailComponent', () => {
  let component: OffersDetailComponent;
  let fixture: ComponentFixture<OffersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
