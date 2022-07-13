
import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ApisService } from 'src/app/services/apis.service';
import { SelectCountryPage } from '../select-country/select-country.page';
import { VerifyPage } from '../verify/verify.page';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';


@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  div_type;
  sent: boolean;
  email: any;
  otp: any;
  myOPT: any;
  verified: any;
  userid: any;
  password: any;
  repass: any;
  loggedIn: boolean;
  id: any;
  Requestflag = true;
  Resendflag = false;
  submitted = false;
  phone: any;
  cc: any = '+91';
  ccCode: any = '+91';
  oldPwd;
  networkType;

  private Form : FormGroup;
  constructor(
    private api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private menuController: MenuController,
    private modalController: ModalController,
    private alertController: AlertController,
    public network: Network,

  ) {
    this.div_type = 0;
    this.sent = false;
    this.email = '';
    this.otp = '';
    this.password = '';
    this.repass = '';
    this.verified = false;
  }

  ngOnInit() {
    this.oldPwd= localStorage.getItem('pwd');
  }
 

  sendOTP(emailval) {
    
    console.log("email======"+emailval);
    this.submitted = true;
    console.log(this.email, ';sendOTPDriver');
    // if (!this.email) {
    //   this.util.showToast(this.util.translate('email is required'), 'dark', 'bottom');
    //   return false;
    // }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (emailfilter.test(emailval)) {
      this.networkType = this.network.type;
      if(this.networkType=='none'){
       this.api.connectionAlert();
      }else{
    this.loggedIn = true;
    const param = {
      email: this.email
    };
    this.api.post('users/sendOTP', param).then((data: any) => {
      console.log(data);
      this.loggedIn = false;
      if (data && data.status === 200) {
        this.id = data.data.id;
        this.loggedIn = false;
        this.submitted = false;
        this.util.showToast(this.util.translate('otp sent successfully'), 'dark', 'bottom');
        this.Resendflag = true;
        this.Requestflag = false;
        //this.div_type = 2;
      } else {
        if (data && data.status === 500) {
          this.util.errorToast(data.data.message);
          this.submitted = false;
          return false;
        }
        this.util.errorToast(this.util.translate('Something went wrong'));
        this.submitted = false;
        return false;
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.submitted = false;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }
  else{
    this.sendOTPOnMobile();
  }
}

  submitverifyOTP() {
    // this.div_type = 3;
    //this.submitted = true;
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    if (!this.otp || this.otp === '') {
      this.util.showToast(this.util.translate('otp is required'), 'dark', 'bottom');
      return false;
    }
    this.loggedIn = true;
    const param = {
      id: this.id,
      otp: this.otp
    };
    this.api.post('users/verifyOTP', param).then((data: any) => {
      console.log(data);
      this.loggedIn = false;
      if (data && data.status === 200) {
        this.loggedIn = false;
        this.submitted = false;
        this.util.showToast(this.util.translate('Account verified successfully'), 'dark', 'bottom');
        //this.email = '';
        this.div_type = 1;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorToast(data.data.message);
          this.submitted = false;
          return false;
        }
        this.util.errorToast(this.util.translate('Something went wrong'));
        this.submitted = false;
        return false;
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.submitted = false;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }

  resetPassword(emailvalue) {
    
    console.log("emailvalue===="+emailvalue);
    console.log("oldPwd===="+this.oldPwd);
    //this.submitted = true;
    console.log('pwddd0<<<<<<', this.password);
    const passwordfilter = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}/;
    if (!this.password || !this.repass || this.password === '' || this.repass === '') {
      this.util.errorToast(this.util.translate('All Field are required'));
      return false;
    }
    //  if(this.oldPwd ==this.password){
    //   console.log("oldPwd===="+this.oldPwd);
    //   this.util.errorToast(this.util.translate('New password does not equal to Old password'));
    //   return false;
    // }
    if(!passwordfilter.test(this.password))
    {
      console.log('Please enter valid password');
      this.util.showToast(this.util.translate('Please enter valid password'), 'danger', 'bottom');
      return false;
    }
    // const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    // if (emailfilter.test(emailvalue)) {
      this.networkType = this.network.type;
      if(this.networkType=='none'){
       this.api.connectionAlert();
      }else{
    const param = {
      // email: this.email,
      // pwd: this.password
      user_name: this.email,
      password: this.password,
      confirm_password: this.repass
    };
    this.loggedIn = true;
    this.api.post('Restaurant/reset_password', param).then((data: any) => {
      console.log(data);
      this.loggedIn = false;
      if (data && data.status == 200) {
        this.loggedIn = false;
        this.submitted = false;
        this.util.errorToast(this.util.translate('Password Reset Successful'));
        this.div_type = 0;
        this.navCtrl.navigateRoot('login');
      } else {
        if (data && data.status == 201) {
          this.util.errorToast(data.message);
          this.submitted = false;
          return false;
        }
        this.util.errorToast(this.util.translate('Something went wrong'));
        this.submitted = false;
        return false;
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.submitted = false;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
// }else{
//     this.resetPasswordWithPhone();
//   }

}

  resetPasswordWithPhone() {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    console.log('pwddd0<<<<<<', this.password);
    if (!this.password || !this.repass || this.password === '' || this.repass === '') {
      this.util.errorToast(this.util.translate('All Field are required'));
      return false;
    }
    if(this.password ==this.oldPwd ){
      this.util.errorToast(this.util.translate('New password does not equal to Old password'));
      return false;
    }
    const param = {
      phone: this.email,
      pwd: this.password
    };
    this.loggedIn = true;
    this.api.post('users/resetPasswordWithPhone', param).then((data: any) => {
      console.log(data);
      this.loggedIn = false;
      if (data && data.status === 200) {
        this.loggedIn = false;
        this.util.errorToast(this.util.translate('Password Reset Successful'));
        this.navCtrl.navigateForward('login');
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorToast(data.data.message);
          return false;
        }
        this.util.errorToast(this.util.translate('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }

  back() {
    this.navCtrl.navigateForward('login');
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }
  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  async openCountry() {
    console.log('open ccode');
    const modal = await this.modalController.create({
      component: SelectCountryPage,
      backdropDismiss: false,
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'selected') {
        console.log('ok');
        this.cc = '+' + data.data;
        this.ccCode = '+' + data.data;
      }
    });
    await modal.present();
  }

  sendOTPOnMobile() {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    this.submitted = false;
    const param = {
      phone: this.email
    };
    this.loggedIn = true;
    this.api.post('users/validatePhoneForReset', param).then((data: any) => {
      this.loggedIn = false;
      console.log('data', data);
      if (data && data.status === 200) {
        console.log('all done...');
        //this.util.showToast(this.util.translate('We will send verification code to your mobile number'), 'dark', 'bottom');
        //this.presentAlertConfirm();
        this.mobileOTP();
      } else if (data && data.status === 500) {
        this.util.errorToast(data.data.message);
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Informations',
      message: 'We will send verification code to your mobile number  ' + this.ccCode + this.email,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Send',
          handler: () => {
            console.log('Confirm Okay');
            this.openModal();
          }
        }
      ]
    });

    await alert.present();
  }

  mobileOTP() {
    console.log('send on this number------<<<<<<<', this.email);
    console.log(this.email);
    const message = this.util.translate('Your Foodies app verification code : ');
    const param = {
      msg: message,
      to: this.email
    };
    console.log(param);
    this.util.show();
    this.api.post('users/twilloMessage', param).then((data: any) => {
      console.log(data);
      console.log("success=====");
      if (data && data.status === 200) {
        this.util.showToast(this.util.translate('We will send verification code to your mobile number'), 'dark', 'bottom');
        this.Resendflag = true;
        this.Requestflag = false;
        this.id = data.data.id;
        this.util.hide();
      }else if (data && data.status === 500) {
        this.util.hide();
        this.util.errorToast(data.message);
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: VerifyPage,
      componentProps: { code: this.ccCode, phone: this.email }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'ok') {
        console.log('verification done...');
        this.div_type = 3;
      }
    });
    modal.present();
  }
}
// validatePhoneForReset