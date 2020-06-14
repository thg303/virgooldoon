import {
  POSTS_REQUESTED,
  POSTS_FAILED,
  POSTS_SUCCESS,
  SET_POSTS_COUNTERS
} from './action_types';

export function getPostType(payload) {
  return {
    type: POSTS_REQUESTED,
    payload
  }
}

export function setPostCounters(payload) {
  return {
    type: SET_POSTS_COUNTERS,
    payload
  }
}
