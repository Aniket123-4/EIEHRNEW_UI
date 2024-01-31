import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Table, message, TimePicker } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getUserInLocalStorage } from '@/utils/common';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';


const ClinicalFinding = ({ patientDetails, patientCaseID, onSaveSuccess,admNo }: any) => {
    const { result10 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();

    const columns: ColumnsType<any> = [
        {
            title: 'Clinical Finding',
            key: 'clinicalFinding',
            dataIndex: 'clinicalFinding',

        }, {
            title: 'Entry Date',
            key: 'entryDate',
            dataIndex: 'entryDate',

        }
    ];


    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": admNo,
                "col1": "",
                "col2": "",
                "col3": "",
                "col4": "",
                "col5": values?.clinicalFinding,
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
                "type": 13
            }
            try {
                setLoading(true)
                const response = await requestAddDelPatientForDoctorOPIP({ ...params });
                setLoading(false)

                if (response?.isSuccess) {
                    tabForm.resetFields();
                }
                onSaveSuccess({
                    tab: "CLINICAL_FINDING",
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
                    {/* <Col span={8}>
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
                    </Col> */}
                    {/* <Col span={8}>
                        <Form.Item name="IsNormal" label="Is Normal" rules={[{ required: false }]}>
                            <Select
                                showSearch
                                placeholder="Select"
                                optionFilterProp="children"
                                options={booleanValueForOption}
                            />
                        </Form.Item>
                    </Col> */}

                    <Col span={18}>
                        <Form.Item name="clinicalFinding" label="Clinical Finding" rules={[{ required: false }]}>
                            <Input.TextArea placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    {/* <Col span={8}>
                        <Form.Item name="CLINICALFINDING" label="CLINICAL FINDING" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col> */}

                    <Col span={8}>
                        {/* <Form.Item name="FindDate" label="Find Date" rules={[{ required: false }]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={dateFormat}
                            />
                        </Form.Item> */}
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