import React, { useEffect, useState } from 'react'
import AuthRouter from './AuthRouter'
import MainRouter from './MainRouter'
import { useDispatch, useSelector } from 'react-redux'
import { addAuth, authSelector, AuthState } from '../reduxs/reducers/authReducer'
import { localDataName } from '../constants/appInfos'
import { Spin } from 'antd'

const Routers = () => {

  const [isloading, setIsLoading] = useState(false);

  const auth: AuthState = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const res = localStorage.getItem(localDataName.authData);
    res && dispatch(addAuth(JSON.parse(res)));
  }

  // Nếu chưa có auth.token thì sẽ vào hàm Auth còn có thì vào hàm Main
  return isloading ? <Spin /> : !auth.token ? <AuthRouter /> : <MainRouter />

}

export default Routers

