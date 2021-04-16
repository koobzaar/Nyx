
class Nyx {
    constructor(Application, BrowserWindow, Path, LCUConnector) {
        this.windowConfig = {
            width:1600,
            height:900,
            devToolsEnabled: false,
            icon:"none",
            resizable:false,
            frame:false,
            mainPage: "./src/pages/index/index.html"
        }
        this.modules = {
            application: Application,
            browserWindow: BrowserWindow,
            path:Path,
        }


        this.modules.application.whenReady().then(() => {
            this.startApplication()
        })

        this.modules.application.on('window-all-closed', () => {
           this._onApplicationClosed()
        })
    }


    startApplication() {
        const window = new this.modules.browserWindow(this.windowConfig)
        window.loadFile(this.windowConfig.mainPage)
    }


    _onApplicationClosed(){
        this.modules.application.quit();
    }


}
module.exports = Nyx