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
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import moment from 'moment';

const { RangePicker } = DatePicker;



const VitalSign = ({ patientDetails = {}, patientCaseID }: any) => {
    const { result3 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();


    const columns: ColumnsType<any> = [
        {
            title: 'Adm No',
            key: 'admNo',
            dataIndex: 'admNo',

        }, {
            title: 'Vital Parameter',
            key: 'vitalParameterName',
            dataIndex: 'vitalParameterName',

        },
        {
            title: 'Vital Unit',
            key: 'vitalUnitName',
            dataIndex: 'vitalUnitName',
        },
        {
            title: 'Vital Serial No',
            key: 'vitalSerialNo',
            dataIndex: 'vitalSerialNo',

        }, {
            title: 'vital Date',
            key: 'vitalDateTimeVar',
            dataIndex: 'vitalDateTimeVar',

        },
        //  {
        //     title: 'vitalDateVar',
        //     key: 'vitalDateVar',
        //     dataIndex: 'vitalDateVar',

        // },
        {
            title: 'Result',
            key: 'vitalResult',
            dataIndex: 'vitalResult',

        }, {
            title: 'Comment',
            key: 'vitalComment',
            dataIndex: 'vitalComment',

        }, {
            title: 'Descp',
            key: 'vitalDescp',
            dataIndex: 'vitalDescp',

        }, {
            title: 'Enter By',
            key: 'enterBy',
            dataIndex: 'enterBy',

        }

    ];

    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const date = moment(values?.VitalDateTime).format(dateFormat);
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": "1",
                "col1": values?.VitalParameterID,
                "col2": values?.VitalResult,
                "col3": values?.VitalComment,
                "col4": values?.VitalDescp,
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
                "col21": date,
                "col22": date,
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
                "type": 2
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

                    <Col span={6}>
                        <Form.Item name="VitalParameterID" label="VitalParameterID" rules={[{ required: true }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: "2", label: "Heart Rate" }]}
                                placeholder="Select"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="VitalResult" label="VitalResult" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="VitalComment" label="VitalComment" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="VitalDescp" label="VitalDescp" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                   
                    <Col span={6}>
                        <Form.Item name="VitalDateTime" label="Date" rules={[{ required: true }]}>
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
                dataSource={result3}
                pagination={false}
            />
        </Space>
    );
};

export default VitalSign;