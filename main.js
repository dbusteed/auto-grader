const { app, 
  BrowserWindow, 
  ipcMain,
  dialog
} = require('electron')

const fs = require('fs-extra')
const path = require('path')
const AdmZip = require('adm-zip')

let zipPath;
let zipName;
let folderName;
let folderPath;
let baseDir;
let submissions = [];
let currentSubIndex = 0;
let targetFile;

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.on('ready', createWindow)

ipcMain.on('choose-directory', (event, args) => {

  let dialogPath = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: { name: 'ZIPS', extensions: ['zip'] } // TODO
  })

  zipPath = dialogPath[0]

  baseDir = path.dirname(zipPath)
  zipName = path.basename(zipPath)
  folderName = path.parse(zipName).name

  event.returnValue = zipName
})

ipcMain.on('start-grading', (event, args) => {

  targetFile = args

  var zip = new AdmZip(zipPath)

  zip.extractAllTo('.')

  folderPath = baseDir + '\\' + folderName

  fs.readdirSync(folderPath).forEach( sub => {
    // TODO extract netID --> path.parse(sub).name.split('_')[2]
    id = path.parse(sub).name
    subPath = folderPath + '\\' + sub

    submissions.push( [id, subPath] )
  })

  // filter the submissions?

  event.returnValue = 'yeet'
})

ipcMain.on('get-submission-data', (event, args) => {
  
  id = submissions[currentSubIndex][0]
  subPath = submissions[currentSubIndex][1]
  
  if(path.parse(subPath).ext == '.zip') {
    
    while(path.parse(subPath).ext == '.zip') {
      var zip = new AdmZip(subPath)
      
      zip.extractAllTo(path.dirname(subPath))
      
      subPath = path.dirname(subPath) + '\\' + path.parse(subPath).name
    }

    subPath = subPath + '\\' + fs.readdirSync(subPath)[0]
  } 

  console.log(subPath)

  event.returnValue = [id, subPath]

  currentSubIndex++
})

ipcMain.on('debug', (event, args) => {
  submissions.forEach( f => {
    console.log(f)
  })
  event.returnValue = 'DEBUG'
})