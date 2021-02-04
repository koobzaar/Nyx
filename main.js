
var nyxGlobalConfig = require('./config/nyxGlobal.json');
var nyxFunctionsConfig = require('./config/nyxFunctions.json');
var funcInstalockBlind = require('./lib/funcionalidades/instalockBlind.js');
var funcAceitarFila = require('./lib/funcionalidades/aceitarFila.js')
var funcDraftAutomatico = require('./lib/funcionalidades/draftAutomatico.js')
const {
  app,
  BrowserWindow,
  ipcMain,
  shell
} = require('electron')
let JanelaPrincipal;
var gerenciadorRequest = require('./lib/requestSender.js');
gerenciadorRequest = new gerenciadorRequest()
function createWindow() {
  JanelaPrincipal = new BrowserWindow(nyxGlobalConfig.confDeInicializacao)
  // JanelaPrincipal.removeMenu();
  JanelaPrincipal.loadFile('./pages/loading/loading.html')
};
var Summoner = require('./lib/invocador')
var url = require('url')
var path = require('path')
var request = require('request')
var LCUConnector = require('lcu-connector')
var APIClient = require('./lib/routes')
var connector = new LCUConnector()
var routes
var nyxInstalockBlind = new funcInstalockBlind();
var nyxAceitarFila = new funcAceitarFila();
var nyxDraftAutomatico = new funcDraftAutomatico()
const {
  type
} = require('os');



app.on('ready', function () {
  createWindow()
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on('Contato', function () {
  shell.openExternal('https://discord.gg/zREzYzB');
});
async function pingRiot() {
  var ping = require('ping');
  setTimeout(async function () {

    for (let host of nyxFunctionsConfig.pingRiot.enderecos) {
      try {
        if (host === '45.7.36.80') {
          let res = await ping.promise.probe(host);
          JanelaPrincipal.webContents.send('pingServidordeJogo1', res.time)
        } else if (host === 'lq.br.lol.riotgames.com') {
          let res = await ping.promise.probe(host);
          JanelaPrincipal.webContents.send('pingServidorLogin', res.time)
        } else if (host === 'prod.br.lol.riotgames.com') {
          let res = await ping.promise.probe(host);
          JanelaPrincipal.webContents.send('pingServidorClient', res.time)
        } else if (host === 'br.chat.si.riotgames.com') {
          let res = await ping.promise.probe(host);
          JanelaPrincipal.webContents.send('pingServidorChat', res.time)
        }
      } catch (e) {
        console.log(e.message)
      }
    }
    pingRiot();
  }, 500)

}

connector.on('connect', (data) => {
  routes = new APIClient(data.protocol + '://' + data.address + ':' + data.port, data.username, data.password)
  gerenciadorRequest._carregarDados(data)
  nyxInstalockBlind._carregarDados(request,routes)
  nyxAceitarFila._carregarDados(request,routes)
  nyxDraftAutomatico._carregarDados(request,routes)
  getLocalSummoner()
})
ipcMain.on('close-me', (evt, arg) => {
  app.quit()
})
ipcMain.on('restart-me', (evt, arg) => {
  app.relaunch();
  app.quit();
})
ipcMain.on('minimize_app', function () {
  JanelaPrincipal.minimize()
})

pingRiot();
function getLocalSummoner() {
  let url = routes.Route("localSummoner")
  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    }
  }
  let callback = function (error, response, body) {
    console.log(body)
    LocalSummoner = new Summoner(body, routes)
  }
  request.get(body, callback)
}
ipcMain.on('profileUpdate', (event, wins, losses) => {
  try {
    getLocalSummoner();
    event.returnValue = LocalSummoner.getProfileData();
    if (nyxGlobalConfig.states.inicializou == false)
      JanelaPrincipal.loadFile('index.html');
      nyxGlobalConfig.states.inicializou = true;
  } catch (e) {
    console.log('Erro ao tentar receber as informações do usuário: ' + e.message);
    JanelaPrincipal.loadFile('./pages/summonerNotFound/summonerNotFound.html');
  }
});
ipcMain.on('alterarStatus', (event, status) => {
 gerenciadorRequest._putInformacoesLCU("statusMessage","submitStatus",status)
});
ipcMain.on('submitAvailability', (event, availability) => {
  gerenciadorRequest._putInformacoesLCU("availability","submitAvailability",availability)
});
ipcMain.on('liberarSkin', (event) => {
  gerenciadorRequest._postInformacoesLCU('aramboost')
});
ipcMain.on('submitTierDivison', (event, tier, division, queue) => {
  var requestrule = function tierDivision(x){
    return x.json.lol.regalia = `{\"bannerType\":1,\"crestType\":2}`
  }
  gerenciadorRequest._putInformacoesLCU(
    'lol',
    'submitTierDivison',
    `{
        "regalia":null,
        "rankedSplitRewardLevel": "3",
        "rankedLeagueTier": "`+tier+`",
        "rankedLeagueQueue": "`+queue+`",
        "rankedLeagueDivision": "`+division+`"
    }`
  )
});
ipcMain.on('autoAccept', (event, int) => {
  nyxAceitarFila.toggleAceitarFila(int);
});
ipcMain.on('draftChampionSelect', (event, championstoPickandBan, state) => {
  nyxDraftAutomatico._toggleAutoDraft(state,championstoPickandBan);
  nyxAceitarFila.toggleAceitarFila(true);
});
ipcMain.on('submitInstalock', (event, champid, int) => {
  nyxInstalockBlind.toogleInstalock(int)
  nyxInstalockBlind.campeaoLock = champid;
});
connector.start();