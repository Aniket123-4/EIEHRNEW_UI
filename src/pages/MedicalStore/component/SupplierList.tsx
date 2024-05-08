import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Typography, Popconfirm, Checkbox, InputRef } from 'antd';
import { requestGetSupplier } from '@/services/apiRequest/dropdowns';
import { Table, Tag } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import { FilterConfirmProps } from 'antd/es/table/interface';

const { Option } = Select;

interface Item {
    key: string;
    name: string;
    isActive: any;
    address: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}


const SupplierList = ({ refresh, editRecord }: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [supplierList, setSupplierList] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Item) => record.key === editingKey;
    // const [isActive, setisActive] = useState<any>([{ value: "true", label: "True" }, { value: "false", label: "False" }])
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        getSupplierList();
    }, [refresh]);

    const getSupplierList = async (supplierSearch: any = "") => {
        const staticParams = {
            supplierID: -1,
            suplierSearch: supplierSearch,
            userID: -1,
            formID: -1,
            type: 0,
        };
        const res = await requestGetSupplier(staticParams);
        // console.log(res.result);
        if (res.result.length > 0) {
            setSupplierList(res.result);
        }
    };



    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        //setSearchText('');
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
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
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
    const columns = [
        {
            title: 'Supplier Name',
            dataIndex: 'supplierName',
            key: 'supplierName',
            width: '90px',
            ...getColumnSearchProps('supplierName'),
            // render: (text) => <a>{text}</a>,
        },
        {
            title: 'Supplier Code',
            dataIndex: 'supplierCode',
            key: 'supplierCode',
            width: '90px',
        },
        {
            title: 'Supplier Address',
            dataIndex: 'supplierAddress',
            key: 'supplierAddress',
            width: '90px',
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '90px',
            render: (text: any) =>
                <Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Active' : 'InActive'}</Tag>,
            editable: true
        },
        {
            title: 'Action',
            key: 'action',
            width: '50px',
            render: (_: any, record: any) => {
                return (
                    <Typography.Link style={{ width: 100 }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const cancel = () => {
        setEditingKey('');
    };
    const edit = (record:any) => {
        editRecord(record);
    };

    const formSubmit = async (values: any) => {
        console.log(values);
    }

    return (
        <Form
            form={form}
            component={false}
        >
            <Card
                title="Supplier List"
                style={{height:480,  boxShadow: '2px 2px 2px #4874dc' }}
            >
                {supplierList &&
                    <Spin tip="Please wait..." spinning={loading}>
                        <Table
                            scroll={{x:350, y: 270 }}
                            columns={columns}
                            dataSource={supplierList}
                        // rowClassName="editable-row"
                        // pagination={{
                        //     onChange: cancel,
                        // }}
                        />
                    </Spin>}
            </Card>
        </Form>
    );
};

export default SupplierList;