import { DatePicker, Form, Input, InputNumber, Modal, Select, Upload, UploadFile } from 'antd';
import React, { useState } from 'react'

interface Props {
    visible: boolean;
    onClose: () => void;
    promotion?: any;
}

const AddPromotions = (props: Props) => {
    const { visible, onClose, promotion } = props;
    const [imageUpload, setImageUpload] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const handleClose = () => {
        onClose();
    }

    const handleAddNewPromotion = async (values: any) => {

    }

    return (
        <Modal title='Add new promotion'
            open={visible}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={() => form.submit()}>
            <Upload fileList={imageUpload} listType='picture-card' className='mb-3' onChange={(val) => { console.log(val)}}>
                {imageUpload.length === 0 ? 'Upload' : null}
            </Upload>
            <Form form={form}
                size='large'
                onFinish={handleAddNewPromotion}
                layout='vertical'>
                <Form.Item name={'title'}
                    label='Title'
                    rules={[{ required: true, message: 'Please input name promotion for product' }]}>
                    <Input placeholder='title' allowClear />
                </Form.Item>

                <Form.Item name={'description'}
                    label='Description'>
                    <Input.TextArea rows={4} placeholder='description' allowClear />
                </Form.Item>

                <div className="row">
                    <div className="col">
                        <Form.Item name={'code'} label='CODE' rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="col">
                        <Form.Item name={'value'} label='Value'>
                            <Input type='number' />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Form.Item name={'numOfAvailable'} label='Num of value'>
                            <Input type='number' />
                        </Form.Item>
                    </div>

                    <div className="col">
                        <Form.Item name={'type'} label='Type' initialValue={'discount'}>
                            <Select
                                options={[
                                    {
                                        label: 'Discount',
                                        value: 'discount',
                                    },

                                    {
                                        label: 'Percent',
                                        value: 'percent',
                                    }
                                ]} />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <Form.Item name={'startAt'} label='Start at'>
                            <DatePicker showTime format={'DD/MM/YYYY HH:mm:ss'} />
                        </Form.Item>
                    </div>
                    <div className="col">
                        <Form.Item name={'endAt'} label='End at'>
                            <DatePicker showTime format={'DD/MM/YYYY HH:mm:ss'} />
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    )
}

export default AddPromotions
