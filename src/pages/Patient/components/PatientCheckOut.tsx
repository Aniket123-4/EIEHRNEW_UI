import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestGetCheckOutPatient, requestGetPatientSearch } from '../services/api';

import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';
import { history, type IRoute } from 'umi';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}

const PatientCheckOut = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const [openPatientFilter, setOpenPatientFilter] = useState(false);



    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };


    const columns: ColumnsType<DataType> = [
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            key: 'patientNo',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Patient Name',
            dataIndex: 'patName',
            key: 'patName',
        },
        {
            title: 'Doctor Name',
            dataIndex: 'consultantDocName',
            key: 'consultantDocName',
        },
        {
            title: 'Patient FileNo',
            dataIndex: 'patientFileNo',
            key: 'patientFileNo',
        },
        {
            title: 'PreEmp Type',
            dataIndex: 'vPreEmpTypeName',
            key: 'vPreEmpTypeName',
        },
        {
            title: 'Status',
            dataIndex: 'statusName',
            key: 'statusName',
            render: (text) => <Tag color={text === "CHECK-IN" ? "success" : "error"}>{text}</Tag>,
        },
        
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} type='primary' >
                        Checkout
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getList();
    }, [])

    const getList = async () => {

        const params = {
            "searchBy": "-1",
            "fromDate": "19000101",
            "toDate": "20240101",
            "mainType": 2,
            "type": 2
        }
        searchPatient(params)
    }

    const searchPatient = async (params: any) => {
        try {
            setLoading(true)
            const staticParams = {
                userID: -1,
                formID: -1,
            }
            const response = await requestGetCheckOutPatient({ ...params, ...staticParams });
            setLoading(false)
            setList(response?.result)

            if (response?.isSuccess) {
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

    const onFilter = async (value: any) => {
        console.log('onFilter', value);
        await searchPatient(value)
        setOpenPatientFilter(false);
    }

    const onClosePatientFilter = () => {
        setOpenPatientFilter(false);
    };


    return (
        <Card
            title="Patient"
            style={{ boxShadow: '2px 2px 2px #4874dc' }}
            extra={
                [
                    <Button type="primary" onClick={() => { setOpenPatientFilter(true); }}>
                        <FilterOutlined />
                        Filter
                    </Button>,

                ]
            }
        >
            <div style={contentStyle}>
                <Table columns={columns} dataSource={list} />
                <PatientFilter
                    visible={openPatientFilter}
                    onClose={onClosePatientFilter}
                    onFilter={onFilter}
                    loading={loading}
                />
            </div>
        </Card>
    );
});

export default PatientCheckOut;