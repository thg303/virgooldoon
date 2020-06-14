import React from 'react';
import { Layout } from 'antd';
import Footer from '../components/Footer';
import BackupSetting from '../components/BackupSetting';
import { connect } from 'react-redux';

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