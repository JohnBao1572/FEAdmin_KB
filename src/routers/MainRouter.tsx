import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import { Affix, Layout } from 'antd'
import SiderComponent from '../components/SiderComponent';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent';
import { Orders, ReportScreen, Suppliers } from '../screens';
import Categories from '../screens/categories/Categories';


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
                <Route path='/inventory' />
                <Route path='/inventory/add-product' />
                <Route path='/inventory/detail/:slug' />
              </Route>

              <Route path='/report' element={<ReportScreen />} />

              <Route path='/suppliers' element={<Suppliers />} />

              <Route path='/orders' element={<Orders />} />

              <Route>
                <Route path='/categories' element={<Categories />} />
                <Route path='/categories/detail/:slug'/>
              </Route>
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>


  )
}

export default MainRouter
