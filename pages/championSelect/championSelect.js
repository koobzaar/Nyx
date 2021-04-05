const { ipcRenderer } = require('electron');
var champions = require('../../lib/champions/champions.json');
var $ = require('jQuery');
console.log(champions)
var champ = [];
var keysChampions = [];
var championsDescription = []
var champTitle = [];
champions.map(value =>{
    champ.push(value.name);
    championsDescription.push(value.description);
    champTitle.push(value.title);
    keysChampions.push(value.key);
});
var champKey = 234;
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
function toggleInstalock(element) {
    champid = document.getElementById("champid").value;
    laneid = document.getElementById("laneid").value;
    if (element.checked) {
        ipcRenderer.send('submitInstalock', champid, true);
    } else {
        ipcRenderer.send('submitInstalock', champid, laneid, false)
    }
}
function autoChampionSelect(e){
    e.preventDefault();
    console.log('bang')
   var aceitarFila = document.getElementById('autoacceptToggle').checked;
   if(aceitarFila)
   ipcRenderer.send('autoAccept',true)
   ipcRenderer.send('submitInstalock', champKey, true);
}
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              console.log(arr[i])
              console.log(i)
            $('.squareImage').remove();
            $('#championSquare').append('<img class="squareImage" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/'+arr[i]+'.png" alt="">')
            $('#titleChampion').text(arr[i]+', '+ champTitle[i]);
            champKey = keysChampions[i];
            $('#loreChampion').text(championsDescription[i]);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
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
  });
  }
  function fechar(){
    ipcRenderer.send('close-me')
  }
  function openContato(){
    ipcRenderer.send('Contato')
  }
  function minimizar(){
    ipcRenderer.send('minimize_app')
  }
  console.log(championsName)