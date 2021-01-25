const electron = require('electron');
const {
  ipcRenderer
} = electron;
async function profileUpdate() {
  let data
  try {
    data = ipcRenderer.sendSync("profileUpdate");
      } catch (e) {
    console.log("And error occured updating the profile information: " + e)
  }
}
profileUpdate();
setTimeout(function() {
  document.getElementById("loading-page").className += "loaded";
  document.getElementById("loader").className += "opzero";
  document.getElementById("lastray").className += " finalray";
  document.body.className += "whitebk";
},80000);