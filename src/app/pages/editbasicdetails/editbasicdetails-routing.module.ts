import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditbasicdetailsPage } from './editbasicdetails.page';

const routes: Routes = [
  {
    path: '',
    component: EditbasicdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditbasicdetailsPageRoutingModule {}
