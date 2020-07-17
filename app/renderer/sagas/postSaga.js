import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';
import { ipcRenderer } from 'electron';
import log from 'electron-log';

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

async function extractImages(post) {
  const html = parse(post.body);
  const images = html.querySelectorAll('img');
  if (images.length === 0) {
    return { post: post, links: [] };
  }
  const links = images.map(imgTag => imgTag.attributes.src);
  const changed_links = links.map(aLink => './images/' + aLink.substr(aLink.lastIndexOf('/') + 1));
  images.forEach((image, i) => image.setAttribute('src', changed_links[i]));
  post.body = html.toString();
  return { post: post, links: links };
}

async function downloadImages(links) {
  ipcRenderer.send('downloads', links)
  return await new Promise((resolve, reject) => {
    ipcRenderer.on('downloads', function (event, downloadDirectory) {
      try {
        resolve(downloadDirectory);
      } catch (e) {
        reject('something bad happened', e);
      }
    })
  });
}

function* imageExtractorFromPosts(allPosts) {
  const result = { posts: [], imageLinks: [] };
  for (const currentPost of allPosts) {
    const { post, links } = yield call(() => extractImages(currentPost));
    result.posts = [...result.posts, post];
    result.imageLinks = [...result.imageLinks, ...links];
  }
  return result;
}

function* loadPosts(action) {
  try {
    log.info(`'initialize loading [${action.payload}] posts'`)
    const isDevelopment = process.env.NODE_ENV === 'development';
    log.info(`WORKING IN DEVELOPMENT MODE? ${isDevelopment}`)
    const response = yield call(isDevelopment ? loadSampleDraftFile : sendLoadDraftPostsRequest);

    if (action.payload === 'published') {
      response.data = response.data.filter(post => (post.post_id !== null));
    }

    yield put({ type: POSTS_SUCCESS });
    log.info('all posts have been downloaded.')

    const postsAndImageLinks = yield call(imageExtractorFromPosts, response.data);
    log.info('extracting images from posts is completed.')
    const { posts, imageLinks } = postsAndImageLinks;
    const photoDownloadDirectory = yield call(downloadImages, imageLinks);
    log.info(`all images have been downloaded to ${photoDownloadDirectory}`);
    
    if (photoDownloadDirectory) {
      yield put({ type: IMAGES_DOWNLOADED, payload: photoDownloadDirectory });
    }
    yield put({ type: SET_POSTS, payload: posts });
    yield put({ type: SET_POSTS_COUNTERS, payload: response.userPostCounts });
  } catch (e) {
    log.debug('there was an error in loading posts:', e);
    yield put({ type: POSTS_FAILED, payload: e.message });
  }
}

export default function* postsSaga() {
  yield takeLatest(POSTS_REQUESTED, loadPosts);
}
