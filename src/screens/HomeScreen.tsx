import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeAuth } from '../reduxs/reducers/authReducer';
import handleAPI from '../apis/handleAPI';
import { Card, Col, Row, Statistic, Table } from 'antd';
import { ShoppingCartOutlined, DollarOutlined } from "@ant-design/icons";
import axios from 'axios';
import { SubProductModel } from '../models/Product';
import { ReportModel } from '../models/reportModel';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [bestSellingProducts, setBestSellingProducts] = useState<SubProductModel[]>([]);
  const [getTotal, setGetTotal] = useState<ReportModel>()

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  const fetchTopSellingProducts = async () => {
    const api = `http://localhost:5000/reports/top5ProductBestSell`;
    try {
      const res = await handleAPI(api);
      setBestSellingProducts(res.data);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
    }
  };

  const columns = [
    { title: "Name product", dataIndex: "title", key: "title" },

    { 
      title: "Image", 
      dataIndex: "image", 
      key: "image",
      render: (image: string) => <img src={image} alt="Product" style={{ width: 50, height: 50 }} />,
    },
    
    { title: "Giá", dataIndex: "price", key: "price" },

    { title: "Quantity", dataIndex: "count", key: "count" },

    { title: "Sizes", dataIndex: "size", key: "size" },

    { title: "colors", dataIndex: "color", key: "color" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="Sales Overview" style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Total Sales" value={bestSellingProducts.reduce((sum, item) => sum + item.count, 0)} prefix={<ShoppingCartOutlined />} />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="Product Best Selling" extra={<a href="#">See All</a>} style={{ marginBottom: 20 }}>
        <Table dataSource={bestSellingProducts} columns={columns} pagination={false} rowKey="_id" />
      </Card>
    </div>
  );
};

export default HomeScreen;