import electron from 'electron';
import path from 'path';
import url from 'url';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

// *Funcoes devem ser exportadas pra serem acessiveis ao front-end
// Executa comando do SO e retorna resultado ao front-end
// Outro processo é o IPCMaine IPCRenderer
// https://electronjs.org/docs/api/ipc-main
// https://electronjs.org/docs/api/ipc-renderer
exports.execProcess = (process, callback) => {
  const { exec } = require('child_process');
  const callExec = exec(process)

  callExec.stdout.on('data', function (data) {
    callback(data)
  })
  callExec.stderr.on('data', function (data) {
    callback("<b>ERROR:</b> \n" + data)
  })
}

exports.printWindow = (process, callback) => {
  console.log('printWindow');
  console.log(process);
  var options = {
    printBackground: true,
    landscape: false
  }

    // Defining a new BrowserWindow Instance
    let win = new BrowserWindow({
      show: true,
      webPreferences: {
        nodeIntegration: true
      }
    });
    //win.loadURL('https://www.google.com/');
    win.loadFile(process);

    win.webContents.on('did-finish-load', () => {
      win.webContents.printToPDF(options, (success, failureReason) => {
        if (!success) { 
          console.log(failureReason);
        }else{
          callback('Print Initiated')
        }
      });
    });
 
}

exports.printHolerith = (html, callback) => {
  const { shell } = require('electron')
  shell.openPath(html);

    callback('Print Initiated')
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,

    // Caracteristicas visuais da janela
    // autoHideMenuBar: true,
    // titleBarStyle: 'customButtonsOnHover',
    frame: true, // Retira barra superior
    useContentSize: false, // Inibe mostragem de dimensao da janela

    webPreferences: {
      nodeIntegration: true
    }
  });
  //mainWindow.removeMenu();

  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
