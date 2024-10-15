import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Login from '../screens/auth/Login'
import Signup from '../screens/auth/Signup'

const AuthRouter = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col d-none d-lg-block text-center" style={{ marginTop: '15%' }}>
                    <div className="mb-4">
                        <img src="" alt="" />
                    </div>
                    <div>
                        <title>ThienBao shopping mall</title>
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
