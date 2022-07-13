
import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { AlertController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-orderissue',
  templateUrl: './orderissue.page.html',
  styleUrls: ['./orderissue.page.scss'],
})
export class OrderIssuePage implements OnInit {
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

  getCart() {
    this.navCtrl.navigateRoot(['/tabs']);
  }
  goToOrderIssueDetail(orderId) {
    const navData: NavigationExtras = {
      queryParams: {
        id: orderId
      }
    };
    this.navCtrl.navigateRoot(['/orderissue-detail'], navData);
  }
  getDate(date) {
    //return moment(date).format('llll');
    return moment(date).format("MMM Do YY");   
  }
  getDate1(date) {
    //return moment(date).format('llll');
    return moment(date).format("h:mm:ss a");   
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'How was your experience?',
      message: 'Rate ' + this.myOrders[0].str_name + ' and ' + "driverName",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.navCtrl.navigateRoot(['rate']);
          }
        }
      ]
    });

    await alert.present();
  }
}
