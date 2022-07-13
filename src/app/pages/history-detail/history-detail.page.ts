
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { AlertController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { CartService } from 'src/app/services/cart.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.page.html',
  styleUrls: ['./history-detail.page.scss'],
})
export class HistoryDetailPage implements OnInit {
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
  store_status: any;
  deliveryAddress: any;
  AddressID: any;
  order_id: any;
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
  discount: any;
  orderNotes: any = '';
  delivery_charge: any = 0;
  package_charge: any;
  networkType;
  addressLat: any;
  addressLng: any;
  storeId;
  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private router: Router,
    public util: UtilService,
    private alertController: AlertController,
    private navCtrl: NavController,
    public cart: CartService,private iab: InAppBrowser,public network: Network,

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
        this.storeId = data.id;
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
        this.package_charge = data.package_charge;
        this.discount = data.discount;
        this.address = data.str_address;
        this.restName = data.str_name;
        this.store_status = data.store_status;
        this.order_id =  data.order_id;
      this.AddressID=data.address_id;
      this.addressLat=data.order_lat;
      this.addressLng=data.order_lng;
        if (data && data.did && data.did !== '0') {
          this.dId = data.did;
          this.getDriverInfo();
        }
        this.coupon = data.applied_coupon === '1' ? true : false;
        this.dicount = data.discount;
        this.restPhone = data.str_mobile;
        this.restFCM = data.str_fcm_token;
        this.deliveryAddress = data.address;
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

  callDriver(){
    this.iab.create('tel:' + this.driverMobile, '_system')
  }

  WatsappDriver(){
    window.open('https://api.whatsapp.com/send?phone=91' + this.driverMobile);
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
            const navData: NavigationExtras = {
              queryParams: {
                orderid: this.id
              }
            };
            this.router.navigate(['/rate'], navData);
            //this.navCtrl.navigateRoot(['rate']);
          }
        }
      ]
    });

    await alert.present();
  }
  trackMyOrder() {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    const navData: NavigationExtras = {
      queryParams: {
        id: this.id
      }
    };
    this.router.navigate(['/trackeraddress'], navData);
  }
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
        this.driverName = info.name;
        this.driverMobile = info.contact_no;
        this.driverCover = info.image;
        this.driverFCM = info.device_token;
       
      }
    }, error => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    });
  }

  async restaurantAvailability() {
    const param = {
      restId: this.orders[0].restId,
    };
    console.log('avail==detail==='+JSON.stringify(param))
    this.api.post("Restaurant/check_res_active", param).then(
      (data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status == 200) {
          this.util.hide();
          this.reOrder();
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


  reOrder(){
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    if(this.store_status == 'open'){
    if(this.orders!=null&&this.orders.length>0)
    {
      this.cart.cart = [];
      this.orders.forEach(element => {        
        this.cart.addItem(element);
      }); 
      this.getVenueDetails();
    } 
  }else{
    this.util.showToast(this.util.translate('Sorry! The shop is closed..'), 'danger', 'bottom');
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

  changeStatus() {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To Cancel this order'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      console.log(data);
      if (data && data.value) {
        console.log('cancle,delivered');
        const value = 'cancel';
        const param = {
          id: this.id,
          status: value,
        };
        console.log('order param', param);
        this.util.show(this.util.translate('Please wait'));
        this.api.post('orders/editList', param).then((order) => {
          console.log(order);
          if (order && order.status === 200) {
            if (this.dId && this.dId !== '' && this.dId !== '0') {
              const driverParam = {
                id: this.dId,
                current: 'active'
              };
              console.log('driver param', driverParam);
              this.api.post('drivers/edit_profile', driverParam).then((driver) => {
                if (driver && driver.status === 200) {
                  this.util.hide();
                  // this.api.sendNotification(this.util.translate('Order statuts changed '),
                  //   this.util.translate('Order statuts changed'), this.driverFCM);
                  Swal.fire({
                    title: this.util.translate('success'),
                    text: this.util.translate('Order status changed to ') + value,
                    icon: 'success',
                    timer: 2000,
                    backdrop: false,
                    background: 'white'
                  });
                  this.navCtrl.back();
                } else {
                  this.util.hide();
                  this.util.errorToast(this.util.translate('Something went wrong'));
                  this.navCtrl.back();
                }
              }, error => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
              }).catch(error => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
              });
            } else {
              this.util.hide();
              this.navCtrl.back();
            }
            // edit_profile
          } else {
            this.util.hide();
            this.util.errorToast(this.util.translate('Something went wrong'));
            this.navCtrl.back();
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
      }
    });
  }

  
  back() {
    this.navCtrl.navigateForward('history');
  }
}
