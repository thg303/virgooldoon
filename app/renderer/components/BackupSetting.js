import React, { useState } from 'react';
import { Card, Radio, Button, Typography, Space, Divider } from 'antd';
import { connect } from 'react-redux';
import { startBackup } from '../actions/backup';
import { getPostType } from '../actions/post';
import { logout } from '../actions/auth';

const { Text } = Typography;

const BackupSetting = ({ dispatch }) => {
  const [postType, setpostType] = useState('published');
  const [format, setFormat] = useState('json');

  return (
    <Card actions={[
      <Button 
        key="1"
        type="primary"  
        onClick={() => {
          dispatch(getPostType(postType));
          dispatch(startBackup(format));
        }}>شروع کن</Button>,
      <Button key="2" type="default" onClick={() => dispatch(logout())}>خروج از حساب کاربری</Button>,
    ]}>
      <Space direction="vertical" size="small">
        <div>
          <Text>از چه پست‌هایی پشتیبان گرفته شود؟</Text>
        </div>
        <div>
          <Radio.Group onChange={ e => setpostType(e.target.value)} value={postType} >
            <Radio value="published">فقط منتشر شده‌ها</Radio>
            <Radio value="drafts">همه</Radio>
          </Radio.Group>
          <Divider style={{width: '550px'}} />
        </div>
        <div>
          <Text>به چه فرمتی پشتیبان گرفته شود؟</Text>
        </div>
        <div>
          <Radio.Group onChange={ e => setFormat(e.target.value)} value={format} >
            <Radio value="excel">Microsoft Excel</Radio>
            <Radio value="json">JSON</Radio>
          </Radio.Group>
        </div>
      </Space>
    </Card>);
};

const mapStateToProps = state => ({ backup: state.backup });

export default connect(mapStateToProps)(BackupSetting);