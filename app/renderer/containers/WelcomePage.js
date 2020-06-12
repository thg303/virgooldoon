import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Intro from '../components/Intro';

const WelcomePage = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return (<Redirect to="/main" />)
  }
  return (<Intro />);
};

// const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated });

// export default connect(mapStateToProps)(WelcomePage);

export default WelcomePage;