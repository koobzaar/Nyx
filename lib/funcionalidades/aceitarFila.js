module.exports = class aceitarFila {
    constructor() {
        this.ativo = false
        this.routes = undefined,
            this.request = undefined
    }
    _carregarDados(requestModule, routesModule) {
        this.routes = routesModule;
        this.request = requestModule;
    }
    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    toggleAceitarFila(estado) {
        estado ? this.ativo = estado : this.ativo = estado
        if (this.ativo) {
            setInterval(() => {
                if (!this.routes) return;
                let url = this.routes.Route("autoAccept")
                let body = {
                    url: url,
                    "rejectUnauthorized": false,
                    headers: {
                        Authorization: this.routes.getAuth()
                    },
                }
                let callback = (error, response, body) => {
                    if (!body || !this.IsJsonString(body)) return
                    var data = JSON.parse(body)
                    if (data["state"] === "InProgress") {
                        if (data["playerResponse"] === "None") {
                            let acceptUrl = this.routes.Route("accept")
                            let acceptBody = {
                                url: acceptUrl,
                                "rejectUnauthorized": false,
                                headers: {
                                    Authorization: this.routes.getAuth()
                                },
                                json: {}
                            }
                            let acceptCallback = function (error, response, body) {}
                            if (this.ativo) {
                                this.request.post(acceptBody, acceptCallback)
                            }
                        }
                    }
                }
                this.request.get(body, callback)
            }, 1000)

        }
    }
}