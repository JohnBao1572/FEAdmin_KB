import { Alert, Button, message, Modal, Spin, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { AddressModel, BillModel, BillStatus, PaymentStatus, BillProductModel } from '../models/Product';
import handleAPI from '../apis/handleAPI';
import { FormatCurrency } from '../utils/formatNumber';

const { Title } = Typography;

const ManageOrders = () => {
  const [orders, setOrders] = useState<BillModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<BillModel | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<Record<string, AddressModel>>({});
  const [products, setProducts] = useState<Record<string, any>>({});
  const [editOrder, setEditOrder] = useState<BillModel | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);


  // Fetch Orders, Addresses & Products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, addressesRes, productsRes] = await Promise.all([
          handleAPI('/payments/get-bill-admin', null, 'get'),
          handleAPI('/carts/get-addCus-ToAdmin', null, 'get'),
          handleAPI('/products/', null, 'get'),
        ]);

        console.log('Orders Response:', ordersRes);
        console.log('Addresses Response:', addressesRes);
        console.log('Products Response:', productsRes);

        // Xử lý đơn hàng
        if (Array.isArray(ordersRes.data)) {
          setOrders(ordersRes.data);
        } else {
          setOrders([]);
        }

        // Xử lý địa chỉ
        if (Array.isArray(addressesRes.data)) {
          const addressMap = addressesRes.data.reduce((acc: Record<string, AddressModel>, addr: AddressModel) => {
            acc[addr._id] = addr;
            return acc;
          }, {});
          setAddresses(addressMap);
        }

        // Xử lý sản phẩm
        if (Array.isArray(productsRes.data)) {
          const productMap = productsRes.data.reduce((acc: Record<string, any>, prod: any) => {
            acc[prod._id] = prod;
            return acc;
          }, {});
          setProducts(productMap);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveOrder = async () => {
    if (!editOrder) return;

    try {
      setLoading(true);

      // Nếu PaymentStatus = Paid thì tự động cập nhật Status = Delivered
      if (editOrder.paymentStatus === PaymentStatus.PAID) {
        editOrder.status = BillStatus.DELIVERED;
      }

      const updateRes = await handleAPI(
        `/payments/update?id=${editOrder._id}`,
        { status: editOrder.status, paymentStatus: editOrder.paymentStatus },
        'put'
      );

      if (updateRes.data.success) {
        message.success("Update order success");

        // Cập nhật danh sách đơn hàng
        const updatedOrdersRes = await handleAPI('/payments/get-bill-admin', 'get');

        if (Array.isArray(updatedOrdersRes.data)) {
          setOrders(updatedOrdersRes.data);
        } else {
          setOrders([]);
        }

        setEditModalVisible(false);
      } 
    } catch (error) {
      console.error("Error updating order:", error);
      message.error("Error updating order");
    } finally {
      setLoading(false);
    }
  };

  // Trạng thái đơn hàng
  const getOrderStatusTag = (status: BillStatus) => {
    const statusMap = {
      [BillStatus.PENDING]: { text: 'Pending', color: 'blue' },
      [BillStatus.IN_PROCESS]: { text: 'In Process', color: 'orange' },
      [BillStatus.DELIVERED]: { text: 'Delivered', color: 'green' },
      [BillStatus.CANCELED]: { text: 'Canceled', color: 'red' },
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  // Trạng thái thanh toán
  const getPaymentStatusTag = (status: PaymentStatus) => {
    return status === PaymentStatus.PAID ? (
      <Tag color="green">Paid</Tag>
    ) : (
      <Tag color="red">Unpaid</Tag>
    );
  };

  // Mở modal xem chi tiết đơn hàng
  const showModal = (order: BillModel) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = (order: BillModel) => {
    setEditOrder(order);
    setEditModalVisible(true);
  };

  // Cấu hình bảng
  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (_id: string) => <strong>{_id}</strong>,
    },

    {
      title: 'Customer',
      dataIndex: 'shippingAddress',
      key: 'name',
      render: (shippingAddress: AddressModel) =>
        addresses[shippingAddress?.address]?.name || <em>Unknown</em>,
    },

    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (productList: BillProductModel[]) => (
        productList?.length
          ? productList.map((prod) => <p key={prod._id} style={{ margin: 0 }}>{prod.title}</p>)
          : <strong>No products</strong>
      ),
    },

    { title: 'Status', dataIndex: 'status', key: 'status', render: getOrderStatusTag },

    { title: 'Payment', dataIndex: 'paymentStatus', key: 'paymentStatus', render: getPaymentStatusTag },

    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => <strong>{FormatCurrency.VND.format(total)}</strong>,
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: BillModel) => (
        <>
          <Button
            onClick={() => showModal(record)}
            icon={<EyeOutlined size={20} color='blue' />}
            type='text'
          />

          <Button
            onClick={() => handleUpdateOrder(record)}
            icon={<EditOutlined style={{ fontSize: 20, color: 'blue' }} />}
            type="text"
          />
        </>
      ),
    },
  ];

  return (
    <div className="container">
      {loading ? (
        <Spin tip="Loading orders..." />
      ) : orders.length === 0 ? (
        <Alert message="No orders found" type="info" />
      ) : (
        <Table dataSource={orders} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />
      )}

      {/* Modal chi tiết đơn hàng */}
      <Modal title="Information Customer's Order" open={isModalVisible} onCancel={handleCancel} footer={null}>

        {selectedOrder?.shippingAddress?.address && (
          <div>
            <p><strong>Customer name:</strong> {addresses[selectedOrder.shippingAddress.address]?.name}</p>
            <p><strong>Customer's phone:</strong> {addresses[selectedOrder.shippingAddress.address]?.phoneNumber}</p>
          </div>
        )}

        {selectedOrder && (
          <div>
            {/* Hiển thị danh sách sản phẩm */}
            <Title level={5}>Products:</Title>
            {selectedOrder.products && selectedOrder.products.length > 0 ? (
              selectedOrder.products.map((product) => (
                <div key={product._id} className="border p-2 mb-2 flex">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.title}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                  <div className="ml-3">
                    <p><strong>{product.title}</strong></p>
                    <p>Size: {product.size}</p>
                    <p>Color: <span style={{ backgroundColor: product.color, padding: "2px 8px", borderRadius: "4px", display: "inline-block" }}>&nbsp;</span></p>
                    <p>Quantity: {product.qty}</p>
                  </div>
                </div>
              ))
            ) : (
              <p><strong>No products found.</strong></p>
            )}

            {/* Hiển thị địa chỉ giao hàng */}
            {addresses[selectedOrder.shippingAddress.address] ? (
              <div className='border p-2 mb-2 flex'>
                <Title level={5} className='d-inline'>Shipping Address:</Title>
                <p className='d-inline'> {addresses[selectedOrder.shippingAddress.address].address}</p>
              </div>
            ) : (
              <p>Address not found</p>
            )}

            <p><strong>Status:</strong> {getOrderStatusTag(selectedOrder.status)}</p>

            <p><strong>Payment Status:</strong> {getPaymentStatusTag(selectedOrder.paymentStatus)}</p>

            <h2><strong>Total:</strong> {FormatCurrency.VND.format(selectedOrder.total)}</h2>
          </div>
        )}
      </Modal>

      {/* Modal to update order status */}
      <Modal
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveOrder}
      >
        {editOrder && (
          <>
            <Title level={5} style={{
              textAlign: 'center',
              fontSize: 25,
              color: 'blue',
              fontWeight: 'bold'
            }}>
              Edit status customer's order
            </Title>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>Status:</strong>
              <select
                value={editOrder.status}
                style={{
                  borderRadius: 5,
                  margin: 5,
                  padding: 6
                }}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, status: parseInt(e.target.value) as BillStatus })
                }
              >
                <option value={BillStatus.PENDING}>Pending</option>
                <option value={BillStatus.IN_PROCESS}>In Process</option>
                <option value={BillStatus.DELIVERED}>Delivered</option>
                <option value={BillStatus.CANCELED}>Canceled</option>
              </select>
            </div>

            <div className='mt-3' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>Payment Status:</strong>
              <select
                value={editOrder.paymentStatus}
                style={{
                  borderRadius: 5,
                  margin: 5,
                  padding: 6
                }}
                onChange={(e) => setEditOrder({
                  ...editOrder,
                  paymentStatus: parseInt(e.target.value) as PaymentStatus
                })}
              >
                <option value={PaymentStatus.PAID}>Paid</option>
                <option value={PaymentStatus.UNPAID}>Unpaid</option>
              </select>
            </div>

          </>
        )}
      </Modal>
    </div>
  );
};

export default ManageOrders;