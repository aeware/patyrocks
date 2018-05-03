import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalBurguersPage } from './modal-burguers';

@NgModule({
  declarations: [
    ModalBurguersPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalBurguersPage),
  ],
  exports: [
    ModalBurguersPage
  ]
})
export class ModalBurguersPageModule {}