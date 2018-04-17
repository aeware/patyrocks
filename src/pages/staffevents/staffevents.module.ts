import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffeventsPage } from './staffevents';

@NgModule({
  declarations: [
    StaffeventsPage,
  ],
  imports: [
    IonicPageModule.forChild(StaffeventsPage),
  ],
})
export class StaffeventsPageModule {}
