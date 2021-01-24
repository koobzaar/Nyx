const {
  ipcRenderer
} = require('electron');
var champions = require('lol-champions');
var $ = require('jQuery');
var champ = [];
var keysChampions = [];
var championstoPickandBan = {
  'pick': [

  ],
  'ban': [

  ]
}
var championsDescription = []
var champTitle = [];
champions.map(value => {
  champ.push(value.name);
  championsDescription.push(value.description);
  champTitle.push(value.title);
  keysChampions.push(value.key);
});
var selectedChampion = {
  'pick': {
    'id': 234,
    'name': 'Viego'
  },
  'ban': {
    'id': 1,
    'name': 'Annie'
  }
}

var electron = require('electron');
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron

var championsName = champ

function toggleAutoAccept(element) {
  if (element.checked) {
    ipcRenderer.send('autoAccept', true)
  } else {
    ipcRenderer.send('autoAccept', false)
  }
}



function teste(event) {
  let state = true;
  $('#responseConfirmed').text('Tudo pronto. Parâmetros confirmados.')
  ipcRenderer.send('draftChampionSelect', championstoPickandBan, state)
  setTimeout(() => {
    $('#responseConfirmed').text('')
  }, 2000);
  
}


function fechar() {
  ipcRenderer.send('close-me')
}

function openContato() {
  ipcRenderer.send('Contato')
}

function minimizar() {
  ipcRenderer.send('minimize_app')
}




function add(id) {
  if (championstoPickandBan.pick.includes(selectedChampion.pick.id) && id === 1) {
    console.log('Campeão já adicionado.')
    return;
  }
  if (championstoPickandBan.ban.includes(selectedChampion.ban.id) && id === 2) {
    console.log('Campeão já adicionado.')
    return;
  }
  $('form :input').val('');
  if (id == 1) { // Adicionar a lista de picks

    console.log('Adicionado a lista de picks')
    championstoPickandBan.pick.push(selectedChampion.pick.id)
    $('.cardLogs').append(`<p class="added" id='` + selectedChampion.pick.id + `'>` +
      selectedChampion.pick.name +
      ` foi adicionado(a) aos picks <button type="button" onclick="removeChampion(` + selectedChampion.pick.id + `,'pick')" class="remove"><img src="../../assets/cancel.svg" alt=""></button></p>`);


  } else if (id == 2) { // Adicionar a lista de bans
    championstoPickandBan.ban.push(selectedChampion.ban.id)
    $('.cardLogs').append(`<p class="added" id='` +
      selectedChampion.ban.id +
      `'>` +
      selectedChampion.ban.name +
      ` foi adicionado(a) aos bans <button type="button" onclick="removeChampion(` + selectedChampion.ban.id + `,'ban')" class="remove"><img src="../../assets/cancel.svg" alt=""></button></p>`);

  }
}

function removeChampion(idCampeao, type) {
  if (type === 'pick') {
    var positionToRemove = championstoPickandBan.pick.indexOf(parseInt(idCampeao))
    championstoPickandBan.pick.splice(positionToRemove, 1)
    $('#' + idCampeao).remove();
  } else if (type === 'ban') {
    var positionToRemove = championstoPickandBan.ban.indexOf(parseInt(idCampeao))
    championstoPickandBan.ban.splice(positionToRemove, 1)
    $('#' + idCampeao).remove();
  }
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;

  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    if (inp.id === "idChampPick") {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/

      /*for each item in the array...*/

      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          $('#pickSquare').remove();
          $('#pickSideSquare').append('<img class="squareImage" id="pickSquare" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/' + arr[i] + '.png" alt="">')
          $('#pickTitleChampion').text(arr[i] + ', ' + champTitle[i]);
          selectedChampion.pick.id = keysChampions[i];
          selectedChampion.pick.name = arr[i];
          $('#pickLoreChampion').text(championsDescription[i]);
        }
      }
    } else if (inp.id === "idChampBan") {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/

      /*for each item in the array...*/

      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {

          $('#banSquare').remove();
          $('#banSideSquare').append('<img class="squareImage" id="banSquare" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/' + arr[i] + '.png" alt="">')
          $('#banTitleChampion').text(arr[i] + ', ' + champTitle[i]);
          selectedChampion.ban.id = keysChampions[i];
          selectedChampion.ban.name = arr[i];
          $('#banLoreChampion').text(championsDescription[i]);
        }
      }

    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  })
};