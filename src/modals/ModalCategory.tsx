import React from 'react'
import { TreeModel } from '../models/FormModel';
import { Modal } from 'antd';


interface Props{
    visible: boolean;
    onClose: () => void;
    onAddNew: (val: any) => void;
    values: TreeModel[]
}

const ModalCategory = (props:Props) => {

    const {visible, onClose, onAddNew, values}= props

    const handleClose = ()=>{
        onClose();
    }

  return (
    <Modal
    title = {'Add category'}
    open={visible}
    onCancel={handleClose}
    footer={[null]}>
        {/* <AddCategory */}
    </Modal>
  )
}

export default ModalCategory
