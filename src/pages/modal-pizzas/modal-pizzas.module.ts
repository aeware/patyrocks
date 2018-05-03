import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPizzasPage } from './modal-pizzas';

@NgModule({
  declarations: [
    ModalPizzasPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPizzasPage),
  ],
  exports: [
    ModalPizzasPage
  ]
})
export class ModalPizzasPageModule {}