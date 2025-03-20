import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Login from '../screens/auth/Login'
import Signup from '../screens/auth/Signup'
import { Typography } from 'antd'
import { appInfo } from '../constants/appInfos'

const { Title } = Typography;

const AuthRouter = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col d-none d-lg-block text-center"
                    style={{ marginTop: '15%' }}>
                    <div className="mb-4">
                        <img src='https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/325906376_2074777692727406_1745368239073569186_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ispnTI4qAk4Q7kNvgGVNU4t&_nc_oc=AdkU-HjUPY5P7rOIqGHRGvkr8AbKCU6X0sWNGv0Mu3TDIp98bPhV-kbHY37FoZJNxW4&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&_nc_gid=OLVVh_mKUueVg2OBb73nwg&oh=00_AYHYU50QMhZi1Trdy3LKyepL7KHMzs517Nn8mtbtlLzkEQ&oe=67E15DCD' alt="Công ty của Thiên Bảo" style={{ width: 270, objectFit: 'cover', borderRadius: 20 }} />
                    </div>

                    <div>
                        <Title className='text-success'>ThienBao E-commerce</Title>
                    </div>
                </div>
                <div className="col content-center">
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Login />} />
                            <Route path='/sign-up' element={<Signup />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </div>
    )
}

export default AuthRouter
