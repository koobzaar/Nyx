const {
    ipcRenderer
  } = require('electron');
function relaunch(){
    ipcRenderer.send('restart-me')
}
function closeApp(){
    ipcRenderer.send('close-me');
}