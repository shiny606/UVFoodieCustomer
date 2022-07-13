
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private navCtrl: NavController
  ) {
    setTimeout(() => {
      modalController.dismiss();
      this.navCtrl.navigateRoot(['/tabs/tab1']);
    }, 1000);
  }

  ngOnInit() {
  }

  closeIt() {
    this.modalController.dismiss();
  }

}
