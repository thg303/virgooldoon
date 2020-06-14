import { BACKUP_STARTED, BACKUP_FAILED, BACKUP_SUCCESS } from '../actions/action_types';

const initialState = {
  target: 'json',
  isLoading: false,
  error: '',
};

const handleState = {
  [BACKUP_SUCCESS]: state => ({ ...state, isLoading: false, error: '' }),
  [BACKUP_FAILED]: (state, action) => ({ ...state, isLoading: false, error: action.payload.error }),
  [BACKUP_STARTED]: (state, action) => {
    return {
      ...state,
      error: '',
      isLoading: true,
      target: action.payload,
    };
  },
};

const backupReducer = (state = initialState, action) => {
  if (typeof handleState[action.type] === 'function') {
    return handleState[action.type](state, action);
  }
  return state;
};

export default backupReducer;
