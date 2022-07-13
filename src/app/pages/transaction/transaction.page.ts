
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  haveItems: boolean = false;
  myOrders: any[] = [];
  Orders: any[] = [];
  dummy = Array(10);
  driverName: any;
  driverMobile: any;
  driverCover: any;
  driverFCM: any;
  dId: any;
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
        
        data.data.forEach(element => {
          //element.orders = JSON.parse(JSON.stringify(element.orders)).orders; 
        });
        
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

 
}
