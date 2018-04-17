import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalChurrasqueirosPage } from './modal-churrasqueiros';

@NgModule({
  declarations: [
    ModalChurrasqueirosPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalChurrasqueirosPage),
  ],
  exports: [
    ModalChurrasqueirosPage
  ]
})
export class ModalChurrasqueirosPageModule {}