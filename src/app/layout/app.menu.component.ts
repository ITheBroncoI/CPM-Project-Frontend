import { OnInit, Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Bienvenido!',
                items: [
                    { label: 'Proyectos', icon: 'pi pi-briefcase', routerLink: ['/dashboard'] },
                    { label: 'Acerca de', icon: 'pi pi-info-circle', routerLink: ['/'] },
                ]
            },
        ];
    }
}
