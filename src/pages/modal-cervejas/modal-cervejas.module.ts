import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCervejasPage } from './modal-cervejas';

@NgModule({
  declarations: [
    ModalCervejasPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCervejasPage),
  ],
  exports: [
    ModalCervejasPage
  ]
})
export class ModalCervejasPageModule {}