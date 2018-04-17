import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLocationPage } from './modal-location';

@NgModule({
  declarations: [
    ModalLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalLocationPage),
  ],
})
export class ModalLocationPageModule {}
