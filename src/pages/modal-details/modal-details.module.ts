import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDetailsPage } from './modal-details';

@NgModule({
  declarations: [
    ModalDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDetailsPage),
  ],
})
export class ModalDetailsPageModule {}
