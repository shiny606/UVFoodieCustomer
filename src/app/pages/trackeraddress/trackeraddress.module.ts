
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackerAddressPageRoutingModule } from './trackeraddress-routing.module';

import { TrackerAddressPage } from './trackeraddress.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackerAddressPageRoutingModule,

  ],
  declarations: [TrackerAddressPage]
})
export class TrackerAddressPageModule { }
