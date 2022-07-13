
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { AlertController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-orderissue-detail',
  templateUrl: './orderissue-detail.page.html',
  styleUrls: ['./orderissue-detail.page.scss'],
})
export class OrderIssueDetailPage implements OnInit {
  id: any;
  grandTotal: any;
  orders: any[] = [];
  serviceTax: any;
  status: any;
  time: any;
  time1: any;
  total: any;
  itemtotal: any;
  uid: any;
  address: any;
  restName: any;
  deliveryAddress: any;
  paid: any;
  tips: any;
  orderTax: any;
  restPhone: any;
  coupon: boolean = false;
  dicount: any;
  dname: any;
  loaded: boolean;
  restFCM: any;
  driverFCM: any;
  dId: any;
  driverName: any;
  driverMobile: any;
  driverCover: any;
  orderNotes: any = '';
  delivery_charge: any = 0;
  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private router: Router,
    public util: UtilService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private iab: InAppBrowser
  ) {
    this.loaded = false;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.getOrder();
      }
    });
  }

  

  getOrder() {
    const param = {
      id: this.id
    };
    console.log("====idorder==="+this.id);
    this.api.post('orders/getById', param).then((datas: any) => {
      this.loaded = true;
      console.log(datas);
      if (datas && datas.status === 200 && datas.data.length) {
        const data = datas.data[0];
        this.util.orderDetails = data;
        this.grandTotal = data.grand_total;
        this.serviceTax = data.serviceTax;
        this.orders = JSON.parse(data.orders);
        this.status = data.status;
        this.time = moment(data.time).format("MMM Do YY");
        this.time1 = moment(data.time).format("h:mm:ss a");
        this.total = data.total;
        this.paid = data.pay_method;
        this.tips = data.driver_tips;
        this.orderTax = data.serviceTax;
        this.delivery_charge = data.delivery_charge;
        this.address = data.str_address;
        this.restName = data.str_name;
      
        if (data && data.did && data.did !== '0') {
          this.dId = data.did;
          this.getDriverInfo();
        }
        this.coupon = data.applied_coupon === '1' ? true : false;
        this.dicount = data.discount;
        this.restPhone = data.str_mobile;
        this.restFCM = data.str_fcm_token;
        //this.deliveryAddress = JSON.parse(data.address);
        // if (data && data.address) {
        //   const add = JSON.parse(data.address);
        //   this.deliveryAddress = add.house + ' ' + add.landmark + ' ' + add.address + add.pincode;
        // }
        console.log("====address=="+data.address);
        console.log("====deliveryAddress=="+this.deliveryAddress);
        this.orderNotes = data.notes;
      } else {
        this.util.back();
      }
    }, error => {
      console.log('error in orders', error);
      this.loaded = true;
      this.util.errorToast('Something went wrong');
    }).catch(error => {
      console.log('error in order', error);
      this.loaded = true;
      this.util.errorToast('Something went wrong');
    });

  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'How was your experience?',
      message: 'Rate ' + this.restName + ' and ' + this.driverName,
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
  trackMyOrder() {
    const navData: NavigationExtras = {
      queryParams: {
        id: this.id
      }
    };
    this.navCtrl.navigateRoot(['/tracker'], navData);
    //
  }
  // call() {
  //   if (this.restPhone) {
  //     this.iab.create('tel:' + this.restPhone, '_system');
  //   }
  // }

  getDriverInfo() {
    const param = {
      id: this.dId
    };
    this.api.post('drivers/getById', param).then((data: any) => {
      console.log('driver info--->>', data);
      if (data && data.status === 200 && data.data.length) {
        const info = data.data[0];
        this.util.orderDetails['driverInfo'] = info;
        console.log('---->>>>>', info);
        this.driverName = info.first_name + ' ' + info.last_name;
        this.driverMobile = info.mobile;
        this.driverCover = info.cover;
        this.driverFCM = info.fcm_token;
      }
    }, error => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    });
  }

  // driverCall() {
  //   if (this.driverMobile) {
  //     this.iab.create('tel:' + this.driverMobile, '_system');
  //   } else {
  //     this.util.errorToast(this.util.translate('Number not found'));
  //   }
  // }
  Call() {
    if (this.util.general.mobile) {
      this.iab.create('tel:' + this.util.general.mobile, '_system');
      console.log('---mobile->>>>>', this.util.general.mobile);
    } else {
      this.util.errorToast(this.util.translate('Number not found'));
    }
  }

   chat() {
     const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Support',
         uid: localStorage.getItem('uid')
       }
     };
     this.navCtrl.navigateRoot(['inbox'], param);
  }

 
  
  back() {
    this.navCtrl.navigateForward('tabs/tab3');
  }
}
