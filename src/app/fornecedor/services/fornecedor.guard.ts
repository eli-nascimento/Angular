
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { BaseGuard } from 'src/app/services/base.guard';

import { NovoComponent } from '../novo/novo.component';

@Injectable()
export class FornecedorGuard extends BaseGuard implements CanActivate, CanDeactivate<NovoComponent> {

    constructor(protected router:Router){ super(router) }

    canDeactivate(component: NovoComponent) {
        if(component.mudancasNaoSalvas) {
            return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulario?');
        }        
        return true
    }

    canActivate(routeAc: ActivatedRouteSnapshot) {
        console.log(super.validarClaims(routeAc));
        return super.validarClaims(routeAc); 
    
    }
}