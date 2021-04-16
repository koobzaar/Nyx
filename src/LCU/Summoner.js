process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const LeagueClient = require('./LeagueClient')
class Summoner extends LeagueClient {
    constructor(Axios, Routes) {
        super(Axios, Routes)
        this.routes = Routes;
        this.axios = Axios;

        this._setSummonerInfo();

        this.info = {
            accountId: 0,
            displayName: null,
            internalName: null,
            nameChangeFlag: false,
            percentCompleteForNextLevel: 0,
            profileIconId: 0,
            puuid: null,
            rerollPoints: {
                currentPoints: 0,
                maxRolls: 0,
                numberOfRolls: 0,
                pointsCostToRoll: 0,
                pointsToReroll: 0
            },
            summonerId: 0,
            summonerLevel: 0,
            unnamed: false,
            xpSinceLastLevel: 0,
            xpUntilNextLevel: 0
        }
    }
    _setSummonerInfo() {
        this.getLocalSummoner().then((response) => {
            this.info = response;
            console.log(this.info.displayName)
        })
    }

}
module.exports = Summoner