import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmpenhoPage } from './empenho';

@NgModule({
  declarations: [
    EmpenhoPage,
  ],
  imports: [
    IonicPageModule.forChild(EmpenhoPage),
  ],
})
export class EmpenhoPageModule {}
