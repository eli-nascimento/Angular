import {HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { throwError } from "rxjs";
import { LocalStorageUtils } from "../utils/localstorage";


export abstract class BaseService {

    //64.7 - Qualquer servico vai poder acessar
    //Qualquer componentes vai poder acessar
    //Qualquer um que esteja implementado aquele servico de BaseService pode tambem conversar com LocalStorage
    //proximo passo foi salvar o usuario no arquivo cadastro.component.ts metodo processarSucesso
    public LocalStorage = new LocalStorageUtils();

    //Quando coloca como protected quem herda de BaseService pode acessar
    protected UrlServiceV1: string = "https://localhost:5001/api/v1/";
    public token: string = `Bearer ${this.LocalStorage.obterTokenUsuario()}`;

    protected ObterHeaderJson(){
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

                                 
    protected ObterAuthHeaderJson() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.token
            })
        };
    }


    protected extractData(response: any){
        return response.data || {};
    }

    protected serviceError(response: Response | any){

            let customError: string[] = [];

        if(response instanceof HttpErrorResponse){

                if(response.statusText === "Unknown Error"){    

                customError.push("ocorreu um erro desconhecido");
                response.error.errors = customError;
                }
        }   

        console.error(response);
        return throwError(response);
    }
}