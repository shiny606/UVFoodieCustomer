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
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-rating',
  templateUrl: './product-rating.page.html',
  styleUrls: ['./product-rating.page.scss'],
})
export class ProductRatingPage implements OnInit {
  id: any;
  OrderId: any;
  name: any;
  rate: any = 2;
  comment: any = '';
  total: any;
  rating: any[] = [];
  way: any;
  constructor(
    public util: UtilService,
    public api: ApisService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id && data.name) {
        this.id = data.id;
        this.name = data.name;
        this.way = 'order';
        this.OrderId = data.OrderId;
        console.log('id', this.id);
        console.log('name', this.name);
        const param = {
          where: 'pid = ' + this.id
        };
        this.util.show();
        this.api.post('rating/getFromCount', param).then((data: any) => {
          this.util.hide();
          console.log('data', data);
          if (data && data.status === 200) {
            if (data && data.data && data.data.total) {
              this.total = data.data.total;
              if (data.data.rating) {
                const rats = data.data.rating;
                console.log(rats.split(','));
                this.rating = rats.split(',');
              } else {
                this.rating = [];
              }
            } else {
              this.total = 0;
              this.rating = [];
            }
          } else {
            this.total = 0;
            this.rating = [];
          }
          console.log('total', this.total);
        }, error => {
          console.log(error);
          this.util.hide();
          this.total = 0;
          this.rating = [];
        });
      }
    });

  }

  ngOnInit() {
  }

  close() {
    this.util.back();
  }

  onRatingChange(event) {
    console.log(event);
  }

  submit() {
    this.rating.push(this.rate);
    let count = 0;
    const sum = this.rating.reduce((sum, item, index) => {
      item = parseFloat(item);
      console.log(sum, item, index);
      count += item;
      return sum + item * (index + 1);
    }, 0);
    console.log(sum / count);
    const storeRating = (sum / count).toFixed(2);
    console.log('rate', this.rate, this.comment);
    if (this.comment === '') {
      this.util.errorToast(this.util.translate('Something went wrong'));
      return false;
    }
    const param = {
      uid: localStorage.getItem('uid'),
      pid: this.id,
      did: 0,
      sid: 0,
      rate: this.rate,
      msg: this.comment,
      way: this.way,
      status: 1,
      timestamp: moment().format('YYYY-MM-DD'),
      oid :this.OrderId, 
    };
    console.log("rate==this.OrderId==="+this.OrderId)

    this.util.show();
    this.api.post('rating/save', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status === 200) {
        this.util.showToast('Rating added', 'success', 'bottom');
        const storeParam = {
          id: this.id,
          rating: storeRating
        }
        this.api.post('products/editList', storeParam).then((stores: any) => {
          console.log('products edit done', stores);
        }, error => {
          console.log(error);
        });
        this.close();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

}
