import { Layout, Menu, MenuProps, Typography } from 'antd';
import { Box, Chart, Home, Home2 } from 'iconsax-react';
import { MdInventory } from "react-icons/md";
import { FaTags } from "react-icons/fa";
import { CiUser, CiViewList } from "react-icons/ci";

import React from 'react'
import { Link } from 'react-router-dom';
import { appInfo } from '../constants/appInfos';
import { colors } from '../constants/colors';

const {Sider} = Layout
const {Text} = Typography;
type MenuItem = Required<MenuProps>['items'][number];

const SiderComponent = () => {

    const items:MenuItem[] =[
        {
            key: 'dashboard',
            label: <Link to={'/'}>Dashboard</Link>,
            icon: <Home2 size={20}/>,
        },

        {
          key: 'inventory',
          label: 'Inventory',
          icon: <MdInventory size={20}/>,
          children:[
            {
              key:'inventory',
              label: <Link to={'/inventory'}>All</Link>,
            },
            {
              key: 'addNew',
              label: <Link to={'/inventory/add-product'}>Add new</Link>,
            },
          ],
        },

        {
          key:'categories',
          label: <Link to={'/categories'}>Category</Link>,
          icon: <FaTags size={20}/>
        },

        {
          key: 'Report',
          label: <Link to={'/report'}>Report</Link>,
          icon: <Chart size={20}/>
        },

        {
          key: 'Suppliers',
          label: <Link to={'/suppliers'}>Supplier</Link>,
          icon: <CiUser size={20}/>
        },

        {
          key: 'Orders',
          label: <Link to={'/orders'}>Order</Link>,
          icon: <Box size={20}/>,
        },

        {
          key: 'Manage Store',
          label: <Link to={'/mange-store'}>Manage Store</Link>,
          icon: <CiViewList size={20}/>
        },
        
    ];

  return (
    <Sider theme='light'>
        <div className="p-2 d-flex">
          <img src={appInfo.logo} width={50}/>

          <Text style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: colors.primary500,
            margin: 0,
          }}>
            {appInfo.title}
          </Text>
        </div>
        <Menu items={items} theme='light' mode='inline'></Menu>
    </Sider>
  )
}

export default SiderComponent;
