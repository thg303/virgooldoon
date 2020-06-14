import React from 'react';
import { Switch, Route } from 'react-router-dom';

import WelcomePage from './containers/WelcomePage';
import LoginPage from './containers/LoginPage';
import MainPage from './containers/MainPage';
import PrivateRouteGuard from './components/PrivateRouteGuard';

export default (
  <Switch>
    <Route exact path="/" component={WelcomePage} />
    <Route path="/login" component={LoginPage} />
    <PrivateRouteGuard>
      <Route path="/main" component={MainPage} />
    </PrivateRouteGuard>
  </Switch>
);
