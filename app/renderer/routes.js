import React from 'react';
import { Switch, Route } from 'react-router';

// import LoginPage from './containers/LoginPage';
// import LoggedInPage from './containers/LoggedInPage';
import WelcomePage from './containers/WelcomePage';

export default (
  <Switch>
    <Route exact path="/" component={WelcomePage} />
  </Switch>
);
