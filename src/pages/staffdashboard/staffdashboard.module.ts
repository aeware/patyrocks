import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffdashboardPage } from './staffdashboard';

@NgModule({
  declarations: [
    StaffdashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(StaffdashboardPage),
  ],
})
export class StaffdashboardPageModule {}
