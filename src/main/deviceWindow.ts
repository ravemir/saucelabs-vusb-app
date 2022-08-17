/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BrowserView, BrowserWindow } from 'electron';
import { ChannelsEnum } from '../types/ChannelTypes';
import { resolveHtmlPath } from './util';

function deviceWindow({
  isDebug,
  mainWindow,
  url,
}: {
  isDebug: boolean;
  mainWindow: BrowserWindow | null;
  url: string;
}) {
  let deviceModalWindow: BrowserWindow | null = null;
  let menuView: BrowserView | null = null;
  // For the Device window and extra menus in it
  const menuWidth = 70;
  const searchString = new URL(url);
  const sessionId = searchString.searchParams.get('sessionId');
  const platform = searchString.searchParams.get('platform');
  const dc = searchString.searchParams.get('dc');
  const port = searchString.searchParams.get('port');
  const status = searchString.searchParams.get('status');
  const descriptorIdRes = url.match('devices/(.*)/shared');
  const descriptorId = descriptorIdRes ? descriptorIdRes[1] : '';
  const sharedUrl = `${url.split('?').shift()}${sessionId}`;
  deviceModalWindow = new BrowserWindow({
    show: false,
    width: 960,
    minWidth: 960,
    height: 760,
    minHeight: 760,
    webPreferences: {
      webSecurity: false,
    },
  });
  // Add a small browser view on top of the device window to add the menu
  menuView = new BrowserView({
    webPreferences: {
      // This is not ave, but for now this is a hack until the live session url
      // has been fixed with also iOS home or Android hardware buttons
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
      additionalArguments: [
        `--sessionId=${sessionId}`,
        `--platform=${platform}`,
        `--dc=${dc}`,
      ],
    },
  });
  menuView.webContents.loadURL(resolveHtmlPath('liveSessionMenu.html'));

  deviceModalWindow.setBrowserView(menuView);
  const { height, width } = deviceModalWindow.getBounds();
  menuView?.setBounds({
    x: width - menuWidth,
    y: 0,
    width: menuWidth,
    height,
  });
  deviceModalWindow.loadURL(sharedUrl);
  if (isDebug) {
    menuView.webContents.toggleDevTools();
  }

  menuView.webContents.on('did-finish-load', () => {
    deviceModalWindow?.show();
  });

  // Keep the bar on the right when the page is being resized
  deviceModalWindow.on('resize', () => {
    // @ts-ignore
    const { height: deviceModalWindowHeight, width: deviceModalWindowWidth } =
      deviceModalWindow?.getBounds();
    const newMenuBarPosition = deviceModalWindowWidth - menuWidth;
    menuView?.setBounds({
      x: newMenuBarPosition,
      y: 0,
      width: menuWidth,
      height: deviceModalWindowHeight,
    });
  });

  deviceModalWindow.on('closed', () => {
    deviceModalWindow = null;
    menuView = null;
    mainWindow?.webContents.send(ChannelsEnum.MANUAL_SESSION_CLOSE, {
      descriptorId,
      manualConnect: true,
      port,
      sessionId,
      status,
    });
  });
}

export default deviceWindow;