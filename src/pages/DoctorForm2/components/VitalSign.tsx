import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList, requestGetVitalParameter } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { booleanValueForOption, dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import { ColumnsType } from 'antd/es/table';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import moment from 'moment';
import { CloseOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;



const VitalSign = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result3 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vitals, setVitals] = useState([]);
    const { verifiedUser } = getUserInLocalStorage();
    const [lstType_Patient, setLstType_Patient] = useState([]);


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

        }, 
        {
            title: 'Enter By',
            key: 'enterBy',
            dataIndex: 'enterBy',

        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_, record) => <CloseOutlined style={{ alignItems: 'center', color: 'red' }} onClick={() => onFinishPatForm(record, true)}/>

        }

    ];

    useEffect(() => {
        getVitalParameter();
    }, [])

    const getVitalParameter = async () => {
        const params = {
            "vitalParameterID": -1,
            "parameterType": -1,
            "isActive": 1,
            "type": 1
        }
        const res = await requestGetVitalParameter(params);

        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result.map((item: any) => {
                return { value: item.vitalParameterID, label: `${item.vitalParameterName}` }
            })
            console.log({ dataMaskForDropdown })
            setVitals(dataMaskForDropdown)
        }
    }
    const onFinishPatForm = async (values: any,isDelete:any=false) => {
        console.log(values)
        const date = moment(values?.vitalDateTime).format(dateFormat);
        const params = {
            "patientCaseID": patientCaseID,
            "admNo": admNo,
            "col1": values?.vitalParameterID ? values?.vitalParameterID : "",
            "col2": values?.vitalResult ? values?.vitalResult : "",
            "col3": values?.vitalComment ? values?.vitalComment : "",
            "col4": values?.vitalDescp ? values?.vitalDescp : "",
            "col5": isDelete ? values?.admNo : "",
            "col6": isDelete ? values?.vitalSerialNo : "",
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
            "isForDelete": isDelete,
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

            if (response?.isSuccess) {
                tabForm.resetFields();
            }
            onSaveSuccess({
                tab: "VITAL_SIGN",
                response
            })


        } catch (e) {
            setLoading(false)
        }
    };


    const formView = () => {

        


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
                        <Form.Item name="vitalParameterID" label="Vital Parameter" rules={[{ required: true }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={vitals}
                                placeholder="Select"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="vitalResult" label="Result" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="vitalDateTime" label="Date" rules={[{ required: false }]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                defaultValue={moment()} 
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="vitalComment" label="Comment" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="vitalDescp" label="Description" rules={[{ required: false }]}>
                            <Input.TextArea placeholder="Please Enter" />
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

    const formList = () => {
        return (
            <>
                <Form.List
                    initialValue={lstType_Patient}
                    name="lstType_Patient">
                    {(lstType_Patient, { add, remove }) => (
                        <>
                            {lstType_Patient.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={16} >
                                    <Col className="gutter-row" span={8}>
                                        <Form.Item
                                            {...restField}
                                            label="Patient Type"
                                            name={[name, 'patientTypeName']}
                                            rules={[{ required: true, message: 'Patient Type' }]}
                                        >
                                            <Input disabled placeholder="Patient Type" />
                                        </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={8}>

                                        <Form.Item
                                            {...restField}
                                            label="Range From"
                                            name={[name, 'col5']}
                                            rules={[{ required: true, message: 'Range From' }]}
                                        >
                                            <InputNumber stringMode style={{ width: '100%' }} placeholder="Range From" />
                                        </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={8}>

                                        <Form.Item
                                            {...restField}
                                            label="Range To"
                                            name={[name, 'col6']}
                                            rules={[{ required: true, message: 'Range To' }]}
                                        >
                                            <InputNumber stringMode style={{ width: '100%' }} placeholder="Range To" />
                                        </Form.Item>
                                    </Col>

                                </Row>
                            ))}
                        </>
                    )}
                </Form.List>
            </>
        )
    }

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                {formView()}
                {/* {formList()} */}
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