import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaulierLayoutComponent } from './haulier-layout.component';

describe('HaulierLayoutComponent', () => {
  let component: HaulierLayoutComponent;
  let fixture: ComponentFixture<HaulierLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaulierLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HaulierLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
