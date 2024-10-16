// Có thể viết (rfc) nó sẽ export const variables
// Hoặc có thể viết (rafce) nó sẽ import => tạo biến => rối mới export
import React from 'react'
import { useDispatch } from 'react-redux'

const HomeScreen = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button className='btn btn-sm btn-danger'>Logout  </button>
    </div>
  )
}

export default HomeScreen
