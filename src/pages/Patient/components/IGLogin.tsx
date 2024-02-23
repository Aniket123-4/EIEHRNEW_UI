import React, { useEffect, useRef, useState } from 'react';
import { CloseOutlined, EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Modal, Descriptions, Typography, Checkbox } from 'antd';
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
    const [stepPos, setStepPos] = useState(0);




    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };
    const contentStyle1: React.CSSProperties = {
        justifyContent: 'center', textAlign: 'center', alignItems: 'center', marginTop: 20
    };



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
    const plainOptions = ['Admitted', 'Not Admitted', 'Under Home Treatment'];

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Row gutter={5}>
                <Col span={12}>
                    <img height={'80%'} width={500} src='https://d2aq6dqxahe4ka.cloudfront.net/themes/front/page/react/images/startfr3/web/webStep1.png'>
                    </img>
                </Col>
                <Col span={12} >
                    <Card
                        title={""}
                        style={{ boxShadow: '2px 2px 2px #4874dc', height: 500, }}
                    >
                        <>
                            <Steps current={stepPos} labelPlacement="vertical" items={items} />
                            {stepPos == 0 && <Space size={[8, 16]} wrap direction='vertical'>
                                <Form
                                style={{paddingTop:25}}
                                // form={linkMedForm}
                                // onFinish={(value) => linkDisease(value, 2)}
                                >
                                    <Form.Item
                                        name="raising for"
                                        label="I am raising funds for :"
                                    >
                                        <Select
                                            style={{ width: 200 }}
                                            defaultValue={"1"}
                                            options={[{ value: "1", label: "Medical" }]}
                                            placeholder="Select"
                                        />

                                    </Form.Item>
                                    <Form.Item
                                        // style={{ width: '48%' }}
                                        name="raisingfundr"
                                        label="The raised funds will help :"
                                    >
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
                                    </Form.Item>


                                    <Form.Item
                                        name="curMobileNo"
                                        label=""
                                        rules={[
                                            { required: false, type: 'string', message: 'Please Enter Mobile Number' },
                                            {
                                                pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                message: 'Please enter a valid mobile number',
                                            }
                                        ]}
                                    >
                                        <Space direction='horizontal' style={{justifyContent:'center'}}>
                                            <Select
                                                defaultValue={"1"}
                                                options={[{ value: "1", label: "+91" }]}
                                                placeholder="Select"
                                            />
                                            <Input maxLength={10} placeholder="Please enter mobile number" />
                                        </Space>
                                    </Form.Item>
                                </Form>
                                <Row>
                                    <Button type='primary'
                                        onClick={() => setStepPos(1)}
                                    >
                                        Next</Button>
                                </Row>
                            </Space>}
                            {stepPos == 1 && <>


                                <Form
                                    layout="vertical"
                                    style={{paddingTop:15}}
                                // form={linkMedForm}
                                // onFinish={(value) => linkDisease(value, 2)}
                                >
                                    <Row style={{ justifyContent: 'space-between' }}>
                                        <Form.Item
                                            style={{ width: '48%' }}
                                            name="name"
                                            label="Enter Your Name"
                                            rules={[{ required: true, message: 'Please Enter Your Name' }]}
                                        >
                                            <Input maxLength={6} placeholder="Please Enter Your Name" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '48%' }}
                                            name="disease"
                                            label="Enter Disease"
                                            rules={[{ required: true, message: 'Please Disease' }]}
                                        >
                                            <Input maxLength={6} placeholder="Please Disease" />

                                        </Form.Item>
                                    </Row>
                                    <Row style={{ justifyContent: 'space-between' }}>
                                        <Form.Item
                                            style={{ width: '48%' }}
                                            name="goalAmt"
                                            label="Enter goal Amount"
                                            rules={[{ required: true, message: 'Please Enter goalAmt' }]}
                                        >
                                            <Input maxLength={6} placeholder="Please Enter goalAmt" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '48%' }}
                                            name="age"
                                            label="Enter Age"
                                            rules={[{ required: true, message: 'Please Enter Age' }]}
                                        >
                                            <Input maxLength={6} placeholder="Please Enter Age" />

                                        </Form.Item>

                                    </Row>
                                    <Form.Item
                                        // style={{ width: '48%' }}
                                        name="cityName"
                                        label="City Name"
                                        rules={[{ required: true, message: 'Please Enter City Name' }]}
                                    >
                                        <Input maxLength={6} placeholder="Please Enter City Name" />

                                    </Form.Item>
                                    <Form.Item
                                        // style={{ width: '48%' }}
                                        valuePropName="checked"
                                        name="age"
                                        label="Is Patient"
                                        rules={[{ required: true, message: 'Please Select' }]}
                                    >
                                        <Checkbox.Group options={plainOptions} defaultValue={['Apple']} />
                                    </Form.Item>
                                </Form>
                                <Row style={{ justifyContent: 'space-between', width: '30%' }}>
                                    {stepPos == 1 && <Button type='primary'
                                        onClick={() => setStepPos(0)}
                                    >
                                        Prev</Button>}
                                    <Button type='primary'
                                        onClick={() => setStepPos(1)}
                                    >
                                        Next</Button>

                                </Row>
                            </>}
                        </>
                    </Card>
                </Col>
            </Row>
        </PageContainer >

    );
});

export default IGLogin;