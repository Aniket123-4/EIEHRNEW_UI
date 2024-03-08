import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import { ColumnsType } from 'antd/es/table';
import { getUserInLocalStorage } from '@/utils/common';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import moment from 'moment';

const { RangePicker } = DatePicker;



const DischargeSummary = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result8 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();


    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'disCondName',
            dataIndex: 'disCondName',

        },
        {
            title: 'Brief Case Summary',
            key: 'breifCaseSummary',
            dataIndex: 'breifCaseSummary',

        },
        {
            title: 'Clinical Finding',
            key: 'clinicalFinding',
            dataIndex: 'clinicalFinding',
        },
        {
            title: 'Cond Upon Discharge',
            key: 'condUponDischarge',
            dataIndex: 'condUponDischarge',

        }, {
            title: 'Dis Cond Name',
            key: 'disCondName',
            dataIndex: 'disCondName',

        }, {
            title: 'Date',
            key: 'dischargeDateVar',
            dataIndex: 'dischargeDateVar',

        },
        {
            title: 'Notes',
            key: 'dischargeNotes',
            dataIndex: 'dischargeNotes',

        }, {
            title: 'Discharge To Name',
            key: 'dischargeToName',
            dataIndex: 'dischargeToName',

        },
        {
            title: 'Duration Of Illness',
            key: 'durationOfIllness',
            dataIndex: 'durationOfIllness',
        },
        {
            title: 'Final Advice ML',
            key: 'finalAdviceML',
            dataIndex: 'finalAdviceML',
        }, {
            title: 'Final Daignosis',
            key: 'finalDaigNosis',
            dataIndex: 'finalDaigNosis',
        },

    ];


    useEffect(() => {

        tabForm.setFieldsValue({
            DischargeDate: moment()
        });

    }, [])

    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": admNo,
                "col1": "-1",//values?.DisCondID,
                "col2": "-1",//values?.DischargeToID,
                "col3": values?.CondUponDischarge ? values?.CondUponDischarge : "",
                "col4": values?.BreifCaseSummary ? values?.BreifCaseSummary : "",
                "col5": values?.ReasonForAdmission ? values?.ReasonForAdmission : "",
                "col6": values?.ClinicalFinding ? values?.ClinicalFinding : "",
                "col7": values?.FinalDaigNosis ? values?.FinalDaigNosis : "",
                "col8": values?.InstructionToPateint ? values?.InstructionToPateint : "",
                "col9": values?.DischargeNotes ? values?.DischargeNotes : "",
                "col10": values?.FinalAdvice ? values?.FinalAdvice : "",
                "col11": values?.IssuesToAddressAtFollowUP ? values?.IssuesToAddressAtFollowUP : "",
                "col12": "",
                "col13": "",//values?.IsDocSeen,
                "col14": "",//values?.IsEmergency,
                "col15": "",//values?.PatDiseaseTypeID,
                "col16": "",//values?.PatSickLeaveID,
                "col17": "",//values?.SickLeaveDays,
                "col18": "",//values?.FromDateToDate,
                "col19": "",//values?.Reasons,
                "col20": "",//values?.Others,
                "col21": moment(values?.DischargeDate).format(dateFormat),//values?.DischargeDate,
                "col22": moment(values?.NextVisitDate).format(dateFormat),//values?.NextVisitDate,
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
                "type": 7
            }
            try {
                setLoading(true)
                const response = await requestAddDelPatientForDoctorOPIP({ ...params });
                setLoading(false)
                if (response?.isSuccess) {
                    tabForm.resetFields();
                }
                onSaveSuccess({
                    tab: "DISCHARGE_SUMMARY",
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
                        <Form.Item name="CondUponDischarge" label="Cond Upon Discharge" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="BreifCaseSummary" label="Brief Case Summary" rules={[{ required: false }]}>
                            <Input.TextArea placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="ReasonForAdmission" label="Reason For Admission" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="ClinicalFinding" label="Clinical Finding" rules={[{ required: false }]}>
                            <Input.TextArea placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="FinalDaigNosis" label="Final Diagnosis" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="InstructionToPateint" label="Instruction To Patient" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="DischargeNotes" label="Discharge Notes" rules={[{ required: false }]}>
                            <Input.TextArea placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="FinalAdvice" label="Final Advice" rules={[{ required: false }]}>
                            <Input.TextArea placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="IssuesToAddressAtFollowUP" label="Issues To Address At FollowUP" rules={[{ required: false }]}>
                            <Input.TextArea placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="DischargeDate" label="Discharge Date" rules={[{ required: false }]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Col>


                    <Col span={8}>
                        <Form.Item name="NextVisitDate" label="Next Visit Date" rules={[{ required: false }]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Col>

                    {/* <Col span={8}>
                        <Form.Item name="DisCondID" label="DisCondID" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="DischargeToID" label="DischargeToID" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                  
                  
                  
                    <Col span={8}>
                        <Form.Item name="IsDocSeen" label="IsDocSeen" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="IsEmergency" label="IsEmergency" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="DischargeDate" label="DischargeDate" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>


                    <Col span={8}>
                        <Form.Item name="NextVisitDate" label="PatDiseaseTypeID multiple" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="PatSickLeaveID" label="PatSickLeaveID multiple" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="SickLeaveDays" label="SickLeave Days" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="FromDateToDate" label="From Date To Date" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="Reasons" label="Reasons" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="Others" label="Others" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col> */}

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
                dataSource={result8}
                pagination={false}
            />
        </Space>
    );
};

export default DischargeSummary;