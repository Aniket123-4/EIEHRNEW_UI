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
import { ColumnsType } from 'antd/es/table';


const Investigation = ({ patientDetails = {}, patientCaseID }: any) => {
    const { result6 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [diseaseList, setDiseaseList] = useState([]);


    const columns: ColumnsType<any> = [
        {
            title: 'Inv Parameter',
            key: 'invParameterName',
            dataIndex: 'invParameterName',
            fixed: 'left',

        }, {
            title: 'Inv Serial No',
            key: 'invSerialNo',
            dataIndex: 'invSerialNo',
            fixed: 'left',
        },
        {
            title: 'Date',
            key: 'invParameterDateVar',
            dataIndex: 'invParameterDateVar',
        },
        {
            title: 'Result',
            key: 'invParameterResult',
            dataIndex: 'invParameterResult',

        }, {
            title: 'Section',
            key: 'sectionName',
            dataIndex: 'sectionName',

        }, {
            title: 'Remark',
            key: 'invRemark',
            dataIndex: 'invRemark',

        }, {
            title: 'Insurance Comp',
            key: 'insuranceComp',
            dataIndex: 'insuranceComp',

        },
        {
            title: 'Entry',
            key: 'entryDate',
            dataIndex: 'entryDate',

        },
        {
            title: 'Unit',
            key: 'unitName',
            dataIndex: 'unitName',

        },
        {
            title: 'Lab Serial No',
            key: 'labSerialNo',
            dataIndex: 'labSerialNo',

        },
        {
            title: 'Enter By',
            key: 'enterBy',
            dataIndex: 'enterBy',

        }, {
            title: 'Sample Receiving',
            key: 'sampleReceivingDate',
            dataIndex: 'sampleReceivingDate',

        }, {
            title: 'Submit Date',
            key: 'submitDate',
            dataIndex: 'submitDate',

        }, {
            title: 'Is Nursing Done',
            key: 'isNursingDone',
            dataIndex: 'isNursingDone',

        }, {
            title: 'Is XRay Exists',
            key: 'isXRayExists',
            dataIndex: 'isXRayExists',

        }, {
            title: 'No Of Injection',
            key: 'noOfInjection',
            dataIndex: 'noOfInjection',

        }, {
            title: 'ML',
            key: 'invParameterNameML',
            dataIndex: 'invParameterNameML',

        }, {
            title: 'Is Normal',
            key: 'isNormal',
            dataIndex: 'isNormal',

        }, {
            title: 'Remark',
            key: 'remarkDoc',
            dataIndex: 'remarkDoc',

        }, {
            title: 'Volume',
            key: 'volume',
            dataIndex: 'volume',

        }, {
            title: 'Group',
            key: 'invGroupName',
            dataIndex: 'invGroupName',
            fixed: 'right',
        },
        {
            title: 'Normal text',
            key: 'normaltext',
            dataIndex: 'normaltext',
            fixed: 'right',
        },

    ];


    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": "1",
                "col1": values?.InvParameterID,
                "col2": values?.InvParameterResult,
                "col3": values?.InvRemark,
                "col4": "",
                "col5": "",
                "col6": values?.NoOfInjection,
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
                "col21": values?.InvParameterDate,
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
                "type": 4
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
                        <Form.Item name="InvParameterID" label="Inv Parameter" rules={[{ required: true }]}>
                            <Select
                                options={[]}
                                placeholder="Select"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="InvParameterResult" label="Inv Parameter Result" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="InvRemark" label="Inv Remark" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="InvParameterDate" label="Date" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="NoOfInjection" label="No Of Injection" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="VolumeML" label="Volume ML" rules={[{ required: true }]}>
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
        <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            <Card>
                {formView()}
            </Card>
            <Table
                columns={columns}
                size="small"
                dataSource={result6}
                pagination={false}
            />
        </Space>
    );
};

export default Investigation;