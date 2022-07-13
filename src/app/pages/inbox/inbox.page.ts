
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;

  id: any;
  name: any;
  msg: any = '';
  messages: any[] = [];
  reply_message;
  uid: any;
  loaded: boolean;
  yourMessage: boolean;
  interval: any;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public api: ApisService,
    public util: UtilService
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id && data.name) {
        this.uid = data.uid;
        this.id = data.id;
        this.loaded = false;
        this.name = data.name;
        this.getChats();
        this.interval = setInterval(() => {
          console.log('calling in interval');
          this.getChats();
        }, 12000);
      } else {
        this.navCtrl.navigateBack('tabs');
      }
    });
  }

  ionViewDidLeave() {
    console.log('leaae');
    clearInterval(this.interval);
  }
  // ScrollToBottom() {

  // }
  ngOnInit() {
  }

  getChats() {
    // store _ opponent
    const param = {
      id: this.id + '_' + this.uid,
      oid: this.id
    };
    this.api.post('chats/getById', param).then((data: any) => {
      console.log(data);
      this.loaded = true;
      this.yourMessage = true;
      if (data && data.status === 200) {
        this.messages = data.data;
        //this.reply_message = data.data.reply_message;
        console.log('this.messages===='+JSON.stringify(this.messages))
        this.myContent.scrollToBottom(300);
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.yourMessage = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.navigateForward('tabs/tab3');
  }

  sendMessage() {
    // store to opponent
    console.log(this.msg);
    if (!this.msg || this.msg === '') {
      return false;
    }
    const msg = this.msg;
    this.msg = '';
    const param = {
      room_id: this.id,
      uid: this.id + '_' + this.uid,
      from_id: this.uid,
      message: msg,
      message_type: 'users',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    this.myContent.scrollToBottom(300);
    this.yourMessage = false;
    this.api.post('chats/save', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.getChats();
      } else {
        this.yourMessage = true;
      }
    }, error => {
      console.log(error);
      this.yourMessage = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

}
