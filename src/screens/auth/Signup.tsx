import React, { useState } from 'react'
import { Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd'
import { Link, useHref } from 'react-router-dom'
import SocialLogin from './components/SocialLogin'
import FormItem from 'antd/es/form/FormItem'
import handleAPI from '../../apis/handleAPI'
import { useDispatch } from 'react-redux'
import { addAuth } from '../../reduxs/reducers/authReducer'
import { localDataName } from '../../constants/appInfos'


const { Title, Paragraph, Text } = Typography

const Login = () => {

    const [isloading, setIsLoading] = useState(false);
    const [isRemember, setIsRemember] = useState(false);

    const dispatch = useDispatch();

    const [form] = Form.useForm();

    const handleLogin = async (values: { name: string; email: string; password: string }) => {
        console.log(values);
        const api = '/auth/register';

        setIsLoading(true);
        try {
            const res = await handleAPI(api, values, 'post');
            if(res.data){
                localStorage.setItem(localDataName.authData, JSON.stringify(res.data));

                dispatch(addAuth(res.data));
            }
        } catch (error) {
            console.log("Tài khoản hoặc mật khẩu. Vui lòng đăng nhập lại", error);
        } finally {
            setIsLoading(false);
        }
    }
    return (

        <Card style={{ width: '60%', }}>
            <div className="text-center">
                <Title level={2}>Sign-up</Title>

                <Paragraph type='secondary'>
                    Welcome back! Please enter to your account details
                </Paragraph>
            </div>

            <Form layout='vertical' form={form} onFinish={handleLogin} disabled={isloading} size='large'>
                <FormItem name={'name'} label='Name' rules={[
                    {
                        required: true,
                        message: 'Please enter your name',
                    }
                ]}>
                    <Input placeholder='Enter your name' allowClear></Input>
                </FormItem>

                <Form.Item name={'email'} label='Email' rules={[{
                    required: true,
                    message: 'Please enter your email',
                },]}>
                    <Input allowClear maxLength={100} type='email' placeholder='Enter your email' />
                </Form.Item>

                <Form.Item name={'password'} label='Password' rules={[{
                    required: true,
                    message: 'Please enter your password to login your account'
                },
                () => ({
                    validator: (_, value) => {
                        if (value.length < 3) {
                            return Promise.reject(
                                new Error('Mật khẩu ít nhất phải chứa 3 kí tự trở lên')
                            );
                        } else {
                            return Promise.resolve();
                        }
                    }
                })
                ]}>
                    <Input.Password maxLength={100} type='password' placeholder='Enter your password' />
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
                    SignUp
                </Button>
            </div>

            <SocialLogin />
            <div className="mt-4 text-center">
                <Space>
                    <Text>Dont't have an account</Text>
                    <Link to={'/'}>Login</Link>
                </Space>
            </div>
        </Card>

    )
}

export default Login
