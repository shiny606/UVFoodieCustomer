
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { Platform, ModalController, NavController, AlertController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { orderBy, uniqBy } from 'lodash';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Network } from '@ionic-native/network/ngx';
import { CartService } from "src/app/services/cart.service";
import { ActivatedRoute } from "@angular/router";
import { AndroidPermissionService } from "src/app/android-permission.service";
import { VideopopupPage } from 'src/app/videopopup/videopopup.page';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  autocompleteItems: any = [];
  plt;
  id: any;
  element = {};
  allRest: any[] = [];
  allRestFood: any[] = [];
  allRest1: any[] = [];
  chips: any[] = [];
  showFilter: boolean;
  lat: any;
  lng: any;
  dummyRest: any[] = [];
  dummyRestFood: any[] = [];
  dummyRest1: any[] = [];
  dummy = Array(5);
  haveLocation: boolean;
  profile: any;
  banners: any[] = [];
  categories: any[] = [];
  discover_category: any[] = [];
  dummyRests: any[] = [];
  caetId: any;
  name: any;
  networkType;

  dummyBanners = Array(2);
  // options = {
  //   slidesPerView: 1.2,
  //   pagination: true
  // };

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  home_type;
  cityName: any;
  cityId: any;
  catagoryname;
  public mySelCategory: string;
  public kmValue: string = '5'
  details: any[] = [];
  loaded: boolean;
  unSearchFood: boolean = false;
  SearchFood: boolean = false;
  bannerimage;
  CategoriesList;
  zipcode;
  from;
  highlighted = "";
  searchTxt;
  searchdata;
  videoList= [];
  videoTitle;
  constructor(
    private androidPermissions: AndroidPermissions,public cart: CartService,public androidPermissionService:AndroidPermissionService,
    public geolocation: Geolocation,
    private alertController: AlertController,
    private navCtrl: NavController,
    private diagnostic: Diagnostic,
    private platform: Platform,
    private router: Router,
    public api: ApisService,
    public util: UtilService,private route: ActivatedRoute,
    public modalController: ModalController,
    private chMod: ChangeDetectorRef,
    private iab: InAppBrowser,public network: Network,

  ) {
    this.highlighted = "";
    this.mySelCategory = "";
    this.autocompleteItems = [];
    this.chips = [
      this.util.translate('Near Me'),
      this.util.translate('Chinese'),
      this.util.translate('Indian'),
      this.util.translate('North Indian'),
      this.util.translate('South Indian'),
    ];

    this.details = [
      this.util.translate('5'),
      this.util.translate('10'),
      this.util.translate('15'),
      this.util.translate('20'),
      this.util.translate('25'),
      //  this.util.translate('30'),
      //  this.util.translate('35'),
      //  this.util.translate('40'),
      //  this.util.translate('500'),
      //  this.util.translate('1000'),
     
    ];
    this.haveLocation = false;
    if (this.platform.is('ios')) {
      this.plt = 'ios';
    } else {
      this.plt = 'android';
    }
    //this.getLocation();
     this.util.subscribeLocation().subscribe(data => {
      
      // this.dummyRest = [];
      // this.allRest = [];
      // this.allRest1 = [];
      // this.banners = [];
    //   this.dummyBanners = Array(2);
    //   this.dummy = Array(5);
    //this.getLocation();
       //this.getCategories();
       //this.getPincodeAvail();
      
    });
    // this.zipcode = localStorage.getItem("zipcode");
    //  //this.getCategories();
    //  this.getPincodeAvail();
   
    
  }

  

  selectAvatar(id){
    // if (this.highlighted === "") {
    //   this.highlighted = id;
    // } else {
    //   this.highlighted = "";
    // }
  }
  getBannerList() {
    this.api.get("Restaurant/banner_list").then(
      (data: any) => {
        if (data) {
          this.bannerimage = data.data;
        }
      },
      (error) => {
        console.log(error);

        this.util.errorToast(this.util.translate("Something went wrong1"));
        console.log("Something went wrong1" + error);
      }
    );
  }

  getPincodeAvail(){
    const param = {
      pincode: this.zipcode,
    };
    console.log('avail====='+JSON.stringify(param))
    this.api.post("Restaurant/check_service_pincode_exist", param).then(
      (data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status == 200) {
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



  getMainCategories(){
    
    this.api.get("Restaurant/main_categories_list").then(
      (data: any) => {
        if (data.status == 200) {
          this.loaded = true;
          this.dummy = [];
          this.CategoriesList = data.data;
          console.log("this.CategoriesList==="+JSON.stringify(this.CategoriesList));
        }else if (data.status == 201) {
          this.dummy = [];
          this.loaded = true;
          this.util.errorToast(data.message);
        }
      },
      (error) => {
        console.log(error);
        this.dummy = [];
        this.loaded = true;
        this.util.errorToast(this.util.translate("Something went wrong1"));
        console.log("Something went wrong1" + error);
      }
    );
  }

  async mainCateclick(cateName, id){
    this.mySelCategory = cateName;
    console.log("id=======sss"+id);
       if(id > 0 ) {
       this.highlighted = id;
       id ++ ;
     } 
      else {
        this.highlighted = "";
        id = 0;
      }
    this.loaded = false;
    this.unSearchFood = false;
    this.SearchFood = false;
    this.searchdata='';
    await this.getRestaurantsCate(this.mySelCategory);
    //this.getRestaurantsFood(cateName);
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
    


 
  
      // this.platform.ready().then(() => {
      //   if (this.platform.is('android')) {
      //      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      //        result => console.log('Has permission?', result.hasPermission),
      //        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      //      );
      //     this.grantRequest();
      //   } else if (this.platform.is('ios')) {
      //     this.grantRequest();
      //   } else {
      //     this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
      //       if (resp) {
      //         console.log('resp', resp);
      //         this.lat = resp.coords.latitude;
      //         this.lng = resp.coords.longitude;
      //         this.getAddress(this.lat, this.lng);
      //       }
      //     }).catch(error => {
      //       console.log(error);
      //       this.grantRequest();
      //     });
      //   }
      // });
    }
  
    askPermission() {
      this.getLocation();
    }
  
    grantRequest() {
      this.diagnostic.isLocationEnabled().then((data) => {
        if (data) {
          this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
            if (resp) {
              console.log('resp', resp);
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;
              this.getAddress(resp.coords.latitude, resp.coords.longitude);
            }
          }).catch(error => {
            console.log('ERORROR 1 and open', JSON.stringify(error));
            this.diagnostic.switchToSettings();
          });
        } else {
          this.diagnostic.switchToSettings();
          this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
            if (resp) {
              console.log('ress,', resp);
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;
              this.getAddress(resp.coords.latitude, resp.coords.longitude);
            }
          }).catch(error => {
            console.log('ERORROR 1 and open', JSON.stringify(error));
            this.diagnostic.switchToSettings();
          });
        }
      }, error => {
        console.log('errir ????????????????/', error);
        if (this.platform.is('ios')) {
          this.iOSAlert();
        } else {
          this.presentAlertConfirm();
        }
      }).catch(error => {
        console.log('error ******************', error);
        if (this.platform.is('ios')) {
          this.iOSAlert();
        } else {
          this.presentAlertConfirm();
        }
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

          // var address = results[0].address_components;
          // var zipcode = address[address.length - 1].long_name;
          // console.log('zipcode=home=='+zipcode);
          // localStorage.setItem('zipcode', zipcode);


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
  
    generateAddress(addressObj) {
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if (obj[val].length)
          address += obj[val] + ', ';
      }
      return address.slice(0, -2);
    }
  
    
  
    async iOSAlert() {
      const alert = await this.alertController.create({
        header: 'Alert',
        message: 'Please Enable Location Service for best experience',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
              this.diagnostic.switchToSettings();
            }
          }
        ]
      });
  
      await alert.present();
    }
  
    async presentAlertConfirm() {
      const alert = await this.alertController.create({
        header: 'Alert',
        message: 'Please Enable Location Service for best experience',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
              this.askPermission();
            }
          }
        ]
      });
  
      await alert.present();
    }

    // segmentclic(catagory) {
    //    this.catagoryname = catagory;
    //    this.getRestaurants(this.catagoryname);
    //  }

    async kmChange(value){
      this.highlighted = ""
      console.log("this.mySelCategory==="+this.mySelCategory)
      console.log("this.searchTxt==="+this.searchTxt)
      this.kmValue =value;
      //this.dummyBanners = [];
      this.loaded = false;
      //this.util.show();
      this.unSearchFood = false;
    this.SearchFood = false;
      await this.loadData();
     
      //this.getRestaurantsCate(this.mySelCategory);
      
      //this.getRestaurantsFood(this.mySelCategory);
      
     }


     async loadData(){
      if(this.searchTxt==''|| this.searchTxt=='undefined'|| this.searchTxt==undefined){
        console.log("this.searchTxt=11=="+this.searchTxt)
        if(this.mySelCategory==''){
          console.log("this.searchTxt=22=="+this.searchTxt)
          await this.getRestaurantsCate('');
        }else{
          console.log("this.searchTxt=33=="+this.searchTxt)
          await this.getRestaurantsCate(this.mySelCategory);
        }
      }else{
        console.log("this.searchTxt=44=="+this.searchTxt)
        await this.getRestaurantsFood(this.searchTxt);
      }
     }

    //  getCategories() {
    //   this.networkType = this.network.type;
    //   if(this.networkType=='none'){
    //    this.api.connectionAlert();
    //   }else{
     
    //   this.api.get('Restaurant/discover_categories_list').then((data: any) => {
       
    //     console.log(data);
    //     if (data && data.status == 200) {
    //       if(data.data.length>0)
    //       {
    //         const obj = { id:0, discover_category:'Near Me' };
    //         this.discover_category.push(obj);
    //         //this.dummyRests.push(obj);
    //         for (var i = 0; i < data.data.length; i++) {
    //           this.discover_category.push(data.data[i]);
    //           //this.dummyRests.push(data.data[i]);
    //       }

    //          // this.mySelCategory = 'Near Me';
    //           this.mySelCategory = this.discover_category[0].discover_category;
    //           //this.dummyRests = this.discover_category[0].discover_category;
    //           this.getRestaurants(this.discover_category[0].discover_category);
    //           console.log("discover_category===="+JSON.stringify(data.data));
    //       }          
    //     } else {
    //       this.util.errorToast(this.util.translate('Something went wrong'));
    //     }
    //   }, error => {
    //     console.log(error);
       
    //   }).catch(error => {
    //     console.log(error);
     
    //   });
    // }
    // }

  // getRestaurants(categorys) {
  //   this.networkType = this.network.type;
  //   if(this.networkType=='none'){
  //    this.api.connectionAlert();
  //   }else{
  //   const param = {
  //     discovertype:categorys,
  //     lat: localStorage.getItem('lat'),
  //     lng: localStorage.getItem('lng'),
  //     distance: this.kmValue,
  //     type: 1
  //   };
  //   //this.dummyBanners = [];
  //   this.loaded = false;
  //  //this.util.show();
  //   this.api.post('Restaurant/get_nearMe_store', param).then((data: any) => {
  //     this.loaded = true;
  //     this.dummyBanners = [];
  //     this.dummy = [];
  //     //this.util.hide();
  //     console.log(data);
  //     if (data && data.status == 200) {
  //       this.allRest = [];
  //       this.dummyRest = [];
       
       
  //       data.data = data.data.filter(x => x.status === '1');
  //       //this.dummyRest1 = data.store_types;
       
  //       this.id = data.id;
  //       //this.allRest = data.data;
       
  //       data.data.forEach(async (element) => {
          
  //         element.rating = parseFloat(element.rating);
  //         element.time = parseInt(element.time);
  //         element.total_dish_count = parseInt(element.total_dish_count);
  //         element.store_types = element.store_types;
          
  //         //this.allRest.push(element);
  //         //element.cover = element.cover;
  //         element['isOpen'] = this.isOpen(element.open_time, element.close_time);
  //         if (element.cusine && element.cusine !== '') {
  //         }
  //         this.allRest.push(element);
  //         this.dummyRest.push(element);
  //       });
  //       const info = [...new Set(this.allRest.map(item => item.id))];
  //       this.getBanners(info);
      
  //       this.chMod.detectChanges();
  //     } else {
       
  //       this.allRest = [];
  //       this.dummy = [];
  //     }
  //   }, error => {
  //     console.log(error);
  //     this.dummyRest = [];
  //     this.dummyBanners = [];
  //   }).catch(error => {
  //     console.log(error);
  //     this.dummyRest = [];
  //     this.dummyBanners = [];
  //   });
  //   //this.util.hide();
  // }
  // }

  getVideoList() {
    this.api.get("Restaurant/get_youtube_videos").then(
      (data: any) => {
        if (data.status=='200') {
         
          this.videoList = data.data;
          this.videoTitle =  this.videoList[0].title
        
        }
        
      },
      (error) => {
        console.log(error);
        
        this.util.errorToast(this.util.translate("Something went wrong1"));
        console.log("Something went wrong1" + error);
      }
    );
  }

  async getRestaurantsCate(categorys) {
   
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    const param = {
      category:categorys,
      lat: localStorage.getItem('lat'),
      lng: localStorage.getItem('lng'),
      distance: this.kmValue,
      type: 1
    };
    //this.dummyBanners = [];
    this.loaded = false;
   //this.util.show();
    this.api.post('Restaurant/get_nearMe_store_categories', param).then((data: any) => {
      this.loaded = true;
      this.dummyBanners = [];
      this.dummy = [];
      //this.util.hide();
      console.log(data);
      if (data && data.status == 200) {
        this.allRest = [];
        this.dummyRest = [];
        this.unSearchFood = false;
    this.SearchFood = true;
       
        data.data = data.data.filter(x => x.status === '1');
        //this.dummyRest1 = data.store_types;
       
        this.id = data.id;
        //this.allRest = data.data;
       
        data.data.forEach(async (element) => {
          
          element.rating = parseFloat(element.rating);
          element.time = parseInt(element.time);
          element.total_dish_count = parseInt(element.total_dish_count);
          element.store_types = element.store_types;
          
          //this.allRest.push(element);
          //element.cover = element.cover;
          element['isOpen'] = this.isOpen(element.open_time, element.close_time);
          if (element.cusine && element.cusine !== '') {
          }
          this.allRest.push(element);
          this.dummyRest.push(element);
        });
        const info = [...new Set(this.allRest.map(item => item.id))];
        this.getBanners(info);
      
        this.chMod.detectChanges();
      } else {
       
        this.allRest = [];
        this.dummy = [];
      }
    }, error => {
      console.log(error);
      this.dummyRest = [];
      this.dummyBanners = [];
    }).catch(error => {
      console.log(error);
      this.dummyRest = [];
      this.dummyBanners = [];
    });
    //this.util.hide();
  }
  }

  async getRestaurantsFood(categorys) {
   
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    const param = {
      search:categorys,
      lat: localStorage.getItem('lat'),
      lng: localStorage.getItem('lng'),
      distance: this.kmValue,
      type: 1
    };
    //this.dummyBanners = [];
    this.loaded = false;
   //this.util.show();
    this.api.post('Restaurant/get_nearMe_store_food', param).then((data: any) => {
      this.loaded = true;
      this.dummyBanners = [];
      this.dummy = [];
      //this.util.hide();
      console.log(data);
      if (data && data.status == 200) {
        this.allRest = [];
        this.dummyRest = [];
        this.unSearchFood = true;
    this.SearchFood = false;
       
        data.data = data.data.filter(x => x.status === '1');
        //this.dummyRest1 = data.store_types;
       
        this.id = data.id;
        //this.allRest = data.data;
       
        data.data.forEach(async (element) => {
          
          element.rating = parseFloat(element.rating);
          element.time = parseInt(element.time);
          element.total_dish_count = parseInt(element.total_dish_count);
          element.store_types = element.store_types;
          
          //this.allRest.push(element);
          //element.cover = element.cover;
          element['isOpen'] = this.isOpen(element.open_time, element.close_time);
          if (element.cusine && element.cusine !== '') {
          }
          this.allRest.push(element);
          this.dummyRest.push(element);
        });
        const info = [...new Set(this.allRest.map(item => item.id))];
        this.getBanners(info);
      
        this.chMod.detectChanges();
      } else {
       
        this.allRest = [];
        this.dummy = [];
      }
    }, error => {
      console.log(error);
      this.dummyRest = [];
      this.dummyBanners = [];
    }).catch(error => {
      console.log(error);
      this.dummyRest = [];
      this.dummyBanners = [];
    });
    //this.util.hide();
  }
  }

  getBanners(ids) {
    this.api.get('banners').then((data: any) => {
      this.dummyBanners = [];
      this.banners = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.dummyBanners = [];
        this.banners = [];
        data.data.forEach(element => {
        
          if (element.type === '0' && ids.includes(element.value)) {
          
            this.banners.push(element);
          } else if (element.type === '1') {
            this.banners.push(element);
          }
        });
      }
    }).catch((error: any) => {
     
      console.log('error=>', error);
    });
  }


  getCates(id) {
   
    const param = {
      id: id
    };
   
    this.api.post('categories/getByRestId', param).then((data: any) => {
     
      if (data && data.status == 200 ) {
        const datas = data.data[0];
        if (data) {
          this.name = data.name;
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  isOpen(open, close) {
    const format = 'HH:mm:ss';
    const currentTime = moment().format(format);
    const time = moment(currentTime, format);
    const beforeTime = moment(open, format);
    const afterTime = moment(close, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false;
  }

  // addFilter(index) {
  //   console.log(index);
  //   if (index === 0) {
  //     console.log('rating');
  //     this.allRest = orderBy(this.allRest, 'rating', 'desc');
  //   } else if (index === 1) {
  //     console.log('fast');
  //     this.allRest = orderBy(this.allRest, 'time', 'asc');
  //   } else if (index === 2) {
  //     console.log('cost');
  //     this.allRest = orderBy(this.allRest, 'dish', 'asc');
  //   } else if (index === 3) {
  //     console.log('A-Z');
  //     this.allRest = orderBy(this.allRest, 'name', 'asc');
  //   } else if (index === 4) {
  //     console.log('Z-A');
  //     this.allRest = orderBy(this.allRest, 'name', 'desc');
  //   }
  // }

  ngOnInit() {
   
    //this.getRestaurants(this.discover_category[0].discover_category);
  }
   ionViewWillEnter() {     
 
  this.route.queryParams.subscribe((params) => {
    this.from = params["from"];
    if (this.from == "picklocation") {
      this.util.cityAddress = params["picklocation"];
      this.cart.calcuate();
      this.highlighted = "";
      this.zipcode = localStorage.getItem("zipcode");
       
       this.unSearchFood = false;
       this.SearchFood = false;
     this.getVideoList();
       this.getBannerList();
       this.getPincodeAvail();
       this.getMainCategories();
       this.mySelCategory = "";
      
       this.getRestaurantsCate("");
      console.log('init==11==');
     
    } else {
      this.getLocation();
      this.highlighted = "";
      this.zipcode = localStorage.getItem("zipcode");
       
       this.unSearchFood = false;
       this.SearchFood = false;
       this.getVideoList();
       this.getBannerList();
       this.getPincodeAvail();
       this.getMainCategories();
       this.mySelCategory = "";
      
       this.getRestaurantsCate("");
      console.log('init==22==');
    }
  });

  
 
 
   }

   async videopopup(){
    const modal = await this.modalController.create({
      // component: ScanuploadimgPage,
      component: VideopopupPage,
      cssClass: 'change-address-shipping-modal',
      backdropDismiss:false,
    });
    modal.onWillDismiss().then(() => {
      // this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
      // this.animateCSS('bounceInLeft');
    });
    modal.present();
    
   }


  async presentModal() {
    await this.navCtrl.navigateRoot(['choose-address']);
  }

  openMenu(item) {
    console.log(item);
    if (item.isClosed === '0') {
      this.util.showToast(this.util.translate('Currently unavailable'), 'danger', 'bottom');
      return false;
    }
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        clickdata:JSON.stringify(item)
      }
    };
    this.navCtrl.navigateRoot(['category'], navData);
  }

  openOffers(item) {
    if (item.type === '0') {
      const navData: NavigationExtras = {
        queryParams: {
          id: item.value
        }
      };
      this.navCtrl.navigateRoot(['category'], navData);
    } else {
      this.iab.create(item.value);
    }

  }

  onSearchChange(event) {
    console.log(event.detail.value);
    if (event.detail.value && event.detail.value !== '') {
      this.allRest = this.dummyRest.filter((ele: any) => {
        return ele.name.toLowerCase().includes(event.detail.value.toLowerCase());
      });
    } else {
      this.allRest = this.dummyRest;
    }
  }


  async onSearchChangeFood(event) {
    this.highlighted = ""
    console.log(event.detail.value);
    this.searchTxt = event.detail.value;
    this.unSearchFood = false;
    this.SearchFood = false;
    // if (event.detail.value && event.detail.value !== '') {
    //   this.unSearchFood = true;
    //   this.SearchFood = false;
    //   this.getRestaurantsFood(event.detail.value);
    // } else {
    //   this.unSearchFood = false;
    //   this.SearchFood = true;
    //   this.getRestaurantsCate(this.mySelCategory);
    // }


    await this.loadData();
  }


  // onSearchChangeCategory(event){
  //   console.log(event.detail.value);
  //   if (event.detail.value && event.detail.value !== '') {
  //     this.discover_category = this.dummyRests.filter((ele: any) => {
  //       return ele.discover_category.toLowerCase().includes(event.detail.value.toLowerCase());
  //     });
  //   } else {
  //     this.discover_category = this.dummyRests;
  //   }
  // }

  chipChange(item) {
    this.allRest = this.dummyRest;
    console.log(item);
    if (item === 'Fastest Delivery') {
      this.allRest.sort((a, b) => {
        a = new Date(a.time);
        b = new Date(b.time);
        return a > b ? -1 : a < b ? 1 : 0;
      });
    }

    if (item === 'Ratting 4.0+') {
      this.allRest = [];

      this.dummyRest.forEach(ele => {
        if (ele.ratting >= 4) {
          this.allRest.push(ele);
        }
      });
    }

    if (item === 'Cost') {
      this.allRest.sort((a, b) => {
        a = a.time;
        b = b.time;
        return a > b ? -1 : a < b ? 1 : 0;
      });
    }

  }

  // changeLocation() {
  //   this.router.navigate(['pick-location']);
  // }

  // pickLocation(){
  //   this.router.navigate(['pick-location']);
  // }

  locationChange(){
    //this.navCtrl.navigateRoot(['pick-location']);
    this.router.navigate(['pick-location']);
  }

}
