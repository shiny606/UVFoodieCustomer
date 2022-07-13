
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderIssuePage } from './orderissue.page';

describe('HistoryDetailPage', () => {
  let component: OrderIssuePage;
  let fixture: ComponentFixture<OrderIssuePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderIssuePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
