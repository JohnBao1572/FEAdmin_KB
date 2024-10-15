import React, { useState } from 'react'
import { Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd'
import { Link, useHref } from 'react-router-dom'
import SocialLogin from './components/SocialLogin'
import handleAPI from '../../apis/handleAPI'


const { Title, Paragraph, Text } = Typography

const Login = () => {

    const [isloading, setIsLoading] = useState(false);
    const [isRemember, setIsRemember] = useState(false);
    const [form] = Form.useForm();

    const handleLogin = async (values: { email: string; password: string }) => {
        console.log(values);

        try{
            const res = await handleAPI('/auth/login', values, 'post');
            console.log(res);
        }catch(error){
            console.log("Sai tài khoản hoặc mật khẩu. Vui lòng đăng nhập lại", error);
        }
    }
    return (

        <Card style={{ width: '60%', }}>
            <div className="text-center">
                <Title level={2}>Login</Title>

                <Paragraph type='secondary'>
                    Welcome back! Please enter to your account details
                </Paragraph>
            </div>

            <Form layout='vertical' form={form} onFinish={handleLogin} disabled={isloading} size='large'>
                <Form.Item name={'email'} label='Email' rules={[{
                    required: true,
                    message: 'Please enter your email',
                },]}>
                    <Input allowClear maxLength={100} type='email' />
                </Form.Item>

                <Form.Item name={'password'} label='Password' rules={[{
                    required: true,
                    message: 'Please enter your password to login your account'
                },]}>
                    <Input.Password maxLength={100} type='password' />
                </Form.Item>
            </Form>

            <div className="row">
                <div className="col">
                    <Checkbox checked={isRemember} onChange={(val) => { setIsRemember(val.target.checked) }}>Remember</Checkbox>
                </div>
                <div className="col text-right">
                    <Link to={'/'}>Forgot password</Link>
                </div>
            </div>

            <div className="mt-4 mb-3">
                <Button onClick={() => form.submit()}
                    type='primary' style={{ width: '100%' }}
                    size='large'>
                    Login
                </Button>
            </div>

            <SocialLogin />
            <div className="mt-4 text-center">
                <Space>
                    <Text>Dont't have an account</Text>
                    <Link to={'/sign-up'}>Sign up</Link>
                </Space>
            </div>
        </Card>

    )
}

export default Login
