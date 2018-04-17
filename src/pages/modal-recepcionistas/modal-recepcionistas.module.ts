import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalRecepcionistasPage } from './modal-recepcionistas';

@NgModule({
  declarations: [
    ModalRecepcionistasPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalRecepcionistasPage),
  ],
  exports: [
    ModalRecepcionistasPage
  ]
})
export class ModalRecepcionistasPageModule {}