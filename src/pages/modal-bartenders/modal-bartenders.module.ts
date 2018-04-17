import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalBartendersPage } from './modal-bartenders';

@NgModule({
  declarations: [
    ModalBartendersPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalBartendersPage),
  ],
  exports: [
    ModalBartendersPage
  ]
})
export class ModalBartendersPageModule {}