import { upload } from '@testing-library/user-event/dist/upload';
import { DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload, UploadFile, UploadProps } from 'antd';
import React, { useState } from 'react'
import { uploadFile } from '../utils/uploadFile';
import handleAPI from '../apis/handleAPI';

interface Props {
    visible: boolean;
    onClose: () => void;
    promotion?: any;
    onAddNew:(val:any) => void;
}

const AddPromotions = (props: Props) => {
    const { visible, onClose, promotion, onAddNew } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<any[]>([]);
    const [form] = Form.useForm();
    const handleClose = () => {
        form.resetFields();
        onClose();
    }

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const items = newFileList.map((item) =>
            item.originFileObj
                ? {
                    ...item,
                    url: item.originFileObj
                        ? URL.createObjectURL(item.originFileObj)
                        : '',
                    status: 'done',
                }
                : { ...item }
        );

        setImageUpload(items);
    };

    const handleAddNewPromotion = async (values: any) => {
        if (imageUpload.length === 0) {
            throw new Error('Please upload image');
        } else {
            const start = values.startAt;
            // console.log(start);
            const end = values.endAt;

            if (new Date(end).getTime() < new Date(start).getTime()) {
                message.error('End time must be higher than start time');
            }
            else {
                // const data: any = [];
                // for (const i in values) {
                //     data[i] = values[i] ?? '';
                // }

                const data = {
                    ...values, // Sao chép tất cả giá trị từ form
                    startAt: new Date(values.startAt),
                    endAt: new Date(values.endAt),
                    imageURL: imageUpload.length > 0 && imageUpload[0].originFileObj
                        ? await uploadFile(imageUpload[0].originFileObj)
                        : '',
                };

                data.startAt = new Date(start);
                data.endAt = new Date(end);

                data.imageURL = imageUpload.length > 0 && imageUpload[0].originFileObj ? await uploadFile(imageUpload[0].originFileObj) : '';
                
                console.log("Form Values:", values); // Kiểm tra giá trị trong form
                // console.log(data); // Kiểm tra dữ liệu trước khi gửi

                const api = `/promotions/add-new`;
                setIsLoading(true);
                try {
                    const res = await handleAPI(api, data, 'post');
                    // console.log(res);

                    onAddNew(res.data);
                    handleClose();
                } catch (error: any) {
                    message.error(error.message);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    }

    return (
        <Modal title='Add new promotion'
            open={visible}
            onClose={handleClose}
            onCancel={handleClose}
            okButtonProps={{ loading: isLoading, }}
            cancelButtonProps={{ loading: isLoading, }}
            onOk={() => form.submit()}>
            <Upload fileList={imageUpload} listType='picture-card' className='mb-3' onChange={handleChange}>
                {imageUpload.length === 0 ? 'Upload' : null}
            </Upload>
            <Form form={form}
                size='large'
                onFinish={handleAddNewPromotion}
                layout='vertical'>
                <Form.Item name={'title'}
                    label='Title'
                    rules={[{required: true, message:"please select start date"}]}>
                    <Input placeholder='title' allowClear />
                </Form.Item>

                <Form.Item name={'description'}
                    label='Description'>
                    <Input.TextArea rows={4} placeholder='description' allowClear />
                </Form.Item>

                <div className="row">
                    <div className="col">
                        <Form.Item name={'code'} label='CODE' rules={[{required: true, message:"please select start date"}]}>
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="col">
                        <Form.Item name={'value'} label='Value' rules={[{required: true, message:"please select start date"}]}>
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
