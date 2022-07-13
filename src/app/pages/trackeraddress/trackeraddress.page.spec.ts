
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackerAddressPage } from './trackeraddress.page';

describe('TrackerPage', () => {
  let component: TrackerAddressPage;
  let fixture: ComponentFixture<TrackerAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrackerAddressPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
