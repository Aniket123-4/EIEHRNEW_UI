import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, theme, Card, Radio, Modal, Tabs, TabsProps, InputNumber, Spin } from 'antd';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';
import { RadioChangeEvent } from 'antd/lib';
import { getUserInLocalStorage, getUserType } from '@/utils/common';
import { requestAddPatRequest } from '@/pages/Booking/services/api';
import moment from 'moment';
import { requestGetPatientSearch } from '@/pages/Patient/services/api';
import { dateFormat } from '@/utils/constant';
import { requestGetPatientDailyCount, requestGetPatientSearchOPIP } from '../services/api';
import AddUpdatePatientCase from './AddUpdatePatientCase';

const { Option } = Select;

const radioOptions = {
    NEW_VISIT: 'New Visit',
    FOLLOW_UP_VISIT: 'Follow Up Visit',
    VISIT_STATUS: 'Visit Status Update'
}

const options = [
    { label: 'New Visit', value: 1 },
    { label: 'Follow Up Visit', value: 2 },
    { label: 'Visit Status Update', value: 3 },
];

const ReceptionSearch = React.forwardRef((props) => {
    const [filterForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [loadingCheckin, setLoadingCheckin] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const [value1, setValue1] = useState('New Visit');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientDailyCount, setPatientDailyCount] = useState({});
    const [selectedType, setSelectedType] = useState(1);
    const [patientCheckInData, setPatientCheckInData] = useState({});


    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'General',
            children: '',
        },
        {
            key: '2',
            label: 'All ',
            children: '',
        },
        {
            key: '3',
            label: 'Battery Service',
            children: '',
        },
    ];

    const columns: ColumnsType<any> = [
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
        // {
        //     title: 'DOB',
        //     dataIndex: 'dob',
        //     key: 'dob',
        // },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        // {
        //     title: 'Gender',
        //     dataIndex: 'genderName',
        //     key: 'genderName',
        // },
        // {
        //     title: 'Blood Group',
        //     dataIndex: 'bloodGroup',
        //     key: 'bloodGroup',
        // },
        // {
        //     title: 'Mobile No',
        //     dataIndex: 'curMobileNo',
        //     key: 'curMobileNo',
        // },
        // {
        //     title: 'Email',
        //     dataIndex: 'email',
        //     key: 'email',
        // },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Select
                        size={'small'}
                        placeholder="Preemp Type"
                        style={{ width: 120 }}
                        options={[
                        ]}
                    />
                    <Button size={'small'} type='primary' size={'small'} onClick={() => patientCheckIn(record)}>
                        Check In
                    </Button>

                </Space>
            ),
        },
    ];

    useEffect(() => {
        getPatientDailyCount();
        filterForm.setFieldsValue({
            patientPhoneNo: '',
            fromDate: '1900-11-21T12:47:26.406Z',
            toDate: '2023-12-21T12:47:26.406Z',
            patientCaseID: -1,
            patientCaseNo: '1',
            patientID: -1,
            patientNo: '',
            patientUIDNo: '',
            caseTypeID: -1,
            sectionID: -1,
            consultantDocID: -1,
            patientFileNo: '',
            patientName: '',
            patientMobile: '',
            patientPhone: '',
            userID: -1,
            formID: -1,
            type: 1,
            preEmpTypeID: -1
        })
    }, [])


    const patientCheckIn = async (patientData: any) => {
        console.log({ patientData });

        const params = {
            patientCaseID: -1,
            patientCaseNo: '1',
            patientID: -1,
            patientNo: '',
            patientUIDNo: '',
            caseTypeID: -1,
            sectionID: -1,
            consultantDocID: -1,
            patientFileNo: '',
            patientName: '',
            patientMobile: '',
            patientPhone: '',
            fromDate: '2022-12-14T11:47:55.610Z',
            toDate: '2023-12-14T11:47:55.610Z',
            userID: -1,
            formID: -1,
            type: 6,
            preEmpTypeID: -1
        }
        console.log(params);
        setLoadingCheckin(true)
        const response = await requestGetPatientSearchOPIP(params);
        setLoadingCheckin(false)
        setPatientCheckInData(response?.result)

        if (response?.isSuccess) {
        } else {
            message.error(response?.msg);
        }

        showModal()
    }


    const getPatientDailyCount = async () => {
        try {
            setLoading(true)
            const staticParams = {
                curDate: moment().format(dateFormat),
                cntTypeID: -1,
                userID: -1,
                formID: -1,
                type: 1
            }
            const response = await requestGetPatientDailyCount({ ...staticParams });
            setLoading(false)
            setPatientDailyCount(response?.result?.[0])

            if (!response?.isSuccess) {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const patientSearch = () => {
        return (
            <Table columns={columns} dataSource={list} />
        )
    }


    const filterVisitForm = () => {

        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        /* eslint-disable no-template-curly-in-string */
        const validateMessages = {
            required: '${label} is required!',
            types: {
                email: '${label} is not a valid email!',
                number: '${label} is not a valid number!',
            }
        };
        /* eslint-enable no-template-curly-in-string */

        const onFinishPatForm = async (values: any) => {
            if (!values.fromToDate) {
                values['fromDate'] = '1900-01-21';
                values['toDate'] = moment(new Date()).format('YYYY-MM-DD');
            } else {
                values['fromDate'] = moment(values.fromToDate[0]).format('YYYY-MM-DD');
                values['toDate'] = moment(values.fromToDate[1]).format('YYYY-MM-DD');
            }

            const params = {
                ...values,
                patientID: -1,
                userID: -1,
                formID: -1,
                type: +selectedType
            }
            console.log(params);
            const response = await requestGetPatientSearchOPIP(params);
            setLoading(false)
            setList(response?.result)

            if (response?.isSuccess) {
            } else {
                message.error(response?.msg);
            }
        };

        const handleChangeFilter = (value: any) => { }
        return (
            <Form
                form={filterForm}
                onFinish={onFinishPatForm}
                validateMessages={validateMessages}
                layout="vertical"
                size={'medium'}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="fromToDate" label="From/To Date" rules={[{ required: false }]}>
                            <DatePicker.RangePicker
                                format={dateFormat}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientCaseID" label="Patient Case" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="patientCaseNo" label="Patient Case No" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientNo" label="PatientNo" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="patientName" label="Patient Name" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientUIDNo" label="Patient UID No" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="caseTypeID" label="Case Type" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item name="sectionID" label="Section" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>

                        <Form.Item name="consultantDocID" label="Consultant Doc" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientFileNo" label="Patient File No" rules={[{ required: false }]}>
                            <InputNumber style={{ width: "100%" }} min={0} />
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="patientMobile" label="Patient Mobile No" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientPhone" label="Patient Phone No" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" loading={loading} htmlType="submit">
                        Filter
                    </Button>

                </Form.Item>
            </Form >
        )
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const model = () => {
        return (
            <Modal title="Patient Name"
                open={isModalOpen}
                width={1000}
                style={{ top: 20 }}
                onOk={() => handleCancel()}
                onCancel={() => handleCancel()}
                footer={[]}
            >
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                <AddUpdatePatientCase handleCancel={() => handleCancel()} />
            </Modal>
        )
    }

    const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
        console.log('radio3 checked', value);
        setSelectedType(value);
    };


    return (
        <>
            <div style={{ marginBottom: 10 }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>

                            <Row>
                                <Col span={12}>
                                    <h3>Registration</h3>
                                </Col>
                                <Col span={12}>
                                    <h3 style={{ textAlign: 'end' }}>{patientDailyCount?.patReg}</h3>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <Row>
                                <Col span={12}>
                                    <h3>New</h3>
                                </Col>
                                <Col span={12}>
                                    <h3 style={{ textAlign: 'end' }}>{patientDailyCount?.patNewCase}</h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <Row>
                                <Col span={12}>
                                    <h3>Revisit</h3>
                                </Col>
                                <Col span={12}>
                                    <h3 style={{ textAlign: 'end' }}>{patientDailyCount?.patRevisit}</h3>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>

                            <Row>
                                <Col span={12}>
                                    <h3>Checkout</h3>
                                </Col>
                                <Col span={12}>
                                    <h3 style={{ textAlign: 'end' }}>{patientDailyCount?.patCheckOut}</h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Row gutter={8}>
                <Col span={12}>

                    <Card>
                        {/* loading={loadingCheckin} */}
                        <Spin spinning={loadingCheckin} >
                            {patientSearch()}
                        </Spin>

                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Radio.Group options={options} onChange={onChange3} value={selectedType} />
                        <div style={{ marginTop: 20 }}>
                            {filterVisitForm()}
                        </div>
                    </Card>
                </Col>
            </Row>
            {model()}
        </>
    );
});

export default ReceptionSearch;