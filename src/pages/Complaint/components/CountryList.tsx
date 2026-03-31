import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, theme, Spin, Card, Typography, InputRef } from 'antd';
import { requestGetCountry } from '@/services/apiRequest/dropdowns';
import { Table, Tag } from 'antd';
import type { ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import { FilterConfirmProps } from 'antd/es/table/interface';

interface CountryDataType {
    countryID: string;
    countryName: string;
    countryCode: string;
    nationality: string;
    key?: string;
}

const CountryList = ({ refresh, editRecord }: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { token } = theme.useToken();
    const [countryList, setCountryList] = useState<CountryDataType[]>([]);
    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        getCountryList();
    }, [refresh]);

    const getCountryList = async () => {
        setLoading(true);
        const params = {
            CountryID: -1,
            Type: 1
        };
        const res = await requestGetCountry(params);
        // Check if response is array (as shown in your API response)
        if (Array.isArray(res) && res.length > 0) {
            const dataWithKeys = res.map((item: any, index: number) => ({
                ...item,
                key: item.countryID || `country_${index}`,
                isActive: true // Default since API doesn't return isActive
            }));
            setCountryList(dataWithKeys);
        } else if (res.isSuccess === true && res.result) {
            // Alternative response format
            const dataWithKeys = res.result.map((item: any, index: number) => ({
                ...item,
                key: item.countryID || `country_${index}`,
                isActive: true
            }));
            setCountryList(dataWithKeys);
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
        dataIndex: keyof CountryDataType,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getColumnSearchProps = (dataIndex: keyof CountryDataType): ColumnType<CountryDataType> => ({
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
            title: 'Country Name',
            dataIndex: 'countryName',
            key: 'countryName',
            width: '30%',
            ...getColumnSearchProps('countryName'),
            sorter: (a: any, b: any) => a.countryName.localeCompare(b.countryName),
        },
        {
            title: 'Country Code',
            dataIndex: 'countryCode',
            key: 'countryCode',
            width: '20%',
        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            width: '25%',
            ...getColumnSearchProps('nationality'),
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'isActive',
        //     key: 'isActive',
        //     width: '15%',
        //     render: (isActive: boolean) =>
        //         <Tag color={isActive === true ? 'success' : 'error'}>
        //             {isActive === true ? 'Active' : 'InActive'}
        //         </Tag>,
        //     filters: [
        //         { text: 'Active', value: true },
        //         { text: 'InActive', value: false },
        //     ],
        //     onFilter: (value: any, record: any) => record.isActive === value,
        // },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (_: any, record: any) => {
                return (
                    <Typography.Link 
                        style={{ width: 100 }} 
                      //  disabled={editingKey !== ''} 
                        onClick={() => {
                            setEditingKey(record.countryID);
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
                            Country List
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
                        dataSource={countryList}
                        pagination={{ pageSize: 10 }}
                    />
                </Spin>
            </Card>
        </Form>
    );
};

export default CountryList;