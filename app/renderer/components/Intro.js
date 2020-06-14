import React from 'react';
import { Card, Button, Typography } from 'antd';
import { useHistory } from 'react-router-dom';

const { shell } = window.require('electron');
const { Text, Title } = Typography;

const Intro = () => {
  const history = useHistory();

  return (<Card actions={[<Button type="primary" onClick={() => history.push('/login')}>شروع کن</Button>]}>
    <Title level={3}>خوش آمدید</Title>
    <div>
      <Text>
        این یک نرم افزار برای پشتیبان‌گیری از پست‌های ویرگول شماست
        با این برنامه می‌توانید پست‌های منتشر شده و منتشر نشده خود را از ویرگول دریافت کرده و روی کامپیوتر خودتان ذخیره کنید تا اگر روزی 
        اطلاعات شما تصادفا یا در اثر بلایای غیر منتظره از  روی ویرگول پاک شد، همچنان بتوانید به مطالبی که نوشته‌اید دسترسی داشته باشید.
      </Text>
    </div>
    <br />
    <Title level={4}>چند چندیم؟</Title>
    <ul>
      <li>
      <Text>
        این برنامه به صورت کاملا داوطلبانه، رایگان و به عنوان یک سرگرمی کاملا مستقل از ویرگول نوشته شده است.
      </Text>
      </li>
      <li>
      <Text>
        هیچ تضمینی برای کارکرد صحیح این برنامه وجود ندارد، با این حال امید است برای شما مفید واقع شود.
      </Text>
      </li>
    </ul>
    <br />
    <Title level={4}>چطور از این پروژه حمایت کنم؟</Title>
    <div>
      <Text>بسته به میزان خوشحال شدنتان یکی از گزینه‌های زیر پیشنهاد می‌شود</Text>
      <ol>
        <li>
        <Text>
          لبخند بزنید :)
        </Text>
        </li>
        <li>
        <Text>
          به <a href="#" onClick={() => shell.openExternal("https://github.com/thg303/virgooldoon")}>گیتهاب پروژه</a> سر بزنید و به این پروژه ستاره بدهید.
        </Text>
        </li>
        <li>
        <Text>
          پیشنهادات و انتقادات خود را در  <a href="#" onClick={() => shell.openExternal("https://github.com/thg303/virgooldoon")}>گیتهاب پروژه</a> مطرح کنید.
        </Text>
        </li>
        <li>
        <Text>
          سازنده برنامه را به <a href="#" onClick={() => shell.openExternal("https://packpay.ir/thg303")}>یک فنجان چای</a> مهمان کنید.
        </Text>
        </li>
      </ol>
    </div>
  </Card>);
  };

export default Intro;