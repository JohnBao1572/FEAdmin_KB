import { Button, Card, message, Modal, Space, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { CategoyModel } from '../../models/Product';
import { TreeModel } from '../../models/FormModel';
import handleAPI from '../../apis/handleAPI';
import { getTreeValues } from '../../utils/getTreeValues';
import Table, { ColumnProps } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { Edit2 } from 'iconsax-react';
import { colors } from '../../constants/colors';
import AddCategory from '../../components/AddCategory';

const { confirm } = Modal;

const Categories = () => {

    const [categories, setCategories] = useState<CategoyModel[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [treeValues, setTreeValues] = useState<TreeModel[]>([]);

    const [categorySelected, setCategorySelected] = useState<CategoyModel>();

    useEffect(() => {
        getCategories(`/product/get-category`, true);
    }, [])

    useEffect(() => {
        const api = `/product/get-category?page=${page}&pageSize=${pageSize}`;
        getCategories(api);
    }, [page, pageSize]);

    const getCategories = async (api: string, isSelected?: boolean) => {
        try {
            const res = await handleAPI(api);
            setCategories(getTreeValues(res.data, false));

            if (isSelected) {
                setTreeValues(getTreeValues(res.data, true));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const columns: ColumnProps<CategoyModel>[] = [
        {
            key: 'title',
            title: 'Name',
            dataIndex: '',
            render: (item: CategoyModel) => (
                <Link to={`/categories/detail/${item.slug}?id=${item._id}`}>
                    {item.title}
                </Link>
            ),
        },

        {
            key: 'description',
            title: 'Description',
            dataIndex: 'description',
        },

        {
            key: 'btnContainer',
            title: 'Actions',
            dataIndex: '',
            render: (item: any) => (
                <Space>

                    <Tooltip title='Edit categories' key={'btnEdit'}>

                        <Button
                            onClick={() => setCategorySelected(item)}
                            icon={<Edit2 size={20} color={colors.gray600} />}
                            type='text' />

                    </Tooltip>

                    <Tooltip title='Xóa categories' key={'btnDelete'}>
                        <Button onClick={() => confirm({
                            title: 'Confirm',
                            content: 'What are you sure you want to remove this item?',
                            onOk: async () => handleRemove(item._id),
                        })} />
                    </Tooltip>
                </Space>
            )
        },
    ];

    const handleRemove = async (id: string) => {
        const api = `/product/delete-category?id=${id}`;

        try {
            await handleAPI(api, undefined, 'delete');
            setCategories((categories) =>
                categories.filter((element) => element._id !== id)
            );

            message.success('Delete cate in product successfully');
        } catch (error: any) {
            console.log(error);
        }
    };

    return isLoading ? (<Spin />) : (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <Card title={'Add  new'}>
                            <AddCategory
                                onClose={() => setCategorySelected(undefined)}
                                seleted={categorySelected}
                                values={treeValues}
                                onAddNew={async (val) => {
                                    if (categorySelected) {
                                        const items = [...categories];
                                        const index = items.findIndex(
                                            (element) => element._id === categorySelected._id
                                        );
                                        if (index !== -1) {
                                            items[index] = val;
                                        }

                                        setCategories(items);
                                        setCategorySelected(undefined);

                                        await getCategories(`/product/get-category`, true);
                                    } else {
                                        getCategories(
                                            `/product/get-category?page=${page}&pageSize=${pageSize}`
                                        );
                                    }
                                }}
                            />
                        </Card>
                    </div>

                    <div className="col-md-8">
                        <Card>
                            <Table size='small' dataSource={categories} columns={columns} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories
