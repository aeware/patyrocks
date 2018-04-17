import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEventreviewPage } from './modal-eventreview';
 
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    ModalEventreviewPage
  ],
  imports: [
    IonicPageModule.forChild(ModalEventreviewPage),
    Ionic2RatingModule
  ],
  schemas:[
    Ionic2RatingModule
  ]
})
export class ModalEventreviewPageModule {}
 