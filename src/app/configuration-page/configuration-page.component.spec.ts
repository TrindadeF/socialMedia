import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationPageComponent } from './configuration-page.component';

describe('ConfigurationPageComponent', () => {
  let component: ConfigurationPageComponent;
  let fixture: ComponentFixture<ConfigurationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationPageComponent]
    });
    fixture = TestBed.createComponent(ConfigurationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
