import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleProyectoComponent } from './detalle-proyecto.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importación correcta
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DetalleProyectoComponent', () => {
  let component: DetalleProyectoComponent;
  let fixture: ComponentFixture<DetalleProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, 
        DetalleProyectoComponent // Aquí se importa directamente el componente en lugar de declararlo
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '123' }), // Simula los parámetros de la ruta
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
