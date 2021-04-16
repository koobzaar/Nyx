class RiotAPI {
    constructor(Axios, Routes) {
        this.axios = Axios;
        this.routes = Routes;

        this._getLatestLeagueData()

        this.currentLeagueVersion = null;
        this.currentChampions = null;
        this.nyxLanguage = 'pt_BR';
    }
    async _getLatestLeagueData(){
        this.currentLeagueVersion = await this._getLeagueVersion().then((LeagueVersion)=>{
            this._setCurrentChampions(LeagueVersion,"pt_BR")

        });
    }
    async _getLeagueVersion() {
        this.currentLeagueVersion = await this.axios({
            method: 'GET',
            url: "https://ddragon.leagueoflegends.com/api/versions.json"
        }).then(function (response) {
            console.log(response.data[0])
            return response.data[0];
        })
        return this.currentLeagueVersion;
    }
    async _setCurrentChampions(latestVersion,language){
        let ChampionsArray = new Array()
        let Champions = await this._getLeagueChampionsFromDDragon(latestVersion,language)
        Champions.map(champion=>{
            ChampionsArray.push({
                "id":champion[1].id.toLowerCase(),
                "key":champion[1].key.toString(),
                "name":champion[1].name,
                "title":champion[1].title,
                "icon":`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion[1].id}.png`,
                "description":champion[1].blurb
            })
        })
        this.currentChampions = ChampionsArray;
        
    }
    async _getLeagueChampionsFromDDragon(latestVersion,language) {
        console.log(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/${language}/champion.json`)
        return await this.axios({
            method: 'GET',
            url: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/${language}/champion.json`,
        }).then(function (response) {
            return Object.entries(response.data.data);
            
        })
    }
}
module.exports = RiotAPI;