import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferOwnerComponent } from './offer-owner.component';

describe('OfferOwnerComponent', () => {
  let component: OfferOwnerComponent;
  let fixture: ComponentFixture<OfferOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
