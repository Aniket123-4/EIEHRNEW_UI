import React, { useEffect, useRef, useState } from 'react';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Modal, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history, type IRoute } from 'umi';
import { activeStatus, dateFormat } from '@/utils/constant';
import { convertDate } from '@/utils/helper';
import dayjs from 'dayjs';
import moment from 'moment';
import { requestGetPatientForDoctorOPIP } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const DoctorPatientList = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [formFilter] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };
    const { verifiedUser } = getUserInLocalStorage();


    const columns: ColumnsType<any> = [
        // {
        //     title: 'Vital Sign Entered',
        //     dataIndex: 'docUserName',
        //     key: 'docUserName',
        //     render: (text) => <a>{text}</a>,
        // },
        // {
        //     title: 'Insurance Approved Status',
        //     dataIndex: 'noOfSlotPerHrs',
        //     key: 'noOfSlotPerHrs',
        // },
        {
            title: 'Admission Date',
            dataIndex: 'admissionDate',
            key: 'admissionDate',
            fixed: 'left',
        },
        {
            title: 'Name',
            key: 'patientName',
            dataIndex: 'patientName',
            fixed: 'left',
        },
        {
            title: 'Patient Number',
            key: 'patientNo',
            dataIndex: 'patientNo',

        },
        {
            title: 'Case Number',
            key: 'patientCaseNo',
            dataIndex: 'patientCaseNo',

        },
        {
            title: 'Admission Type',
            key: 'admNo',
            dataIndex: 'admNo',

        }, {
            title: 'Token Number',
            key: 'tokenNo',
            dataIndex: 'tokenNo',

        }, {
            title: 'Age',
            key: 'age',
            dataIndex: 'age',

        }, {
            title: 'Gender',
            key: 'genderName',
            dataIndex: 'genderName',

        }, {
            title: 'Mobile Number',
            key: 'curMobileNo',
            dataIndex: 'curMobileNo',

        }, {
            title: 'Ins App Status',
            key: 'insAppStatus',
            dataIndex: 'insAppStatus',

        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} onClick={() => {
                        history.push(`/doctor/patient-details/${record?.patientID}/${record?.patientNo}/${record?.patientCaseID}/${record?.patientCaseNo}/${record?.admNo}`)
                    }}>View</Button>

                </Space>
            ),
        },
    ];

    useEffect(() => {
        getList();
    }, [])

    const getList = async () => {
        try {

            const { dateRange, isActive } = formFilter.getFieldsValue()
            let slotFromDate = convertDate(dateRange[0]);
            let slotToDate = convertDate(dateRange[1]);



            const staticParams = {
                patientCaseID: -1,
                patientCaseNo: '',
                patientID: -1,
                patientNo: '',
                caseTypeID: 1,
                patientName: '',
                fromDate: slotFromDate,
                toDate: slotToDate,
                userID: verifiedUser?.userID,
                formID: 1,
                type: 1
            }

            setLoading(true)
            const response = await requestGetPatientForDoctorOPIP({ ...staticParams });
            setLoading(false)
            setList(response?.result)

            if (!response?.isSuccess) {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const filterSubmit = () => {
        getList();
    }

    const filterForm = () => {
        return (
            <Form
                layout="vertical"
                form={formFilter}
                onFinish={filterSubmit}
                preserve={true}
                scrollToFirstError={true}
                initialValues={
                    {
                        dateRange: [dayjs(), dayjs()],
                        isActive: -1
                    }
                }
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="dateRange"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <RangePicker
                                        format={dateFormat}
                                        style={{ width: "100%" }}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>

                            {/* <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="isActive"
                                    label="Status"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Status"
                                        optionFilterProp="children"
                                        options={activeStatus}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col> */}
                            <Col className="gutter-row" span={8}>
                                <Button style={{ padding: 5, width: 100, height: 38, marginTop: 0 }} type="primary" htmlType="submit">
                                    Filter
                                </Button>
                            </Col>
                        </Row>



                        <Row gutter={16}>

                        </Row>
                    </div>
                </>
            </Form>
        )
    }

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card
                title="From - To Date"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {filterForm()}
                    </div>
                </Spin>
            </Card>
            <Card
                title={`Patient List (Total ${list.length})`}
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >

                <div style={contentStyle}>
                    <Table
                        columns={columns}
                        dataSource={list}
                        pagination={false}
                    />
                </div>
            </Card>
        </Space>

    );
});

export default DoctorPatientList;