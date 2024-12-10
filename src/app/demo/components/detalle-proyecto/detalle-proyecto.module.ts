import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import { DetalleProyectoRoutingModule } from './detalle-proyecto-routing.module';


@NgModule({
  declarations: [],
  imports: [
      CommonModule,
      DetalleProyectoRoutingModule,
      HttpClientModule,
      HttpClientXsrfModule.withOptions({
          cookieName: 'X-CSRFToken',
          headerName: 'X-XSRF-TOKEN'
      }),
  ]
})
export class DetalleProyectoModule { }
