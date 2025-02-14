
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, removeAuth } from '../reduxs/reducers/authReducer'
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Drawer, Dropdown, Input, List, MenuProps, Space, Typography } from 'antd';
import { auth } from '../firebase/firebaseConfig';
import { Auth } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { SearchNormal1 } from 'iconsax-react';
import { IoIosNotifications } from "react-icons/io";
import { colors } from '../constants/colors';
import handleAPI from '../apis/handleAPI';
import { NotificationModel } from '../models/NotificationModel';
import { DateTime } from '../utils/dateTime';


const HeaderComponent = () => {
    const [notificaitons, setNotiifications] = useState<NotificationModel[]>([]);
    const [visibleModalNoti, setVisibleModalNoti] = useState(false);

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


    useEffect(() => {
        getNotifications();
    }, [])
    const getNotifications = async () => {
        const api = `/notifications`;
        // console.log(api);
        try {
            const res = await handleAPI(api);
            // console.log(res);

            setNotiifications(res.data);
        } catch (error: any) {
            console.log(error.message);
        }
    }
    // console.log(notificaitons);

    const handleReadNotification = async (item: NotificationModel) => {
        if (!item.isRead) {
            const api = `/notifications/updateNewOrderNoti?id=${item._id}`;

            try {
                const res = await handleAPI(api, { isRead: true }, 'put')
                await getNotifications();
            } catch (error: any) {
                console.log(error.message);
            }
        }

        // console.log(item)
        setVisibleModalNoti(false);
        navigate(`/order?id=${item._id}`)
    }

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
                    <Button
                        onClick={() => setVisibleModalNoti(true)}
                        type='text'
                        icon={
                            <Badge count={
                                notificaitons.filter((element) => !element.isRead).length
                            }>
                                <IoIosNotifications size={22} color={colors.gray600} />
                            </Badge>
                        }
                    />

                    <Dropdown menu={{ items }}>
                        <Avatar src={user.photoUrl} size={40}></Avatar>
                    </Dropdown>
                </Space>
            </div>

            <Drawer open={visibleModalNoti}
                onClose={() => setVisibleModalNoti(false)}>
                <List
                    dataSource={notificaitons}
                    renderItem={(item) => (
                        <List.Item key={item._id}
                            // onClick={item.isRead ? undefined : () => { handleReadNotification(item) }}
                            >
                            <List.Item.Meta
                                title={
                                    <Button
                                    type='link'
                                    onClick={() => handleReadNotification(item)}>
                                        <Typography.Text className={item.isRead ? 'text-muted' : ''}>
                                            {item.title}
                                        </Typography.Text>
                                    </Button>
                                }
                                description={item.body}
                            />

                            <Typography.Text type='secondary'>
                                {DateTime.CalendarDate(item.createdAt)}
                            </Typography.Text>

                        </List.Item>
                    )}>

                </List>
            </Drawer>
        </div>
    )
}

export default HeaderComponent;


