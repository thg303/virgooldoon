import { call, take, put, select, takeLatest } from 'redux-saga/effects';
import fs from 'fs';
import path from 'path';
import { BACKUP_STARTED, BACKUP_SUCCESS, BACKUP_FAILED, SET_POSTS } from '../actions/action_types';
import { getPostList } from '../selectors/postsSelector';
import { buildExcel } from '../utils/excel-utils';
import { normalizer } from '../utils/normalizer';
import notifier from '../utils/notifier';

const { remote: { dialog } } = window.require('electron');

function saveAsExcel(posts) {
  let filePath = dialog.showSaveDialog({ title: 'ویرگولدون - انتخاب مسیر فایل پشتیبانی' });
  if (typeof(filePath) === 'undefined') {
    return false;
  }
  const fileExtension = path.extname(filePath);
  if (fileExtension.toLowerCase() !== '.xlsx') {
    filePath += '.xlsx';
  }

  const backupFilePath = path.resolve(filePath);
  buildExcel(posts, backupFilePath);
  return notifier.backupSuccess(backupFilePath);
}

function saveAsJson(posts) {
  let filePath = dialog.showSaveDialog({ title: 'ویرگولدون - انتخاب مسیر فایل پشتیبانی' });
  if (typeof(filePath) === 'undefined') {
    return false;
  }
  const fileExtension = path.extname(filePath);
  if (fileExtension.toLowerCase() !== '.json') {
    filePath += '.json';
  }
  const backupFilePath = path.resolve(filePath);
  return fs.promises.writeFile(backupFilePath, JSON.stringify(posts)).then(() => notifier.backupSuccess(backupFilePath));
}

function* runBackup(action) {
  try {
    const target = action.payload
    yield take(SET_POSTS);
    const posts = normalizer(yield select(getPostList));
    if (target === 'json') {
      yield call(() => saveAsJson(posts));
    }
    if (target === 'excel') {
      yield call(() => saveAsExcel(posts));
    }

    yield put({ type: BACKUP_SUCCESS });
  } catch (e) {
    yield put({ type: BACKUP_FAILED, payload: e.message });
    notifier.backupError(e);
    throw e;
  }
}

export default function* backupSaga() {
  yield takeLatest(BACKUP_STARTED, runBackup);
}
