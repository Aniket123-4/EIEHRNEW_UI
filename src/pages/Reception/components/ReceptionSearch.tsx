import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Radio, Modal, Tabs, TabsProps } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';
import { requestGetPatientSearch } from '../services/api';
import { RadioChangeEvent } from 'antd/lib';
import { getUserInLocalStorage, getUserType } from '@/utils/common';
import { requestAddPatRequest } from '@/pages/Booking/services/api';

const { Option } = Select;

const ReceptionSearch = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const [value1, setValue1] = useState('New Visit');
    const [isModalOpen, setIsModalOpen] = useState(false);


    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'General',
            children: 'No Data',
        },
        {
            key: '2',
            label: 'All ',
            children: 'No Data',
        },
        {
            key: '3',
            label: 'Battery Service',
            children: 'No Data',
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
        {
            title: 'Blood Group',
            dataIndex: 'bloodGroup',
            key: 'bloodGroup',
        },
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
                    <Button size={'small'} type='primary' size={'small'} onClick={showModal}>
                        Check In
                    </Button>
                    <Select
                        size={'small'}
                        placeholder="Preemp Type"
                        style={{ width: 120 }}
                        options={[
                        ]}
                    />
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

    const patientSearch = () => {
        return (
            <Table columns={columns} dataSource={list} />
        )
    }

    const plainOptions = ['New Visit', 'Follow Up Visit', 'Visit Status Update'];

    const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
        console.log('radio1 checked', value);
        setValue1(value);
    };


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
            console.log(values);
            const { verifiedUser } = getUserInLocalStorage();
            const params = {
                ...values,
                userWeekSlotID: selectedSlot?.userWeekSlotID,
                patientId: getUserType() === "Candidate" ? verifiedUser?.userID : -1,
                remarkId: -1,
                userID: -1,
                formID: -1,
                type: 1
            }
            const response = await requestAddPatRequest(params);
            setLoading(false)
            console.log(response?.result);
            message.success(response?.msg);

            if (!response?.isSuccess) {
                message.error(response?.msg);
            } else {
                // reset();
            }
        };


        return (
            <Form
                name="nest-messages"
                onFinish={onFinishPatForm}
                validateMessages={validateMessages}
                layout="vertical"

            >
                <Form.Item name="patientName" label="Patient Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phoneNo" label="Mobile No" rules={[{ required: true }]}>
                    <Input maxLength={10} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Search
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
            <Modal title="Patient Name" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

            </Modal>
        )
    }

    return (
        <>
            <div style={{ marginBottom: 10 }}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <h3>New</h3>
                            <h3>0</h3>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <h3>Revisit</h3>
                            <h3>0</h3>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <h3>Checkout</h3>
                            <h3>0</h3>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Row gutter={8}>
                <Col span={14}>
                    <Card>
                        {patientSearch()}
                    </Card>
                </Col>
                <Col span={10}>
                    <Card>
                        <Radio.Group options={plainOptions} onChange={onChange1} value={value1} />
                        <div style={{ marginTop: 50 }}>
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