import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleProyectoComponent } from './detalle-proyecto.component';

const routes: Routes = [{ path: '', component: DetalleProyectoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleProyectoRoutingModule { }
