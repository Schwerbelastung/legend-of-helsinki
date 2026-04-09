const { app, BrowserWindow } = require('electron')
const path = require('path')

app.setAppUserModelId('Legend of Helsinki')

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 720,
        height: 780,
        minWidth: 400,
        minHeight: 500,
        title: 'Legend of Helsinki',
        backgroundColor: '#0a0a0f',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    })
    win.loadFile('index.html')
    win.removeMenu()
})

app.on('window-all-closed', () => app.quit())
