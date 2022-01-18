import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { NavegacaoModule } from './navegacao/navegacao.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ErrorInteceptor } from './services/error.handler.service';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInteceptor,multi:true }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NavegacaoModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot() ,
    HttpClientModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
