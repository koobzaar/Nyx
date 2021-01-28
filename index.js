var $ = require('jQuery');


const electron = require('electron');
const {
  ipcRenderer
} = electron;

var formularioStatus = document.querySelector('#definirStatus');
var disponibilidadeClient = document.querySelector('#disponibilidadeClient');
var mudarElo = document.querySelector('#changeElo');

disponibilidadeClient.addEventListener('submit', submitAvailability)
formularioStatus.addEventListener('submit', envioStatus);
mudarElo.addEventListener('submit', submitTierDivison);

const closeApp = document.getElementById('close');
closeApp.addEventListener('click', () => {
    ipcRenderer.send('close-me')
});
const minimizeApp = document.getElementById('minimize');
minimizeApp.addEventListener('click', () => {
  ipcRenderer.send('minimize_app')
});
ipcRenderer.on('pingServidordeJogo1', function (e, item) {
  $('.classificacaoPing').remove();
  if (item < 35)
    $('#valorPing').append('<span class="classificacaoPing" id="goodPing">' + item + '</span>')
  else if (item < 60)
    $('#valorPing').append('<span class="classificacaoPing" id="averagePing">' + item + '</span>')
  else
    $('#valorPing').append('<span class="classificacaoPing" id="badPing">' + item + '</span>')
})
ipcRenderer.on('pingServidorLogin', function (e, item) {
  if(item=='unknown')
  $('#pingClient').text('Não houve resposta por parte da Riot Games.');
  else
  $('#pingLogin').text('Seu ping é de '+item+'ms.');
})
ipcRenderer.on('pingServidorClient', function (e, item) {
  if(item=='unknown')
  $('#pingClient').text('Não houve resposta por parte da Riot Games.');
  else
  $('#pingClient').text('Seu ping é de '+item+'ms.');
})
ipcRenderer.on('pingServidorChat', function (e, item) {
  if(item=='unknown')
  $('#pingChat').text('Não houve resposta por parte da Riot Games.');
  else
  $('#pingChat').text('Seu ping é de '+item+'ms.');

});
ipcRenderer.on('pingServidorVoice', function (e, item) {
  if(item=='unknown')
  $('#pingVoice').text('Não houve resposta por parte da Riot Games.');
  $('#pingVoice').text('Seu ping é de '+item+'ms.');
})
async function profileUpdate() {
  let data
  try {
    data = ipcRenderer.sendSync("profileUpdate");
    $('#nomeInvocador').text(data.name)
    $('#invocadorImagem').append("<img src=https://cdn.communitydragon.org/latest/profile-icon/" + (data.iconID || "1") + ' alt="">')
    $('#nivelInvocador').append(data.level)
    $('#ligaInvocador').append(data.rankedTier)
  } catch (e) {
    console.log("And error occured updating the profile information: " + e)
  }
}

profileUpdate();
function openContato(){
  ipcRenderer.send('Contato')
}
function liberarSkin(e){
  console.log('liberando')
  ipcRenderer.send('liberarSkin', e);
}
function envioStatus(e) {
  e.preventDefault();
  var status = `"`+document.querySelector('#statusUsuario').value+`"`;
  ipcRenderer.send('alterarStatus', status)
  document.querySelector('#statusUsuario').value = '';
}

function submitAvailability(e) {
  e.preventDefault();

  var availability = `"`+document.querySelector('#availability').value+`"`
  console.log(availability)
  ipcRenderer.send('submitAvailability', availability)
}

function submitLoot(){
  ipcRenderer.send('submitLoot');
}
function submitTierDivison(e) {
  e.preventDefault();
  var selectedDivision = document.querySelector('#division').value;
  var selectedQueue = document.querySelector('#queue').value;
  var selectedTier = document.querySelector('#tier').value;
  ipcRenderer.send('submitTierDivison', selectedTier, selectedDivision, selectedQueue);
}