import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { Endereco,CepConsulta } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';


///


import { NgBrazilValidators } from 'ng-brazil';
import { utilsBr } from 'js-brasil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StringUtils } from 'src/app/utils/string-utils';
import { FormBaseComponent } from 'src/app/basic-components/form-base.component';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html'
})
export class EditarComponent extends FormBaseComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = [];
  errorsEndereco: any[] = [];
  fornecedorForm: FormGroup;
  enderecoForm: FormGroup;

  fornecedor: Fornecedor = new Fornecedor();
  endereco: Endereco = new Endereco();

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
  textoDocumento: string = '';

  tipoFornecedor: number;
  formResult: string = '';
  MASKS = utilsBr.MASKS;
  

  mudancasNaoSalvas: boolean;

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) {

    super();
    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento',
        cpf: 'CPF em formato inválido',
        cnpj: 'CNPJ em formato inválido'
      },
      logradouro: {
        required: 'Informe o Logradouro',
      },
      numero: {
        required: 'Informe o Número',
      },
      bairro: {
        required: 'Informe o Bairro',
      },
      cep: {
        required: 'Informe o CEP'
      },
      cidade: {
        required: 'Informe a Cidade',
      },
      estado: {
        required: 'Informe o Estado',
      }
    };
    super.configurarMensagensValidacaoBase(this.validationMessages);
    //this.genericValidator = new GenericValidator(this.validationMessages);

    // this.fornecedorService.obterPorId(route.params['id'])
      // .subscribe(fornecedor => this.fornecedor = fornecedor);

    this.fornecedor = this.route.snapshot.data['fornecedor']; 
    this.tipoFornecedor = this.fornecedor.tipoFornecedor;
    
  }

  ngOnInit() {

    this.spinner.show();

    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    });

    this.enderecoForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });

    this.preencherForm();  

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);
  
  }

  preencherForm() {

    this.fornecedorForm.patchValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      tipoFornecedor: this.fornecedor.tipoFornecedor.toString(),
      documento: this.fornecedor.documento
    });
    console.log(this.documento().value);
    if (this.tipoFornecedorForm().value === "1") {
      this.documento().setValidators([Validators.required, NgBrazilValidators.cpf]);
    }
    else {
      this.documento().setValidators([Validators.required, NgBrazilValidators.cnpj]);
    }

    this.enderecoForm.patchValue({
      id: this.fornecedor.endereco.id,
      logradouro: this.fornecedor.endereco.logradouro,
      numero: this.fornecedor.endereco.numero,
      complemento: this.fornecedor.endereco.complemento,
      bairro: this.fornecedor.endereco.bairro,
      cep: this.fornecedor.endereco.cep,
      cidade: this.fornecedor.endereco.cidade,
      estado: this.fornecedor.endereco.estado
    });
  }

  ngAfterViewInit() {
    this.tipoFornecedorForm().valueChanges
    .subscribe(() => {
      this.trocarValidacaoDocumento();
      super.configurarValidacaoFormularioBase(this.formInputElements,this.fornecedorForm);
      super.validarFormulario(this.fornecedorForm);
      //this.configurarElementosValidacao();
      //this.validarFormulario();
    });
    super.configurarValidacaoFormularioBase(this.formInputElements,this.fornecedorForm);
    //this.configurarElementosValidacao();   
   
   
    // let controlBlurs: Observable<any>[] = this.formInputElements
      // .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // merge(...controlBlurs).subscribe(() => {
      // this.displayMessage = this.genericValidator.processarMensagens(this.fornecedorForm);
      // this.mudancasNaoSalvas = true;
    // });
    
  }

  trocarValidacaoDocumento(){
    if(this.tipoFornecedorForm().value == "1"){
      this.documento().clearValidators();
      this.documento().setValidators([Validators.required, NgBrazilValidators.cpf]);
      this.textoDocumento = 'CPF (Requerido)';
    }
    else{
      this.documento().clearValidators();
      this.documento().setValidators([Validators.required, NgBrazilValidators.cnpj]);
      this.textoDocumento = 'CNPJ (Requerido)';      
    }
  }
  documento(): AbstractControl {
    return this.fornecedorForm.get('documento');
  }
  tipoFornecedorForm(): AbstractControl {
    return this.fornecedorForm.get('tipoFornecedor');
  }

  editarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
      this.fornecedor.documento = StringUtils.somenteNumeros(this.fornecedor.documento);
      console.log(this.fornecedor);
      if(this.tipoFornecedorForm().value == "2"){
          this.fornecedor.tipoFornecedor = 2;
        }else{
          this.fornecedor.tipoFornecedor = 1;
        }
      this.fornecedorService.atualizarFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.errors = [];

    let toast = this.toastr.success('Fornecedor atualizado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  abrirModal(content){
    this.modalService.open(content);
  }
   
  buscarCep(cep: string) {

    cep = StringUtils.somenteNumeros(cep);
    if (cep.length < 8) return;

    this.fornecedorService.consultaCep(cep)
      .subscribe(
        cepRetorno => this.preencherEnderecoConsulta(cepRetorno),
        erro => this.errors.push(erro));
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta) {

    this.enderecoForm.patchValue({
      logradouro: cepConsulta.logradouro,
      bairro: cepConsulta.bairro,
      cep: cepConsulta.cep,
      cidade: cepConsulta.localidade,
      estado: cepConsulta.uf
    });
  }

  editarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {

      this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);
      
      this.endereco.cep = StringUtils.somenteNumeros(this.endereco.cep);
      this.endereco.fornecedorId = this.fornecedor.id;

      this.fornecedorService.atualizarEndereco(this.endereco)
        .subscribe(
          () => this.processarSucessoEndereco(this.endereco),
          falha => { this.processarFalhaEndereco(falha) }
        );
    }
  }

  processarSucessoEndereco(endereco: Endereco) {
    this.errors = [];

    this.toastr.success('Endereço atualizado com sucesso!', 'Sucesso!');
    this.fornecedor.endereco = endereco
    this.modalService.dismissAll();
  }

  processarFalhaEndereco(fail: any) {
    this.errorsEndereco = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

}
