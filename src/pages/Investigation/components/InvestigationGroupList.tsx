import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddInvGroup, requestGetInvGroup } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    code: string;
    discount: number;
    description: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'invGroupName',
        key: 'invGroupName',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Code',
        dataIndex: 'invGroupCode',
        key: 'invGroupCode',
    },
    {
        title: 'Discount',
        dataIndex: 'discountParameterID',
        key: 'discountParameterID',
    },
    {
        title: 'Description',
        dataIndex: 'invGroupDesc',
        key: 'invGroupDesc',
        width: 200,
        render: (data) => <label>{data}</label>,
    },
    {
        title: 'Is Service',
        dataIndex: 'isService',
        key: 'isService',
        render: (isService) => <label>{isService ? "Yes" : "No"}</label>,
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Edit</a>
            </Space>
        ),
    },
];


const InvestigationGroupList = React.forwardRef((props, ref) => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const { token } = theme.useToken();
    const [loading, setLoading] = useState(false);
    const [groupList, setGroupList] = useState([]);

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    // Attach the ref to the child component
    useImperativeHandle(ref, () => ({
        getGroupList
    }));


    useEffect(() => {
        getGroupList();
    }, [])

    const getGroupList = async () => {
        try {
            const staticParams = {
                invGroupID: -1,
                discountParameterID: -1,
                isActive: -1,
                formID: -1,
                type: 1
            };

            setLoading(true)
            const response = await requestGetInvGroup({ ...staticParams });
            setLoading(false)
            setGroupList(response?.result)

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
            title="Investigation Group List"
            style={{ boxShadow: '2px 2px 2px #4874dc' }}
        >
            <div style={contentStyle}>
                <Table columns={columns} dataSource={groupList} />
            </div>
        </Card>

    );
})

export default InvestigationGroupList;