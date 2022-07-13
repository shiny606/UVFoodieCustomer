
import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalController, NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {
  products: any;
  oId:any;
  networkType;

  constructor(
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private router: Router,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,public network: Network,

  ) {


    this.route.queryParams.subscribe(data => {
      console.log('data=>', data);
      if (data.hasOwnProperty('orderid')) {
        this.oId = data.orderid;
        console.log("track==11=="+data.orderid);
       
      }
    });
    
    console.log("===orderDetails===="+this.util.orderDetails.orders);
    if (this.util.orderDetails && this.util.orderDetails.orders) {
      this.products = JSON.parse(this.util.orderDetails.orders);
      console.log(this.products);
    } else {
      this.util.errorToast('Something went wrong');
      this.navCtrl.back();
    }
  }

  submit() {

  }
  ngOnInit() {
  }
  onRatingChange(event) {
    console.log(event);
  }



  rateStore() {
    
    const navData: NavigationExtras = {
      queryParams: {
        id: this.util.orderDetails.restId,
        name: this.util.orderDetails.str_name,
        way: 'order',
        OrderId : this.oId
      }
    };
    this.navCtrl.navigateRoot(['/add-review'], navData);
  }

  ratDriver() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.util.orderDetails.driverInfo.id,
        name: this.util.orderDetails.driverInfo.name,
        OrderId : this.oId
      }
    };
    this.navCtrl.navigateRoot(['driver-rating'], param);
  }

  async rateProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        name: item.name,
        OrderId : this.oId
      }
    };
    this.navCtrl.navigateRoot(['product-rating'], param);
  }
}
