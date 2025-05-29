import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingOfferDetailComponent } from './buying-offer-detail.component';

describe('BuyingOfferDetailComponent', () => {
  let component: BuyingOfferDetailComponent;
  let fixture: ComponentFixture<BuyingOfferDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyingOfferDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingOfferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
