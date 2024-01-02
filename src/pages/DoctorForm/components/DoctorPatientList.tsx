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


    const columns: ColumnsType<any> = [
        {
            title: 'Vital Sign Entered',
            dataIndex: 'docUserName',
            key: 'docUserName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Insurance Approved Status',
            dataIndex: 'noOfSlotPerHrs',
            key: 'noOfSlotPerHrs',
        },
        {
            title: 'CheckIn Date',
            dataIndex: 'displaySlotFromDate',
            key: 'displaySlotFromDate',
        },
        {
            title: 'Admission Type',
            key: 'displaySlotToDate',
            dataIndex: 'displaySlotToDate',

        }, {
            title: 'Token Number',
            key: 'displaySlotToDate',
            dataIndex: 'displaySlotToDate',

        }, {
            title: 'Serial Number',
            key: 'displaySlotToDate',
            dataIndex: 'displaySlotToDate',

        }, {
            title: 'Patient Number',
            key: 'displaySlotToDate',
            dataIndex: 'displaySlotToDate',

        }, {
            title: 'Case Number',
            key: 'displaySlotToDate',
            dataIndex: 'displaySlotToDate',

        }, {
            title: 'Name',
            key: 'displaySlotToDate',
            dataIndex: 'displaySlotToDate',

        }, {
            title: 'Age',
            key: 'Age',
            dataIndex: 'Age',

        }, , {
            title: 'Gender',
            key: 'Gender',
            dataIndex: 'Gender',

        }, , {
            title: 'Mobile Number',
            key: 'Mobile',
            dataIndex: 'Mobile',

        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} onClick={() => {
                        // props?.onEditRecord(record)
                        const { dateRange, isActive } = formFilter.getFieldsValue()
                        let slotFromDate = convertDate(dateRange[0]);
                        let slotToDate = convertDate(dateRange[1]);
                        console.log({ isActive })
                        history.push(`/doctor/patient-details`)
                    }}>
                        View
                    </Button>

                </Space>
            ),
        },
    ];

    const filterSubmit = (val: any) => {
        history.push(`/doctor/patient-details/2343423`)
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
                                    label="From - To Date"
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
                                <Button style={{ padding: 5, width: 100, height: 38, marginTop: 30 }} type="primary" htmlType="submit">
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
                title="Filter"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {filterForm()}
                    </div>
                </Spin>
            </Card>
            <Card
                title="Patient List (Total 0)"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >

                <div style={contentStyle}>
                    <Table
                        columns={columns}
                        dataSource={list}
                    />
                </div>
            </Card>
        </Space>

    );
});

export default DoctorPatientList;