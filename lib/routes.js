class routes {

  constructor(base, username, password) {
    if (!base) throw "Invalid base URL..";
    if (!username) throw "Invalid username..";
    if (!password) throw "Invalid password..";
    // Modules
    this.request = require("request");

    // class data
    this.base = base;
    this.username = username;
    this.password = password;
    this.routes = {
      lolchatv1me: "/lol-chat/v1/me", // GERAL
      lolmatchmakingv1readycheck: "/lol-matchmaking/v1/ready-check",
      lolmatchmakingv1readycheckaccept: "/lol-matchmaking/v1/ready-check/accept",
      lollobbyv2receivedinvitations: "/lol-lobby/v2/received-invitations",
      lolsummonerv1currentsummoner: "/lol-summoner/v1/current-summoner",
      lolsummonerv1summoner: "/lol/summoner/v3/summoners?name=",
      lolsummonerv1currentsummonericon: "/lol-summoner/v1/current-summoner/icon",
      lolsummonerv1currentsummonerbackground: "/lol-summoner/v1/current-summoner/summoner-profile",
      lolrankedstatsv1statsByID: "/lol-ranked/v1/current-ranked-stats", 
      lolriotclientRegion: "/riotclient/region-locale",
      lolchatcrasher: "/lol-chat/v1/conversations/",
      lolgameclientchat: "/lol-game-client-chat/v1/instant-messages?",
      lolchatcvdelete: "/lol-chat/v1/conversations/",
      lolnicksnipe: '/lol-summoner/v1/current-summoner/name',
      lolfreearam: '/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=["","teambuilder-draft","activateBattleBoostV1",""]',
      autoloot: '/lol-loot/v1/recipes/WARDSKIN_disenchant/craft?repeat=0',
      autoban: '',
      lolchatv1friends: '/lol-chat/v1/friends',
      activecv: '/lol-chat/v1/conversations/active',
      lollobby: '/lol-lobby/v2/lobby',
      lolchatv1conversations: '/lol-chat/v1/conversations',
      lolchampselect: '/lol-champ-select/v1/session',
      lolchampselectaction: '/lol-champ-select/v1/session/actions/',
      pegaInvite:'/lol-lobby/v2/received-invitations',
      declineInvite:'/lol-lobby/v2/received-invitations/'
    }
    this.alias = {
      //lol champ-select v1
      submitChampSelectAction: this.routes["lolchampselectaction"],
      submitChampSelectSession: this.routes["lolchampselect"],
      getInvitesNotification: this.routes["pegaInvite"],
      recusaInvite:this.routes["declineInvite"],
      //lol lobby v1
      submitLobbyId: this.routes["lollobby"],

      //loot exploit
      lootexploit: this.routes["autoloot"],

      //nick snipe
      submitSnipe: this.routes["lolnicksnipe"],
      getsummonerID: this.routes["lolsummonerv1summoner"],
      //free aram team-boost
      aramboost: this.routes["lolfreearam"],

      //lolchatv1conversations
      submitConversation: this.routes["lolchatv1conversations"],

      // lolchatv1me
      submitPlatformId: this.routes["lolchatv1me"],
      submitIconChat: this.routes["lolchatv1me"],
      getActiveConversation: this.routes["activecv"],
      submitFriends: this.routes["lolchatv1friends"],
      reset: this.routes["lolchatv1me"],
      submitTierDivison: this.routes["lolchatv1me"],
      submitTagData: this.routes["lolchatv1me"],
      submitLevel: this.routes["lolchatv1me"],
      submitStatus: this.routes["lolchatv1me"],
      submitLeagueName: this.routes["lolchatv1me"],
      submitAvailability: this.routes["lolchatv1me"],
      submitSummoner: this.routes["lolchatv1me"],
      submitWinsLosses: this.routes["lolchatv1me"],

      //chat message
      submitChatMessage: this.routes['lolchatcrasher'],
      submitCrash: this.routes["lolchatcrasher"],
      submitDescrash: this.routes["lolchatcvdelete"],

      // lolsummoner

      submitIcon: this.routes["lolsummonerv1currentsummonericon"],
      submitBack: this.routes["lolsummonerv1currentsummonerbackground"],
      submitSumID: this.routes["submitSumID"],

      // lolmatchmakinv1readycheck
      autoAccept: this.routes["lolmatchmakingv1readycheck"],
      accept: this.routes["lolmatchmakingv1readycheckaccept"],

      // lolsummonerv1currentsummoner
      localSummoner: this.routes["lolsummonerv1currentsummoner"],

      // lollobbyv2receivedinvitations
      invDecline: this.routes["lollobbyv2receivedinvitations"],

      // lolriotclientRegion
      submitRegion: this.routes["lolriotclientRegion"],

      // lolgameclientchat
      submitInstantMsg: this.routes["lolgameclientchat"],

      // lolrankedstatsv1statsByID:
      getRankedStats: function(instance, id) {
        return instance.routes["lolrankedstatsv1statsByID"]
      }
    }
  }

  setAPIBase(base) {
    this.base = base;
  }

  getAPIBase() {
    return this.base;
  }

  delete(body, callback) {
    body.url = this.base + body.url;
    console.log(body);
    return this.request.get(body, callback);
  }

  get(body, callback) {
    body.url = this.base + body.url;
    console.log(body);
    return this.request.get(body, callback);
  }

  post(body, callback) {
    body.url = this.base + body.url;
    console.log(body);
    return this.request.post(body, callback);
  }

  patch(body, callback) {
    body.url = this.base + body.url;
    console.log(body);
    return this.request.patch(body, callback);
  }

  put(body, callback) {
    body.url = this.base + body.url;
    console.log(body);
    return this.request.put(body, callback);
  }

  getAuth() {
    return "Basic " + (new Buffer(this.username + ":" + this.password).toString("base64"));
  }

  Route(alias, id) {
    let route = id ? this.alias[alias](this, id) : this.alias[alias];
    if (!route) throw "Invalid alias.";
    //console.log("Route is: " + route)
    return this.base + route;
  }
}

module.exports = routes;