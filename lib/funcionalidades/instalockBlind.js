module.exports = class instalockBlind {
    constructor() {
        this.request = undefined;
        this.routes = undefined;
        this.ativo = false;
        this.cellIdUsuario = undefined;
        this.campeaoLock = undefined;
        this.tentativaPickAtual = 0;
        this.associacoes = [10, 13, 14, 17, 18, 11, 12, 15, 16, 19, 11];
        this.quantidadeSpams = 5
        this.intervaloSpam = 90000 - (500 * this.quantidadeSpams);
    }
    set mudarQuantidadeSpams(novaQuantidade) {
        this.quantidadeSpams = novaQuantidade;
    }
    _carregarDados(requestModule, routesModule) {
        this.request = requestModule;
        this.routes = routesModule;
    }
    toogleInstalock(estado) {
        estado ? this.ativo = estado : this.ativo = estado
        if (this.ativo) {
            var y = setInterval( () => {
                let url = this.routes.Route('submitChampSelectSession');
                let body = {
                    url: url,
                    "rejectUnauthorized": false,
                    headers: {
                        Authorization: this.routes.getAuth()
                    },
                }
                let callbackSessionInfo = (error, response, body) => {
                    var data = JSON.parse(body);
                    if (data['isSpectating'] == false) {
                        data['isCustomGame'] ? this.cellIdUsuario = data['localPlayerCellId'] + 1 : this.cellIdUsuario = data['localPlayerCellId'];
                        let urlLock = (this.routes.Route('submitChampSelectAction') + this.cellIdUsuario);
                        let bodyLock = {
                            url: urlLock,
                            "rejectUnauthorized": false,
                            headers: {
                                Authorization: this.routes.getAuth()
                            },
                            json: {
                                "championId": this.campeaoLock,
                                "completed": true

                            }
                        }
                        let callbackPickAction = (error, response, body) =>{
                            if(response.httpStatus!=500)
                            this.ativo=false
                        }
                        this.request.patch(bodyLock,callbackPickAction);
                    }
                }
                this.request.get(body, callbackSessionInfo);
                // if(this.ativo == false)
                // clearTimeout(y)
            }, 500)
        }
    }

}