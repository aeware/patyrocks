import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalGarconsPage } from './modal-garcons';

@NgModule({
  declarations: [
    ModalGarconsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalGarconsPage),
  ],
  exports: [
    ModalGarconsPage
  ]
})
export class ModalGarconsPageModule {}