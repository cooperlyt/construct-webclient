import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionLayoutComponent } from './function-layout.component';

describe('FunctionLayoutComponent', () => {
  let component: FunctionLayoutComponent;
  let fixture: ComponentFixture<FunctionLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
