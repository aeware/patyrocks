import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCrepesPage } from './modal-crepes';

@NgModule({
  declarations: [
    ModalCrepesPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCrepesPage),
  ],
  exports: [
    ModalCrepesPage
  ]
})
export class ModalCrepesPageModule {}