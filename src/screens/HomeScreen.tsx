// Có thể viết (rfc) nó sẽ export const variables
// Hoặc có thể viết (rafce) nó sẽ import => tạo biến => rối mới export
import React from 'react'
import { useDispatch } from 'react-redux'
import { removeAuth } from '../reduxs/reducers/authReducer';
import handleAPI from '../apis/handleAPI';
import { StatisticModel } from '../models/StatisticModel';
import { colors } from '../constants/colors';
import { LiaCoinsSolid } from "react-icons/lia";
import StatisticComponent from '../components/StatisticComponent';


const HomeScreen = () => {
  const dispatch = useDispatch();

  const salesData: StatisticModel[] = [
    {
      key: 'sales',
      description: 'Sales',
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30}
        color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: 'currency',
    },

    {
      key: 'revenue',
      description: 'Revenue',
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: 'number',
    },

    {
      key: 'profit',
      description: 'Profit',
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30}
        color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: 'currency',
    },

    {
      key: 'cost',
      description: 'Cost',
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30}
        color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: 'number',
    },
  ];

  const inventoryDatas: StatisticModel[] = [
    {
      key: 'sales',
      description: 'Sales',
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30}
        color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: 'currency',
      type: 'vertical',
    },

    {
      key: 'revenue',
      description: 'Revenue',
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30}
        color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: 'number',
      type: 'vertical',
    },
  ]

  return (
    <div>
      <div className="row">

        <div className="col-md-8">
          <StatisticComponent title={'Sales Overview'} datas={salesData} />

          <StatisticComponent title={'Purchase Overview'} datas={salesData} />

          <StatisticComponent title={'Sales Overview'} datas={salesData} />

          <StatisticComponent title={'Sales Overview'} datas={salesData} />

          <StatisticComponent title={'Sales Overview'} datas={salesData} />
        </div>

        <div className="col-md-4">
          <StatisticComponent datas={inventoryDatas} title='Inventory Sumary' />

          <StatisticComponent datas={inventoryDatas} title='Product Sumary' />
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
