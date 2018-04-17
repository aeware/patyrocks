import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentOkPage } from './payment-ok';

@NgModule({
  declarations: [
    PaymentOkPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentOkPage),
  ],
})
export class PaymentOkPageModule {}
