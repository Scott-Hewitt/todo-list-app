const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 563,
        webPreferences: {
            nodeIntegration: true
        }
    });

    const path = require('path');
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
});
