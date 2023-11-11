import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestGetInvGroup, requestGetInvestigation } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}

const DoctorSlotBookingList = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };


    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'invName',
            key: 'invName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Code',
            dataIndex: 'invCode',
            key: 'invCode',
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => <label>{isActive ? "Yes" : "No"}</label>,
        },
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
        {
            title: 'Name ML',
            dataIndex: 'invNameML',
            key: 'invNameML',
        },
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
                message.success(response?.msg);
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
            title="Booking List"
            style={{ boxShadow: '2px 2px 2px #4874dc' }}
        >
            <div style={contentStyle}>
                <Table columns={columns} dataSource={list} />
            </div>
        </Card>
    );
});

export default DoctorSlotBookingList;