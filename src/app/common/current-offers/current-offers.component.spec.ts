import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOffersComponent } from './current-offers.component';

describe('CurrentOffersComponent', () => {
  let component: CurrentOffersComponent;
  let fixture: ComponentFixture<CurrentOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
