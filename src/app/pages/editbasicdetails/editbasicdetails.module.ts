import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditbasicdetailsPageRoutingModule } from './editbasicdetails-routing.module';

import { EditbasicdetailsPage } from './editbasicdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditbasicdetailsPageRoutingModule
  ],
  declarations: [EditbasicdetailsPage]
})
export class EditbasicdetailsPageModule {}
