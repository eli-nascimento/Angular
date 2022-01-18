import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FornecedorAppComponent } from './fornecedor.app.component';
import { NovoComponent } from './novo/novo.component';
import { ListaComponent } from './lista/lista.component';
import { EditarComponent } from './editar/editar.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { FornecedorResolve } from './services/fornecedor.resolve';
import { FornecedorGuard } from './services/fornecedor.guard';

const fornecedorRouterConfig: Routes = [
    {
        path: '', component: FornecedorAppComponent,
        children: [
            { 
                path: 'listar-todos', component: ListaComponent, 
                // canActivate: [FornecedorGuard],
                //data:[{claim:{ nome:'Fornecedor', valor:'Visualizar' }}]
            },
            { 
                path: 'adicionar-novo', component: NovoComponent,
                canDeactivate: [FornecedorGuard],
                canActivate:[FornecedorGuard],
                data:[{claim:{ nome: 'Fornecedor', valor: 'Adicionar' }}]
            },
            { 
                path: 'editar/:id', component: EditarComponent,
                canActivate:[FornecedorGuard],
                data:[{claim:{ nome:'Fornecedor', valor:'Atualizar' }}],
                resolve: {
                    fornecedor: FornecedorResolve
                }
            },
            {
                 path: 'detalhes/:id', component: DetalhesComponent,
                //  canActivate:[FornecedorGuard],
                //  data:[{claim:{ nome:'Fornecedor', valor:'Visualizar' }}],    
                 resolve: {
                    fornecedor: FornecedorResolve
                }
            },
            { 
                path: 'excluir/:id', component: ExcluirComponent,
                canActivate:[FornecedorGuard],
                data:[{claim:{ nome:'Fornecedor', valor:'Excluir' }}],
                resolve: {
                    fornecedor: FornecedorResolve
                }
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(fornecedorRouterConfig)
    ],
    exports: [RouterModule]
})
export class FornecedorRoutingModule { }