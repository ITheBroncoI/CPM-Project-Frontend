import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { RouterTestingModule } from '@angular/router/testing'; // Para las pruebas del [routerLink]

describe('ErrorComponent', () => {
    let component: ErrorComponent;
    let fixture: ComponentFixture<ErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ErrorComponent],
            imports: [
                RouterTestingModule, // Para que funcione [routerLink]
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the logo image correctly', () => {
        const compiled = fixture.nativeElement;
        const logo = compiled.querySelector('img[alt="Sakai logo"]');
        expect(logo).toBeTruthy();
        expect(logo.src).toContain('assets/demo/images/error/logo-error.svg');
    });

    it('should display the error message', () => {
        const compiled = fixture.nativeElement;
        const errorMessage = compiled.querySelector('h1');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.textContent).toContain('Error Occured');
    });
});
