import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';
import { ipcRenderer } from 'electron';

import { POSTS_REQUESTED, POSTS_SUCCESS, POSTS_FAILED, SET_POSTS, SET_POSTS_COUNTERS, IMAGES_DOWNLOADED } from '../actions/action_types';

function sendLoadDraftPostsRequest() { // eslint-disable-line no-unused-vars
  return axios
    .get('https://virgool.io/api/v1.2/posts/drafts')
    .then(response => response.data)
    .catch(error => ({ error }));
}

function loadSampleDraftFile() {
  const draftsFile = path.resolve(__dirname, '../assets/drafts.json');
  return fs.promises.readFile(draftsFile)
    .then(result => {
      const draftResponse = JSON.parse(result);
      return draftResponse;
    }).catch(error => ({ error }));
}

async function downloadImages(post) {
  const html = parse(post.body);
  const images = html.querySelectorAll('img');
  if (images.length === 0) {
    return post;
  }
  const links = images.map(imgTag => imgTag.attributes.src);
  
  ipcRenderer.send('downloads', links)
  return await new Promise((resolve, reject) => {
    ipcRenderer.on('downloads', function () {
      try {
        const changed_links = links.map(aLink => './virgool_images/' + aLink.substr(aLink.lastIndexOf('/') + 1));
        images.forEach((image, i) => image.setAttribute('src', changed_links[i]));
        post.body = html.toString();
        resolve(post);
      } catch (e) {
        reject('something bad happened', e);
      }
    })
  });
}

function* loadPosts(action) {
  try {
    const response = yield call(loadSampleDraftFile);
    // const response = yield call(sendLoadDraftPostsRequest);

    if (action.payload === 'published') {
      response.data = response.data.filter(post => (post.post_id !== null));
    }
    const posts = yield all(response.data.map( aPost => call(() => downloadImages(aPost))));
    if (posts.length > 0) {
      yield put({ type: IMAGES_DOWNLOADED });
    }
    yield put({ type: POSTS_SUCCESS });
    yield put({ type: SET_POSTS, payload: posts });
    yield put({ type: SET_POSTS_COUNTERS, payload: response.userPostCounts });
  } catch (e) {
    console.log(e);
    console.log(e.response);
    console.log(e.response.status);
    yield put({ type: POSTS_FAILED, payload: e.message });
  }
}

export default function* postsSaga() {
  yield takeLatest(POSTS_REQUESTED, loadPosts);
}
