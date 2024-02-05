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
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import { requestDiseaseList } from '@/pages/Complaint/services/api';
import { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;



const Diagnosis = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result4 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [diseaseList, setDiseaseList] = useState([]);


    const columns: ColumnsType<any> = [
        // {
        //     title: 'admNo',
        //     key: 'admNo',
        //     dataIndex: 'admNo',

        // },
        // {
        //     title: 'enterDate',
        //     key: 'enterDateVar',
        //     dataIndex: 'enterDateVar',
        // },
        {
            title: 'Disease Name',
            key: 'diseaseName',
            dataIndex: 'diseaseName',

        },
        {
            title: 'Comment',
            key: 'diagnosisComment',
            dataIndex: 'diagnosisComment',

        }, {
            title: 'Disease Type',
            key: 'diseaseTypeName',
            dataIndex: 'diseaseTypeName',

        }, {
            title: 'Special Type',
            key: 'specialTypeName',
            dataIndex: 'specialTypeName',
        }

    ];

    useEffect(() => {
        getDiseaseList()
    }, [])

    const getDiseaseList = async () => {
        const params = {
            "diseaseID": "-1",
            "diseaseTypeID": "-1",
            "specialTypeID": "-1",
            "isActive": "-1",
            "type": 1
        }
        const res = await requestDiseaseList(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: string) => {
                return { value: item.diseaseID, label: item.diseaseName }
            })
            setDiseaseList(dataMaskForDropdown)
        }
    }

    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": admNo,
                "col1": values?.DiseasesID,
                "col2": values?.DiagnosisComment ? values?.DiagnosisComment : "",
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
                "type": 3
            }
            try {
                setLoading(true)
                const response = await requestAddDelPatientForDoctorOPIP({ ...params });
                setLoading(false)

                if (response?.isSuccess) {
                    tabForm.resetFields();
                }
                onSaveSuccess({
                    tab: "DIAGNOSIS",
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

                    <Col span={12}>
                        <Form.Item name="DiseasesID" label="Disease" rules={[{ required: true }]}>
                            <Select
                                options={diseaseList}
                                placeholder="Select"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="DiagnosisComment" label="Comment" rules={[{ required: false }]}>
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
                dataSource={result4}
                pagination={false}
            />
        </Space>
    );
};

export default Diagnosis;