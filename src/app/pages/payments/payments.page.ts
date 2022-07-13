import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { ApisService } from "src/app/services/apis.service";
import { UtilService } from "src/app/services/util.service";
import * as moment from "moment";
import {
  NavController,
  AlertController,
  PopoverController,
  IonContent,
  ModalController,
} from "@ionic/angular";
import { environment } from "src/environments/environment";
import { CartService } from "src/app/services/cart.service";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
import { SuccessPage } from "../success/success.page";
import { Network } from "@ionic-native/network/ngx";

declare var RazorpayCheckout: any;
@Component({
  selector: "app-payments",
  templateUrl: "./payments.page.html",
  styleUrls: ["./payments.page.scss"],
})
export class PaymentsPage implements OnInit {
  cards: any[] = [];
  token: any;
  paykey: any;

  //storeFCM: any;
  dummy: any[] = [];

  havePayment: boolean;
  haveStripe: boolean;
  havePayPal: boolean;
  haveCOD: boolean;
  havePayTM: boolean;
  haveInstamojo: boolean;
  havepayStack: boolean;
  haveflutterwave: boolean;
  hideCOD : boolean = true;
  hideRAZOR : boolean= true;
  instamojo = {
    key: "",
    token: "",
    code: "",
  };
  instaENV: any;
  paystack = {
    pk: "",
    sk: "",
    code: "",
  };
  flutterwave = {
    pk: "",
    code: "",
  };
  haveRazor: boolean;
  razorKey: any;

  storeFCM: any;

