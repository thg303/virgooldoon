import React from 'react';
import { Layout, Button } from 'antd';
import { PoweroffOutlined, GithubFilled, HeartTwoTone } from '@ant-design/icons';
import path from 'path';

const { shell, remote: { app } } = window.require('electron');
const logo = path.resolve(__dirname, '../assets/images/virgooldoon-logo.svg');

const Footer = () => (
  <Layout.Footer className="copyright">
    <div>
      <p>
        <img className="logo" src={logo} /> {texts.virgooldoon} | 
        {' '}<Button type="link" icon={<GithubFilled />} onClick={() => shell.openExternal("https://github.com/thg303/virgooldoon")} /> 
        {' '}<Button type="link" icon={<HeartTwoTone twoToneColor="#eb2f96" />} onClick={() => shell.openExternal("https://packpay.ir/thg303")} /> 
      </p>
      <Button ghost icon={<PoweroffOutlined />} onClick={() => app.quit() }>خروج</Button>
    </div>
  </Layout.Footer>
);

export default Footer;

const texts = {
  virgooldoon: 'ویرگولدون',
  copyright: 'کلیه حقوق محفوظ است'
}