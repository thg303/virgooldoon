import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import Footer from '../components/Footer';
import BackupSetting from '../components/BackupSetting';

const { Content } = Layout;

const MainPage = ({dispatch}) => (
  <Layout id="backup_page">
    <Layout>
      <Content className="center-content">
        <BackupSetting dispatch={dispatch} />
      </Content>
    </Layout>
    <Footer />
  </Layout>
);

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(MainPage);