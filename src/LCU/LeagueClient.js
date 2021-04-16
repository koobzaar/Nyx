const DataDragon = require('./DataDragon')
class LeagueClient extends DataDragon {
    constructor(Axios, Routes){
        super(Axios, Routes)
        this.axios = Axios;
        this.routes = Routes;
    }
    async getLocalSummoner(){
        var LocalSummoner = await this.axios({
            method: 'GET',
            url: this.routes.Route('localSummoner'),
            headers: {
                Authorization: this.routes.getAuth()
            }
        }).then(function (response) {
            return response.data
        })
        return LocalSummoner
    }
}
module.exports = LeagueClient;