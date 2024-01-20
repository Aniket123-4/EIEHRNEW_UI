import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Typography, Popconfirm, Checkbox, InputRef } from 'antd';
import { requestGetComplaintType, requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import {  requestGetItem } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

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


const ItemList = ({ refresh, editRecord }: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [itemList, setItemList] = useState<any>([])
    const { token } = theme.useToken();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Item) => record.key === editingKey;
    // const [isActive, setisActive] = useState<any>([{ value: "true", label: "True" }, { value: "false", label: "False" }])
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        getItemList();
        console.log(refresh);
    }, [refresh])



    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'itemName',
            key: 'itemName',
            // render: (text) => <a>{text}</a>,
            editable: true,
            // width: '35%',
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            // width: '15%',
            render: (text: any) =>
                <Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Active' : 'InActive'}</Tag>,
            editable: true
        },
        {
            title: 'Item Code',
            dataIndex: 'itemCode',
            key: 'itemCode',
            editable: true,
            // width: '25%',
        },
        {
            title: 'Action',
            key: 'action',
            // width: '25%',
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

    const getItemList = async () => {
        const staticParams = {
            "itemID": -1,
            "itemCatID": -1,
            "itemSearch": "",
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        setLoading(true)
        const res = await requestGetItem(staticParams);
        if (res.result.length > 0) {
            setItemList(res.result)
            setLoading(false)
            // console.log(dataMaskForDropdown)
        }
        else {
            setLoading(true)
        }
    }
    return (
        // <PageContainer
        //     style={{ backgroundColor: '#4874dc', height: 120 }}
        // >


        <Form
            form={form}
            component={false}
        >
            <Card
                title="Item List"
                style={{height:480,  boxShadow: '2px 2px 2px #4874dc' }}
            >
                {itemList &&
                    <Spin tip="Please wait..." spinning={loading}>
                        <Table
                            scroll={{ y: 270 }}
                            columns={columns}
                            dataSource={itemList}
                        // rowClassName="editable-row"
                        // pagination={{
                        //     onChange: cancel,
                        // }}
                        />
                    </Spin>}
            </Card>
        </Form>
        // </PageContainer>
    );
};

export default ItemList;