import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ApisService } from "src/app/services/apis.service";
import { UtilService } from "src/app/services/util.service";
import { Router, NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import { CartService } from "src/app/services/cart.service";
import { ActivatedRoute } from "@angular/router";
import { Network } from '@ionic-native/network/ngx';
import { LoadingController} from "@ionic/angular";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  name: any;
  descritions: any;
  cover: any;
  address: any;
  house: any;
  frm: any;
  landmark: any;
  time: any;
  total: any;
  finalval: any;
  finalval1: any;
  addressCheck: any;
  totalRatting: any = 0;
  coupon: any;
  from: any;
  tipsamount: any;
  addressID: any;
  addressLat: any;
  addressLng: any;
  taxVal: any;
  package_chargeVal: any;
  kmVal: any;
  networkType;
  tips: any[] = [];
  isLoading;
  mobile;
  uid;
  label1;
  label2;
  zipcode;
  constructor(
    public api: ApisService,
    private router: Router,
    public util: UtilService,
    private navCtrl: NavController,
    private chMod: ChangeDetectorRef,
    public cart: CartService,public network: Network,
    private route: ActivatedRoute,public loadingCtrl: LoadingController
  ) {
    this.util.getCouponObservable().subscribe((data) => {
      if (data) {
       
      }
    });
    this.cart.orderNotes = "";
    this.tips = [
      this.util.translate("0"),
      this.util.translate("10"),
      this.util.translate("20"),
      this.util.translate("50"),
      this.util.translate("100"),
      this.util.translate("150"),
    ]; 

  
    //this.getVenueDetails();
    this.getDetails();  
 
       
    //this.getDetails();
    //this.util.getObservable().next();   
  }

  ionViewWillEnter(){
    this.uid = localStorage.getItem('uid');  
    this.zipcode = localStorage.getItem("zipcode"); 
    this.presentLoading();
    //this.getVenueDetails(); 
    
    this.tipsamount=this.cart.tipsamount;
    //this.util.getObservable().next();
    this.route.queryParams.subscribe((params) => {
      this.from = params["from"];
      if (this.from == "changeaddress") {
        this.addressID = params["addressId"];
        this.address = params["addressDelivery"];
        this.addressLat = params["addressLat"];
        this.addressLng = params["addressLng"];
        this.cart.addressPincode = params["pincodechng"];
        this.cart.calcuate();
        //this.getVenueDetails(); 
      } else {
        this.address = this.cart.deliveryAddress;
        this.addressID = this.cart.addressId;
        this.addressLat = this.cart.addressLat;
        this.addressLng = this.cart.addressLng;
        this.cart.calcuate();
        //this.getVenueDetails(); 
        this.getDetails();
      }
      
      if (this.address == undefined || this.address.length == 0 || this.address == '' || this.address == null
      || this.address == 'null') {
        this.getAddress();  
      }
       else
       {
        this.getDetails();
       }   
    });  
   
    
    this.dismissLoading();
    //this.getVenueDetails();   
   }

  ngOnInit() {   
    this.uid = localStorage.getItem('uid');  
    
  }


  


  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: "Loading…",
      spinner: 'bubbles',
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  async getDetails()
  {
    //this.util.getObservable().next();
    await this.getVenueDetails();
    await this.cart.calcuate();
    await this.getTax();
    await this.getDeliveryCharge();
    this.getProfile();
    
  }

  getProfile() {

    const param = {
      id: localStorage.getItem('uid')
    };
    
    this.api.post('users/getById', param).then((data: any) => {
      
      console.log('user info=>', data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data[0];
      
        this.mobile = info.mobile;
        
      }
    }, error => {
      console.log(error);
      
      this.util.errorToast(this.util.translate('Something went wrong'));
    })
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
              this.cart.cartStoreInfo = data;
              console.log('cartStoreInfo===='+JSON.stringify(data))            
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
  

 async  getTax() {
  //this.presentLoading();
    const body = {
      grand_total: this.cart.grandTotal,
      restId:this.cart.cart[0].restId
    }; 
    console.log("taxxx=="+JSON.stringify(body))   
    this.api
      .post("Restaurant/apply_tax", body)
      .then(
        (datas: any) => {  
          //this.dismissLoading();        
          if (datas && datas.status == 200) {
            this.taxVal = datas.serviceTax;
            this.package_chargeVal = datas.package_charge;
            this.cart.Tax = datas;
            this.cart.package_charge = datas.package_charge;
            console.log("apply_tax===="+this.taxVal + "Tax=="+  this.cart.Tax
            +"xxx=="+this.cart.delivery_charge_GST);
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

  

  async getDeliveryCharge() {
    //this.presentLoading();
    const body = {
      //total_km: this.cart.distance,
      origins:this.cart.cartStoreInfo.lat +"," + this.cart.cartStoreInfo.lng,
      distinations:this.cart.addressLat +"," + this.cart.addressLng,
    };  
    console.log("distance======11"+this.cart.distance+"test=="+JSON.stringify(body));

    this.api
      .post("Restaurant/get_delivery_charge", body)
      .then(
        (datas: any) => { 
          //this.dismissLoading();      
          if (datas) {
            this.kmVal = datas.delivery_charge;
            this.cart.delivery_charges  = this.kmVal;
            this.cart.delivery_charge_GST  = datas.delivery_charge_GST;
            console.log("get_delivery_charge===="+this.kmVal + "ccc=="+ this.cart.delivery_charges
            +"xxx=="+this.cart.delivery_charge_GST);
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


 async getTips(tips) {
    this.tipsamount = tips;
    this.cart.tipsamount = this.tipsamount;
    await this.cart.calcuate();    
  }

  addr: string;
  getAddress() {    
    const param = {
      id: localStorage.getItem("uid"),
    };
    this.api
      .post("address/getByUid", param)
      .then(
        (data) => {  
          if (data && data.status === 200 && data.data.length > 0) {            
            this.addr = "";
            this.addr = this.addr + data.data[0].address;
            this.addressID = data.data[0].id;
            this.addressLat = data.data[0].lat;
            this.addressLng = data.data[0].lng;
            if (data.data[0].house != null && data.data[0].house.length > 0) {
              this.addr = this.addr +" "+ data.data[0].house;
            }
            if (
              data.data[0].landmark != null &&
              data.data[0].landmark.length > 0
            ) {
              this.addr = this.addr +" "+ data.data[0].landmark;
            }
            if (
              data.data[0].pincode != null &&
              data.data[0].pincode.length > 0
            ) {
              this.addr = this.addr +" "+ data.data[0].pincode;
              this.cart.addressPincode = data.data[0].pincode;
            }
            this.address = this.addr;
            this.cart.deliveryAddress = this.address;
            this.cart.addressId = this.addressID;
            this.cart.addressLat = this.addressLat;
            this.cart.addressLng = this.addressLng;
            this.getDetails();
          }
        },
        (error) => {
          console.log(error);
          this.util.errorToast(this.util.translate("Something went wrong"));
        }
      )
      .catch((error) => {
        console.log(error);
        this.util.errorToast(this.util.translate("Something went wrong"));
      });
  }

  back() {
    this.navCtrl.navigateRoot("tabs/tab1");
  }

  getCart() {
    this.navCtrl.navigateRoot(["tabs/tab1"]);
  }

  changeDeliveryAddress() {
    
    
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    const navData: NavigationExtras = {
      queryParams: {
        from: "cart",
      },
    };
    this.navCtrl.navigateForward(["manageaddress"], navData);
  }
  }

  addQ(index) {
    console.log("this.cart.coupon.promo_code=="+this.cart.coupon)

    if(this.cart.coupon == null)
    {
    console.log("coupon===="+this.cart.coupon)
    this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
    this.cart.calcuate();
    this.getTax();
    //return false;
    //this.getDeliveryCharge();
    }else{
      this.cart.coupon = null;
      this.cart.calcuate();
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
      this.cart.calcuate();
      this.getTax();
    }
    
    // if(this.cart.coupon.promo_code == "BUY1GET1FREE")
    // {
    //   console.log("coupon===="+this.cart.coupon)
    //   this.util.showToast(this.util.translate("Sorry! Can't able to add product quantity for this applied promocode."), 'danger', 'bottom');
    // }else if(this.cart.coupon.promo_code == "UVFOODIE BRIYANI MELA")
    // {
    //   if (this.cart.cart[0].quantiy > 1 || this.cart.cart.length > 1) {
    //     this.util.showToast(this.util.translate("Sorry! Can't able to add product quantity for this applied promocode."), 'danger', 'bottom');
    //   }else{
    //     console.log("coupon=22==="+this.cart.coupon)
    //     this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
    //     this.cart.calcuate();
    //     this.getTax();
    //   }
    //   console.log("coupon===="+this.cart.coupon)
      
    // }else{
    //   console.log("coupon===="+this.cart.coupon)
    //   this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
    //   this.cart.calcuate();
    //   this.getTax();
    // }
    


    // if(this.cart.coupon==null||this.cart.coupon.promo_code != "UVFOODIE BRIYANI MELA")
    // {
    // this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
    // this.cart.calcuate();
    // this.getTax();
    // //this.getDeliveryCharge();
    // } else
    // {
    //   this.util.showToast(this.util.translate('Sorry! This promocode is valid for maximum product quantity of 2..'), 'danger', 'bottom');
    // }
  }

 async removeQ(index) {
  if(this.cart.coupon == null)
  {
    if (this.cart.cart[index].quantiy !== 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      if (this.cart.cart[index].quantiy === 0) {
        this.cart.removeItem(this.cart.cart[index].id);
      }
    } else {
      this.cart.cart[index].quantiy = 0;
      if (this.cart.cart[index].quantiy === 0) {
        this.cart.removeItem(this.cart.cart[index].id);
      }
    }
    await this.cart.calcuate();
    await this.getTax();
  }else{
    this.cart.coupon = null;
    this.cart.calcuate();
    if (this.cart.cart[index].quantiy !== 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      if (this.cart.cart[index].quantiy === 0) {
        this.cart.removeItem(this.cart.cart[index].id);
      }
    } else {
      this.cart.cart[index].quantiy = 0;
      if (this.cart.cart[index].quantiy === 0) {
        this.cart.removeItem(this.cart.cart[index].id);
      }
    }
    await this.cart.calcuate();
    await this.getTax();
  }
    //this.getDeliveryCharge();    
  }

  async proceedToPay() {
   
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
      this.getDetails();
    var Addresslabel = document.getElementById("addresslabel").textContent;
    if (Addresslabel == null || Addresslabel == '' 
    || Addresslabel == 'undefined' || Addresslabel == undefined) {     
      this.util.errorToast(this.util.translate("Please select one address"));
      return false;
    }
    if(this.cart.FinalTotal == 'NaN' || this.cart.FinalTotal == '₹'){
      this.util.errorToast(this.util.translate("Please check your amount"));
      return false;
    }
    if(this.mobile == '' || this.mobile == null || this.mobile == undefined){
      this.util.errorToast(this.util.translate('Please update your mobile number')); 
      return false;
    }     
      this.cart.deliveryAddress = this.address;
      this.cart.addressId = this.addressID;
      this.cart.addressLat = this.addressLat;
      this.cart.addressLng = this.addressLng;
      await this.cart.calcuate();
      if (this.tipsamount == null) {
        
        this.label1 = document.getElementById("label1").textContent;
        this.cart.FinalTotal = this.label1;
        console.log('FinalTotalsss======'+this.label1)
        this.cart.calcuate();
      } else {
       
        this.label2 = document.getElementById("label2").textContent;
        this.cart.FinalTotal = this.label2;
        console.log('FinalTotalsss===sss==='+this.label2)
        this.cart.calcuate();       
      }
      var labelva = document.getElementById("labelVal").textContent;
      this.cart.serviceTaxx = labelva;
      await this.cart.calcuate();
      //this.navCtrl.navigateForward("payments");
      
      this.restaurantAvailability();
    }
    
  }
  }

  async restaurantAvailability() {
    const param = {
      restId: this.cart.cart[0].restId,
    };
    console.log('avail===cart=='+JSON.stringify(param))
    this.api.post("Restaurant/check_res_active", param).then(
      (data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status == 200) {
          this.util.hide();
          this.getPincodeAvail();
          //this.navCtrl.navigateRoot("payments");
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

  async getPincodeAvail(){
    const param = {
      pincode: this.cart.addressPincode,
    };
    console.log('avail====='+JSON.stringify(param))
    this.api.post("Restaurant/check_service_pincode_exist", param).then(
      (data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status == 200) {
          this.navCtrl.navigateRoot("payments");
          this.util.hide();
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



  openCoupon() {
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    const navData: NavigationExtras = {
      queryParams: {
        restId: this.cart.cart[0].restId,
        name: this.name,
        totalPrice: this.cart.totalPrice,
      },
    };
    this.navCtrl.navigateRoot(["coupons", navData]);
  }
  }

  async removeQAddos(i, j) {
    if (this.cart.cart[i].selectedItem[j].total !== 0) {
      this.cart.cart[i].selectedItem[j].total =
        this.cart.cart[i].selectedItem[j].total - 1;
      if (this.cart.cart[i].selectedItem[j].total === 0) {
        const newCart = [];
        this.cart.cart[i].selectedItem.forEach((element) => {
          if (element.total > 0) {
            newCart.push(element);
          }
        });        
        this.cart.cart[i].selectedItem = newCart;
        this.cart.cart[i].quantiy = newCart.length;
        if (this.cart.cart[i].quantiy === 0) {
          this.cart.removeItem(this.cart.cart[i].id);
        }
      }
    }
    await this.cart.calcuate();
  }

  async addQAddos(i, j) {
    console.log(this.cart.cart[i].selectedItem[j]);
    this.cart.cart[i].selectedItem[j].total =
      this.cart.cart[i].selectedItem[j].total + 1;
    await this.cart.calcuate();
  }  
}