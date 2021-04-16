const { app, BrowserWindow } = require('electron')
const path = require('path');
const LCUConnector = require('lcu-connector')
const Application = require('../../Nyx');
const LCUSummoner = require('../LCU/Summoner')
const APIClient = require('../LCU/Routes');
const Axios = require('axios');


var Routes;

var connector = new LCUConnector()
connector.on('connect', (data) => {
    Routes = new APIClient(data.protocol + '://' + data.address + ':' + data.port, data.username, data.password)
    startSummoner(Routes)
})
connector.start();



function startSummoner(routes){
    var Summoner = new LCUSummoner(Axios, routes)    
}
const Nyx = new Application(
    app, 
    BrowserWindow, 
    path
)
