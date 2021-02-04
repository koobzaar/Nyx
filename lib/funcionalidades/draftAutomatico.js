module.exports = class automaticDraft {
    constructor(){
        this.request = undefined;
        this.routes = undefined;
        this.cellIDJogador = undefined;
        this.associacoes = [10, 13, 14, 17, 18, 11, 12, 15, 16, 19, 11];
        this.data = null;
        this.currentTentativePick = 0
    }
    _carregarDados(requestModule, routesModule) {
        this.request = requestModule;
        this.routes = routesModule;
    }
    _toggleAutoDraft(estado, champions){
        this.ativo = estado;
        if(this.ativo){
        let sendingRequest = setInterval(() => {
              let url = this.routes.Route('submitChampSelectSession');
              let body = {
                url: url,
                "rejectUnauthorized": false,
                headers: {
                  Authorization: this.routes.getAuth()
                },
              }
              let retornoSessaoJogador = (error, response, body) => {
                this.data = JSON.parse(body);
                this.cellIDJogador = this.data.localPlayerCellId;
                if (this.data.httpStatus != 404) {
                  if (this.data.timer.phase == "PLANNING")
                    this.currentTentativePick = 0;
                  if (this.data.actions[7][0].completed == true){
                    this.ativo = false;
                    clearTimeout(sendingRequest)
                  }
                  if (this.data.actions[1][0].completed) {
                    let url = this.routes.Route('submitChampSelectAction') + this.associacoes[this.data.localPlayerCellId];
                    let body = {
                      url: url,
                      "rejectUnauthorized": false,
                      headers: {
                        Authorization: this.routes.getAuth()
                      },
                      json: {
                        "actorCellId": 0,
                        "championId": champions.pick[this.currentTentativePick],
                        "completed": true,
                        "id": 0,
                        "isAllyAction": true,
                        "type": "string"
                      }
                    }
                    let retornoFinalizacao = (error, response, body) => { //null?
                      try {
                        if (body.httpStatus == '500')
                          this.currentTentativePick++;
                        if (body.httpStatus == '200') {
                          this.currentTentativePick = 0;
                          this.ativo = false;
                        }
                      } catch (e) {}
                    }
                    this.request.patch(body, retornoFinalizacao);
                  } else { // banir
                    let url = this.routes.Route('submitChampSelectAction') + this.data.localPlayerCellId;
                    let body = {
                      url: url,
                      "rejectUnauthorized": false,
                      headers: {
                        Authorization: this.routes.getAuth()
                      },
                      json: {
                        "actorCellId": 0,
                        "championId": champions.ban[0],
                        "completed": true,
                        "id": 0,
                        "isAllyAction": true,
                        "type": "string"
                      }
                    }
                    this.request.patch(body);
                  }
                }
              }
              this.request.get(body, retornoSessaoJogador);
          }, 500);
    }
}
}