import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestGetInvGroup, requestGetInvestigation, requestGetPatientSearch } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}

const PatientList = React.forwardRef((props) => {
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
            title: 'Name',
            dataIndex: 'candName',
            key: 'candName',
        },
        // {
        //     title: 'candNameML',
        //     dataIndex: 'candNameML',
        //     key: 'candNameML',
        // },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'genderName',
            key: 'genderName',
        },
        // {
        //     title: 'civilStatusName',
        //     dataIndex: 'civilStatusName',
        //     key: 'civilStatusName',
        // },
        {
            title: 'Blood Group',
            dataIndex: 'bloodGroup',
            key: 'bloodGroup',
        },
        {
            title: 'Mobile No',
            dataIndex: 'curMobileNo',
            key: 'curMobileNo',
        },
        // {
        //     title: 'curPhoneNo',
        //     dataIndex: 'curPhoneNo',
        //     key: 'curPhoneNo',
        // },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} type='link' onClick={() => { console.log(record) }}>
                        <InfoCircleOutlined />
                    </Button>
                    <Button size={'small'} type='link' onClick={() => { console.log(record) }}>
                        <EditOutlined />
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
            patientNo: '',
            patientUIDNo: '',
            ageGreater: 0,
            genderID: -1,
            civilStatusID: -1,
            bloodGroupID: -1,
            nationalityID: -1,
            serviceTypeID: -1,
            patientName: '',
            patientMobileNo: '',
            patientPhoneNo: '',
            patientDOB: '1900-01-01',
            fromDate: '1900-01-21',
            toDate: '2023-12-21',
        }
        searchPatient(params)
    }

    const searchPatient = async (params: any) => {
        try {
            setLoading(true)
            const staticParams = {
                isDeleted: false,
                userID: -1,
                formID: -1,
                type: 1,
                patientID: -1,
            }
            const response = await requestGetPatientSearch({ ...params, ...staticParams });
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

export default PatientList;