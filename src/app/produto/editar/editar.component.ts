import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProdutoService } from '../services/produto.service';
import { CurrencyUtils } from 'src/app/utils/currency-utils';
import { ProdutosBaseComponent } from '../produto-form.base.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html'
})
export class EditarComponent extends ProdutosBaseComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
             
  imageBase64: any;
  imagePreview: any;
  imageNome: any;
  imagemOriginalSrc: string;
  mudancasNaoSalvas: boolean;


  imagens: string = environment.imagensUrl;


  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {                                                                                    
    super();
    this.produto = this.route.snapshot.data['produto'];
  }

  ngOnInit(): void {

    this.produtoService.obterFornecedores()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores);

    this.produtoForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      imagem: [''],
      valor: ['', [Validators.required]],
      ativo: [0]
    });

    this.produtoForm.patchValue({
      fornecedorId: this.produto.fornecedorId,
      id: this.produto.id,
      nome: this.produto.nome,
      descricao: this.produto.descricao,
      ativo: this.produto.ativo,
      valor: CurrencyUtils.DecimalParaString(this.produto.valor)
    });

    // utilizar o [src] na imagem para evitar que se perca apos post
    this.imagemOriginalSrc = this.imagens + this.produto.imagem;
  }

  ngAfterViewInit(): void {
    super.configurarValidacaoFormulario(this.formInputElements);
  }

  editarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);

      if(this.imageBase64){
        this.produto.imagemUpload = this.imageBase64;
        this.produto.imagem = this.imageNome;
    }

    this.produto.valor = CurrencyUtils.StringParaDecimal(this.produto.valor);
     
     this.produtoService.atualizarProduto(this.produto)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.produtoForm.reset();
    this.errors = [];

    let toast = this.toastr.success('Produto editado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  } 

  upload(file: any) {
    this.imageNome = file[0].name;

    var reader = new FileReader();
    reader.onload = this.manipularReader.bind(this);
    reader.readAsBinaryString(file[0]);
  }

  manipularReader(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.imageBase64 = btoa(binaryString);
    this.imagePreview = "data:image/jpeg;base64," + this.imageBase64;
  }


}

