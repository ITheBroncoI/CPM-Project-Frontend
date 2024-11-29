import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import {LoginComponent} from "./demo/components/auth/login/login.component";

const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    {
        path: '', component: AppLayoutComponent,
        children: [

        ]
    },
    { path: 'notfound', component: NotfoundComponent },
    { path: 'create', loadChildren: () => import('./demo/components/auth/create/create.module').then(m => m.CreateModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
