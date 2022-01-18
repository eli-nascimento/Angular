import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder,  Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { ImageCroppedEvent, ImageTransform, Dimensions } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

import { ProdutoService } from '../services/produto.service';
import { CurrencyUtils } from 'src/app/utils/currency-utils';
import { ProdutosBaseComponent } from '../produto-form.base.component';


@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})
export class NovoComponent extends ProdutosBaseComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  imageChangedEvent: any = ''; //é um evento
  croppedImage: any = ''; //Aqui representa a imagem que foi recortada
  canvasRotation = 0; // Aqui a rotação caso queira rotacionar a imagem
  rotation = 0;
  scale = 1; //a escal é sempre 1
  showCropper = false; // Para mostrar a parte do recorte
  containWithinAspectRatio = false; // Aqui se manter o arquivo com os aspectos tradicionais ou vai criar a propria dimensão redendo ou quadrada
  transform: ImageTransform = {}; //isso é uma classe propria dele
  imageURL: string; // Para uso da url da imagem 
  imagemNome: string; // E o nome 
  mudancasNaoSalvas: boolean;

  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private toastr: ToastrService) { super(); }

  ngOnInit(): void {

    this.produtoService.obterFornecedores()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores);

    this.produtoForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      imagem: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      ativo: [true]
    });
  }

  ngAfterViewInit(): void {
    super.configurarValidacaoFormulario(this.formInputElements);
  }

  adicionarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);

      this.produto.imagemUpload = this.croppedImage.split(',')[1];
      this.produto.imagem = this.imagemNome;

      this.produto.valor = CurrencyUtils.StringParaDecimal(this.produto.valor);
      //this.formResult = JSON.stringify(this.produto);

      this.produtoService.novoProduto(this.produto)
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

    let toast = this.toastr.success('Produto cadastrado com sucesso!', 'Sucesso!');
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


  fileChangeEvent(event: any): void {
    console.log('teste')
    this.imageChangedEvent = event;
    this.imagemNome = event.currentTarget.files[0].name;
  }
  imageCropped(event: ImageCroppedEvent) {
    console.log('teste')
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.showCropper = true;
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }
  loadImageFailed() {
    this.errors.push('O formato do arquivo ' + this.imagemNome + ' não é aceito.');
  }
  
    


}

