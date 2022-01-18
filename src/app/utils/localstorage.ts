export class LocalStorageUtils{

    // Classe util para não escrever os metodos toda hora e evitar de espalhar a chaves em todo que é lugar 
    //da aplicação e ficar alterando cada ponto
    //Colocar tudo em um lugar só e centraliza as informações
    //Proximo passo foi colocar no servico base arquivo base.service.ts para colocar publicamente
    //para qualquer serviço possa acessa-lo

    //Para obter o usuario passar a chave 'devio.user' e o JSON.parse transforma em formato Json
    public obterUsuario(){
        return JSON.parse(localStorage.getItem('devio.user'));
    }

    //Mertodo proprio que recebe um response que já está preparado para salvar os dados accessToken e userToken
    // que vem do retorno do swagger Response body
    public salvarDadosLocaisUsuario(response: any){
        this.salvarTokenUsuario(response.accessToken);
        this.salvarUsuario(response.userToken);
    };

    //Limpa os dados passar as duas chaves que estou trabalhando
    public limparDadosLocaisUsuario(){
        localStorage.removeItem('devio.token');
        localStorage.removeItem('devio.user');
    }
    //quando quiser usar o token do usuario usar localStorage.getItem e a minha chave 'devio.token'
    public obterTokenUsuario(): string{
        return localStorage.getItem('devio.token');
    }

    //Recebe a variavel token que é uma string
    //Vai usar a biblioteca do javascript localStorage
    // 'devio.token' é o nome que pode ser qualquer um, é atraves dessa chave que podemos buscar ou exluir este dado
    // token variavel que recebe os dados populados
    public salvarTokenUsuario(token: string){
        localStorage.setItem('devio.token',token);
    }

    //Recebe a variavel user que é uma string
    //O user vai vir em um formato json e estamos usando JSON.stringify para transformar para string
    public salvarUsuario(user: string){
        localStorage.setItem('devio.user',JSON.stringify(user));
    }
}