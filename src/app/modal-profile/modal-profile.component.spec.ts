import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfileComponent } from './modal-profile.component';

describe('ModalProfileComponent', () => {
  let component: ModalProfileComponent;
  let fixture: ComponentFixture<ModalProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalProfileComponent]
    });
    fixture = TestBed.createComponent(ModalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
