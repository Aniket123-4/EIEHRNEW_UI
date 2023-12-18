import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, theme, Card, Radio, Modal, Tabs, TabsProps, InputNumber } from 'antd';
import moment from 'moment';
import { dateFormat } from '@/utils/constant';
import { requestAddUpdatePatientCase, requestGetPatientDailyCount, requestGetPatientSearchOPIP } from '../services/api';

const { Option } = Select;



const AddUpdatePatientCase = React.forwardRef((props) => {
    const [filterForm] = Form.useForm();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        filterForm.setFieldsValue({
            patientCaseID: -1,
            patientID: -1,
            caseType: 1,
            admissionDate: '',
            dischargeDate: '',
            consultantDocID: 1,
            referToDocID: 1,
            sectionID: 1,
            admTypeID: 1,
            patientFoundID: 1,
            proDiagnosis: '',
            patientFileNo: '',
            deductablePercentage: 0,
            allergy: '',
            warnings: '',
            addiction: '',
            socialHistory: '',
            familyHistory: '',
            personalHistory: '',
            pastMedicalHistory: '',
            obstetrics: '',
            isNextVisit: true,
            priority: 0,
            invParameterID: 1,
            preEmpTypeID: 1,

            lstType_ro: [
                {
                    rowID: 1,
                    rowValue: '12'
                }
            ],
            serviceID: 1
        })
    }, []);

    const onFinishPatForm = async (values: any) => {
        if (!values.admissionDate) {
            values['admissionDate'] = moment().format('YYYY-MM-DD');
        }

        if (!values.dischargeDate) {
            values['dischargeDate'] = moment().format('YYYY-MM-DD');
        }

        const params = {
            ...values,
            lstType_ro: [
                {
                    "rowID": 1,
                    "rowValue": "12"
                }
            ],
            patientID: -1,
            userID: -1,
            formID: -1,
            type: 2
        }
        console.log(params);
        console.log(JSON.stringify(params));
        const response = await requestAddUpdatePatientCase(params);
        setLoading(false)
      
        if (response?.isSuccess) {
            message.success(response?.msg);
        } else {
            message.error(response?.msg);
        }

       
        props.handleCancel();
    };

    const handleChangeFilter = (value: any) => { }

    return (
        <>
            <Form
                form={filterForm}
                onFinish={onFinishPatForm}
                layout="vertical"
            >

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="patientCaseID" label="Patient Case" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="caseType" label="Case Type" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="admissionDate" label="Admission Date" rules={[{ required: false }]}>
                            <DatePicker
                                style={{ width: "100%" }}
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="dischargeDate" label="Discharge Date" rules={[{ required: false }]}>
                            <DatePicker
                                style={{ width: "100%" }}
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="consultantDocID" label="consultantDocID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: 1, label: "All" }]}
                                defaultValue={1}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="referToDocID" label="referToDocID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: 1, label: "All" }]}
                                defaultValue={1}
                            />
                        </Form.Item>
                    </Col>
                </Row>


                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="sectionID" label="sectionID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: 1, label: "All" }]}
                                defaultValue={1}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="admTypeID" label="admTypeID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: 1, label: "All" }]}
                                defaultValue={1}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item name="patientFoundID" label="patientFoundID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: 1, label: "All" }]}
                                defaultValue={1}
                            />
                        </Form.Item>
                    </Col>
                </Row>


                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="proDiagnosis" label="proDiagnosis" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="patientFileNo" label="patientFileNo" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item name="deductablePercentage" label="deductablePercentage" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>


                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="allergy" label="allergy" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item name="warnings" label="warnings" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item name="addiction" label="addiction" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="socialHistory" label="socialHistory" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="familyHistory" label="familyHistory" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="personalHistory" label="personalHistory" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="pastMedicalHistory" label="pastMedicalHistory" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="isNextVisit" label="isNextVisit" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="priority" label="priority" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="obstetrics" label="obstetrics" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="invParameterID" label="invParameterID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item name="preEmpTypeID" label="preEmpTypeID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="serviceID" label="serviceID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[]}
                                defaultValue={1}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                    </Col>
                    <Col span={8}>

                    </Col>
                </Row>


                <Form.Item>
                    <Button type="primary" loading={loading} htmlType="submit">
                        Submit
                    </Button>

                </Form.Item>
            </Form >
        </>
    );
});

export default AddUpdatePatientCase;