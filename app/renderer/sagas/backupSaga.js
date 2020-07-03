import { call, take, put, select, takeLatest } from 'redux-saga/effects';
import fs from 'fs-extra';
import path from 'path';
import { BACKUP_STARTED, BACKUP_SUCCESS, BACKUP_FAILED, SET_POSTS } from '../actions/action_types';
import { getPostList, areImagesDownloaded } from '../selectors/postsSelector';
import { buildExcel } from '../utils/excel-utils';
import { normalizer } from '../utils/normalizer';
import notifier from '../utils/notifier';
import { getExtensionFor } from '../utils/helpers';
import moment from 'moment-jalaali';

const { remote: { dialog, app } } = window.require('electron');

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

async function moveImagesToBackupPath(backupFilePath) {
  const source = path.resolve(path.join(app.getPath('temp'), 'virgooldoon_images'));
  const destination = path.resolve(path.join(path.dirname(backupFilePath), 'virgool_images'));
  if (fs.existsSync(destination)) {
    const timeSuffix = moment().format('YYYY-MM-DD_H-mm-ss');
    await fs.move(destination, `${destination}__moved_at_${timeSuffix}`);
  }
  
  return fs.move(source, destination)
}

function* runBackup(action) {
  try {
    const target = action.payload
    yield take(SET_POSTS);
    const posts = normalizer(yield select(getPostList));
    const backupFilePath = yield call(() => askBackupFilePath(getExtensionFor(target)));
    if (target === 'json') {
      yield call(() => saveAsJson(posts, backupFilePath));
    }
    if (target === 'excel') {
      yield call(() => saveAsExcel(posts, backupFilePath));
    }

    const isDownloaded = yield select(areImagesDownloaded);
    if (isDownloaded) {
      yield call(() => moveImagesToBackupPath(backupFilePath));
    }

    yield put({ type: BACKUP_SUCCESS });
    return notifier.backupSuccess(backupFilePath);
  } catch (e) {
    yield put({ type: BACKUP_FAILED, payload: e.message });
    notifier.backupError(e);
    throw e;
  }
}

export default function* backupSaga() {
  yield takeLatest(BACKUP_STARTED, runBackup);
}
