import { Component } from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
    imports: [
        InputTextModule,
        FormsModule,
        InputTextareaModule,
        ButtonModule,
        RippleModule
    ],
  templateUrl: './detalle-proyecto.component.html',
  styleUrl: './detalle-proyecto.component.scss'
})
export class DetalleProyectoComponent {
    descripcionProyecto: string;
    fechaInicio: string;
    unidadTiempo: string;
    hrsTrabajoPorDia: string;

    descargarExcel() {
      // Logica a implementar
    }

    borrarProyecto() {
      // Logica a implementar
    }
}
