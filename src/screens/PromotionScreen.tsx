import { Button } from 'antd'
import React, { useState } from 'react'
import { AddPromotions } from '../modals';

const PromotionScreen = () => {
    const [visiblePromotion, setIsVisiblePromotion] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsVisiblePromotion(true)}>Add new promotion</Button>

      <AddPromotions visible={visiblePromotion} onClose={() => setIsVisiblePromotion(false)}/>
    </div>
  )
}

export default PromotionScreen