  paymentAmount: number = 100;
  currency: any = "INR";
  currencyIcon: any = "₹";
  //razor_key = "rzp_test_dBQG5Zaw88ufFo";
  //razor_key = 'rzp_test_3mIQwXUK3QWxON';
  razor_key = "rzp_live_7f0UzlkRoNM3ui";
  AmountValue: any;
  networkType;
  isLoading;
  quarter: any;
  year: any;
  planid: any;
  user_id: any;
  InvestId: any;
  id: any;
  orderID: any;
  available;
  reorderPage;
  district;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    public cart: CartService,
    private iab: InAppBrowser,
    public alertCtrl: AlertController,
    public network: Network
  ) {
    this.id = localStorage.getItem("uid");
    console.log("uid==11===" + localStorage.getItem("uid"));
    console.log("uid===22==" + this.cart.cartStoreInfo.id);
    console.log("FinalTotal===22==" + this.cart.FinalTotal);
    //this.getPayments();
    this.getDetails();
  }

  ngOnInit() {
    this.getDetails();
    this.district = localStorage.getItem("district")
    //this.reorderPage = localStorage.getItem('reorderPage')
  }
  back() {
    this.navCtrl.navigateRoot(["tabs"]);
  }

  getDetails() {
    this.api.get("Restaurant/COD_status").then(
      (data: any) => {
        if (data) {
          this.available = data.COD_enabled;
        }
      },
      (error) => {
        console.log(error);

        this.util.errorToast(this.util.translate("Something went wrong1"));
        console.log("Something went wrong1" + error);
      }
    );
  }

  getPayments() {
    this.util.show();
    this.api.get("payments").then(
      (data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status === 200 && data.data) {
          const info = data.data.filter((x) => x.status === "1");
          console.log("total payments", info);
          if (info && info.length > 0) {
            console.log("---->>", info);
            this.havePayment = true;
            const stripe = info.filter((x) => x.id === "1");
            this.haveStripe = stripe && stripe.length > 0 ? true : false;
            const cod = info.filter((x) => x.id === "2");
            this.haveCOD = cod && cod.length > 0 ? true : false;
            const payPal = info.filter((x) => x.id === "3");
            this.havePayPal = payPal && payPal.length > 0 ? true : false;
            const razor = info.filter((x) => x.id === "4");
            this.haveRazor = razor && razor.length > 0 ? true : false;
            const paytm = info.filter((x) => x.id === "5");
            this.havePayTM = paytm && paytm.length > 0 ? true : false;
            const insta = info.filter((x) => x.id === "6");
            this.haveInstamojo = insta && insta.length > 0 ? true : false;
            const paystack = info.filter((x) => x.id === "7");
            this.havepayStack = paystack && paystack.length > 0 ? true : false;
            const flutterwave = info.filter((x) => x.id === "8");
            this.haveflutterwave =
              flutterwave && flutterwave.length > 0 ? true : false;
            if (this.haveStripe) {
              // this.util.stripe = stripe;
              if (stripe) {
                const creds = JSON.parse(stripe[0].creds);
                if (stripe[0].env === "1") {
                  this.util.stripe = creds.live;
                } else {
                  this.util.stripe = creds.test;
                }
                this.util.stripeCode = creds && creds.code ? creds.code : "USD";
              }
              console.log("============>>", this.util.stripe);
            }
            if (this.haveInstamojo) {
              const datas = info.filter((x) => x.id === "6");
              this.instaENV = datas[0].env;
              if (insta) {
                const instaPay = JSON.parse(datas[0].creds);
                this.instamojo = instaPay;
                console.log("instaMOJO", this.instamojo);
              }
            }
            // if (this.haveRazor) {
            //   const razorPay = info.filter(x => x.id === '4');
            //   const env = razorPay[0].env;
            //   if (razorPay) {
            //     const keys = JSON.parse(razorPay[0].creds);
            //     console.log('evnof razor pay', env);
            //     this.razorKey = env === 'rzp_test_dBQG5Zaw88ufFo' ? keys.test : keys.live;
            //     console.log('----------', this.razorKey);
            //   }
            // }
            if (this.havepayStack) {
              const keys = JSON.parse(paystack[0].creds);
              this.paystack = keys;
              console.log("paystack variables", this.paystack);
            }

            if (this.haveflutterwave) {
              const keys = JSON.parse(flutterwave[0].creds);
              this.flutterwave = keys;
              console.log("flutterwave config", this.flutterwave);
            }
          } else {
            this.havePayment = false;
            this.util.showToast(
              this.util.translate("No Payment Found"),
              "danger",
              "bottom"
            );
          }
        } else {
          this.havePayment = false;
          this.util.showToast(
            this.util.translate("No Payment Found"),
            "danger",
            "bottom"
          );
        }
      },
      (error) => {
        console.log(error);
        this.util.hide();
        this.havePayment = false;
        this.util.showToast(
          this.util.translate("Something went wrong"),
          "danger",
          "bottom"
        );
      }
    );
  }

  openStripe() {
    this.navCtrl.navigateRoot(["stripe-payments"]);
  }

  async makeOrder(method, paymentid) {
    this.networkType = this.network.type;
    if (this.networkType == "none") {
      this.api.connectionAlert();
    } else {
      const param = {
        address: this.cart.deliveryAddress,
        applied_coupon:
          this.cart.coupon && this.cart.coupon.discount_amount ? 1 : 0,
        coupon_id: this.cart.couponId,
        pay_method: method,
        did: "",
        delivery_charge: this.cart.delivery_charges,
        discount: this.cart.discount,
        grand_total: this.cart.FinalTotal,
        orders: JSON.stringify(this.cart.cart),
        paid: "completed",
        restId: this.cart.cartStoreInfo.id,
        serviceTax: this.cart.serviceTaxx,
        status: "created",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        total: this.cart.totalPrice,
        uid: localStorage.getItem("uid"),
        notes: this.cart.orderNotes,
        driver_tips: this.cart.tipsamount,
        address_id: this.cart.addressId,
        lat: this.cart.addressLat,
        lng: this.cart.addressLng,
        delivery_charge_GST: this.cart.delivery_charge_GST,
        package_charge: this.cart.package_charge,
        del_city:this.district
      };

      console.log("paramss--orders--->", JSON.stringify(param));
      //alert("paramss--orders--->"+JSON.stringify(param))
      this.api.post("orders/save", param).then(
        (data: any) => {
          if (data && data.status == 200) {
            console.log(data.data.id);
            //this.util.errorToast("orderID===="+data.data.id);
            this.orderID = data.data.id;
            this.util.hide();
          
            //const orderIds = this.util.makeid(20);
            console.log("payment=====");
            const param = {
              order_id: this.orderID,
              user_id: localStorage.getItem("uid"),
              amount: this.cart.FinalTotal,
              payment_id: paymentid,
              razorpay_paisa_total: parseInt(this.cart.FinalTotal) * 100,
            };
            //alert("pay===="+JSON.stringify(param))
            console.log("payment param=======", param);
            //this.util.errorToast(this.orderID);
            this.api.post("Payment/order_payment", param).then(
              (data: any) => {
                this.util.hide();
                console.log(data);
               // alert("capture===="+data.status)
                //if (data && data.status == 200) {
                  console.log("payment success=======", data.data);
                  this.util.hide();
                  this.cart.orderNotes = "";
                  this.util.publishNewOrder();
                  this.cart.clearCart();
                  this.cart.calcuate();
                  this.navCtrl.navigateRoot(["success"]);
                // } else {
                //   this.util.errorToast(data.data.message);
                // }
              },
              (error) => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(
                  this.util.translate("Something went wrong")
                );
              }
            );
          } else {
            this.util.showToast(
              this.util.translate(data.data.message),
              "danger",
              "bottom"
            );
          }

          //this.navCtrl.navigateRoot(['success']);
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
  }

  proceed() {
    console.log('this.razor_key===='+this.cart.FinalTotal)
    console.log('this.cart.delivery_charges===='+this.cart.delivery_charges)
    if (
      this.cart.deliveryAddress == null ||
      this.cart.deliveryAddress == "" ||
      this.cart.deliveryAddress == "NaN" ||
      this.cart.deliveryAddress == "undefined" ||
      this.cart.deliveryAddress == undefined
    ) {
      this.util.errorToast(this.util.translate("Please select one address"));
      return false;
    } else {
      this.networkType = this.network.type;
      if (this.networkType == "none") {
        this.api.connectionAlert();
      } else {
        var options = {
          description: "Credits towards consultation",
          image: "https://szwebprofile.com/foodie/foodie_api/uploads/icon2.png",
          currency: this.currency, // your 3 letter currency code
          key: this.razor_key, // your Key Id from Razorpay dashboard
          amount: this.cart.FinalTotal ? this.cart.FinalTotal * 100 : 5, // Payment amount in smallest denomiation e.g. cents for USD
          name: "UVFoodie",
          email: this.getEmail(),
          prefill: {
            email: "",
            contact: "",
            name: "",
            method: "",
          },
          send_sms_hash: true,
          retry: {
            enabled: true,
            max_count: 4,
          },
          theme: {
            color: "#F97012",
            backdrop_color: "#F97012",
            hide_topbar: true,
          },
          modal: {
            ondismiss: () => {
              console.log("ondismiss======");
              this.FailureAlert();
            },
            escape: () => {
              console.log("escape======");
              this.FailureAlert();
            },
            backdropclose: () => {
              console.log("backdropclose======");
              this.FailureAlert();
            },
            handleback: () => {
              console.log("handleback======");
              this.FailureAlert();
            },
            confirm_close: () => {
              console.log("confirm_close======");
              this.FailureAlert();
            },
            insufficient_funds: () => {
              console.log("insufficient_funds======");
              this.FailureAlert();
            },
            mobile_number_invalid: () => {
              console.log("mobile_number_invalid======");
              this.FailureAlert();
            },
            payment_failed: () => {
              console.log("payment_failed======");
              this.FailureAlert();
            },
            capture_failed: () => {
              console.log("capture_failed======");
              this.FailureAlert();
            },
          },
        };

        var successCallback = (payment_id) => {
          // alert('payment_id: ' + payment_id);
          console.log("payment_id======" + payment_id);
          this.makeOrder("razorpay", payment_id);
        };

        var cancelCallback = (error) => {
          //alert(error.description + ' (Error ' + error.code + ')');
          console.log(
            "payment_error======" +
              error.description +
              " (Error " +
              error.code +
              ")"
          );
          this.FailureAlert();
        };

        RazorpayCheckout.open(options, successCallback, cancelCallback);
      }
    }
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email
      ? this.util.userInfo.email
      : "info@groceryee.com";
  }

  async restaurantAvailability(method) {
    this.hideCOD= false;
          this.hideRAZOR= false;
    const param = {
      restId: this.cart.cartStoreInfo.id,
    };
    this.api.post("Restaurant/check_res_active", param).then(
      (data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status == 200) {
         
          this.util.hide();
          if (method == "cod") {
            this.createOrder();
          } else if (method == "razor") {
            this.proceed();
          }
        } else if (data && data.status == 201) {
          this.hideCOD= true;
      this.hideRAZOR= true;
          this.util.errorToast(data.message);
        }
      },
      
      (error) => {
        console.log(error);
        this.util.hide();
        this.hideCOD= true;
      this.hideRAZOR= true;
        this.util.showToast(
          this.util.translate("Something went wrong"),
          "danger",
          "bottom"
        );
      }
    );
  }

  async createOrder() {
    if (
      this.cart.deliveryAddress == null ||
      this.cart.deliveryAddress == "" ||
      this.cart.deliveryAddress == "NaN" ||
      this.cart.deliveryAddress == "undefined" ||
      this.cart.deliveryAddress == undefined
    ) {
      this.util.errorToast(this.util.translate("Please select one address"));
      return false;
    } else {
      if(this.cart.FinalTotal == 'NaN' || this.cart.FinalTotal == '₹'|| this.cart.FinalTotal == ''
      || this.cart.FinalTotal == '0'){
        this.util.errorToast(this.util.translate("Please check your amount"));
        return false;
      }else{
      console.log("this.cart.FinalTotal ===" + this.cart.FinalTotal);
      this.networkType = this.network.type;
      if (this.networkType == "none") {
        this.api.connectionAlert();
      } else {
        const param = {
          address: this.cart.deliveryAddress,
          applied_coupon: this.cart.coupon && this.cart.coupon.discount ? 1 : 0,
          coupon_id: this.cart.couponId,
          pay_method: "cod",
          did: "",
          delivery_charge: this.cart.delivery_charges,
          discount: this.cart.discount,
          grand_total: this.cart.FinalTotal,
          orders: JSON.stringify(this.cart.cart),
          paid: "none",
          restId: this.cart.cartStoreInfo.id,
          serviceTax: this.cart.serviceTaxx,
          status: "created",
          time: moment().format("YYYY-MM-DD HH:mm:ss"),
          total: this.cart.totalPrice,
          uid: localStorage.getItem("uid"),
          notes: this.cart.orderNotes,
          driver_tips: this.cart.tipsamount,
          address_id: this.cart.addressId,
          lat: this.cart.addressLat,
          lng: this.cart.addressLng,
          delivery_charge_GST: this.cart.delivery_charge_GST,
          package_charge: this.cart.package_charge,
          del_city:this.district
        };

        console.log("Codparam=====" + JSON.stringify(param));
        this.util.show();
        this.api.post("orders/save", param).then(
          (data: any) => {
            console.log(data);
            if (data && data.status == 200) {
            this.util.hide();
            this.cart.orderNotes = "";
            // this.api.sendNotification(
            //   "You have received new order",
            //   "New Order Received",
            //   this.storeFCM
            // );
            console.log("ordersCod=====" + JSON.stringify(data));
            this.util.publishNewOrder();
            this.cart.clearCart();
            this.cart.calcuate();
            this.openSuccess();
            }else if(data && data.status == 500){
              this.hideCOD= true;
          this.hideRAZOR= true;
              this.util.hide();
              this.util.showToast(
                this.util.translate(data.message),
                "danger",
                "bottom"
              );
            }
          },
          (error) => {
            console.log(error);
            this.hideCOD= true;
          this.hideRAZOR= true;
            this.util.hide();
            this.util.showToast(
              this.util.translate("Something went wrong"),
              "danger",
              "bottom"
            );
          }
        );
      }
    }
    }
  }

  async openSuccess() {
    const modal = await this.modalCtrl.create({
      component: SuccessPage,
      cssClass: "custom_modal2",
      componentProps: {
        //name: this.pay_method,
        //food: this.foods[index]
      },
    });
    return await modal.present();
  }

  getCards() {
    this.dummy = Array(10);
    console.log(this.util.userInfo.stripe_key);
    this.api
      .httpGet(
        "https://api.stripe.com/v1/customers/" +
          this.util.userInfo.stripe_key +
          "/sources?object=card",
        this.util.stripe
      )
      .subscribe(
        (cards: any) => {
          console.log(cards);
          this.dummy = [];
          if (cards && cards.data) {
            this.cards = cards.data;
            this.token = this.cards[0].id;
          }
        },
        (error) => {
          this.dummy = [];
          console.log(error);
          if (
            error &&
            error.error &&
            error.error.error &&
            error.error.error.message
          ) {
            this.util.showErrorAlert(error.error.error.message);
            return false;
          }
          this.util.errorToast(this.util.translate("Something went wrong"));
        }
      );
  }

  // payment() {
  //   console.log("place order");

  //   swal
  //     .fire({
  //       title: this.util.translate("Are you sure?"),
  //       text: this.util.translate(
  //         "Orders once placed cannot be cancelled and are non-refundable"
  //       ),
  //       icon: "question",
  //       confirmButtonText: this.util.translate("Yes"),
  //       cancelButtonText: this.util.translate("cancel"),
  //       showCancelButton: true,
  //       backdrop: false,
  //       background: "white",
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       if (data && data.value) {
  //         console.log("go to procesed,,");
  //         const options = {
  //           amount: parseInt(this.cart.grandTotal) * 100,
  //           currency: this.util.stripeCode,
  //           customer: this.util.userInfo.stripe_key,
  //           card: this.token,
  //         };
  //         console.log("options", options);
  //         const url = "https://api.stripe.com/v1/charges";
  //         this.util.show();
  //         this.api.externalPost(url, options, this.util.stripe).subscribe(
  //           (data: any) => {
  //             console.log("------------------------->", data);
  //             this.paykey = data.id;
  //             this.util.hide();
  //             this.util.showToast(
  //               this.util.translate("Payment Success"),
  //               "success",
  //               "bottom"
  //             );
  //             this.createOrder();
  //           },
  //           (error) => {
  //             this.util.hide();
  //             console.log(error);
  //             this.util.hide();
  //             if (
  //               error &&
  //               error.error &&
  //               error.error.error &&
  //               error.error.error.message
  //             ) {
  //               this.util.showErrorAlert(error.error.error.message);
  //               return false;
  //             }
  //             this.util.errorToast(this.util.translate("Something went wrong"));
  //           }
  //         );
  //       }
  //     });
  // }

  onAdd() {
    this.navCtrl.navigateRoot(["add-card"]);
  }

  changeMethod(id) {
    this.token = id;
  }

  ionViewWillEnter() {
    // if (this.util.userInfo && this.util.userInfo.stripe_key) {
    //   this.getCards();
    // }
  }

  async FailureAlert() {
    const alert = await this.alertCtrl.create({
      header: "Alert",
      message: "Your payment was Failed",
      backdropDismiss: false,
      buttons: [
        {
          text: "OK",

          handler: (blah) => {
            this.navCtrl.navigateBack("tabs");
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
}
