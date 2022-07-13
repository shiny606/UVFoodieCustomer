
import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { Router, NavigationExtras } from "@angular/router";
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  skip;
  seg_id = 1;
  name: any;
  photo: any = 'assets/user1.png';
  email: any;
  id: any;
  userDetail;
  networkType;
  loginType;
  uid;
  constructor(
    public api: ApisService,
    private router: Router,
    public util: UtilService,
    private navCtrl: NavController,
    private cart: CartService,
    private googlePlus: GooglePlus,
  ) {

  }

  ngOnInit() {
    this.skip = localStorage.getItem('loginSkip');
    console.log('skipppp==='+this.skip)
    this.uid = localStorage.getItem('uid');   
    this.loginType = localStorage.getItem('login_type');
    this.getProfile();
  }
  editBasicDetails(){
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    this.navCtrl.navigateRoot(['editbasicdetails']);
  }
}

  manageAddress(){
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    const navData: NavigationExtras = {
           queryParams: {
             from: 'account'
           }
         };
         this.navCtrl.navigateRoot(['manageaddress'], navData);
        }
  }

  orderHistory(){
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    this.navCtrl.navigateRoot(['history']);
  }
}
  helpClick(){
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    // this.navCtrl.navigateRoot(['helpsupport']);
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Support',
        uid: localStorage.getItem('uid')
      }
    };
    this.navCtrl.navigateRoot(['inbox'], param);
  }
  }

  contactUs(){
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    this.navCtrl.navigateRoot(['contacts']);
  }
  }

  logOut(){
    if(this.loginType == 'gmail_login'){
      this.googlePlus.logout()
      .then(res => {
        console.log("===gmail_logout==="+res);
        localStorage.removeItem('uid');
        this.cart.clearCart();
        localStorage.removeItem('userCart');
        localStorage.removeItem('deliveryAddress');
        localStorage.removeItem('addressId');
        localStorage.removeItem('addressLat');
    localStorage.removeItem('addressLng');
    localStorage.removeItem('loginSkip');
        this.navCtrl.navigateRoot(['/login']);        
      })
      .catch(err => console.error(err));
  

    }else{
    
    localStorage.removeItem('uid');
    localStorage.removeItem('userCart');
    this.cart.clearCart();
    localStorage.removeItem('deliveryAddress');
    localStorage.removeItem('addressId');
    localStorage.removeItem('addressLat');
    localStorage.removeItem('addressLng');
    localStorage.removeItem('loginSkip');
    this.navCtrl.navigateRoot(['/login']);
    }
  }

  loginCall(){
    localStorage.removeItem('loginSkip');
    this.navCtrl.navigateRoot(['/login']);
  }

  deactivateAcc(){
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    const param = {
      user_id: localStorage.getItem('uid')
    };
    this.api.post('/Restaurant/deactivate_customer', param).then((data) => {
      console.log(data);
      if (data.status == 200) {
        this.util.showToast(this.util.translate('Account Deactivated Successfully'),'success', 'bottom');
        localStorage.removeItem('uid');
        localStorage.removeItem('userCart');
        this.cart.clearCart();
        localStorage.removeItem('deliveryAddress');
        localStorage.removeItem('addressId');
        localStorage.removeItem('addressLat');
        localStorage.removeItem('addressLng');
        localStorage.removeItem('loginSkip');
        this.navCtrl.navigateRoot(['/login']);
      }else{
        this.util.showToast(this.util.translate(data.message),'success', 'bottom');
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  }

  getProfile() {
       return this.util.userInfo && this.util.userInfo.cover ? this.api.mediaURLProfile + this.util.userInfo.cover : 'assets/user1.png';
  }
  transactionDetails(){
    if(this.uid == 'undefined' || this.uid == undefined || this.uid == null){
      this.util.errorToast(this.util.translate('Please Login or Signup!!!'));
      this.navCtrl.navigateRoot('login');
  }else{
    this.navCtrl.navigateRoot(['transaction']);
  }
}
  // addCards(){
  //   this.navCtrl.navigateRoot(['stripe-payments']);
  // }


  

  // goToAddress() {
  //   const navData: NavigationExtras = {
  //     queryParams: {
  //       from: 'account'
  //     }
  //   };
  //   this.router.navigate(['/choose-address'], navData);
  // }

  // changeSegment(val) {
  //   this.seg_id = val;
  // }

  // goToselectRestaurants() {
  //   this.router.navigate(['/choose-restaurant']);
  // }

  // editProfile() {
  //   this.router.navigate(['/edit-profile']);
  // }

  // getProfile() {
  //   return this.util.userInfo && this.util.userInfo.cover ? this.api.mediaURL + this.util.userInfo.cover : 'assets/user.png';
  // }

  // getName() {
  //   return this.util.userInfo && this.util.userInfo.first_name ?
  //     this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Foodies';
  // }
  // getEmail() {
  //   return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@foodies.com';
  // }

  // orders() {
  //   this.navCtrl.navigateRoot(['tabs/tab2']);
  // }

  // reset() {
  //   this.router.navigate(['forgot']);
  // }

  // // goToAbout() {
  // //   this.navCtrl.navigateRoot(['tabs/tab4/about']);
  // // }

  // // goToContact() {
  // //   this.navCtrl.navigateRoot(['tabs/tab4/contacts']);
  // // }

  // // goLangs() {
  // //   this.navCtrl.navigateRoot(['tabs/tab4/languages']);
  // // }
  // goToAbout() {
  //   this.navCtrl.navigateRoot(['about']);
  // }

  // goToContact() {
  //   this.navCtrl.navigateRoot(['contacts']);
  // }

  // goLangs() {
  //   this.navCtrl.navigateRoot(['languages']);
  // }


  // goToChats() {
  //   this.router.navigate(['chats']);
  // }

  // // goFaqs() {
  // //   this.navCtrl.navigateRoot(['tabs/tab4/faqs']);
  // // }

  // // goHelp() {
  // //   this.navCtrl.navigateRoot(['tabs/tab4/help']);
  // // }

  // goFaqs() {
  //   this.navCtrl.navigateRoot(['faqs']);
  // }

  // goHelp() {
  //   this.navCtrl.navigateRoot(['help']);
  // }
  // logout() {
  //   localStorage.removeItem('uid');
  //   this.cart.cart = [];
  //   this.cart.itemId = [];
  //   this.cart.totalPrice = 0;
  //   this.cart.grandTotal = 0;
  //   this.cart.coupon = null;
  //   this.cart.discount = null;
  //   this.util.clearKeys('cart');
  //   this.navCtrl.navigateRoot(['']);
  // }

  // reviews() {
  //   console.log('review');
  //   this.router.navigate(['choose-restaurant']);
  // }
}
