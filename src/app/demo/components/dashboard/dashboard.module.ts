import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";


@NgModule({
  declarations: [],
  imports: [
      CommonModule,
      DashboardRoutingModule,
      ToastModule
  ],
    providers: [
        MessageService
    ],
})
export class DashboardModule { }
