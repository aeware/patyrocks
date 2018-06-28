import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalculateCorporatePage } from './calculatecorporate';

@NgModule({
  declarations: [
    CalculateCorporatePage,
  ],
  imports: [
    IonicPageModule.forChild(CalculateCorporatePage),
  ],
})
export class CalculateCorporatePageModule {}
