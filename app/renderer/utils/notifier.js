import React from 'react';
import { Typography, Button, notification } from 'antd';

const { Text } = Typography;
const { shell } = window.require('electron');

const backupSuccess = (filePath) => {
  const key = `open${Date.now()}`;
  const button = (
    <Button type="primary" size="small" onClick={() => {
      shell.showItemInFolder(filePath);
      notification.close(key);
    }}>
      ببینمش
    </Button>
  );

  notification.success({
    message: 'پشتیبان‌گیری انجام شد',
    description: <Text>فایل پشتیبان با موفقیت ساخته شد</Text>,
    btn: button,
    key: key,
  });
};

const backupError = (error) => {
  notification.error({
    message: 'پشتیبان‌گیری  با خطا مواجه شد',
    description: 'لطفا مسیر دیگری برای پشتیبان‌گیری انتخاب کنید و مطمئن شوید فضای کافی برای ذخیره کردن فایل وجود داشته باشد',
  });
};

const loginSuccess = () => {
  notification.success({
    message: 'ورود موفق',
    description: <Text>ورود به ویرگول موفقیت آمیز بود</Text>,
    duration: 2,
  });
};

const loginError = (msg = '') => {
  notification.error({
    message: 'ورود ناموفق',
    description: <Text>{msg === '' ? 'ورود به ویرگول ناموفق بود' : msg}</Text>,
  });
};

const notifier = {
  backupSuccess,
  backupError,
  loginSuccess,
  loginError,
}


export default notifier;