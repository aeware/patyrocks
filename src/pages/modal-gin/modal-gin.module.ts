import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalGinPage } from './modal-gin';

@NgModule({
  declarations: [
    ModalGinPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalGinPage),
  ],
  exports: [
    ModalGinPage
  ]
})
export class ModalGinPageModule {}