import { Avatar, Button, List, message, Modal, Space, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { AddPromotions } from '../modals';
import handleAPI from '../apis/handleAPI';
import { PromotionModel } from '../models/PromotionModels';
import { Table } from 'antd'
import { ColumnProps } from 'antd/es/table';
import { Edit, Edit2, Trash } from 'iconsax-react';

const {confirm} = Modal;

const PromotionScreen = () => {
  const [visiblePromotion, setIsVisiblePromotion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [promotions, setPromotions] = useState<PromotionModel[]>([])
  const [promotionSelected, setPromotionSelected] = useState<PromotionModel>();

  useEffect(() => {
    // Set thời gian cho nó khoảng bao nhiêu giây nó sẽ hiện ra mảng các mã khuyến mãi
    // const timeout = setTimeout(() =>{
    //   getPromotions();
    // }, 3000);

    // return () => clearInterval(timeout);

    getPromotions();
  }, [])

  const getPromotions = async () => {
    const api = `/promotions/get-promotions`;

    setIsLoading(true);
    try {
      const res = await handleAPI(api)
      setPromotions(res.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePromotion = async (id:string) =>{
    const api = `/promotions/delete-promotion?id=${id}`

    try {
      await handleAPI(api, undefined, 'delete')
      await getPromotions();
    } catch (error:any) {
      console.log(error)
    }
  };

  const columns: ColumnProps<PromotionModel>[] = [
    {
      key: 'image',
      dataIndex: 'imageURL',
      title: 'Image',
      render: (img:string) => <Avatar src={img} size={50}/>
    },

    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
    },

    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description',
    },

    {
      key: 'code',
      dataIndex: 'code',
      title: 'Code',
    },

    {
      key: 'available',
      dataIndex: 'numOfAvailable',
      title: 'Available',
    },

    {
      key: 'value',
      dataIndex: 'value',
      title: 'Value',
    },

    {
      key: 'type',
      dataIndex: 'type',
      title: 'Type',
    },

    {
      key: 'btn',
      dataIndex: '',
      align: 'right',
      fixed: 'right',
      render: (item: PromotionModel) =>(
        <Space>
          <Button 
          onClick={() => {
            setPromotionSelected(item);
            setIsVisiblePromotion(true);
          }}
          type='text' 
          icon={<Edit2 variant='Bold' size={20} className='text-info'/>}/>

          <Button onClick={() => {
            // Sẽ xác thực người dùng trước khi muốn xóa
            confirm({
              title: 'Confirm',
              content: 'Are you sure you want to remove this promotion',
              onOk:() => handleRemovePromotion(item._id),
          })
        }} 
          type='text' 
          icon={<Trash variant='Bold' 
          size={20} 
          className='text-danger'/>}/>
        </Space>
      )
    },
  ]

  return (
    <div>
      {/* <Button onClick={() => setIsVisiblePromotion(true)}>Add new promotion</Button> */}

      <div className="container">
          <Table loading={isLoading} columns={columns} dataSource={promotions}/>
      </div>

      <AddPromotions promotion={promotionSelected}
      onAddNew={async(val) => getPromotions()} 
      visible={visiblePromotion} 
      onClose={() => setIsVisiblePromotion(false)} />
    </div>
  )
}

export default PromotionScreen
