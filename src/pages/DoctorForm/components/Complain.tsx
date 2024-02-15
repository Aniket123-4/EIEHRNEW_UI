import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { requestGetComplaintType, requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import { DatePicker, Radio } from 'antd';
import { booleanValueForOption, dateFormat } from '@/utils/constant';
import moment from 'moment';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';


const Complain = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result2 } = patientDetails;
    const [filterForm] = Form.useForm();
    const [loading, setLoading] = useState(false)


    const { verifiedUser } = getUserInLocalStorage();

    const columns: ColumnsType<any> = [
        {
            title: 'Complaint',
            key: 'complaintTypeName',
            dataIndex: 'complaintTypeName',

        },
        // {
        //     title: 'Adm No',
        //     key: 'admNo',
        //     dataIndex: 'admNo',

        // },
        // {
        //     title: 'Complaint',
        //     key: 'complaint',
        //     dataIndex: 'complaint',
        // },
        {
            title: 'Entry Date',
            key: 'entryDateVar',
            dataIndex: 'entryDateVar',

        },
        // {
        //     title: 'Complaint ML',
        //     key: 'complaintML',
        //     dataIndex: 'complaintML',
        // }

    ];

    const [complaintType, setComplaintType] = useState<any>([])

    useEffect(() => {
        getComplaintType();

    }, [])

    const getComplaintType = async () => {
        const staticParams = {
            "complaintTypeID": "-1",
            "isActive": "1",
            "type": "1"
        }
        const res = await requestGetComplaintType(staticParams);
        // console.log(res.result);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.complaintTypeID, label: item.complaintTypeName }
            })
            setComplaintType(dataMaskForDropdown)
            // console.log(dataMaskForDropdown)
        }
    }

    const formView = () => {

        /* eslint-disable no-template-curly-in-string */
        const validateMessages = {
            required: '${label} is required!',
            types: {
                email: '${label} is not a valid email!',
                number: '${label} is not a valid number!',
            }
        };
        /* eslint-enable no-template-curly-in-string */

        



        const handleChangeFilter = (value: any) => { }

        return (
            <Form
                form={filterForm}
                onFinish={onFinishPatForm}
                layout="vertical"
                size={'small'}
            >

                <Row gutter={16}>

                    <Col span={6}>
                        <Form.Item name="ComplainTypeID" label="Complaint Type" rules={[{ required: true }]}>
                            <Select
                                showSearch
                                onChange={handleChangeFilter}
                                options={complaintType}
                                placeholder="Select"
                                filterOption={filterOption}
                            // mode="multiple"
                            />
                        </Form.Item>
                    </Col>

                    {/* <Col span={6}>
                        <Form.Item name="IsML" label="is ML" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={booleanValueForOption}
                                placeholder="Select"
                            />
                        </Form.Item>
                    </Col> 
                    <Col span={6}>
                        <Form.Item name="ComplaintML" label="Complaint ML" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col> */}
                    <Col span={6}>
                        <Form.Item name="Complain" label="Complaint" rules={[{ required: false }]}>
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
    const onFinishPatForm = async (values: any) => {
        const date = moment(new Date()).format(dateFormat);
        const params = {
            "patientCaseID": patientCaseID,
            "admNo": admNo,
            "col1": values?.ComplainTypeID ? values?.ComplainTypeID : "",
            "col2": values?.Complain ? values?.Complain : "",
            "col3": "",
            "col4": values?.IsML ? "" + values?.IsML : "",
            "col5": values?.ComplaintML ? values?.ComplaintML : "",
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
            "type": 1
        }
        console.log(values)
        setLoading(true)
        const response = await requestAddDelPatientForDoctorOPIP({ ...params });
        setLoading(false)
        if (response?.isSuccess) {
            filterForm.resetFields();
        }
        onSaveSuccess({
            tab: "COMPLAIN",
            response
        })
    };
    const filterOption = (input: string, patientList?: { label: string; value: string }) =>
            (patientList?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex', width: 300,paddingBottom:10 }}>
            <Spin spinning={loading}>
            <Card
            title="Problems"
            style={{ boxShadow: '2px 2px 2px #4874dc'}}
                cover={
                    <Table
                style={{padding: '1px'}}
                scroll={{ y: 240 }}
                columns={columns}
                size="small"
                dataSource={result2}
                pagination={false}
            />
                }
                actions={[
                    <Select
                    style={{ width: 275 }}
                        showSearch
                        // onChange={handleChangeFilter}
                        options={complaintType}
                        placeholder="Select"
                        filterOption={filterOption}
                        onSelect={(item:any)=>onFinishPatForm({"ComplainTypeID":item})}
                    // mode="multiple"
                    />
                ]}
            >
                {/* {formView()} */}
            </Card>
            </Spin>
            
        </Space>
    );
};

export default Complain;