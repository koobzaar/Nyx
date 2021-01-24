const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
let JanelaPrincipal;
function createWindow() {
  JanelaPrincipal = new BrowserWindow({
    width: 1600,
    height: 900,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // JanelaPrincipal.removeMenu();
  JanelaPrincipal.loadFile('./index.html')
};
var associations = [
  10,
  13,
  14,
  17,
  18,
  11,
  12,
  15,
  16,
  19,
  11
];
// Enable live reload for all the files inside your project directory
app.on('ready', function () {
  createWindow()
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on('Contato', function () {
  const {
    shell
  } = require('electron');
  shell.openExternal('https://discord.gg/zREzYzB');
});
var Summoner = require('./lib/invocador')
var url = require('url')
var path = require('path')
var request = require('request')
var fs = require('fs')
var LCUConnector = require('lcu-connector')
var APIClient = require('./lib/routes')
var connector = new LCUConnector()
var routes
var ping = require('ping');
const {
  type
} = require('os');
var autoAccept_enabled = false;
var instalock_enabled = false;
var draft_enabled = false;
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
ipcMain.on('close-me', (evt, arg) => {
  app.quit()
})
ipcMain.on('minimize_app', function () {
  JanelaPrincipal.minimize()
})

pingRiot();
var mainWindow, addWindow, userAuth, passwordAuth,requestUrl;
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
var autoAccept = function () {
  setInterval(function () {
    if (autoAccept_enabled) {
      if (!routes) return

      let url = routes.Route("autoAccept")

      let body = {
        url: url,
        "rejectUnauthorized": false,
        headers: {
          Authorization: routes.getAuth()
        },
      }

      let callback = function (error, response, body) {
        if (!body || !IsJsonString(body)) return
        var data = JSON.parse(body)

        if (data["state"] === "InProgress") {

          if (data["playerResponse"] === "None") {
            let acceptUrl = routes.Route("accept")
            let acceptBody = {
              url: acceptUrl,
              "rejectUnauthorized": false,
              headers: {
                Authorization: routes.getAuth()
              },
              json: {}
            }

            let acceptCallback = function (error, response, body) {}

            if (autoAccept_enabled) {
              request.post(acceptBody, acceptCallback)
            }

          }
        }
      }

      request.get(body, callback)
    }
  }, 1000)
}

ipcMain.on('submitAvailability', (event, availability) => {
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
  let url = routes.Route("aramboost")
  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {}
  }
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
})
ipcMain.on('autoAccept', (event, int) => {
  if (int) {
    autoAccept_enabled = true
  } else {
    autoAccept_enabled = false
  }
})

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
var autoAccept = function () {
  setInterval(function () {
    if (autoAccept_enabled) {
      if (!routes) return

      let url = routes.Route("autoAccept")

      let body = {
        url: url,
        "rejectUnauthorized": false,
        headers: {
          Authorization: routes.getAuth()
        },
      }

      let callback = function (error, response, body) {
        if (!body || !IsJsonString(body)) return
        var data = JSON.parse(body)

        if (data["state"] === "InProgress") {

          if (data["playerResponse"] === "None") {
            let acceptUrl = routes.Route("accept")
            let acceptBody = {
              url: acceptUrl,
              "rejectUnauthorized": false,
              headers: {
                Authorization: routes.getAuth()
              },
              json: {}
            }

            let acceptCallback = function (error, response, body) {}

            if (autoAccept_enabled) {
              request.post(acceptBody, acceptCallback)
            }

          }
        }
      }

      request.get(body, callback)
    }
  }, 1000)
}

ipcMain.on('draftChampionSelect', (event, championstoPickandBan, state) => {
  draft_enabled = state;
  autoAccept_enabled = true;
  draftPickLockBan(championstoPickandBan);
})
var currentTentativePick = 0;
var draftPickLockBan = function (champions) {
  setInterval(() => {
    if (draft_enabled) {
      let url = routes.Route('submitChampSelectSession');
      let body = {
        url: url,
        "rejectUnauthorized": false,
        headers: {
          Authorization: routes.getAuth()
        },
      }
      let callback = function (error, response, body) {
        var data = JSON.parse(body);
        var infoUsuario = {
          'cellID': 0,
        };
        infoUsuario.cellID = data.localPlayerCellId;
        
        if (data.httpStatus != 404) {
          if(data.timer.phase=="PLANNING")
            currentTentativePick=0;
          if(data.actions[7][0].completed==true)
            draft_enabled=false;
          if (data.actions[1][0].completed) { 
            let url = routes.Route('submitChampSelectAction') + associations[data.localPlayerCellId];
            let body = {
              url: url,
              "rejectUnauthorized": false,
              headers: {
                Authorization: routes.getAuth()
              },
              json: {
                "actorCellId": 0,
                "championId": champions.pick[currentTentativePick],
                "completed": true,
                "id": 0,
                "isAllyAction": true,
                "type": "string"
              }
            }
            let callback2 = function (error, response, body) { //null?
              try {
                if (body.httpStatus == '500')
                  currentTentativePick++;
                if (body.httpStatus == '200') {
                  console.log('finalizado.')
                  currentTentativePick = 0;
                  draft_enabled = false;
                }
              } catch (e) {}
            }
            request.patch(body, callback2);
          } else { // banir
            let url = routes.Route('submitChampSelectAction') + data.localPlayerCellId;
            let body = {
              url: url,
              "rejectUnauthorized": false,
              headers: {
                Authorization: routes.getAuth()
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
            request.patch(body);
          }
        }
      }
      request.get(body, callback);

    }

  }, 500);
};

var instalock = function () {
  setInterval(function () {
    if (instalock_enabled) {
      let url = routes.Route('submitChampSelectSession');
      let body = {
        url: url,
        "rejectUnauthorized": false,
        headers: {
          Authorization: routes.getAuth()
        },
      }

      let callback = function (error, response, body) {
        var data = JSON.parse(body);
        var cellId, i;
        var localSumId;
        var spamTimes = 5;
        var spamTimeMs = 90000 - (500 * spamTimes);

        if (data['isSpectating'] == false && data['timer']['adjustedTimeLeftInPhase'] > spamTimeMs) {

          if (data['isCustomGame'] == false) {
            cellId = data['localPlayerCellId'];


          } else {
            cellId = data['localPlayerCellId'] + 1;

          }
          let urlLock = (routes.Route('submitChampSelectAction') + cellId);

          let bodyLock = {
            url: urlLock,
            "rejectUnauthorized": false,
            headers: {
              Authorization: routes.getAuth()
            },
            json: {
              "championId": championToLock,
              "completed": true

            }
          }
          request.patch(bodyLock);

        }
      }
      request.get(body, callback);
    }
  }, 500)
}

ipcMain.on('submitInstalock', (event, champid, int) => {
  if (int) {
    championToLock = champid;
    instalock_enabled = true;
  } else {
    instalock_enabled = false;
  }
})

autoAccept();
instalock();
connector.start();