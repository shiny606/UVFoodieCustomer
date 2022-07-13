/*
  Authors : initappz(Rahul Jograna)
Website: https://initappz.com/
App Name: ionic 5 foodies app
Created: 28 - Feb - 2021
This App Template Source code is licensed as per the
terms found in the Website https://initappz.com/license
Copyright and Good Faith Purchasers © 2020 - present initappz.
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderIssueDetailPage } from './orderissue-detail.page';

describe('OrderIssueDetailPage', () => {
  let component: OrderIssueDetailPage;
  let fixture: ComponentFixture<OrderIssueDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderIssueDetailPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderIssueDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
