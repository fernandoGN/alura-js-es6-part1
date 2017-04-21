class NegociacaoController {

    constructor() {
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacaoView($('#negociacoesView')),
            ['adiciona','esvazia']
        );

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView( $('#mensagemView') ),
            ['texto']
        );
    }

    adiciona(event){
        event.preventDefault();
        
        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._mensagem.texto = 'Negociação adicionada com sucesso.';
        this._limpaFormulario();

       
    }

    _criaNegociacao(){
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value), 
            this._inputQuantidade.value,
            this._inputValor.value  
        );
    }

    _limpaFormulario(){
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }

    apaga(){
        this._listaNegociacoes.esvazia();
        this._mensagem.texto = "Negociações apagadas.";
    }

    importaNegociacoes(){
        let service = new NegociacaoService();

        Promise.all([
            service.obterNegociacoesDaSemana(),
            service.obterNegociacoesDaSemanaAnterior(),
            service.obterNegociacoesDaSemanaRetrasada()
        ]).then(
            negociacoes => {
                negociacoes
                    .reduce((arrayTransformado, array) => arrayTransformado.concat(array), [])
                    .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                this._mensagem.texto = 'Negociações da semana obtidas com sucesso';
            }
        ).catch(erro => this._mensagem.texto = erro);

        
        .then()
        .catch(erro => this._mensagem.texto = erro);

        
        .then(negociacoes => {
            negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações da semana anterior obtidas com sucesso';
        })
        .catch();

        
        .then(negociacoes => {
            negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações da semana retrasada obtidas com sucesso';
        })
        .catch(erro => this._mensagem.texto = erro);

    }
}