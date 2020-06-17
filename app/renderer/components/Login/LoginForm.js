import React from 'react';
import { Form, Input, Button } from 'antd';
import { login } from '../../actions/auth';

const texts = {
  username: 'نام کاربری ویرگول',
  password: ' رمز عبور ویرگول',
  submit: 'بسم الله',
  usernameRequiredMsg: 'بدون نام کاربری نمیشه!',
  passwordRequiredMsg: 'بدون رمز عبور نمیشه!', 
};

const LoginForm = ({ dispatch }) => {
  const onFinish = (values, errors, outOfDate) => {
    dispatch(login(values));
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="login"
      layout="vertical"
      size="small"
      wrapperCol={{span: 24, offset: 0}}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label={texts.username}
        name="username"
        rules={[
          {
            required: true,
            message: texts.usernameRequiredMsg,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={texts.password}
        name="password"
        rules={[
          {
            required: true,
            message: texts.passwordRequiredMsg,
          },
        ]}
      >
        <Input.Password direction="ltr" />
      </Form.Item>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <Button type="ghost" htmlType="submit" size="medium">
           {texts.submit}
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;