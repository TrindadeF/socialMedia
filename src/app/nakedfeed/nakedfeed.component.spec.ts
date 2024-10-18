import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NakedFeedComponent } from './nakedfeed.component';

describe('NakedfeedComponent', () => {
  let component: NakedFeedComponent;
  let fixture: ComponentFixture<NakedFeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NakedFeedComponent]
    });
    fixture = TestBed.createComponent(NakedFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
