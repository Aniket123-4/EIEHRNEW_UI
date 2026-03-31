import React, { useEffect, useRef, useState } from 'react';
import { CloseOutlined, EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Modal, Descriptions, Typography } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestGetCheckOutPatient, requestGetPatientCheckOutInfo, requestGetPatientSearch, requestUpdateBulkCaseCheckOut, requestUpdateCaseCheckIn, requestUpdateCaseCheckOut } from '../services/api';

import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';
import { history, type IRoute } from 'umi';
import { dateFormat } from '@/utils/constant';
import dayjs from 'dayjs';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-components';

const { Option } = Select;
const { Search } = Input;


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
    const [list, setCheckInList] = useState([]);
    const [checkoutList, setCheckOutList] = useState([]);
    const [openPatientFilter, setOpenPatientFilter] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkedPatient, setCheckedPatient] = useState([]);
    const [checkoutInfo, setCheckoutInfo] = useState([]);
    const [mainType, setMainType] = useState(2);




    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };


    const columns: ColumnsType<DataType> = [
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            key: 'patientNo',
            width:'100px',
            render: (text) => <a>{text}</a>,
            sorter: (a:any, b:any):any=> a.patientNo<b.patientNo,
        },
        {
            title: 'Patient Name',
            dataIndex: 'patName',
            key: 'patName',
            width:'150px'
        },
        {
            title: 'Doctor Name',
            dataIndex: 'consultantDocName',
            key: 'consultantDocName',
            width:'150px'
        },
        // {
        //     title: 'Patient FileNo',
        //     dataIndex: 'patientFileNo',
        //     key: 'patientFileNo',
        // },
        {
            title: 'Patient CaseNo',
            dataIndex: 'patientCaseNo',
            key: 'patientCaseNo',
            width:'100px'
        },
        {
            title: 'Case Type',
            dataIndex: 'vPreEmpTypeName',
            key: 'vPreEmpTypeName',
            width:'100px'
        },
        {
            title: 'Status',
            dataIndex: 'statusName',
            key: 'statusName',
            width:'100px',
            render: (text) => <Tag color={text === "CHECK-IN" ? "success" : "error"}>{text}</Tag>,
        },

        {
            title: 'Action',
            key: 'action',
            width:'100px',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => {
                        record?.patientStatusID == 1 && getPatientCheckOutInfo(record)
                        record?.patientStatusID == 3 && updatePatientStatusToCheckIn(record)
                    }}
                        size={'small'} type='primary' >
                        {record?.patientStatusID == 1 ? "Checkout" : "CheckIn"}
                    </Button>
                </Space>
            ),
        },
    ];
    const checkoutColumns: ColumnsType<DataType> = [
        {
            title: 'SlNo',
            dataIndex: 'slno',
            key: 'slno',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Activity Name',
            dataIndex: 'activityName',
            key: 'activityName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Status',
            dataIndex: 'activityStatus',
            key: 'activityStatus',
        },
        {
            title: 'IsOk',
            dataIndex: 'isOk',
            key: 'isOk',
            render: (text: any) =>
                <Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Yes' : 'No'}</Tag>,
        },
        {
            title: 'IsPresent',
            dataIndex: 'isPresent',
            key: 'isPresent',
            render: (text: any) =>
                <Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Yes' : 'No'}</Tag>,

        },

    ];

    useEffect(() => {
        getList();
    }, [])

    const getList = async (mainType: any = 2) => {

        const params = {
            "searchBy": "-1",
            "fromDate": "19000101",
            "toDate": dayjs(),
            "type": 2
        }
        searchPatient(params, mainType)
    }

    const searchPatient = async (values: any, mainType: any) => {
        if (!values.fromToDate) {
            values['fromDate'] = '1900-01-01';
            values['toDate'] = moment(new Date()).format('YYYY-MM-DD');
        } else {
            values['fromDate'] = moment(values.fromToDate[0]).format('YYYY-MM-DD');
            values['toDate'] = moment(values.fromToDate[1]).format('YYYY-MM-DD');
        }
        values['searchBy'] = values.searchBy ? values.searchBy : "-1";
        try {
            setLoading(true)
            const staticParams = {
                mainType: mainType,
                userID: -1,
                formID: -1,
            }
            const response = await requestGetCheckOutPatient({ ...values, ...staticParams });
            setLoading(false)
            if (response.isSuccess = true) {
                setCheckInList(response?.result)
            //}
            //if (response?.isSuccess) {
                // form.resetFields();
            } else {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const getPatientCheckOutInfo = async (value: any) => {
        console.log('onFilter', value);
        const staticParams = {
            "patientCaseID": value?.patientCaseID,
            "admNo": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetPatientCheckOutInfo(staticParams)
        if (res.isSuccess = true) {
            setCheckoutInfo(res.result)
            setCheckedPatient(value)
            showModal();
        }
    }

    const onClosePatientFilter = () => {
        setOpenPatientFilter(false);
    };

    const handleCheckType = (v: any) => {
        setMainType(v)
        getList(v)
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const updateCaseCheckout = async () => {
        const params = {
            "patientCaseID": checkedPatient.patientCaseID,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestUpdateCaseCheckOut(params)
        if (res.isSuccess == true) {
            message.success(res.msg)
            setIsModalOpen(false);
            getList();
        }
    };

    const updateBulkCaseCheckOut = async () => {
        const params = {
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestUpdateBulkCaseCheckOut(params)
        if (res.isSuccess == true) {
            message.success(res.msg)
            getList();
        }
    };

    const updatePatientStatusToCheckIn = async (value: any) => {
        const params = {
            "patientCaseID": value.patientCaseID,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestUpdateCaseCheckIn(params)
        if (res.isSuccess == true) {
            message.success(res.msg)
            setIsModalOpen(false);
            handleCheckType(1);
        }
    };

    const model = () => {
        return (
            <Modal
                //title={selectedPatientData?.candName}
                open={isModalOpen}
                width={800}
                height={300}
                style={{ top: 20 }}
                onOk={() => handleCancel()}
                onCancel={() => handleCancel()}
                footer={[]}
            >
                <Table
                    size='small'
                    pagination={false}
                    columns={checkoutColumns}
                    dataSource={checkoutInfo} />
                <div style={{ textAlign: 'center', paddingTop: 10 }}>
                    <Button type='primary'
                        onClick={updateCaseCheckout}>
                        Submit</Button>
                </div>
            </Modal>
        )
    }

    return (
        // <PageContainer
        // title=" "
        // style={{padding:0}}>
            <Card
            title={
            <Row>
                <Col xs={24} xl={4}>
            <Select
                //style={{ width: 200 }}
                onChange={handleCheckType}
                defaultValue={"2"}
                options={[{ value: "1", label: "Check-Out List" }, { value: "2", label: "Check-In List" }]}
                placeholder="Select"
            />
            {/* {mainType==2&&<Button onClick={updateBulkCaseCheckOut}>BulkCheckout</Button>} */}
            </Col>
            </Row>}
            style={{ boxShadow: '2px 2px 2px #4874dc'}}
            extra={
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={(value) => searchPatient(value, mainType)}
                    initialValues={{ type: "1" }}
                    style={{ marginBottom: 0 }}
                >
                    <Row gutter={[8, 8]} align="bottom">
                        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
                            <Form.Item name="fromToDate" label="Date From/To">
                                <DatePicker.RangePicker format={dateFormat} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={5} xl={4}>
                            <Form.Item name="type" label="Search by:">
                                <Select placeholder="Select" style={{ width: '100%' }}>
                                    <Option value="1">PATIENT NO</Option>
                                    <Option value="2">PATIENT CASE NO</Option>
                                    <Option value="3">PATIENT NAME</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item name="searchBy" label=" ">
                                <Input allowClear placeholder="Input Search Text" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={3}>
                            <Form.Item label=" ">
                                <Button htmlType="submit" type="primary" block>Search</Button>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={3} xl={2}>
                            <Form.Item label=" ">
                                <Button onClick={() => { form.resetFields(); getList(); }} icon={<CloseOutlined />} block />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            }
        >
            <Spin tip="Please wait..." spinning={loading} style={contentStyle}>
                {model()}
                <Table pagination={{ pageSize: 6 }} size='small' columns={columns} dataSource={list} scroll={{ y: 257 }}/>
            </Spin>
        </Card>
        // </PageContainer>
        
    );
});

export default PatientCheckOut;