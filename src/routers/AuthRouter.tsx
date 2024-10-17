import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Login from '../screens/auth/Login'
import Signup from '../screens/auth/Signup'
import { Typography } from 'antd'

const { Title } = Typography;

const AuthRouter = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col d-none d-lg-block text-center"
                    style={{ marginTop: '15%' }}>
                    <div className="mb-4">
                        <img src="https://firebasestorage.googleapis.com/v0/b/kanban-a0807.appspot.com/o/thanhxinh.jpg?alt=media&token=e49e6f2a-7594-4a74-86db-0a3dea09a2fe" alt="Công ty của Thiên Bảo và Thu Thanh nè" style={{ width: 270, objectFit: 'cover', borderRadius: 20 }} />
                    </div>

                    <div>
                        <Title className='text-success'>BaoThanh shop</Title>
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
