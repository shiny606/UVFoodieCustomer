
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { CartService } from 'src/app/services/cart.service';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  haveItems: boolean = false;
  myOrders: any[] = [];
  Orders: any[] = [];
  dummy = Array(10);
  driverName: any;
  driverMobile: any;
  driverCover: any;
  driverFCM: any;
  dId: any;
  networkType;
  uid;

  constructor(
    public api: ApisService,
    public util: UtilService,
    private router: Router,public cart: CartService,
    private chMod: ChangeDetectorRef,
    private navCtrl: NavController,
    private alertController: AlertController,public network: Network,

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
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
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
        //this.orders = JSON.parse(data.orders);
        // this.haveItems = true;        
        // data.data.forEach(element => {    
                         
        //   //element.orders = JSON.parse(JSON.stringify(element.orders)).orders;
        //   const myJSON2=element.orders;
        //   //const myJSON=JSON.stringify(element.orders);
        //   //const myJSON1=JSON.parse(myJSON);
        //   //const myJSON2=JSON.parse(myJSON1);
        //  // element.orders=myJSON;
        //   console.log("Orders=====>"+JSON.parse(JSON.stringify(myJSON2)));
        //   this.Orders=JSON.parse(JSON.stringify(myJSON2));
            
        //this.myOrders = data.data;
        //this.Orders=JSON.parse(this.myOrders[0].orders);
        
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

  getCart() {
    this.navCtrl.navigateRoot(['/tabs']);
  }
  goToHistoryDetail(orderId) {
    const navData: NavigationExtras = {
      queryParams: {
        id: orderId
      }
    };
    this.navCtrl.navigateRoot(['/history-detail'], navData);
  }
  getDate(date) {
    //return moment(date).format('llll');
    return moment(date).format("MMM Do YY");   
  }
  getDate1(date) {
    //return moment(date).format('llll');
    return moment(date).format("h:mm:ss a");   
  }

  async restaurantAvailability(order,store_status,orderId) {
    const param = {
      restId: order[0].restId,
    };
    console.log('avail====='+JSON.stringify(param))
    this.api.post("Restaurant/check_res_active", param).then(
      (data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status == 200) {
          this.util.hide();
          this.reOrder(order,store_status,orderId);
        } else if (data && data.status == 201) {
          this.util.errorToast(data.message);
        }
      },
      (error) => {
        console.log(error);
        this.util.hide();
        this.util.showToast(
          this.util.translate("Something went wrong"),
          "danger",
          "bottom"
        );
      }
    );
  }


  async reOrder(order,store_status,orderId){
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{

    if(store_status=='open'){

    const param = {
      id: orderId
    };
    
    this.api.post('orders/getById', param).then((datas: any) => {      
      console.log(datas);
      if (datas && datas.status === 200 && datas.data.length) {
        const data = datas.data[0];
        this.util.orderDetails = data;
        if(order!=null&&order.length>0)
    {
      this.cart.cart = [];
      order.forEach(element => {        
        this.cart.addItem(element);
        
      });
      this.getVenueDetails();
      
    }
        
      } else {
        this.util.back();
      }
    }, error => {
      console.log('error in orders', error);     
      this.util.errorToast('Something went wrong');
    }).catch(error => {
      console.log('error in order', error);      
      this.util.errorToast('Something went wrong');
    }); 
    
  }else{
    this.util.showToast(this.util.translate('Currently unavailable'), 'danger', 'bottom');
  }
}
  }

  async getVenueDetails() {
    //this.presentLoading();
      const body = {
        id: this.cart.cart[0].restId,
      };
      this.api
        .post("stores/getByUid", body)
        .then(
          (datas: any) => {    
            //this.dismissLoading();      
            if (datas && datas.status == 200 && datas.data.length > 0) {
              const data = datas.data[0];
              this.cart.cart[0].lat = data.lat;
              this.cart.cart[0].lng = data.lng;   
              this.navCtrl.navigateRoot('cart');       
            }
          },
          (error) => {
            //this.dismissLoading();
            console.log(error);
            this.util.errorToast(this.util.translate("Something went wrong"));
          }
        )
        .catch((error) => {
          //this.dismissLoading();
          console.log(error);
          this.util.errorToast(this.util.translate("Something went wrong"));
        });
        return true;
    }

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


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'How was your experience?',
      message: 'Rate ' + this.myOrders[0].str_name + ' and ' + this.driverName ,
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
