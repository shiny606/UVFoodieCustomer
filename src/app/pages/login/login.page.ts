
import { Component, OnInit } from '@angular/core';
import { login } from 'src/app/interfaces/login';
import { NavigationExtras, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { mobile } from 'src/app/interfaces/mobile';
import { mobile1 } from 'src/app/interfaces/mobile1';
import { SelectCountryPage } from '../select-country/select-country.page';
import { mobileLogin } from 'src/app/interfaces/mobileLogin';
import { VerifyPage } from '../verify/verify.page';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
//import { AngularFireAuth } from '@angular/fire/auth';
//import * as firebase from 'firebase';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  
})
export class LoginPage implements OnInit {
  login: login = { email: '', password: '' };
  mobile1: mobile1 = { ccCode: '+91', email: '', password: '' };
  mobile: mobile = { ccCode: '', phone: '', password: '' };
  mobileLogin: mobileLogin = { ccCode: '', phone: '' };
  submitted = false;
  isLogin: boolean = false;
  userDetail;
  public isGoogleLogin = false;
  public user = null;
  tcm_token:any;
  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;
  networkType;
fcm_token:any;
  isLoggedIn:boolean = false;
  public showPassword: boolean = false;
  district;

  constructor(
    private router: Router,
    //private fireAuth: AngularFireAuth,
    private platform: Platform,
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private oneSignal: OneSignal,
    private menuController: MenuController,
    private modalController: ModalController,public network: Network,
    private modalCtrl: ModalController,private googlePlus: GooglePlus
  ) {
    console.log('--------------- user login', this.util.user_login);
    // this.mobile.ccCode = '+91';
    // this.mobileLogin.ccCode = '+91';
    // this.oneSignal.getIds().then((data) => {
    //   console.log('iddddd==========', data);
    //   localStorage.setItem('fcm', data.userId);
    // });
  }

  ngOnInit() {
    this.district = localStorage.getItem("district")
    const uid = localStorage.getItem('uid');
    this.fcm_token = localStorage.getItem('fcm');
         console.log('uid', localStorage.getItem('uid'));
         if (uid && uid != null && uid !== 'null') {
          this.navCtrl.navigateRoot(['tabs/tab1']);
         }
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
      this.isLogin = true;
      const param = {
        email:this.login.email,
        password:this.login.password,
        fcm_token:this.fcm_token, 
      };
      this.api.post('users/login',param).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status === 200) {
          if (data && data.data && data.data.type === 'user') {
            if (data.data.status === '1') {
              localStorage.setItem('uid', data.data.id);
              localStorage.setItem('loginSkip','1');
              console.log("==id===="+data.data.id)
              this.util.userInfo = data.data;
              this.navCtrl.navigateRoot(['tabs/tab1']);
              const fcm = localStorage.getItem('fcm');
              if (fcm && fcm !== null && fcm !== 'null') {
                const updateParam = {
                  id: data.data.id,
                  fcm_token: fcm
                };
                this.api.post('users/edit_profile', updateParam).then((data: any) => {
                  console.log('user info=>', data);
                }, error => {
                  console.log(error);
                });
              }
            }
          } else if (data && data.status === 201) {
            this.util.errorToast(data.data.message);
            this.login.email = '';
            this.login.password = '';
          }
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
  // userData: any;
  // googleSignin()
  // {
  //   if(this.networkType=='none'){
  //     this.api.connectionAlert();
  //    }else{
  //   console.log("userData=1===>"+this.userData);
  //   if(this.userData==null || this.userData == "undefined")
  //   {
  //      console.log("userData=s===>");
  //      try
  //      {
  //         this.googlePlus.login({})
  //           .then(result =>{
  //           console.log("userData=2===>"+result);
  //           this.userData=result;
  //           console.log(result);
  //           this.DogoogleLogin(this.userData);
  //         }).catch(err => console.error(err));
  //       }
  //       catch(ex)
  //       {
  //         console.log("userData=3===>"+ex);
  //       }
  //   }
  //   else
  //   {
  //     this.DogoogleLogin(this.userData);
  //   }
  // }
  // }

  // DogoogleLogin(result)
  // {
  //   const updateParam = {
  //     email:result.email,
  //     password:result.userId,
  //     fcm_token:this.fcm_token,
  //     first_name:result.familyName,
  //     last_name:result.givenName,
  //     city:this.district
  //   };
  //   this.api.post('Social/gmail_login', updateParam).then((data: any) => {
  //     if (data && data.status == 200 ) {
        
  //       localStorage.setItem('uid', data.data[0].id);
  //       localStorage.setItem('login_type',data.login_type);
  //       localStorage.setItem('loginSkip','1');
  //       console.log('====gmail_login==data===>', data.data);
  //       console.log("==id===="+data.data[0].id)
  //       this.util.userInfo = data.data;
  //       if(data.data[0].mobile=='' || data.data[0].mobile==null || data.is_mobile_empty == 'Yes'){
  //         this.navCtrl.navigateRoot(['editbasicdetails']);
  //         this.util.showToast(this.util.translate('Gmail Login successfully'), 'dark', 'bottom');
  //       }else{
  //         this.navCtrl.navigateRoot(['tabs/tab1']);
  //         this.util.showToast(this.util.translate('Gmail Login successfully'), 'dark', 'bottom');
  //       }
        
  //       // const fcm_token = localStorage.getItem('fcm');
  //       // if (fcm_token && fcm_token !== null && fcm_token !== 'null') {
  //       //   const updateParam = {
  //       //     id: data.data[0].id,
  //       //     fcm_token: fcm_token
  //       //   };
  //       //   this.api.post('users/edit_profile', updateParam).then((data: any) => {
  //       //     console.log('user info=>', data);
  //       //   }, error => {
  //       //     console.log(error);
  //       //   });
  //       // }

  //       // return false;
  //     }else if (data && data.status === 201) {
  //       this.util.errorToast(data.data.message);
  //       this.util.errorToast(this.util.translate('error 201'));
  //     }else if (data && data.status === 405) {
  //       this.util.errorToast(data.data.message);
  //       this.util.errorToast(this.util.translate('error 405'));
  //     }else if (data && data.status === 406) {
  //       this.util.errorToast(data.data.message);
  //       this.util.errorToast(this.util.translate('error 406'));
  //     }
  //     else {
  //       this.util.errorToast(this.util.translate('error else'));
  //       this.util.errorToast(data.data.message);
  //       return false;
  //     }
  //   }, error => {
  //     console.log('fav error', error);
  //     this.util.errorToast(this.util.translate('error catch'));
  //     //this.util.errorToast(this.util.translate('Something went wrong'));
  //   });
  // }



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



  resetPass() {
    this.navCtrl.navigateRoot(['/forgot']);
  }

  register() {
    this.navCtrl.navigateRoot(['register']);
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
    this.fcm_token = localStorage.getItem('fcm');
    this.district = localStorage.getItem("district")
    //const uid = localStorage.getItem('uid'); 
  }
  ionViewWillLeave() {
    this.menuController.enable(true);
  }

}
