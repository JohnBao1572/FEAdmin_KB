import { upload } from '@testing-library/user-event/dist/upload';
import { DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload, UploadFile, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react'
import { uploadFile } from '../utils/uploadFile';
import handleAPI from '../apis/handleAPI';
import { PromotionModel } from '../models/PromotionModels';
import dayjs from 'dayjs';
import { url } from 'inspector';

interface Props {
    visible: boolean;
    onClose: () => void;
    promotion?: PromotionModel;
    onAddNew: (val: PromotionModel) => void;
}

const AddPromotions = (props: Props) => {
    const { visible, onClose, promotion, onAddNew } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<any[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (promotion) {
            form.setFieldsValue({
                ...promotion,
                startAt: dayjs(promotion.startAt),
                endAt: dayjs(promotion.endAt),
            });

            if (promotion.imageURL) {
                setImageUpload([
                    { uid: '-1', url: promotion.imageURL, status: 'done' }
                ]);
            }
        }
    }, [promotion])

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
            message.error('Please upload image');
            return;
        }

        const start = values.startAt;
        const end = values.endAt;

        if (new Date(end).getTime() < new Date(start).getTime()) {
            message.error('End time must be higher than start time');
            return;
        }

        const data = {
            ...values,
            startAt: new Date(values.startAt),
            endAt: new Date(values.endAt),
            imageURL: imageUpload.length > 0 && imageUpload[0].originFileObj
                ? await uploadFile(imageUpload[0].originFileObj)
                : imageUpload[0].url,
        };

        const api = `/promotions/${promotion ? `update-promotion?id=${promotion._id}` : 'add-new'}`;
        setIsLoading(true);
        try {
            const res = await handleAPI(api, data, promotion ? 'put' : 'post');
            onAddNew(res.data);
            handleClose();
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsLoading(false);
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
                    rules={[{ required: true, message: "please select start date" }]}>
                    <Input placeholder='title' allowClear />
                </Form.Item>

                <Form.Item name={'description'}
                    label='Description'>
                    <Input.TextArea rows={4} placeholder='description' allowClear />
                </Form.Item>

                <div className="row">
                    <div className="col">
                        <Form.Item name={'code'} label='CODE' rules={[{ required: true, message: "please select start date" }]}>
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="col">
                        <Form.Item name={'value'} label='Value' rules={[{ required: true, message: "please select start date" }]}>
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
