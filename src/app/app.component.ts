
import { Component } from '@angular/core';
import { Platform, ActionSheetController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { UtilService } from './services/util.service';
import { ApisService } from './services/apis.service';
import { CartService } from './services/cart.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController } from "@ionic/angular";
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AudioServiceService } from './audio-service.service';
import {AppVersion} from '@ionic-native/app-version/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissionService } from "src/app/android-permission.service";
import { ModalController , NavParams } from '@ionic/angular';
declare var google;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  autocompleteItems: any = [];
  public appPages: any[] = [];
  selectedIndex: any;
  loginType;
  versions;
  versionLink;
  lat;
  lng;
  protected app_version: string;
 
  constructor(
    public androidPermissionService:AndroidPermissionService,
    private platform: Platform,public modalController: ModalController,
    public geolocation: Geolocation,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,private appVersion: AppVersion,
    private oneSignal: OneSignal,
    private actionSheetController: ActionSheetController,
    public util: UtilService,
    private navCtrl: NavController,
    public api: ApisService,
    private cart: CartService,
    private googlePlus: GooglePlus,
    private alertCtrl: AlertController,
    private audio: AudioServiceService,
    private firebaseX: FirebaseX,private nativeAudio: NativeAudio
  ) {

    this.selectedIndex = 0;

    this.util.subscribeNewOrder().subscribe((data) => {
      
    });    

  }

  async ngOnInit() {  
      
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {      
    this.firebaseX.logMessage("Customer App Crashed");   
    this.getLocation(); 
      this.appVersion.getVersionNumber().then(
				(versionNumber) => {
					this.app_version = versionNumber;
				},
				(error) => {
					console.log(error);
				});
      this.loginType = localStorage.getItem('login_type');
      this.statusBar.backgroundColorByHexString('#F97012');
      this.splashScreen.hide();
      this.util.cityAddress = localStorage.getItem('address');
      this.appPages = this.util.appPages;

        const body = {
          type: 'customer',
        };  
        this.api
          .post("CurrentVersion/current_version", body)
          .then(
            (datas: any) => {   
              if (datas) {
                this.versions = datas.current_version[0].version; 
                this.versionLink = datas.current_version[0].link;
                if(this.app_version != this.versions ){
                  this.updateAlert(this.versionLink);
                }
              }
            },
            (error) => {
              console.log(error);
              this.util.errorToast(this.util.translate("Something went wrong"));         
          });

      if (this.platform.is('cordova')) {        
        this.firebaseX.getToken()
      .then(
        token =>
        {        
        localStorage.setItem('fcm',token);
        }
        )      
      .catch(error => console.error('Error getting token', error));
    this.firebaseX.onMessageReceived()
      .subscribe(data =>{        
          this.util.subscribeNewOrder().next();
      });
      
      this.firebaseX.deleteChannel("UVFoodieCustomer").then(() => console.log('Channel deleted'));  
    var channel1  = {      
      id: "UVFoodieCustomer",
      description: "UVFoodie Customer",
      name: "UVFoodie",
      sound: "crystal",
      light: true,
      lightColor: parseInt("FF0000FF", 16).toString(),  
      badge: true,      
  };

    this.firebaseX.createChannel(channel1)
    .then(()=>console.log('Channel created'))
    .catch(error => console.error('Error createChannel', error));  
   
      
this.firebaseX.onTokenRefresh()
.subscribe((token: string) => {
  localStorage.setItem('fcm',token);  
});
}    
      this.platform.backButton.subscribe((): void => {
        console.log("this.router.url===>" + this.router.url);
        
        if (this.router.url == "/login") {
          //navigator["app"].exitApp();
          localStorage.setItem('skip', "null");
          this.exitAlert();
          console.log("login");
          return;
        } else if (this.router.url == "/register") {
          this.navCtrl.navigateBack(["/login"]);
          console.log("register");
          return;
        } 
        else if (this.router.url == "/home") {
          this.navCtrl.navigateBack(["/login"]);
          console.log("home");
          return;
        } 
        else if (this.router.url == "/cart") {
          localStorage.setItem('skip', "null");
          navigator["app"].exitApp();
          console.log("cart");
          return;
        } 
        else if (this.router.url == "/category?") {
          localStorage.setItem('skip', "null");
          navigator["app"].exitApp();
          console.log("tabs/tab1");
          return;
        } 
        else if (this.router.url == "/account") {
          localStorage.setItem('skip', "null");
          navigator["app"].exitApp();
          console.log("account");
          return;
        } 
        else if (this.router.url == "/history") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("history");
          return;
        } 
        else if (this.router.url == "/payments") {
          this.navCtrl.navigateBack(["/login"]);
          console.log("payments");
          return;
        } 
        else if (this.router.url == "/choose-address") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("choose-address");
          return;
        } 
        else if (this.router.url == "/add-new-address") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("add-new-address");
          return;
        } 
        else if (this.router.url == "/coupons") {
          this.navCtrl.navigateBack(["/cart"]);
          console.log("coupons");
          return;
        } 
        else if (this.router.url == "/history-detail") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("history-detail");
          return;
        } 
        else if (this.router.url == "/choose-restaurant") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("choose-restaurant");
          return;
        } 
        else if (this.router.url == "/add-review") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("add-review");
          return;
        } 
        else if (this.router.url == "/edit-profile") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("edit-profile");
          return;
        } 
        else if (this.router.url == "/tracker") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("tracker");
          return;
        } 
        else if (this.router.url == "/inbox") {
          this.navCtrl.navigateBack(["/login"]);
          console.log("inbox");
          return;
        } 
        else if (this.router.url == "/rate") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("rate");
          return;
        } 
        else if (this.router.url == "/forgot") {
          this.navCtrl.navigateBack(["/login"]);
          console.log("forgot");
          return;
        } 
        else if (this.router.url == "/pick-location") {
          this.navCtrl.navigateBack(["/login"]);
          console.log("pick-location");
          return;
        } 

        else if (this.router.url == "/about") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("about");
          return;
        }  else if (this.router.url == "/tabs/tab3/contacts") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("contacts");
          return;
        } 
        else if (this.router.url == "/faqs") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("faqs");
          return;
        } 
        else if (this.router.url == "/help") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("help");
          return;
        } 
        else if (this.router.url == "/chats") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("chats");
          return;
        } 
        else if (this.router.url == "/driver-rating") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("driver-rating");
          return;
        } 
        else if (this.router.url == "/product-rating") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("product-rating");
          return;
        }  else if (this.router.url == "/success") {
          this.navCtrl.navigateBack(["/login"]);
          console.log("success");
          return;
        }  else if (this.router.url == "/editbasicdetails") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("editbasicdetails");
          return;
        }  else if (this.router.url == "/manageaddress?from=account") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("manageaddress");
          return;
        }  else if (this.router.url == "/editaddress") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("editaddress");
          return;
        }  else if (this.router.url == "/helpsupport") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("helpsupport");
          return;
        }  else if (this.router.url == "/orderissue-detail") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("orderissue-detail");
          return;
        }  else if (this.router.url == "/orderissue") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("orderissue");
          return;
        }   else if (this.router.url == "/transaction") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("transaction");
          return;
        }   else if (this.router.url == "/trackeraddress") {
          this.navCtrl.navigateBack(["/tabs/tab3"]);
          console.log("trackeraddress");
          return;
        } else if (this.router.url == "/tabs/tab2") {
          localStorage.setItem('skip', "null");
          navigator["app"].exitApp();
          console.log("tabs/tab2");
          return;
        }  else if (this.router.url == "/tabs/tab3") {
          localStorage.setItem('skip', "null");
          navigator["app"].exitApp();
          console.log("tabs/tab3");
          return;
        } else if (this.router.url == "/tabs/tab1") {
          if(this.modalController!=null){
            console.log("modalController");
            navigator["app"].exitApp();
            this.modalController.dismiss();
          }else{
          localStorage.setItem('skip', "null");
          navigator["app"].exitApp();
          console.log("tabs/tab1");
          }
          return;
        }  
      });

  
    });

  }


  getLocation() {

    this.androidPermissionService.checkLocationEnabled().then(data => {
 
      console.log('ngOnInit androidPermissionService  '+JSON.stringify(data));
 
         this.platform.ready().then(() => {
 
          this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
                 if (resp) {
                  console.log('resp', resp);
                   this.lat = resp.coords.latitude;
                  this.lng = resp.coords.longitude;
                  
                   this.getAddress(this.lat, this.lng);
                }
              }).catch(error => {
                  console.log(error);
              this.askPermission();
               });
 
  
     });
     
    });


  }


  getAddress(lat, lng) {
  
  
    console.log('lat', lat, 'lon', lng);
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    let latlng = {lat, lng};
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log('geocode=====', location);
      console.log(results);
      console.log('status', status);
      if (results && results.length) {
        this.lat = lat;
        this.lng = lng;
        console.log('results=====', lat,"====="+lng);
        console.log('results=====', results[0]);
        localStorage.setItem('location', 'true');
        localStorage.setItem('lat', this.lat);
        this.autocompleteItems=results;

        localStorage.setItem('address', results[0].formatted_address);
        localStorage.setItem('lng', this.lng);
        var address = results[0].address_components;
        var zipcode = address[address.length - 1].long_name;
        console.log('zipcode==='+zipcode);
        localStorage.setItem('zipcode', zipcode);

        var district=address[address.length - 4].long_name;
        //var dist=address[address.length - 3].long_name;
        console.log('district==='+district);
        //console.log('dist==='+dist);
         //var cityNew=address[address.length - 7].long_name;
         //var country=address[address.length - 6].long_name;
         //var city=address[address.length - 5].long_name;
        localStorage.setItem('district', district);
         //console.log('city==='+city);
         //console.log('country==='+country);
         //console.log('cityNew==='+cityNew);
         //console.log('city==='+city);
        this.util.cityAddress = results[0].formatted_address;
        console.log('cityAddress5', this.util.cityAddress);
        this.util.publishLocation();
        //this.navCtrl.navigateRoot(['/home']);
      } else {
        
        this.util.errorToast('Something went wrong please try again later');
      }
    });
   // this.navCtrl.navigateRoot(['/home']);
  }

  askPermission() {
    this.getLocation();
  }

  async exitAlert() {
    const alert = await this.alertCtrl.create({
      header: "Alert",
      message: "Are you sure want to exit the app?",
      buttons: [
        {
          text: "YES",
          handler: (blah) => {
            console.log("EXIT APP");
            navigator["app"].exitApp();
          },
        },
        {
          text: "NO",
          role: "cancel",
        },
      ],
    });

    await alert.present();
  }


  async updateAlert(link) {
    const alert = await this.alertCtrl.create({
      header: "Alert",
      message: "A new version is available. Please download for best experience!!!",
      backdropDismiss: false,
      buttons: [
        
        {
          text: "YES",
          handler: (blah) => {
            window.open(link);
            navigator["app"].exitApp();
            console.log('link==='+link)
          },
        },
        
        // {
        //   text: "NO",
        //   role: "cancel",
        // },
      ],
      
    });
    

    await alert.present();
  }

  logout() {
    if(this.loginType == 'gmail_login'){
      this.googlePlus.logout()
      .then(res => {
        console.log("===gmail_logout==="+res);
        if(localStorage.getItem('uid') != null){
          localStorage.removeItem('uid');
        }
       
        this.cart.clearCart();
        localStorage.removeItem('userCart');
        localStorage.removeItem('deliveryAddress');
        localStorage.removeItem('addressId');
        localStorage.removeItem('addressLat');
    localStorage.removeItem('addressLng');
        this.navCtrl.navigateRoot(['/login']);        
      })
      .catch(err => console.error(err));
  

    }else{
    
      if(localStorage.getItem('uid') != null){
        localStorage.removeItem('uid');
      }
    localStorage.removeItem('userCart');
    this.cart.clearCart();
    localStorage.removeItem('deliveryAddress');
    localStorage.removeItem('addressId');
    localStorage.removeItem('addressLat');
    localStorage.removeItem('addressLng');
    this.navCtrl.navigateRoot(['/login']);
    }

  }
  
}
