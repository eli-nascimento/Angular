import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';

import { CustomValidators } from 'ngx-custom-validators';

import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { Usuario } from '../models/usuario';
import { ContaService } from '../services/conta.service';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBaseComponent } from 'src/app/basic-components/form-base.component';



@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent extends FormBaseComponent implements OnInit,AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errors: any[] = [];
  cadastroForm!: FormGroup;
  usuario!: Usuario;

  // validationMessages: ValidationMessages;
  // genericValidator: GenericValidator;
  // displayMessage: DisplayMessage = {};

  mudancaNaoSalvas:boolean;



  constructor(private fb: FormBuilder,
              private contaService: ContaService,
              private router: Router,
              private toastr:ToastrService) 
      {

       super();
       this.validationMessages = {
          email: {
                    require:'Informe o e-mail',
                    email: 'Email inválido'
                    },
                    password: {
                    required: 'Informe a senha',
                     rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
                    },
                    confirmPassword: {
                      require: 'Informe a senha novamente',
                      rangelenth: 'A senha deve possuir entre 6 e 15 caracteres',
                      equalTo: 'As senhas não conferem'
                    }
                 };
                 super.configurarMensagensValidacaoBase(this.validationMessages);
           // this.genericValidator = new GenericValidator(this.validationMessages);
       }
 
  ngOnInit(): void {
    
    let senha = new FormControl('', [Validators.required,CustomValidators.rangeLength([6, 15])]);
    let senhaConfirm = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(senha)]);
    // 

    this.cadastroForm = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password: senha,
      confirmPassword: senhaConfirm 
    });
  }

  ngAfterViewInit(): void {
    super.configurarValidacaoFormularioBase(this.formInputElements,this.cadastroForm);
    // let controlBlurs:Observable<any>[] = this.formInputElements
      // .map((FormControl:ElementRef) => fromEvent(FormControl.nativeElement,'blur'));

    // merge(...controlBlurs).subscribe(() => {
      // this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);
      // this.mudancaNaoSalvas = true;   
    // });

    
  }

  adicionarConta(){
    if(this.cadastroForm.dirty && this.cadastroForm.valid){
        this.usuario = Object.assign({},this.usuario,this.cadastroForm.value);

        this.contaService.registraUsuario(this.usuario)
        .subscribe(
          sucesso =>{this.processarSucesso(sucesso)},
          falha =>{this.processarFalha(falha)}
        );

        this.mudancaNaoSalvas = false;
    }
1
  }


  //Anotações Importantes
  //64.3 - Depois de criado o conteudo dos metodos processarSucesso e processarFalha
  //Foi criado na psta utils o arquivo da classe localstorage.ts
  //64.4 - Criado metodo vazio
  // - Adicionado a linha this.cadastroForm.reset(); para resetar formulario e não fazer um duplo submit
  // Usuario vai ter de digitar novamente
  //64.5 - Adicionado a linha this.errors = []; para zerar o erro e tirar a mensagem de erro da tela para dar uma boa 
  //64. - 
  
  processarSucesso(response: any){
    this.cadastroForm.reset();
    this.errors = [];
    //64.8 - Chamando o metodo salva da localstorage.ts despois de criado o acesso publico na base.service.ts
    //Vai salvar o token e o usuario no browser da aplicação
    //Para visualizar o dados no inspect F12 ir na opção  Application Local Storage
    //64.9 -impressão ao usuário na linha 30 acima
    //64-10 - Proximo passo foi injetar/criar a variavel router do tipo Router para que depois de gravar o usuario voltar para pagina home private router: Router
    this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);


    //64.11 - Depois de salvar o usuario na application vai para pagina inicial home
    //Senão ocorrer erro vai para a pagina principal home
    //this.router.navigate(['/home']);
    //this.toastr.success('Registro realizado com sucesso!','Bem vindo!!!');
    let toast = this.toastr.success('Registro realizado com sucesso!','Bem vindo!!!');
    if(toast){
        toast.onHidden.subscribe(()=>{
          this.router.navigate(['/home']);
        })
    }
  }

  //Aula 64 - Tratando os responses do servidor inicia aqui
  //Anotações Importantes
  //64.1 - Gerado apenas o metodo vazio
  // processarFalha(fail: any){}
  //64.2 - Adicionado a linha
  //this.errors = fail.error.errors;
  processarFalha(fail: any){
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!','Opa :(');    
  }

}
