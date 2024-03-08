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
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import { requestGetInvestigation } from '@/pages/Investigation/services/api';
import { requestGetInvestigationParameter } from '@/pages/Complaint/services/api';

const { RangePicker } = DatePicker;

const ReferalDoctor = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result9 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [sections, setSections] = useState<any>([])
    const [doctorList, setDoctorList] = useState<any>([])
    const [invParameterList, setInvParameterList] = useState([]);
    const columns: ColumnsType<any> = [
        // {
        //     title: 'Adm No',
        //     key: 'admNo',
        //     dataIndex: 'admNo',

        // },
        {
            title: 'Doctor Name',
            key: 'doctorName',
            dataIndex: 'doctorName',

        },
        {
            title: 'Inv Parameter',
            key: 'invParameterName',
            dataIndex: 'invParameterName',
        },
        {
            title: 'Is First Doc',
            key: 'isFirstDoc',
            dataIndex: 'isFirstDoc',

        }, {
            title: 'Enter By Name',
            key: 'enterBYName',
            dataIndex: 'enterBYName',

        }, {
            title: 'Section Name',
            key: 'sectionName',
            dataIndex: 'sectionName',
        }
    ];

    useEffect(() => {
        getSectionList();
        getInvParameter();
    }, [])

    const getSectionList = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetSection(params);

        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.sectionID, label: item.sectionName }
            })
            setSections(dataMaskForDropdown)
            console.log(sections)
        }
    }


    const getDoctorList = async (value: any, item: any) => {
        const params = {
            "CommonID": item.value,
            "Type": 3,
        }
        const res = await requestGetUserList(params);
        console.log(res)
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.userID, label: item.userName }
            })
            setDoctorList(dataMaskForDropdown)
        }
    }

    const getInvParameter = async () => {
        try {
            const staticParams = {
                "invParameterID": -1,
                "invGroupID": -1,
                "isActive": -1,
                "type": 2
            };

            setLoading(true)
            const response = await requestGetInvestigationParameter({ ...staticParams });
            setLoading(false)

            const dataMaskForDropdown = response?.result?.map((item: any) => {
                return { value: item.invParameterID, label: item.invName }
            })
            setInvParameterList(dataMaskForDropdown)
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": admNo,
                "col1": values?.DoctorID ? values?.DoctorID : "",
                "col2": values?.InvParameterID ? values?.InvParameterID : "",
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
                "type": 12
            }
            try {
                setLoading(true)
                const response = await requestAddDelPatientForDoctorOPIP({ ...params });
                setLoading(false)
                if (response?.isSuccess) {
                    tabForm.resetFields();
                }
                onSaveSuccess({
                    tab: "REFERAL_DOCTOR",
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
                        <Form.Item name="SectionID" label="Section" rules={[{ required: false }]}>
                            <Select
                                showSearch
                                placeholder="Select"
                                optionFilterProp="children"
                                options={sections}
                                onChange={(value, item) => {
                                    getDoctorList(value, item)
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="DoctorID" label="Doctor" rules={[{ required: false }]}>
                            <Select
                                showSearch
                                placeholder="Select"
                                optionFilterProp="children"
                                options={doctorList}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="InvParameterID" label="Inv Parameter" rules={[{ required: false }]}>
                            <Select
                                showSearch
                                placeholder="Select"
                                optionFilterProp="children"
                                options={invParameterList}
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
                dataSource={result9}
                pagination={false}
            />
        </Space>
    );
};

export default ReferalDoctor;