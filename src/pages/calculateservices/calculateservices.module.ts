import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalculateServicesPage } from './calculateservices';

@NgModule({
  declarations: [
    CalculateServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(CalculateServicesPage),
  ],
})
export class CalculateServicesPageModule {}
