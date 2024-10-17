// Có thể viết (rfc) nó sẽ export const variables
// Hoặc có thể viết (rafce) nó sẽ import => tạo biến => rối mới export
import React from 'react'
import { useDispatch } from 'react-redux'
import { removeAuth } from '../reduxs/reducers/authReducer';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const logout =()=>{
    dispatch(removeAuth({}));
  };

  return (
    <div>
      <button className='btn btn-sm btn-danger' onClick={logout}>Logout</button>
    </div>
  )
}

export default HomeScreen
