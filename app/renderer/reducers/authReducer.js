import { LOGGED_OUT, LOGGED_IN, LOGIN_SUCCESS, LOGIN_FAILED } from '../actions/action_types';

const initialState = {
  isAuthenticated: false,
  jwt: '',
  isLoading: false,
  error: '',
  name: '',
  activated: null, // 1 means email is verified.
  username: '',
  avatar: '', // url "https://files.virgool.io/upload/users/48628/avatar/yeRhIL.png"
};

const handleState = {
  [LOGIN_SUCCESS]: state => ({ ...state, isLoading: false }),
  [LOGIN_FAILED]: (state, action) => ({ ...state, isLoading: false, error: action.payload.error }),
  [LOGGED_IN]: (state, action) => {
    // persist it on the disk
    window.virgooldoon.storage.set('jwt', action.payload.token);
    window.virgooldoon.storage.set('username', action.payload.user.username);
    window.virgooldoon.storage.set('name', action.payload.user.name);
    window.virgooldoon.storage.set('activated', action.payload.user.activated);
    window.virgooldoon.storage.set('avatar', action.payload.user.avatar);

    return {
      ...state,
      error: '',
      isAuthenticated: true,
      jwt: action.payload.token,
      username: action.payload.user.username,
      name: action.payload.user.name,
      activated: action.payload.user.activated,
      avatar: action.payload.user.avatar,
    };
  },
  [LOGGED_OUT]: (state) => {
    // clear saved credentials
    window.virgooldoon.storage.delete('jwt');
    window.virgooldoon.storage.delete('username');
    window.virgooldoon.storage.delete('name');
    window.virgooldoon.storage.delete('activated');
    window.virgooldoon.storage.delete('avatar');
    
    return {
      ...state,
      ...initialState,
    }
  }
}

const authReducer = (state = initialState, action) => {
  if (typeof handleState[action.type] === 'function') {
    return handleState[action.type](state, action);
  }
  return state;
}

export default authReducer;
