import React from 'react';
import { Layout } from 'antd';
import path from 'path';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Footer from '../components/Footer';
import LoginForm from '../components/Login/LoginForm';

const { Content } = Layout;
const video = path.resolve(__dirname, '../assets/entry.mp4');

const LoginPage = ({ isAuthenticated, dispatch }) => {
  if (isAuthenticated) {
    return (<Redirect to="/main" />)
  }
  return (
  <Layout>
    <video src={video} width="1100" loop={true} autoPlay={true} id="login-video" />
    <Layout>
      <Content className="center-content">
        <div id="login-blur" />
        <LoginForm dispatch={dispatch} />
      </Content>
    </Layout>
    <Footer />
  </Layout>
  );
};

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated })

export default connect(mapStateToProps)(LoginPage);