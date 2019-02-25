import * as React from 'react';
import { Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { LocaleContext } from '$contexts/Locale';

import Particles from '$components/Particles';

import SignButton from './SignButton';

import './index.less';

export interface FormValue {
  username: string;
  password: string;
}

interface SignInProps extends FormComponentProps {
  path: string;
}

function SignIn(props: SignInProps) {
  const { getFieldDecorator, validateFields } = props.form;
  const { locale } = React.useContext(LocaleContext);

  return (
    <div className="sign-in page-container">
      <Particles />
      <Form>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              {
                validator(rule, value, callback) {
                  if (/^[\da-zA-Z]{3,15}$/g.test(value)) {
                    callback();
                  }
                  callback(locale.signIn.usernameLimit);
                },
              },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={locale.signIn.username}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                validator(rule, value, callback) {
                  if (
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\da-zA-Z]{6,15}$/.test(
                      value,
                    )
                  ) {
                    callback();
                  }
                  callback(locale.signIn.passwordLimit);
                },
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder={locale.signIn.password}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <SignButton type="sign-up" validateFields={validateFields} />
          <SignButton type="sign-in" validateFields={validateFields} />
        </Form.Item>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'signIn' } as any)(React.memo(SignIn));
