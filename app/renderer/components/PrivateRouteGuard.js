import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRouteGuard = ({ children, isAuthenticated, ...rest }) => (
  <Route { ...rest } render={ ({ location }) => isAuthenticated ? (children) 
  : (<Redirect to={{ pathname: '/login', state: { from: location } }} />) } />
);

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated })

export default connect(mapStateToProps)(PrivateRouteGuard);