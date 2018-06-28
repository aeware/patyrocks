import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalculateProductsPage } from './calculateproducts';

@NgModule({
  declarations: [
    CalculateProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(CalculateProductsPage),
  ],
})
export class CalculateProductsPageModule {}
