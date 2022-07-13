/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Component({
  selector: 'app-helpsupport',
  templateUrl: './helpsupport.page.html',
  styleUrls: ['./helpsupport.page.scss'],
})
export class HelpSupportPage implements OnInit {
  haveItems: boolean = false;
  myOrders: any[] = [];
  Orders: any[] = [];
  dummy = Array(10);
  constructor(
    public api: ApisService,
    public util: UtilService,
    private router: Router,
    private chMod: ChangeDetectorRef,
    private navCtrl: NavController,
    private alertController: AlertController,
  ) {
    this.getMyOrders('', false);
    this.util.subscribeNewOrder().subscribe((data) => {
      this.getMyOrders('', false);
    });
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.navigateForward('tabs/tab3');
  }
  issueOrders(){
    this.navCtrl.navigateBack('orderissue');
  }

  doRefresh(event) {
    console.log(event);
    this.getMyOrders(event, true);
  }

   dataValues = [];
   dataKeys = []; 
  getMyOrders(event, haveRefresh) {
    const param = {
      id: localStorage.getItem('uid')
    };
    console.log("UI"+localStorage.getItem('uid'));
    this.api.post('orders/getByUid', param).then((data: any) => {
      this.dummy = [];      
      if (data && data.status === 200 && data.data.length) {
        this.haveItems = true;
        console.log("====sss00==="+data.data);
        
       
        
        this.myOrders = data.data;
      
        
      } else {
        this.haveItems = false;
      }
      this.chMod.detectChanges();
      if (haveRefresh) {
        event.target.complete();
      }

    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong1'));
      console.log("Something went wrong1"+error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong2'+error));
      console.log("Something went wrong2"+error);
    });
  }

  getCart() {
    this.navCtrl.navigateRoot(['/tabs']);
  }
 
  getDate(date) {
    //return moment(date).format('llll');
    return moment(date).format("MMM Do YY");   
  }
  getDate1(date) {
    //return moment(date).format('llll');
    return moment(date).format("h:mm:ss a");   
  }


 
}
