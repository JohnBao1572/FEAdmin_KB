import { Button, List, message, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { AddPromotions } from '../modals';
import handleAPI from '../apis/handleAPI';
import { PromotionModel } from '../models/PromotionModels';

const PromotionScreen = () => {
    const [visiblePromotion, setIsVisiblePromotion] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [promotions, setPromotions] = useState<PromotionModel[]>([])

    useEffect(() =>{
      // Set thời gian cho nó khoảng bao nhiêu giây nó sẽ hiện ra mảng các mã khuyến mãi
      // const timeout = setTimeout(() =>{
      //   getPromotions();
      // }, 3000);

      // return () => clearInterval(timeout);

      getPromotions();
    }, [])
    const getPromotions = async() =>{
      const api = `/promotions/get-promotions`;

      setIsLoading(true);
      try {
        const res = await handleAPI(api)
        setPromotions(res.data);
      } catch (error:any) {
        console.log(error.message);
      } finally{
        setIsLoading(false);
      }
    }

    const testAddToCard = async() =>{
      const data = promotions[0];
      const items:any = [];

      Array.from({length: 100}).map((item) =>{
        items.push({
          ...data,
          uid: `user${Math.floor(Math.random() * 2)}`,
        })
      })

      console.log(items)
    }
  return (
    <div>
      {/* <Button onClick={() => setIsVisiblePromotion(true)}>Add new promotion</Button> */}

      <div className="container">
        <Button onClick={testAddToCard}>Test</Button>
        <div className="row">
          <div className="col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
            <List dataSource={[]} loading={isLoading}/>
          </div>
        </div>
      </div>

      <AddPromotions onAddNew={(val) => console.log(val)} visible={visiblePromotion} onClose={() => setIsVisiblePromotion(false)}/>
    </div>
  )
}

export default PromotionScreen
