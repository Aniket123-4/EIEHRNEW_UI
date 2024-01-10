import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { booleanValueForOption, dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import DoctorSlotBookingList from './DoctorSlotBookingList';
import { ColumnsType } from 'antd/es/table';
import { getUserInLocalStorage } from '@/utils/common';
import moment from 'moment';

const { RangePicker } = DatePicker;



const ClinicalFinding = ({ patientDetails }: any) => {
    const { result10 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [sections, setSections] = useState<any>([])
    const [doctorList, setDoctorList] = useState<any>([])
    const [invParameterList, setInvParameterList] = useState([]);

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'patNameTitle',
            dataIndex: 'patNameTitle',

        }, {
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
            title: 'Age',
            key: 'age',
            dataIndex: 'age',

        }, {
            title: 'Section',
            key: 'sectionName',
            dataIndex: 'sectionName',

        }, {
            title: 'Doctor Name',
            key: 'doctorName',
            dataIndex: 'doctorName',

        }, {
            title: 'Insurance Comp',
            key: 'insuranceComp',
            dataIndex: 'insuranceComp',

        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} onClick={() => {
                    }}>action</Button>

                </Space>
            ),
        },
    ];


    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": "1",
                "col1": values?.CFindID,
                "col2": values?.IsNormal,
                "col3": values?.Finding,
                "col4": "",
                "col5": "",
                "col6": "",
                "col7": "",
                "col8": "",
                "col9": "",
                "col10": "",
                "col11": "",
                "col12": "",
                "col13": "",
                "col14": "",
                "col15": "",
                "col16": "",
                "col17": "",
                "col18": "",
                "col19": "",
                "col20": "",
                "col21": moment(values?.FindDate).format(dateFormat),
                "col22": "",
                "isForDelete": false,
                "lstType_DocPatient": [
                    {
                        "col1": "",
                        "col2": "",
                        "col3": "",
                        "col4": "",
                        "col5": "",
                        "col6": "",
                        "col7": "",
                        "col8": "",
                        "col9": "",
                        "col10": "",
                        "col11": "",
                        "col12": "",
                        "col13": "",
                        "col14": "",
                        "col15": ""
                    }
                ],
                "lstType_Patient": [
                    {
                        "col1": "",
                        "col2": "",
                        "col3": "",
                        "col4": "",
                        "col5": "",
                        "col6": "",
                        "col7": "",
                        "col8": "",
                        "col9": "",
                        "col10": "",
                        "col11": "",
                        "col12": "",
                        "col13": "",
                        "col14": "",
                        "col15": ""
                    }
                ],
                "userID": verifiedUser?.userID,
                "formID": -1,
                "type": 12
            }
            try {
                setLoading(true)
                const response = await requestAddDelPatientForDoctorOPIP({ ...params });
                setLoading(false)

                if (!response?.isSuccess) {
                    message.error(response?.msg);
                } else {
                    message.success(response?.msg);
                    tabForm.resetFields();
                }
            } catch (e) {
                setLoading(false)
            }
        };



        const handleChangeFilter = (value: any) => { }

        return (
            <Form
                form={tabForm}
                onFinish={onFinishPatForm}
                layout="vertical"
                size={'small'}
            >

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="CFindID" label="Find" rules={[{ required: false }]}>
                            <Select
                                showSearch
                                placeholder="Select"
                                optionFilterProp="children"
                                options={sections}
                                onChange={(value, item) => {

                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="IsNormal" label="Is Normal" rules={[{ required: false }]}>
                            <Select
                                showSearch
                                placeholder="Select"
                                optionFilterProp="children"
                                options={booleanValueForOption}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Finding" label="Finding" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="CLINICALFINDING" label="CLINICAL FINDING" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="FindDate" label="Find Date" rules={[{ required: false }]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Col>




                </Row>

                <Form.Item>
                    <Button type="primary" loading={loading} htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        )
    }

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                {formView()}
            </Card>
            <Table
                columns={columns}
                size="small"
                dataSource={result10}
                pagination={false}
            />
        </Space>
    );
};

export default ClinicalFinding;