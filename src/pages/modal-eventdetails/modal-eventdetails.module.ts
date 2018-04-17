import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEventdetailsPage } from './modal-eventdetails';

@NgModule({
  declarations: [
    ModalEventdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalEventdetailsPage),
  ],
})
export class ModalEventdetailsPageModule {}
