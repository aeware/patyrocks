import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalGeraisPage } from './modal-gerais';

@NgModule({
  declarations: [
    ModalGeraisPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalGeraisPage),
  ],
  exports: [
    ModalGeraisPage
  ]
})
export class ModalGeraisPageModule {}