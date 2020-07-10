import { call, take, put, select, takeLatest, all } from 'redux-saga/effects';
import fs from 'fs-extra';
import path from 'path';
import log from 'electron-log';
import { BACKUP_STARTED, BACKUP_SUCCESS, BACKUP_FAILED, SET_POSTS, BACKUP_ASK_DESTINATION, BACKUP_SET_DESTINATION } from '../actions/action_types';
import { getPostList, downloadedImagePath } from '../selectors/postsSelector';
import { getBackupDestination } from '../selectors/backupSelector';
import { buildExcel } from '../utils/excel-utils';
import { normalizer } from '../utils/normalizer';
import notifier from '../utils/notifier';
import { getExtensionFor, getHtmlDirectoryFor, getImageDirectoryFor } from '../utils/helpers';
import { buildHtml, buildIndexHtmlFile } from '../utils/html-utils';

const { remote: { dialog } } = window.require('electron');

async function askBackupFilePath (withExtention = '') {
  const response = await dialog.showSaveDialog({ title: 'ویرگولدون - انتخاب مسیر فایل پشتیبانی' });
  let { filePath } = response;
  if (response.canceled || typeof(filePath) === 'undefined') {
    return false;
  }
  const fileExtension = path.extname(filePath);
  if (fileExtension.toLowerCase() !== withExtention.toLowerCase()) {
    filePath += withExtention.toLowerCase(); 
  }
  return path.resolve(filePath)
}

async function saveAsExcel(posts, backupFilePath) {
  buildExcel(posts, backupFilePath);
}

async function saveAsJson(posts, backupFilePath) {
  return fs.promises.writeFile(backupFilePath, JSON.stringify(posts));
}

async function moveImagesToBackupPath(source, destination) {
  return fs.move(source, destination);
}
  
async function saveAsHtml(posts, backupFilePath, htmlsDirectory) {
  await Promise.all(posts.map(post => buildHtml(htmlsDirectory, post)));
  await buildIndexHtmlFile(backupFilePath, htmlsDirectory);
}

// async function moveImagesToBackupPath(source, destination) {
//   return fs.move(source, destination);
// }

function* runBackup(action) {
  log.info('backup has begun to run...');
  try {
    const format = action.payload
    // const backupFilePath = yield call(askBackupFilePath, getExtensionFor(format));
    
    yield take(SET_POSTS);
    log.info('taking posts,  format:', format);
    const posts = normalizer(yield select(getPostList));
    const backupFilePath = yield select(getBackupDestination);
    log.info('saving backup file path:', backupFilePath);
    const backupFileExtension = getExtensionFor(format);
    let backupImageDir = getImageDirectoryFor(backupFilePath, backupFileExtension);
    log.info('got backup image dir:', backupImageDir);

    if (format === 'json') {
      yield call(saveAsJson, posts, backupFilePath);
    }
    if (format === 'excel') {
      log.info('runing for excel')
      yield call(saveAsExcel, posts, backupFilePath);
    }
    if (format === 'html') {
      const htmlsDirectory = yield call(getHtmlDirectoryFor, backupFilePath);
      backupImageDir = path.join(htmlsDirectory, 'images')
      yield call(saveAsHtml, posts, backupFilePath, htmlsDirectory);
    }

    const downloadedImagesPath = yield select(downloadedImagePath);
    log.info(`now moving downloaded images from ${downloadedImagesPath} to: ${backupImageDir}`);
    if (downloadedImagesPath) {
      yield call(moveImagesToBackupPath, downloadedImagesPath, backupImageDir);
    }

    log.info('all images has been moved.');

    yield put({ type: BACKUP_SUCCESS });
    return notifier.backupSuccess(backupFilePath);
  } catch (e) {
    log.debug('there was an error with backup process: ', e);
    yield put({ type: BACKUP_FAILED, payload: e.message });
    notifier.backupError(e);
    throw e;
  }
}

function* askBackupPath(action) {
  const destination = yield call(askBackupFilePath, getExtensionFor(action.payload));
  log.info('destination backup path:', destination);
  if (!destination) {
    return yield put({ type: BACKUP_FAILED, payload: 'canceled by user!' });
  }
  yield put({ type: BACKUP_SET_DESTINATION, payload: destination });
}

export default function* backupSaga() {
  yield all([
    yield takeLatest(BACKUP_ASK_DESTINATION, askBackupPath),
    yield takeLatest(BACKUP_STARTED, runBackup)
  ]);
}
