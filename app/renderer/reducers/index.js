import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postReducer from './postsReducer';
import backupReducer from './backupReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  backup: backupReducer,
});

export default rootReducer;