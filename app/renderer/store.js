/*
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { connectRouter, routerMiddleware, push } from 'connected-react-router';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';

import user from './reducers/user';
import userActions from './actions/user';

export default function configureStore(initialState, routerHistory) {
  const router = routerMiddleware(routerHistory);

  const actionCreators = {
    ...userActions,
    push,
  };

  const reducers = {
    router: connectRouter(routerHistory),
    user,
  };

  const middlewares = [thunk, router];

  const composeEnhancers = (() => {
    const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (process.env.NODE_ENV === 'development' && compose_) {
      return compose_({ actionCreators });
    }
    return compose;
  })();

  const enhancer = composeEnhancers(applyMiddleware(...middlewares), persistState());
  const rootReducer = combineReducers(reducers);

  return createStore(rootReducer, initialState, enhancer);
}
*/

import { createStore as createReduxStore, applyMiddleware, compose, combineReducers } from 'redux';
// import { connectRouter, routerMiddleware, push } from 'connected-react-router';
import persistState from 'redux-localstorage';
import createSagaMiddleware, { END } from 'redux-saga';

import user from './reducers/user';
import userActions from './actions/user';

// import rootReducer from './reducers';
import rootSaga from './sagas';

const actionCreators = {
  ...userActions,
  // push,
};

const reducers = {
  // router: connectRouter(routerHistory),
  user,
};

const rootReducer = combineReducers(reducers);

export default function createStore(initialState, routerHistory) {
  // const router = routerMiddleware(routerHistory);
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);

  const enhancer = composeEnhancers(applyMiddleware(...middlewares), persistState());

  const store = createReduxStore(rootReducer, initialState, enhancer);
  store.runSaga = sagaMiddleware.run(rootSaga);
  store.close = () => store.dispatch(END);
  return store;
}
