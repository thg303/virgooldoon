import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { ConfigProvider } from 'antd';
import routes from './routes';
import createStore from './store';

const initialState = {};
const routerHistory = createMemoryHistory();
const store = createStore(initialState, routerHistory);

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider direction="rtl">
      <Router history={routerHistory}>{routes}</Router>
    </ConfigProvider>
  </Provider>,
  rootElement,
);
