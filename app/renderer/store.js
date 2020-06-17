import { createStore as createReduxStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import Store from 'electron-store';
import rootReducer from './reducers';
import rootSaga from './sagas';

export default function createStore() {
  const sagaMiddleware = createSagaMiddleware();

  const storage = new Store({
    migrations: {
      '0.0.1': storage => {
        storage.set('jwt', '');
        storage.set('username', '');
        storage.set('name', '');
        storage.set('activated', null);
        storage.set('avatar', '');
      },
    },
    encryptionKey: 'aes-256-cbc',
  });

  window.virgooldoon = { storage };

  const initialState = {
    auth: {
      jwt: storage.get('jwt', ''),
      isAuthenticated: !!storage.get('jwt', ''),
      username: storage.get('username', ''),
      name: storage.get('name', ''),
      activated: storage.get('activated', null),
      avatar: storage.get('avatar', ''),
    },
  };

  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);

  const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

  const store = createReduxStore(rootReducer, initialState, enhancer);
  store.runSaga = sagaMiddleware.run(rootSaga);
  store.close = () => store.dispatch(END);
  return store;
}
