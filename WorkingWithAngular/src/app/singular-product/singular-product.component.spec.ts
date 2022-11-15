import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingularProductComponent } from './singular-product.component';

describe('SingularProductComponent', () => {
  let component: SingularProductComponent;
  let fixture: ComponentFixture<SingularProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingularProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingularProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
