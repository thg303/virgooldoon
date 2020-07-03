import React from 'react';
import { Redirect } from 'react-router-dom';
import Intro from '../components/Intro';

const WelcomePage = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return (<Redirect to="/main" />)
  }
  return (<Intro />);
};

export default WelcomePage;