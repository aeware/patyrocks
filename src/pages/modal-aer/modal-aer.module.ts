import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAerPage } from './modal-aer';

@NgModule({
  declarations: [
    ModalAerPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAerPage),
  ],
  exports: [
    ModalAerPage
  ]
})
export class ModalAerPageModule {}