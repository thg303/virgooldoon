import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { LOGIN_REQUESTED, LOGGED_IN, LOGIN_SUCCESS, LOGIN_FAILED } from '../actions/action_types';
import notifier from '../utils/notifier';

function sendLoginRequest(params) {
  const form = new FormData();
  form.append('username', params.username);
  form.append('password', params.password);
  return axios
    .post('https://virgool.io/api/v1.2/login', form)
    .then(response => response.data);
}

function* login(action) {
  try {
    const response = yield call(sendLoginRequest, action.payload);
    console.log('got response:', response);
    if (response.success === false) {
      return notifier.loginError(response.msg);
    }
    yield put({ type: LOGIN_SUCCESS });
    yield put({ type: LOGGED_IN, payload: response });
    notifier.loginSuccess();
  } catch (e) {
    yield put({ type: LOGIN_FAILED, payload: e.message });
    if (e.response && e.response.status === 429) {
      notifier.loginError('حساب کاربری فعلا قفل شده، لطفا پس از ۲۴ ساعت مجددا تلاش کنید');
    } else {
      notifier.loginError(e.message);
    }
    throw e;
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN_REQUESTED, login);
}
