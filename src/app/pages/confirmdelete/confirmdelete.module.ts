import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmdeletePageRoutingModule } from './confirmdelete-routing.module';

import { ConfirmdeletePage } from './confirmdelete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmdeletePageRoutingModule
  ],
  declarations: [ConfirmdeletePage]
})
export class ConfirmdeletePageModule {}
