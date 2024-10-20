import React, { useEffect, useState } from 'react'
import { TreeModel } from '../models/FormModel';
import { CategoyModel } from '../models/Product';
import { useForm } from 'antd/es/form/Form';
import { replace } from 'react-router-dom';
import { replaceName } from '../utils/replaceName';
import handleAPI from '../apis/handleAPI';
import { Button, Form, Input, message, Space, TreeSelect } from 'antd';



interface Props {
    onAddNew: (val: any) => void;
    values: TreeModel[];
    seleted?: CategoyModel;
    onClose?: () => void;
}

const AddCategory = (props: Props) => {

    const { values, onAddNew, seleted, onClose } = props;

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (seleted) {
            form.setFieldsValue(seleted);
        } else {
            form.resetFields();
        }
    }, [seleted])

    const [form] = useForm();

    const handleCategory = async (values: any) => {
        const api = seleted
            ? `/product/update-category?id=${seleted._id}`
            : `/product/add-category`;
        const data: any = {};

        for (const i in values) {
            data[i] = values[i] ?? '';
        }

        data.slug = replaceName(values.title);

        setIsLoading(true);
        try {
            
            const res = await handleAPI(api, data, seleted ? 'put' : 'post');
            // message.success('Add new category successfully');
            message.success(seleted ? 'Update category successfully' : 'Add new category successfully');

            onAddNew(res.data);

            form.resetFields();
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Form disabled={isLoading}
                form={form}
                layout='vertical'
                onFinish={handleCategory}
                size='large'>
                <Form.Item name={'parentId'} label='Parent category'>
                    <TreeSelect treeData={values}
                        allowClear
                        showSearch
                        treeDefaultExpandAll />
                </Form.Item>

                <Form.Item
                    name={'title'}
                    rules={[
                        {
                            required: true,
                            message: 'Enter category title'
                        },
                    ]}
                    label='Title'>
                    <Input allowClear />
                </Form.Item>

                <Form.Item name={'description'} label='Description'>
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>

            <div className="text-right">
                <Space>
                    {onClose && (
                        <Button loading={isLoading}
                            disabled={isLoading}
                            onClick={() => {
                                form.resetFields();
                                onClose();
                            }}>
                            Cancel
                        </Button>
                    )}

                    <Button
                        loading={isLoading}
                        disabled={isLoading}
                        type='primary'
                        onClick={() => form.submit()}>
                        {seleted ? 'Update' : 'Submit'}
                    </Button>
                </Space>
            </div>
        </>
    )
}

export default AddCategory
