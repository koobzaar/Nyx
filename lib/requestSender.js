const { unique } = require('jquery');
module.exports = class enviarRequest {
    constructor() {
        this.APIClient = require('./routes'),
            this.requestAPI = require('request'),
            this.tokenAutorizacao = null,
            this.rotas = null
    }
    _carregarDados(data) {
        this.rotas = new this.APIClient(
            data.protocol + '://' + data.address + ':' + data.port,
            data.username,
            data.password
        )
        this.tokenAutorizacao = this.rotas.getAuth();
    }
    async _getInformacoesLCU(urlAlvo) {
        let y;
        let corpoRequest = {
            url: urlAlvo,
            "rejectUnauthorized": false,
            headers: {
                Authorization: this.tokenAutorizacao
            }
        };
        let retornoRequest = async function (error, response, body) {
            return body;
        };
         return this.requestAPI.get(corpoRequest, retornoRequest);
    }
    /**
     * 
     * @param {function} uniqueRequestRule      Ao enviar um put request, pode ser que algo dentro necesside de uma 
     *                                          alteração única. Você pode enviar uma função
     *                                          em conjunto para alterar características do JSON.
     *                                          
     */
    _putInformacoesLCU(tipo, urlAlvo, putInformacao, uniqueRequestRule) {
        let scopeRequestPut = JSON.parse(`{
          "url": "` + this.rotas.Route(urlAlvo) + `",
          "rejectUnauthorized": false,
          "headers": {
            "Authorization": "` + this.tokenAutorizacao + `"
          },
          "json": {
            "` + tipo + `": ` + putInformacao + `
          }
        }`);
        uniqueRequestRule != null && (scopeRequestPut = uniqueRequestRule(scopeRequestPut));
        return this.requestAPI.put(scopeRequestPut, function (error, response, body) {
            return "teste"
        })     
    }
    _postInformacoesLCU(urlAlvo) {
        let scopeRequestPost = `{
            "url": "` + this.rotas.Route(urlAlvo) + `",
            "rejectUnauthorized": false,
            "headers": {
              "Authorization": "` + this.tokenAutorizacao + `"
            },
            "json": {
            }
          }`
        return this.requestAPI.post(JSON.parse(scopeRequestPost))
    }
}