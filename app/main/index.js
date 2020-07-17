import path from 'path';
import { app, crashReporter, BrowserWindow, Menu, ipcMain } from 'electron';
import electronDl, { download } from 'electron-dl';
import moment from 'moment-jalaali';
import log from 'electron-log';

log.transports.file.fileName = 'main.log';
const isDevelopment = process.env.NODE_ENV === 'development';

electronDl();
let mainWindow = null;
let forceQuit = false;

ipcMain.on('downloads', async(event, links) => {
  log.info('got image download links:', links);
  const win = BrowserWindow.getFocusedWindow();
  const timeSuffix = moment().format('YYYY-MM-DD_H-mm-ss');
  const downloadDirectory = path.resolve(path.join(app.getPath('temp'), `virgooldoon_images__${timeSuffix}`));
  const options = {
    directory: downloadDirectory,
  };
  try {
    for (const aLink of links) {
      await download(win, aLink, options);
    }
    log.info('all links have been downloaded.');
    event.reply('downloads', downloadDirectory);
  } catch (e) {
    log.debug('there was an error in downloading images', e);
  }
});

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      log.debug(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

crashReporter.start({
  productName: 'Ali',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
  uploadToServer: false,
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#ffffff',
    show: false,
    resizable: false,
    fullscreen: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.resolve(path.join(__dirname, '..', 'renderer', 'index.html')));

  // show window once on first load
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      mainWindow.on('close', function (e) {
        if (!forceQuit) {
          e.preventDefault();
          mainWindow.hide();
        }
      });

      app.on('activate', () => {
        mainWindow.show();
      });

      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    }
  });

  if (isDevelopment) {
    // auto-open dev tools
    mainWindow.webContents.openDevTools();

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(props.x, props.y);
          },
        },
      ]).popup(mainWindow);
    });
  }
});
