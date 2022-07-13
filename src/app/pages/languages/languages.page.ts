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
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {

  dummy: any[] = [];
  langs: any[] = [];
  selected: any;
  constructor(
    public util: UtilService,
    public api: ApisService
  ) {
    this.selected = localStorage.getItem('language');
    this.getLangs();
  }

  ngOnInit() {

  }

  getLangs() {
    this.dummy = Array(10);
    this.api.get('lang').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200) {
        const info = data.data.filter(x => x.status === '1');
        this.langs = info;
      }
    }, error => {
      this.dummy = [];
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  openMenu() {
    this.util.openMenu();
  }

  changed() {
    console.log(this.selected);
    const item = this.langs.filter(x => x.file === this.selected);
    if (item && item.length > 0) {
      this.util.direction = item[0].positions === '1' ? 'ltr' : 'rtl';
      document.documentElement.dir = this.util.direction;
      localStorage.setItem('language', this.selected);
      window.location.reload();
    }
  }
}
