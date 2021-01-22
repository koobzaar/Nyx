const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

let JanelaPrincipal;

function createWindow() {
  JanelaPrincipal = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // win.removeMenu();
  JanelaPrincipal.loadFile('./index.html')
}

app.on('ready', function () {
  createWindow()
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
var Summoner = require('./lib/invocador')
var url = require('url')
var path = require('path')
var request = require('request')
var fs = require('fs')
var LCUConnector = require('lcu-connector')
var APIClient = require('./lib/routes')
var connector = new LCUConnector()
var routes
// load configuration from file 'config-default-' + process.platform
// Only linux is supported at the moment
var ping = require('ping');
async function pingRiot() {

  var hosts = ['45.7.36.80', 'lq.br.lol.riotgames.com', 'prod.br.lol.riotgames.com', 'br.chat.si.riotgames.com'];
  setTimeout(async function () {
    for (let host of hosts) {
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
  requestUrl = data.protocol + '://' + data.address + ':' + data.port
  routes = new APIClient(requestUrl, data.username, data.password)

  getLocalSummoner()

  userAuth = data.username
  passwordAuth = data.password

  console.log('Request base url set to: ' + routes.getAPIBase())
})

pingRiot();
// load configuration from file 'config-default-' + process.platform
// Only linux is supported at the moment


// Riot Games

let mainWindow
let addWindow
var userAuth
var passwordAuth
var requestUrl

function getLocalSummoner() {

  let url = routes.Route("localSummoner")
  console.log(url)
  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    }
  }

  let callback = function (error, response, body) {
    LocalSummoner = new Summoner(body, routes)
  }

  request.get(body, callback)
}
ipcMain.on('profileUpdate', (event, wins, losses) => {
  getLocalSummoner()
  event.returnValue = LocalSummoner.getProfileData()
})

ipcMain.on('alterarStatus', (event, status) => {

  let url = routes.Route("submitStatus")
  console.log(status)
  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "statusMessage": status
    }
  }

  request.put(body)

})

ipcMain.on('submitAvailability', (event, availability) => {
  console.log(availability)
  let url = routes.Route("submitAvailability")
  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "availability": availability
    }
  }

  request.put(body)

})

ipcMain.on('liberarSkin', (event) => {
  console.log('chegou')
  
  let url = routes.Route("aramboost")
  console.log(url)
  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json:{}
  }
  console.log('foi?')
  request.post(body)

})
ipcMain.on('submitTierDivison', (event, tier, division, queue) => {

  let url = routes.Route("submitTierDivison")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "lol": {
        "regalia": "{\"bannerType\":1,\"crestType\":2}",
        "rankedSplitRewardLevel": "3",
        "rankedLeagueTier": tier,
        "rankedLeagueQueue": queue,
        "rankedLeagueDivision": division
      }
    }
  }

  request.put(body)

})
ipcMain.on('submitLoot', (event) => {

  let url = routes.Route("lolchatv1friends");
  console.log(url)
})


connector.start()