import {
  LOGGED_OUT,
  LOGIN_REQUESTED,
} from './action_types';

export function logout() {
  return {
    type: LOGGED_OUT
  }
}

export function login(payload) {
  return {
    type: LOGIN_REQUESTED,
    payload
  }
}
