import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NakedfeedComponent } from './nakedfeed.component';

describe('NakedfeedComponent', () => {
  let component: NakedfeedComponent;
  let fixture: ComponentFixture<NakedfeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NakedfeedComponent]
    });
    fixture = TestBed.createComponent(NakedfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
