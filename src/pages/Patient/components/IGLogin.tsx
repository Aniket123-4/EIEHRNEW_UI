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

const IGLogin = React.forwardRef((props) => {
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
            title: 'Patient CaseNo',
            dataIndex: 'patientCaseNo',
            key: 'patientCaseNo',
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
    const items = [
        {
            title: 'Your Details',
            description: '',
        },
        {
            title: 'Patient Details',
            description: '',
        },
        {
            title: 'Waiting',
            description: '',
        },
    ];

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Row >
                <Col span={12}>
                    <img height={300} width={500} src='https://d2aq6dqxahe4ka.cloudfront.net/themes/front/page/react/images/startfr3/web/webStep1.png'>
                    </img>
                    <Typography>
                        Thousands Are Raising Funds
                        Online On ImpactGuru
                        You Can Too!
                    </Typography>
                </Col>
                <Col span={12} >
                    <Card
                        title={""}
                        style={{ boxShadow: '2px 2px 2px #4874dc',height: 500,}}
                    >
                        <>
                            <Steps current={0} labelPlacement="vertical" items={items} />
                            <Row>
                                <Typography>
                                    I am raising funds for :
                                </Typography>
                                <Select
                                    style={{ width: 200 }}
                                    defaultValue={"1"}
                                    options={[{ value: "1", label: "Medical" }]}
                                    placeholder="Select"
                                />
                            </Row>
                            <Row>
                                <Typography>
                                    The raised funds will help :
                                </Typography>
                                <Select
                                    style={{ width: 200 }}
                                    defaultValue={"1"}
                                    options={[{ value: "1", label: "Myself" },
                                    { value: "2", label: "Spouse" },
                                    { value: "3", label: "Sibling" },
                                    { value: "4", label: "Child" },
                                    { value: "5", label: "Family" }]}
                                    placeholder="Select"
                                />
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <Select
                                        defaultValue={"+91"}
                                        options={[{ value: "+91", label: "+91" }]}
                                        placeholder="Select"
                                    /></Col>
                                <Col span={20}>
                                    <Input placeholder="Please Enter" />
                                </Col>
                            </Row>
                            <Row>
                                <Button type='primary'
                                    // onClick={updateCaseCheckout}
                                    >
                                    Submit</Button>
                            </Row>
                        </>
                    </Card>
                </Col>
            </Row>
        </PageContainer>

    );
});

export default IGLogin;