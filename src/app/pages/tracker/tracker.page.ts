
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import swal from 'sweetalert2';
import { CartService } from 'src/app/services/cart.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';

declare var google: any;

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;
  myaddress: any[] = [];
  from: any;
  selectedAddress: any;
  distanceval;
  id: any = '';
  networkType;

  dName: any = '';
  distancekm;
  restAddress: any = '';
  dCover: any = '';
  dId: any;
  phone: any = '';
  status: any = '';
  foodCover: any = '';
  totalOrders: any[] = [];
  grandTotal: any;
  payMethod: any;

  myLat: any;
  myLng: any;
  driverLat: any;
  driverLng: any;
  interval: any;
  orderDetails : boolean;
  myOrders: any;
  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private cart: CartService, private iab: InAppBrowser, public network: Network,
    ) { 
    this.orderDetails = true;
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
  callWatsapp() {
    window.open('https://api.whatsapp.com/send?phone=91' + this.phone);
    //this.callNumber.callNumber(this.phone, true);
  }

  callDriver() {
       this.iab.create('tel:' + this.phone, '_system')
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
          this.myLat = data.order_lat;
          this.myLng = data.order_lng;
          console.log("===addrss==="+this.myLat);
          console.log("===addrsslat==="+this.myLng);
        if (data && data.did && data.did !== '0') {
          this.dId = data.did;
         
            this.getDriverInfo();
            
        }
          
        // this.interval1 = setInterval(() => {
         
        //     if (data && data.did && data.did !== '0') {
        //       this.dId = data.did;
        //       this.getDistanceInfo();
        //   }
        // }, 5000);
        
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
    if(this.orderDetails == true){
    this.orderDetails = false;

  }else{
    this.orderDetails = true;
  }
   
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
       
        this.getDistanceInfo();
        this.loadMap(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
        console.log('--1111-->>>>>', parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
      }
    }, error => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    });
  }

  // async distanceCal(lat1,lng1,lat2,lng2){
  //   console.log('distance=11===');
   
  //     const distance = await this.distanceInKmBetweenEarthCoordinates(lat1,lng1,lat2,lng2);
      
  //     this.distanceval=Number((distance).toFixed(1)); // 6.7
  //     console.log('distance====', distance);
  //     console.log('distance==1==', lat1);
  //     console.log('distance==2==', lng1);
  //     console.log('distance==3==', lat2);
  //     console.log('distance===4=', lng2);
    
  // }

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

  getDistanceInfo() {
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
        console.log('--===lat->>',  parseFloat(this.driverLat), parseFloat(this.driverLng));
        //this.distanceCal(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
        this.getDistanceCalculate(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng))
        //this.loadMap(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
        console.log('driver info--lat->>', parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
      }
    }, error => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    });
  }

  changeMarkerPosition(marker, map, directionsService,directionsDisplay,origin1) {   
    const param = {
      id: this.dId
    };
    
    
    this.api.post('drivers/getById', param).then((data: any) => {
      console.log('driver info--->>', data);
      if (data && data.status === 200 && data.data.length) {
        const info = data.data[0];
        this.dName = info.name;
        this.dCover = info.image;
        this.phone = info.contact_no;
        this.driverLat = info.lat;
        this.driverLng = info.lng;
        const destinationA = { lat: this.driverLat, lng: this.driverLng };
        const latlng = new google.maps.LatLng(parseFloat(this.driverLat), parseFloat(this.driverLng));       
        map.setCenter(latlng);
        marker.setPosition(latlng);
        directionsService.route({
          origin: origin1,
          destination: destinationA,
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
        //alert("driver latlng==>"+this.driverLat+"\nlng===>"+this.driverLng)
      }
    }, error => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.util.errorToast('Something went wrong');
    });

  }

  loadMap(latOri, lngOri, latDest, lngDest) {
    const directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay = new google.maps.DirectionsRenderer();
    const bounds = new google.maps.LatLngBounds;
    const origin1 = { lat: parseFloat(latOri), lng: parseFloat(lngOri) };
    const destinationA = { lat: latDest, lng: lngDest };
    const maps = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: latOri, lng: lngOri },
      disableDefaultUI: true,
      zoom: 100
    });
    const custPos = new google.maps.LatLng(latOri, lngOri);
    const restPos = new google.maps.LatLng(latDest, lngDest);
    const marker1 = new google.maps.Marker({
      map: maps,
      position: custPos,
      animation: google.maps.Animation.DROP,
      //title: 'Customer Location!',
      icon: { url : 'assets/homes.png' }
      //icon: logo,
    });
    const marker2 = new google.maps.Marker({
      map: maps,
      position: restPos,
      animation: google.maps.Animation.DROP,
      //title: 'Driver Location!',
      icon: { url : 'assets/bikes.png' }
      //icon: logo,
    });
    marker1.setMap(maps);
    marker2.setMap(maps);
    directionsDisplay.setMap(maps);
    directionsDisplay.setOptions({
      polylineOptions: {
        strokeWeight: 4,
        strokeOpacity: 1,
        strokeColor: '#ff384c'
      },
      suppressMarkers: true
    });
    const geocoder = new google.maps.Geocoder;
    const service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [origin1],
      destinations: [destinationA],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function (response, status) {
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        const showGeocodedAddressOnMap = function (asDestination) {
          return function (results, status) {
            if (status === 'OK') {
              maps.fitBounds(bounds.extend(results[0].geometry.location));
            } else {
              alert('Geocode was not successful due to: ' + status);
            }
          };
        };
        directionsService.route({
          origin: origin1,
          destination: destinationA,
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
        for (let i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;
          geocoder.geocode({ 'address': originList[i] },
            showGeocodedAddressOnMap(false));
          for (let j = 0; j < results.length; j++) {
            geocoder.geocode({ 'address': destinationList[j] },
              showGeocodedAddressOnMap(true));
          }
        }
      }
    });
    this.interval = setInterval(() => {
      this.changeMarkerPosition(marker2, maps,directionsService,directionsDisplay,origin1);
    }, 5000);
  }
  ionViewDidLeave() {
    console.log('leaae');
    clearInterval(this.interval);
  }
}
