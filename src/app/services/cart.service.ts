import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cart: any[] = [];
  public itemId: any[] = [];
  public totalPrice: any = 0;  
  public grandTotal: any = 0;
  public coupon: any;
  public discount: any = 0;
  public orderTax: any = 0;
  public tipsamount: any=0;
  public shipping: any;
  public shippingPrice: any = 0;
  public freeShipping: any = 0;
  public deliveryAddress: any;
  public deliveryPrice: any = 0;
  public distance: any = 0;
  public stores: any[] = [];
  public totalItem: any;
  public cartStoreInfo: any;
  public Tax: any;
  public FinalTotal: any;
  public couponId : any;
  public serviceTaxx : any;
  public package_charge : any;
  public addressId: any;
  public addressLat: any;
  public addressLng: any;
  public addressPincode: any;
  public delivery_charges : any;
  public delivery_charge_GST : any;
  public orderNotes: any;
  public deliAddress: any = '';
  constructor(private storage: Storage,
    public util: UtilService
  ) {
    this.ionViewWillEnter();

    this.util.getCouponObservable().subscribe(data => {
      if (data) {
        this.coupon = data;
        this.coupon.discount = parseFloat(data.discount);
        this.coupon.min = parseFloat(data.min);
        this.calcuate();
      }
    });

    this.util.getKeys('addressId').then((data: any) => {
this.addressId=data;
    });

this.util.getKeys('deliveryAddress').then((data: any) => {
      this.deliveryAddress=data;
    });

    this.util.getKeys('addressLat').then((data: any) => {
      this.addressLat=data;
    });

    this.util.getKeys('addressLng').then((data: any) => {
      this.addressLng=data;
    });
    
    this.util.getKeys('userCart').then((data: any) => {     
      if (data && data !== null && data !== 'null') {
        const userCart = JSON.parse(data);
        if (userCart && userCart.length > 0) {
          this.cart = userCart;
          this.itemId = [...new Set(this.cart.map(item => item.id))];
          this.calcuate();
        } else {
          this.calcuate();
        }
      } else {
        this.calcuate();
      }
    });
  }

  async ionViewWillEnter() {
    await this.storage.create();
  }

  clearCart() {
    this.cart = [];
    this.itemId = [];
    this.totalPrice = 0;
    this.grandTotal = 0;
    this.coupon = undefined;
    this.discount = 0;
    this.tipsamount = 0;
    this.stores = [];
    this.util.clearKeys('cart');
    this.totalItem = 0;

    this.discount= 0;
    this.orderTax = 0;
    this.tipsamount=0;
    this.shipping=0;
    this.shippingPrice=0;
    this.freeShipping=0;
    this.deliveryAddress='';
    this.deliveryPrice=0;
    this.totalItem=0;
    this.Tax=0;
    this.FinalTotal=0;
    this.couponId=0;
    this.serviceTaxx=0;
    this.addressId='';
    this.addressLat='';
    this.addressLng='';
    //this.delivery_charges=0;
    this.orderNotes='';
    localStorage.removeItem('userCart');
    localStorage.removeItem('deliveryAddress');
    localStorage.removeItem('addressId');
    localStorage.removeItem('addressLat');
    localStorage.removeItem('addressLng');
    localStorage.setItem('userCart', JSON.stringify(this.cart));
    localStorage.setItem('deliveryAddress', this.deliveryAddress);
    localStorage.setItem('addressId', this.addressId);
    localStorage.setItem('addressLat', this.addressLat);
    localStorage.setItem('addressLng', this.addressLng);
  }

  addVariations(info, cart, type) {    
    if (type === 'new') {
      this.cart.push(info);
      this.itemId.push(info.id);
    } else if (type === 'sameChoice') {
      const index = this.cart.findIndex(x => x.id === info.id);      
      this.cart[index].selectedItem = info.selectedItem;
    } else if (type === 'newCustom') {
      const index = this.cart.findIndex(x => x.id === info.id);      
      this.cart[index].selectedItem = info.selectedItem;      
      this.cart[index].quantiy = info.quantiy;
    }
    this.calcuate();
  }

 async addItem(item) {
    this.coupon = undefined;   
    if(this.cart.length>0)
    {
    const data=this.cart.filter(x => x.id === item.id)
    if(data==null||data.length==0)
    {
      this.cart.push(item);
    this.itemId.push(item.id);
    await this.calcuate();
    }
    }
    else
    {
    this.cart.push(item);
    this.itemId.push(item.id);
    await this.calcuate();
    }
  }

  async addQuantity(quantity, id) {   
    this.coupon = undefined;    
    this.cart.forEach(element => {
      if (element.id === id) {
        element.quantiy = quantity;
      }
    });
    await this.calcuate();
  }  

  removeItem(id) {    
    this.coupon = undefined;
    this.cart = this.cart.filter(x => x.id !== id);
    this.itemId = this.itemId.filter(x => x !== id);    
    if(this.cart.length==0)
    {
      this.clearCart();
    }
    else
    {
      this.calcuate();
    }
  }

  async calcuate() {  
    const item = this.cart.filter(x => x.quantiy > 0);
    this.cart.forEach(element => {
      if (element.quantiy === 0) {
        element.selectedItem = [];
      }
    });
    this.totalPrice = 0;
    this.totalItem = 0;    
    this.cart = [];
    item.forEach(element => {
      if (element && element.selectedItem && element.selectedItem.length > 0 && element.size === '1'
      ) {
        let subPrice = 0;
        element.selectedItem.forEach(subItems => {
          subItems.item.forEach(realsItems => {
            subPrice = subPrice + (realsItems.value);
          });
          subPrice = subPrice * subItems.total;
          this.totalItem = this.totalItem + subItems.total;
        });
        this.totalPrice = this.totalPrice + subPrice;
      } else if (element && element.selectedItem && element.selectedItem.length > 0 && element.size === '0') {
        let subPrice = 0;
        element.selectedItem.forEach(subItems => {
          subPrice = 0;
          subItems.item.forEach(realsItems => {
            subPrice = subPrice + (realsItems.value);
          });
          subPrice = subPrice * subItems.total;
          this.totalItem = this.totalItem + subItems.total;
          this.totalPrice = this.totalPrice + subPrice;
        });
      } else {
        this.totalItem = this.totalItem + element.quantiy;
        this.totalPrice = this.totalPrice + (element.price * element.quantiy);
        this.totalPrice =parseInt(this.totalPrice);
      }
      this.cart.push(element);
    });    
    localStorage.removeItem('userCart');
    localStorage.removeItem('deliveryAddress');
    localStorage.removeItem('addressId');
    localStorage.removeItem('addressLat');
    localStorage.removeItem('addressLng');
    localStorage.setItem('userCart', JSON.stringify(this.cart));
    localStorage.setItem('deliveryAddress', this.deliveryAddress);
    localStorage.setItem('addressId', this.addressId);
    localStorage.setItem('addressLat', this.addressLat);
    localStorage.setItem('addressLng', this.addressLng);
    this.util.setKeys('userCart', JSON.stringify(this.cart));
    this.totalPrice = parseFloat(this.totalPrice).toFixed(2);    
     const appTax = this.util.general && this.util.general.tax ? parseFloat(this.util.general.tax) : 21;
     const tax = (parseFloat(this.totalPrice) * appTax) / 100;
     this.orderTax = tax.toFixed(2);  
    this.distance;    
    if (this.cart!=null&&this.cart.length>0&&this.cart[0].lat&&this.deliveryAddress) {
      this.distance = await this.distanceInKmBetweenEarthCoordinates(this.addressLat, this.addressLng,
        this.cart[0].lat, this.cart[0].lng);
    } else {      
      this.distance = 0;
    }
    console.log("this.distance=11=cart="+ this.distance)

    if (this.freeShipping > this.totalPrice) {
      if (this.shipping === 'km') {
        const distancePricer = this.distance * this.shippingPrice;
        this.deliveryPrice = Math.floor(distancePricer).toFixed(2);
      } else {
        this.deliveryPrice = this.shippingPrice;
      }
    } else {
      this.deliveryPrice = 0;
    }   
    this.grandTotal = parseFloat(this.totalPrice)+ parseFloat(this.deliveryPrice);    
    this.grandTotal = this.grandTotal.toFixed(2);
    if (this.coupon && this.coupon.promo_code) {
        this.discount = this.coupon.discount;
        this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.deliveryPrice);
        this.grandTotal = this.grandTotal - this.discount;
        this.grandTotal = this.grandTotal.toFixed(2);      
    } else {
      this.coupon = null;
      localStorage.removeItem('coupon');
    }
    if (this.totalItem === 0) {
      const lng = localStorage.getItem('language');
      const selectedCity = localStorage.getItem('selectedCity');
      localStorage.setItem('language', lng);
      localStorage.setItem('selectedCity', selectedCity);
      this.totalItem = 0;
      this.totalPrice = 0;
    }
  }

  checkProductInCart(id) {
    return this.itemId.includes(id);
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  //distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {   
    distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {  
    console.log("lat1===="+lat1);
    console.log("lon1===="+lon1);
    console.log("lat2===="+lat2);
    console.log("lon2===="+lon2); 
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
}