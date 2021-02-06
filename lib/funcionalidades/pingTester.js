module.exports = class pingTester {
    constructor() {
        this.ativo = false;
        this.enderecos = [
            {
                "ip": "45.7.36.80",
                "nyxAlias":"pingServidordeJogo1"
            },
            {
                "ip": "lq.br.lol.riotgames.com",
                "nyxAlias":"pingServidorLogin"
            },
            {
                "ip": "prod.br.lol.riotgames.com",
                "nyxAlias":"pingServidorClient"
            },
            {
                "ip": "br.chat.si.riotgames.com",
                "nyxAlias":"pingServidorChat"
            }
        ];
        this.pingModule = require('ping');
    }
    _startPinging(nyxWindow) {
        setInterval(async () => {
            for (let host of this.enderecos) {
                try{
                    let resposta = await this.pingModule.promise.probe(host.ip);
                    nyxWindow.webContents.send(host.nyxAlias,resposta.time);
                }
                catch (erro){
                    console.log(erro.message)
                }
            }
        }, 500)
    }
}