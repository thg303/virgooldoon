import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import routes from './routes';
import createStore from './store';

const initialState = {};
const store = createStore(initialState);

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider direction="rtl">
      <Router>{routes}</Router>
    </ConfigProvider>
  </Provider>,
  rootElement,
);
