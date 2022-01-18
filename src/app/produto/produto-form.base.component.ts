import { FormGroup } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';


import { DisplayMessage, GenericValidator, ValidationMessages } from '../utils/generic-form-validation';
import { Fornecedor, Produto } from './models/produto';
import { utilsBr } from 'js-brasil';
import { ElementRef } from '@angular/core';
import { FormBaseComponent } from '../basic-components/form-base.component';

export abstract class ProdutosBaseComponent extends FormBaseComponent{

    produto: Produto;
    fornecedores: Fornecedor[];
    errors: any[] = [];
    produtoForm: FormGroup;

    MASKS = utilsBr.MASKS;

    validationMessages: ValidationMessages
    genericValidator: GenericValidator;
    displayMessage: DisplayMessage = {};
    mudancasNaoSalvas: boolean;

    constructor(){

         super();
         this.validationMessages = {
            fornecedorId: {
              required: 'Escolha um fornecedor',
            },
            nome: {
              required: 'Informe o Nome',
              minlength: 'Mínimo de 2 caracteres',
              maxlength: 'Máximo de 200 caracteres'
            },
            descricao: {
              required: 'Informe a Descrição',
              minlength: 'Mínimo de 2 caracteres',
              maxlength: 'Máximo de 1000 caracteres'
            },
            imagem: {
              required: 'Informe a Imagem',
            },
            valor: {
              required: 'Informe o Valor',
            }
          };     

          super.configurarMensagensValidacaoBase(this.validationMessages);
          //this.genericValidator = new GenericValidator(this.validationMessages);
    }

    protected configurarValidacaoFormulario( formInputElements:ElementRef[] ){

      super.configurarValidacaoFormularioBase(formInputElements,this.produtoForm);
        //  let controlBlurs: Observable<any>[] = formInputElements
            // .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

        //  merge(...controlBlurs).subscribe(() => {
          //  this.displayMessage = this.genericValidator.processarMensagens(this.produtoForm);
          //  this.mudancasNaoSalvas = true;
        //  });

     }
         
}