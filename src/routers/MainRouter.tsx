import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import { Affix, Layout } from 'antd'
import SiderComponent from '../components/SiderComponent';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent';
import { ManageStore, Orders, ReportScreen, Suppliers } from '../screens';
import Categories from '../screens/categories/Categories';
import Inventories from '../screens/inventories/Inventories';
import AddProduct from '../screens/inventories/AddProduct';
import ProductDetail from '../screens/inventories/ProductDetail';
import PromotionScreen from '../screens/PromotionScreen';


const { Content, Footer, Header, Sider } = Layout;


const MainRouter = () => {

  return (
    <BrowserRouter>
      <Layout>

        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>

        <Layout style={{
          backgroundColor: 'white !important',
        }}>

          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>

          <Content className='pt-3 container-fluid'>
            <Routes>
              <Route path='/' element={<HomeScreen />}></Route>

              <Route>
                <Route path='/inventory' element={<Inventories />} />
                <Route path='/inventory/add-product' element={<AddProduct />} />
                <Route path='/inventory/detail/:slug' element={<ProductDetail />} />
              </Route>

              <Route path='/report' element={<ReportScreen />} />

              <Route path='/suppliers' element={<Suppliers />} />

              <Route path='/orders' element={<Orders />} />

              <Route>
                <Route path='/categories' element={<Categories />} />
                <Route path='/categories/detail/:slug' />
              </Route>

              
              <Route path='/promotions' element={<PromotionScreen />} />
              <Route />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}

export default MainRouter
