import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DetalleProyectoRoutingModule } from './detalle-proyecto-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DetalleProyectoRoutingModule,
    HttpClientModule
  ]
})
export class DetalleProyectoModule { }
