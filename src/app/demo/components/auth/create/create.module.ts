import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateComponent} from "./create.component";
import { CreateRoutingModule } from './create-routing.module';
import {PasswordModule} from "primeng/password";
import {FormsModule} from "@angular/forms";
import {DividerModule} from "primeng/divider";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";


@NgModule({
  declarations: [CreateComponent],
    imports: [
        CommonModule,
        CreateRoutingModule,
        PasswordModule,
        FormsModule,
        DividerModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        ToastModule
    ],
    providers: [
        MessageService
    ],
})
export class CreateModule { }
