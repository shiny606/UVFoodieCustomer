/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApisService } from 'src/app/services/apis.service';
import { register } from 'src/app/interfaces/register';
import { HttpClient,HttpParams} from '@angular/common/http';
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { VerifyPage } from '../verify/verify.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as moment from 'moment';
import { SelectCountryPage } from '../select-country/select-country.page';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  login: register = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    gender: '1',
    mobile: '',
    fcm_token: '',
    type: '',
    lat: '',
    lng: '',
    cover: '',
    status: '',
    verified: '',
    others: '',
    date: '',
    stripe_key: '',
    cc: '',
    check: false
  };
  submitted = false;
  passwordInvalid = false;
  isLogin: boolean = false;
  check: boolean;
  ccCode: any = '+91';
  checkOption:boolean =true;
  public showPassword: boolean = false;
  fcm_token:any;
  district;
  networkType;

  constructor(
    private router: Router,
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    public http: HttpClient,
    private menuController: MenuController,
    private alertController: AlertController,
    private googlePlus: GooglePlus,
    public network: Network,


  ) {
    this.login.cc = '+91';    
  }
  
  ngOnInit() {
    this.fcm_token = localStorage.getItem('fcm');
    this.district = localStorage.getItem('district');
  }

  
  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }
  loginSkip(){    
    localStorage.setItem('skip', "true");
    this.navCtrl.navigateRoot(['tabs/tab1']);
}


  onLogin(form: NgForm) {  
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{  
    this.submitted = true;
    if (form.valid) {
      this.submitted = true;
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      const passwordfilter = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}/;
      if (!emailfilter.test(this.login.email)) {
        console.log('Please enter valid email');
        this.util.showToast(this.util.translate('Please enter valid email'), 'danger', 'bottom');
        return false;
      }
      else if(!passwordfilter.test(this.login.password))
      {
        this.passwordInvalid=true;
        console.log('Please enter valid password');
        this.util.showToast(this.util.translate('Please enter valid password'), 'danger', 'bottom');
        return false;
      }
      else if(this.login.mobile.length<10)
      {
        this.passwordInvalid=false;
        console.log('Please enter valid mobile');
        this.util.showToast(this.util.translate('Please enter valid mobile'), 'danger', 'bottom');
        return false;
      }
      else {
        this.passwordInvalid=false;
        console.log('login');
        const param = {
          first_name: this.login.first_name,
          last_name: '',
          email: this.login.email,
          password: this.login.password,
          gender: '',
          fcm_token: this.fcm_token,
          type: 'user',
          lat: '',
          lng: '',
          cover: 'NA',
          mobile: this.login.mobile,
          status: '1',
          country_code: '',
          verified: '1',
          others: '',
          date: '',
          stripe_key: '',
          city:this.district
        };

        console.log('param', param);
        this.isLogin = true;
        this.api.post('users/registerUser', param).then((data: any) => {
          this.isLogin = false;
          console.log(data);
          if (data && data.status === 200) {
            this.util.userInfo = data.data;
            localStorage.setItem('uid', data.data.id);
            localStorage.setItem('pwd', data.data.password);
            localStorage.setItem('loginSkip','1');
            const fcm = localStorage.getItem('fcm');
            const password = localStorage.getItem('fcm');
            this.navCtrl.navigateRoot(['tabs/tab1']);
            

          } else if (data && data.status === 500) {
            this.util.errorToast(data.data.message);
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.isLogin = false;
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
      }


    }
  }
  }

  userData: any;
  googleSignin()
  {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    console.log("userData=1===>"+this.userData);
    if(this.userData==null)
    {
    this.googlePlus.login({})
    .then(result =>{
      console.log("userData=2===>"+result);
        this.userData=result;
        console.log(result);
        
        
        this.DogoogleLogin(this.userData);
  

})
.catch(err => console.error(err));
    }
    else
    {
      this.DogoogleLogin(this.userData);
    }
  }
  }

  DogoogleLogin(result)
  {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    const updateParam = {
      email:result.email,
      password:result.userId,
      fcm_token:this.fcm_token,
      first_name:result.familyName,
      last_name:result.givenName,
      city:this.district
    };
    this.api.post('Social/gmail_login', updateParam).then((data: any) => {
      console.log('====gmail_login=====>', data);
      if (data && data.status == 200 ) {
        
        //this.navCtrl.navigateRoot(['tabs/tab1']);
        localStorage.setItem('uid', data.data[0].id);
        localStorage.setItem('login_type',data.login_type);
        localStorage.setItem('loginSkip','1');
        console.log('====gmail_login==data===>', data.data);
        console.log("==id===="+data.data[0].id)
        this.util.userInfo = data.data;
        if(data.data[0].mobile=='' || data.data[0].mobile==null || data.is_mobile_empty == 'Yes'){
          this.navCtrl.navigateRoot(['editbasicdetails']);
          this.util.showToast(this.util.translate('Gmail Login successfully'), 'dark', 'bottom');
        }else{
          this.navCtrl.navigateRoot(['tabs/tab1']);
          this.util.showToast(this.util.translate('Gmail Login successfully'), 'dark', 'bottom');
        }
        
        
        // const fcm_token = localStorage.getItem('fcm');
        // if (fcm_token && fcm_token !== null && fcm_token !== 'null') {
        //   const updateParam = {
        //     id: data.data[0].id,
        //     fcm_token: fcm_token
        //   };
        //   this.api.post('users/edit_profile', updateParam).then((data: any) => {
        //     console.log('user info=>', data);
        //   }, error => {
        //     console.log(error);
        //   });
        // }

        // return false;
      } else if (data && data.status === 201) {
        this.util.errorToast(data.data.message);
      }else if (data && data.status === 405) {
        this.util.errorToast(data.data.message);
      }else if (data && data.status === 406) {
        this.util.errorToast(data.data.message);
      }
      else {
        this.util.errorToast(this.util.translate('Something went wrong'));
        return false;
      }
    }, error => {
      this.util.errorToast(this.util.translate('Something went wrong'));
      console.log('fav error', error);
      //this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }



  checkboxproceedOption(e) {
    if (e.currentTarget.checked) {
      this.checkOption = true;
    } else {
      this.util.showToast(this.util.translate('Please accept terms and Privacy policy'), 'dark', 'bottom');
      this.checkOption = false;
    }
  }


  sendVerification(mail, link) {
    const param = {
      email: mail,
      url: link
    };

    this.api.post('users/sendVerificationMail', param).then((data) => {
      console.log('mail', data);
    }, error => {
      console.log(error);
    });
  }
  back() {
    this.navCtrl.back();
  }

  async openCountry() {
    console.log('open ccode');
    const modal = await this.modalCtrl.create({
      component: SelectCountryPage,
      backdropDismiss: false,
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'selected') {
        console.log('ok');
        this.login.cc = '+' + data.data;
        this.ccCode = '+' + data.data;
      }
    });
    await modal.present();
  }

  open(type) {
    if (type === 'eula') {
      this.iab.create('https://initappz.com/groceryeeaagya/eula.html');
    } else {
      this.iab.create('https://initappz.com/groceryeeaagya/privacy.html');
    }
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }
  ionViewWillLeave() {
    this.menuController.enable(true);
  }
}
