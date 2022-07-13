import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageaddressPageRoutingModule } from './manageaddress-routing.module';

import { ManageaddressPage } from './manageaddress.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageaddressPageRoutingModule
  ],
  declarations: [ManageaddressPage]
})
export class ManageaddressPageModule {}
