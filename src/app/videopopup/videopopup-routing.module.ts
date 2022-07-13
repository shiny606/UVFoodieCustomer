import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideopopupPage } from './videopopup.page';

const routes: Routes = [
  {
    path: '',
    component: VideopopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideopopupPageRoutingModule {}
