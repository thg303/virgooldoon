import { createStore as createReduxStore, applyMiddleware, compose } from 'redux';
import persistState from 'redux-localstorage';
import createSagaMiddleware, { END } from 'redux-saga';

import rootReducer from './reducers';
import rootSaga from './sagas';

export default function createStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);

  const enhancer = composeEnhancers(applyMiddleware(...middlewares), persistState());

  const store = createReduxStore(rootReducer, initialState, enhancer);
  store.runSaga = sagaMiddleware.run(rootSaga);
  store.close = () => store.dispatch(END);
  return store;
}
