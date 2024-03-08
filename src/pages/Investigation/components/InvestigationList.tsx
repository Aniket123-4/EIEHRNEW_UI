import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, InputRef } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestGetInvGroup, requestGetInvestigation } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}

const InvestigationList = React.forwardRef((props) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    type DataIndex = keyof DataType;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };



    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
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
            <SearchOutlined style={{ color: filtered ? '#1677ff' : 'gray', fontSize:17 }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
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
    const columns: ColumnsType<DataType> = [
        {
            title: 'Test Name',
            dataIndex: 'invName',
            key: 'invName',
            render: (text) => <a>{text}</a>,
            ...getColumnSearchProps('invName'),
        },
        {
            title: 'Code',
            dataIndex: 'invCode',
            key: 'invCode',
        },
        // {
        //     title: 'Active',
        //     dataIndex: 'isActive',
        //     key: 'isActive',
        //     render: (isActive) => <label>{isActive ? "Yes" : "No"}</label>,
        // },
        {
            title: 'Range Required',
            key: 'isRangeRequired',
            dataIndex: 'isRangeRequired',
            render: (isRangeRequired) => <label>{isRangeRequired ? "Yes" : "No"}</label>,
        },
        {
            title: 'Group Name',
            dataIndex: 'invGroupName',
            key: 'invGroupName',
        },
        {
            title: 'Is Service',
            dataIndex: 'isService',
            key: 'isService',
            render: (isService) => <label>{isService ? "Yes" : "No"}</label>,
        },
        // {
        //     title: 'Name ML',
        //     dataIndex: 'invNameML',
        //     key: 'invNameML',
        // },
        {
            title: 'Rate',
            dataIndex: 'invRate',
            key: 'invRate',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} onClick={() => { props?.onEditRecord(record) }}>Edit</Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getList();
    }, [])

    const getList = async () => {
        try {
            const staticParams = {
                invParameterID: -1,
                invGroupID: -1,
                isActive: -1,
                formID: -1,
                type: 1
            };

            setLoading(true)
            const response = await requestGetInvestigation({ ...staticParams });
            setLoading(false)
            setList(response?.result)

            if (response?.isSuccess) {
                // message.success(response?.msg);
                form.resetFields();
            } else {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    return (
        <Card
            title="Investigation List"
            style={{ boxShadow: '2px 2px 2px #4874dc' }}
        >
            <div style={contentStyle}>
                <Table columns={columns} dataSource={list} />
            </div>
        </Card>
    );
});

export default InvestigationList;