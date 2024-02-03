import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import { getUserInLocalStorage } from '@/utils/common';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';

const { RangePicker } = DatePicker;



const PatientHistory = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result7 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();


    const columns: ColumnsType<any> = [
        {
            title: 'Allergy',
            key: 'allergy',
            dataIndex: 'allergy',
        }, {
            title: 'Warnings',
            key: 'warnings',
            dataIndex: 'warnings',
        },
        {
            title: 'Addiction',
            key: 'addiction',
            dataIndex: 'addiction',
        },
        {
            title: 'Social History',
            key: 'socialHistory',
            dataIndex: 'socialHistory',

        }, {
            title: 'Family History',
            key: 'familyHistory',
            dataIndex: 'familyHistory',
        },
        {
            title: 'Personal History',
            key: 'personalHistory',
            dataIndex: 'personalHistory',
        },
        {
            title: 'Past Medical History',
            key: 'pastMedicalHistory',
            dataIndex: 'pastMedicalHistory',
        },
        {
            title: 'Obstetrics',
            key: 'obstetrics',
            dataIndex: 'obstetrics',
        },
        {
            title: 'Entry Date',
            key: 'entryDateVar',
            dataIndex: 'entryDateVar',
        }
    ];

    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": admNo,
                "col1": values?.Allergy ? values?.Allergy : "",
                "col2": values?.Warnings ? values?.Warnings : "",
                "col3": values?.Addiction ? values?.Addiction : "",
                "col4": values?.SocialHistory ? values?.SocialHistory : "",
                "col5": values?.FamilyHistory ? values?.FamilyHistory : "",
                "col6": values?.PersonalHistory ? values?.PersonalHistory : "",
                "col7": values?.PastMedicalHistory ? values?.PastMedicalHistory : "",
                "col8": values?.Obstetrics ? values?.Obstetrics : "",
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
                "col21": "",
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
                "type": 6
            }
            try {
                setLoading(true)
                const response = await requestAddDelPatientForDoctorOPIP({ ...params });
                setLoading(false)
                if (response?.isSuccess) {
                    tabForm.resetFields();
                }
                onSaveSuccess({
                    tab: "PATIENT_HISTORY",
                    response
                })

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
                        <Form.Item name="Allergy" label="Allergy" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Warnings" label="Warnings" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="Addiction" label="Addiction" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="SocialHistory" label="Social History" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="FamilyHistory" label="Family History" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="PersonalHistory" label="Personal History" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="PastMedicalHistory" label="Past Medical History" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="Obstetrics" label="Obstetrics" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
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
                dataSource={result7}
                pagination={false}
            />
        </Space>
    );
};

export default PatientHistory;