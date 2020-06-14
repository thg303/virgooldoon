import { POSTS_SUCCESS, POSTS_FAILED, SET_POSTS, SET_POSTS_COUNTERS } from '../actions/action_types';
import { buildTimeDiffFromDuration } from '../utils/date-utils';

const initialState = {
  postType: 'published',
  isLoading: false,
  error: '',
  list: [],
  totalDraftPosts: null,
  totalPublishedPosts: null,
};

const handleState = {
  [POSTS_SUCCESS]: state => ({ ...state, isLoading: false }),
  [POSTS_FAILED]: (state, action) => ({ ...state, isLoading: false, error: action.payload.error }),
  [SET_POSTS]: (state, action) => {
    return {
      ...state,
      error: '',
      list: action.payload.map(item => ({ ...item, updated_at_moment: buildTimeDiffFromDuration(item.updated_at) })),
    };
  },
  [SET_POSTS_COUNTERS]: (state, action) => {
    return {
      ...state,
      totalDraftPosts: action.payload.draftPosts,
      totalPublishedPosts: action.payload.publishedPosts,
    };
  }
};

const postReducer = (state = initialState, action) => {
  if (typeof handleState[action.type] === 'function') {
    return handleState[action.type](state, action);
  }
  return state;
};

export default postReducer;
