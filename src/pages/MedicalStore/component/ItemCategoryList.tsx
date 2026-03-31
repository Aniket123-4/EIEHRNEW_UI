import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, theme, Spin, Card, Typography, InputRef } from 'antd';
import { requestGetItemCat } from '@/services/apiRequest/dropdowns';
import { Table, Tag } from 'antd';
import type { ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import { FilterConfirmProps } from 'antd/es/table/interface';

interface ItemCategoryDataType {
    itemCatID: string;
    itemCatName: string;
    itemCatCode: string;
    parentItemCatID: string;
    isActive: boolean;
    itemCatTypeID: string;
    depthLevel: string;
    isRight: boolean;
    rowID: string;
    itemCatIDTree: string;
    key?: string;
}

const ItemCategoryList = ({ refresh, editRecord }: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { token } = theme.useToken();
    const [categoryList, setCategoryList] = useState<ItemCategoryDataType[]>([]);
    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        getCategoryList();
    }, [refresh]);

    const getCategoryList = async () => {
        setLoading(true);
        const params = {
            itemCatID: -1,
            sectionID: -1,
            fundID: 1,
            userID: -1,
            formID: -1,
            mainType: 2,
            type: 1
        };
        const res = await requestGetItemCat(params);
        if (res.isSuccess == true && res.result.length > 0) {
            // Add key property for table
            const dataWithKeys = res.result.map((item: any, index: number) => ({
                ...item,
                key: item.itemCatID || `cat_${index}`
            }));
            setCategoryList(dataWithKeys);
        }
        setLoading(false);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: keyof ItemCategoryDataType,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getColumnSearchProps = (dataIndex: keyof ItemCategoryDataType): ColumnType<ItemCategoryDataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()) ?? false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Category Name',
            dataIndex: 'itemCatName',
            key: 'itemCatName',
            width: '35%',
            ...getColumnSearchProps('itemCatName'),
        },
        {
            title: 'Category Code',
            dataIndex: 'itemCatCode',
            key: 'itemCatCode',
            width: '20%',
            render: (text: string) => text || '-',
        },
      //  {
        //     title: 'Category ID',
        //     dataIndex: 'itemCatID',
        //     key: 'itemCatID',
        //     width: '15%',
        // },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '15%',
            render: (isActive: boolean) =>
                <Tag color={isActive === true ? 'success' : 'error'}>
                    {isActive === true ? 'Active' : 'InActive'}
                </Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: (_: any, record: ItemCategoryDataType) => {
                return (
                    <Typography.Link 
                        style={{ width: 100 }} 
                      //  disabled={editingKey !== ''} 
                        onClick={() => {
                            setEditingKey(record.itemCatID);
                            editRecord(record);
                        }}
                    >
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    return (
        <Form form={form} component={false}>
            <Card
                title={
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        margin: 0,
                    }}>
                        <Typography style={{
                            margin: 0,
                            color: '#0050b3',
                            fontWeight: 600,
                            fontSize: '18px'
                        }}>
                            Item Category List
                        </Typography>
                    </div>
                }
                headStyle={{
                    backgroundColor: '#e6f7ff',
                    borderBottom: '1px solid #91d5ff',
                    padding: '12px 16px',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                }}
                bodyStyle={{ padding: '16px 20px' }}
                style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 3px 12px rgba(72, 116, 220, 0.18)',
                    marginBottom: 24,
                }}
            >
                <Spin tip="Loading..." spinning={loading}>
                    <Table
                        scroll={{ x: 450, y: 270 }}
                        columns={columns}
                        dataSource={categoryList}
                        pagination={{ pageSize: 10 }}
                    />
                </Spin>
            </Card>
        </Form>
    );
};

export default ItemCategoryList;