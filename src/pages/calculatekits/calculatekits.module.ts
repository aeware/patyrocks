import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalculateKitsPage } from './calculatekits';

@NgModule({
  declarations: [
    CalculateKitsPage,
  ],
  imports: [
    IonicPageModule.forChild(CalculateKitsPage),
  ],
})
export class CalculateKitsPageModule {}
