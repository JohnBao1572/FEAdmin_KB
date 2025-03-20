import React, { useState } from 'react'
import { Button, Card, Checkbox, Form, Input, message, Space, Typography } from 'antd'
import { Link, useHref } from 'react-router-dom'
import SocialLogin from './components/SocialLogin'
import handleAPI from '../../apis/handleAPI'
import { addAuth } from '../../reduxs/reducers/authReducer'
import { useDispatch } from 'react-redux'
import { appInfo, localDataName } from '../../constants/appInfos'


const { Title, Paragraph, Text } = Typography

const Login = () => {

    const [isloading, setIsLoading] = useState(false);
    const [isRemember, setIsRemember] = useState(false);

    const dispatch = useDispatch();

    const [form] = Form.useForm();

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            const res: any = await handleAPI('/auth/login', values, 'post');

            message.success('Đăng nhập thành công', res.data.message);
            res.data && dispatch(addAuth(res.data));

            if (isRemember) {
                localStorage.setItem(localDataName.authData, JSON.stringify(res.data));
            }
        } catch (error: any) {
            // console.log("Sai tài khoản hoặc mật khẩu. Vui lòng đăng nhập lại", error);

            message.error('Tài khoản hoặc mật khẩu không trùng khớp', error);
        } finally {
            setIsLoading(false);
        }
    }
    return (

        <Card style={{ width: '60%', }}>
            <div className="text-center">
                <img className='mb-3' src='https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/325906376_2074777692727406_1745368239073569186_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ispnTI4qAk4Q7kNvgGVNU4t&_nc_oc=AdkU-HjUPY5P7rOIqGHRGvkr8AbKCU6X0sWNGv0Mu3TDIp98bPhV-kbHY37FoZJNxW4&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&_nc_gid=OLVVh_mKUueVg2OBb73nwg&oh=00_AYHYU50QMhZi1Trdy3LKyepL7KHMzs517Nn8mtbtlLzkEQ&oe=67E15DCD' alt="" style={{ width: 48, height: 48, }} />
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
                    <Checkbox checked={isRemember} onChange={(val) => { setIsRemember(val.target.checked) }}>Remember for 30 days</Checkbox>
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

            <SocialLogin isRemember={isRemember}/>
            <div className="mt-4 text-center">
                <Space>
                    <Text>Dont't have an account</Text>
                    <Link to={'/sign-up'}>Sign-up</Link>
                </Space>
            </div>
        </Card>
    )
}

export default Login
