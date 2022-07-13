import { Component, OnInit } from "@angular/core";
import { ApisService } from "src/app/services/apis.service";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "src/app/services/util.service";
import { NavController } from "@ionic/angular";
import { CartService } from "src/app/services/cart.service";
import { Router, NavigationExtras } from "@angular/router";
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: "app-coupons",
  templateUrl: "./coupons.page.html",
  styleUrls: ["./coupons.page.scss"],
})
export class CouponsPage implements OnInit {
  list: any[] = [];
  promo_code: any[] = [];
  restId: any;
  name: any;
  total: any;
  networkType;
  dummy = Array(10);
  constructor(
    public api: ApisService,
    private route: ActivatedRoute,
    public util: UtilService,
    private navCtrl: NavController,
    public cart: CartService,public network: Network,

  ) {}

  ngOnInit() {
    this.getOffers();
    this.route.queryParams.subscribe((data) => {
      this.restId = data.restId;
      this.name = data.name;
      this.total = data.totalPrice;
      console.log(this.restId);
    });

    
  }

  getOffers() {
    
 this.networkType = this.network.type;
 if(this.networkType=='none'){
  this.api.connectionAlert();
 }else{
    const body = {
      restId: this.cart.cart[0].restId,
    };
    this.dummy = [];
    this.list = [];
    this.api
      .post("Restaurant/promocodes", body)
      .then(
        (datas: any) => {
          if (datas && datas.status == 200) {
            this.list = datas.data;            
          } else if (datas.status == 201) {
            this.dummy = [];
            this.util.errorToast(this.util.translate(datas.message));
          }
        },
        (error) => {
          console.log(error);
          this.dummy = [];
          this.util.errorToast(this.util.translate("Something went wrong"));
        }
      )
      .catch((error) => {
        console.log(error);
        this.util.errorToast(this.util.translate("Something went wrong"));
      });
    }
  }

  applyCoupon(item) {
    //alert("amt===="+this.cart.totalPrice)
 this.networkType = this.network.type;
 if(this.networkType=='none'){
  this.api.connectionAlert();
 }else{
    if (item.code == "BUY1GET1FREE") {
      if (this.cart.cart[0].quantiy > 1 || this.cart.cart.length > 1) {
        this.util.errorToast(this.util.translate("This coupon is not valid"));
      }else{
        //this.cart.cart[0].quantiy=2;
        this.cart.couponId = item.id;
        this.cart.calcuate();
        const body = {
          user_id: localStorage.getItem("uid"),
          promo_code: item.code,
          grand_total: this.cart.totalPrice,
        };
        this.dummy = [];       
        this.promo_code = [];
        this.api
          .post("Restaurant/apply_promocode", body)
          .then(
            (datas: any) => {
              console.log("item====33====" + JSON.stringify(datas));
              if (datas && datas.status == 200) {
                this.promo_code = datas.promo_code;
                this.util.showToast(
                  this.util.translate("Coupon Applied"),
                  "success",
                  "bottom"
                );
                this.util.publishCoupon(datas);               
                this.navCtrl.navigateBack(['cart']);
              } else if (datas.status == 201) {
                this.dummy = [];
                this.util.errorToast(this.util.translate(datas.message));
              }
            },
            (error) => {
              console.log(error);
              this.dummy = [];
              this.util.errorToast(this.util.translate("Something went wrong"));
            }
          )
          .catch((error) => {
            console.log(error);
            this.util.errorToast(this.util.translate("Something went wrong"));
          });
      }
    } else if (item.code == "UVFOODIE BRIYANI MELA") {
      if (this.cart.cart[0].quantiy > 2 || this.cart.cart.length > 2) {
        this.util.errorToast(this.util.translate("This coupon is valid only for maximum product quantity of 2."));
      }else{
        //this.cart.cart[0].quantiy=2;
        this.cart.couponId = item.id;
        this.cart.calcuate();
        const body = {
          user_id: localStorage.getItem("uid"),
          promo_code: item.code,
          grand_total: this.cart.totalPrice,
        };
        this.dummy = [];       
        this.promo_code = [];
        this.api
          .post("Restaurant/apply_promocode", body)
          .then(
            (datas: any) => {
              console.log("item====33====" + JSON.stringify(datas));
              if (datas && datas.status == 200) {
                this.promo_code = datas.promo_code;
                this.util.showToast(
                  this.util.translate("Coupon Applied"),
                  "success",
                  "bottom"
                );
                console.log('ssssss==='+JSON.stringify(datas))
                this.util.publishCoupon(datas);               
                this.navCtrl.navigateBack(['cart']);
              } else if (datas.status == 201) {
                this.dummy = [];
                this.util.errorToast(this.util.translate(datas.message));
              }
            },
            (error) => {
              console.log(error);
              this.dummy = [];
              this.util.errorToast(this.util.translate("Something went wrong"));
            }
          )
          .catch((error) => {
            console.log(error);
            this.util.errorToast(this.util.translate("Something went wrong"));
          });
      }
    }  else {
      this.cart.couponId = item.id;
      this.cart.calcuate();
      const body = {
        user_id: localStorage.getItem("uid"),
        promo_code: item.code,
        grand_total: this.cart.totalPrice,
      };
      this.dummy = [];
      this.promo_code = [];
      this.api
        .post("Restaurant/apply_promocode", body)
        .then(
          (datas: any) => {
            if (datas && datas.status == 200) {
              this.promo_code = datas.promo_code;
              this.util.showToast(
                this.util.translate("Coupon Applied"),
                "success",
                "bottom"
              );
              this.util.publishCoupon(datas);
              this.navCtrl.back();
            } else if (datas.status == 201) {
              this.dummy = [];
              this.util.errorToast(this.util.translate(datas.message));
            }
          },
          (error) => {
            console.log(error);
            this.dummy = [];
            this.util.errorToast(this.util.translate("Something went wrong"));
          }
        )
        .catch((error) => {
          console.log(error);
          this.util.errorToast(this.util.translate("Something went wrong"));
        });
    }
  }
  }


  back() {
    this.navCtrl.back();
  }
  
  expire(date) {
    return moment(date).format("llll");
  }
}
