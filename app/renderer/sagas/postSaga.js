import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { POSTS_REQUESTED, POSTS_SUCCESS, POSTS_FAILED, SET_POSTS, SET_POSTS_COUNTERS } from '../actions/action_types';
import fs from 'fs';
import path from 'path';

function sendLoadDraftPostsRequest() {
  return axios
    .get('https://virgool.io/api/v1.2/posts/drafts')
    .then(response => response.data)
    .catch(error => ({ error }));
}

function loadSampleDraftFile () {
  const draftsFile = path.resolve(__dirname, '../assets/drafts.json');
  return fs.promises.readFile(draftsFile)
  .then(result => {
    const draftResponse = JSON.parse(result);
    return draftResponse;
  }).catch(error => ({ error }));
}

function* loadPosts(action) {
  try {
    // const response = yield call(loadSampleDraftFile);
    const response = yield call(sendLoadDraftPostsRequest);

    if (action.payload === 'published') {
      // response = yield call(sendLoadPublishedPostsRequest);
      response.data = response.data.filter(post => (post.post_id !== null));
    }
    yield put({ type: POSTS_SUCCESS });
    yield put({ type: SET_POSTS, payload: response.data });
    yield put({ type: SET_POSTS_COUNTERS, payload: response.userPostCounts });
  } catch (e) {
    console.log(e)
    console.log(e.response)
    console.log(e.response.status)
    yield put({ type: POSTS_FAILED, payload: e.message });
  }
}

export default function* postsSaga() {
  yield takeLatest(POSTS_REQUESTED, loadPosts);
}
