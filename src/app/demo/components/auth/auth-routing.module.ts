import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
    { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
