import { all } from 'redux-saga/effects';

// import loginSaga from './loginSaga';
// import postSaga from './postSaga';
// import backupSaga from './backupSaga';

export default function* rootSaga() {
  yield all([
    // loginSaga(),
    // postSaga(),
    // backupSaga(),
  ]);
}