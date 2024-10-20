
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, removeAuth } from '../reduxs/reducers/authReducer'
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Input, MenuProps, Space } from 'antd';
import { auth } from '../firebase/firebaseConfig';
import { Auth } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { SearchNormal1 } from 'iconsax-react';
import { IoIosNotifications } from "react-icons/io";
import { colors } from '../constants/colors';


const HeaderComponent = () => {

    const user = useSelector(authSelector);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const items: MenuProps['items'] = [
        {
            key: 'logout',
            label: 'Đăng xuất',
            onClick: async () => {
                signOut(auth)
                dispatch(removeAuth({}));
                localStorage.clear();

                navigate('/');
            },
        },
    ];

    return (
        <div className='p-2 row bg-white m-0'>
            <div className="col">
                <Input
                    placeholder='Search product, suppliers, order'
                    style={{
                        borderRadius: 100,
                        width: '50%',
                    }}
                    size='large'
                    prefix={<SearchNormal1 className='text-muted' size={20} />}
                />
            </div>

            <div className="col text-right">
                <Space>
                    <Button type='text'
                        icon={<IoIosNotifications size={22} color={colors.gray600} />}
                    />

                    <Dropdown menu={{ items }}>
                        <Avatar src={user.photoUrl} size={40}></Avatar>
                    </Dropdown>
                </Space>
            </div>
        </div>
    )
}

export default HeaderComponent;


