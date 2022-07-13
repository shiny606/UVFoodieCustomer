
import { ChangeDetectorRef,Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute,NavigationExtras } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import swal from 'sweetalert2';
import { CartService } from 'src/app/services/cart.service';
declare var google: any;

@Component({
  selector: 'app-trackeraddress',
  templateUrl: './trackeraddress.page.html',
  styleUrls: ['./trackeraddress.page.scss'],
})
export class TrackerAddressPage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;
  autocomplete1: { 'query': string };
  autocompleteItems1: any = [];
  GoogleAutocomplete;
  myaddress: any[] = [];
  from: any;
  selectedAddress: any;
  geocoder: any;
  id: any = '';
  previousMarker: any;
  dName: any = '';
  restAddress: any = '';
  dCover: any = '';
  dId: any;
  phone: any = '';
  status: any = '';
  foodCover: any = '';
  totalOrders: any[] = [];
  grandTotal: any;
  payMethod: any;
  lat: any;
  lng: any;
  myLat: any;
  myLng: any;
  driverLat: any;
  driverLng: any;
  interval: any;
  orderDetails : boolean;
  myOrders: any;
  distanceval;
  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private cart: CartService,
    private chMod: ChangeDetectorRef,
  ) { 
    this.orderDetails = false;
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete1 = { query: '' };
    this.autocompleteItems1 = [];
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
    this.api.post('orders/getById', param).then((datas: any) => {
      console.log(datas);
      if (datas && datas.status === 200 && datas.data.length) {
        const data = datas.data[0];
        this.totalOrders = JSON.parse(data.orders);
        this.grandTotal = data.grand_total;
        this.status = data.status;
        this.foodCover = data.str_cover;
        this.restAddress = data.str_address;
        this.myOrders = this.totalOrders[0].name;
        this.payMethod = data.pay_method === 'cod' ? 'COD' : 'PAID';
        this.myLat =data.order_lat;
        this.myLng = data.order_lng;
       this.loadMap1(this.myLat, this.myLng);
        //if (data && data.address) {
          //const add = JSON.parse(data.address);
          //console.log("===addrss==="+this.myaddress);
          //console.log("===addrsslat==="+this.myaddress+"===lng==="+this.myaddress);
          
          //  this.myLat = add.lat;
          //  this.myLng = add.lng;
           
          
        //}
        
       
        this.interval = setInterval(() => {
          if (data && data.did && data.did !== '0') {
            this.dId = data.did;
            this.getDriverInfo();
          }
        }, 1000);
      

      } else {
        this.util.back();
      }
    }, error => {
      console.log('error in orders', error);
      this.util.errorToast('Something went wrong');
    }).catch(error => {
      console.log('error in order', error);
      this.util.errorToast('Something went wrong');
    });

  }

  loadMap1(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    const latLng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
      center: latLng,
      zoom: 15,
      scaleControl: true,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      disableDoubleClickZoom: false,
      styles: [],
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.previousMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      animation: google.maps.Animation.DROP,
      //icon: { url : 'assets/android-bicycle.svg'},
      //title: 'Customer Location!',
      // text: {
      //   content: 'Customer Location!',
      //   color: '#DD0000',
      //   size: '24px',
      //   weight: '700',
      //   position: [latLng]
      // }
    
      
    });
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2);
    const earthRadiusKm = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }
  viewDetails(){
    const navData: NavigationExtras = {
      queryParams: {
        id: this.id
      }
    };
    this.navCtrl.navigateForward(['/tracker'], navData);
    
  }
 
  back() {
    this.navCtrl.navigateBack('history');
  }
 
  getDriverInfo() {
    const param = {
      id: this.dId
    };
    this.api.post('drivers/getById', param).then((data: any) => {
      console.log('driver info--->>', data);
      if (data && data.status === 200 && data.data.length) {
        const info = data.data[0];
        console.log('---->>>>>', info);
        this.dName = info.name;
        this.dCover = info.image;
        this.phone = info.contact_no;
        this.driverLat = info.lat;
        this.driverLng = info.lng;
        //this.distanceCal(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
       this.getDistanceCalculate(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
      }
    }, error => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    });
  }

  async distanceCal(lat1,lng1,lat2,lng2){
    console.log('distance=11===');
   
      const distance = await this.distanceInKmBetweenEarthCoordinates(lat1,lng1,lat2,lng2);
      
      this.distanceval=Number((distance).toFixed(1)); // 6.7
      console.log('distance====', distance);
      console.log('distance==1==', lat1);
      console.log('distance==2==', lng1);
      console.log('distance==3==', lat2);
      console.log('distance===4=', lng2);
      //const permittedDistance = parseInt(this.util.general.allowDistance);
    //   console.log('--', permittedDistance);
    //   if (distance <= permittedDistance) {
    //     console.log('distance is ok... you can order now');
       
    //     this.cart.calcuate();
      
    // }
  }

  getDistanceCalculate(lat1,lng1,lat2,lng2) {
    const param = {
      
      origins:lat1 +"," + lng1,
      distinations:lat2 +"," + lng2,
    };
    this.api.post('Restaurant/get_order_delivery_time', param).then((data: any) => {
      console.log('distance info--->>', data);
      if (data && data.status == 200) {
        const info = data;
        console.log('---->>>>>', info);
        //this.distancekm = info.duration;
        this.distanceval= info.duration;
        //this.distanceCal(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
        //this.loadMap(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
        //console.log('driver info--lat->>', parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
      }
    }, error => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    });
  }


  ionViewDidLeave() {
    console.log('leaae');
    clearInterval(this.interval);
  }
}
