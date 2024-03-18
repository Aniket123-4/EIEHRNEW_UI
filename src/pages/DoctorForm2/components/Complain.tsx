import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker, Typography } from 'antd';
import { requestGetComplaintType, requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import { DatePicker, Radio } from 'antd';
import { booleanValueForOption, dateFormat } from '@/utils/constant';
import moment from 'moment';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import { AudioOutlined, CloseOutlined } from '@ant-design/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


const Complain = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result2 } = patientDetails;
    const [filterForm] = Form.useForm();
    const [loading, setLoading] = useState(false)


    const { verifiedUser } = getUserInLocalStorage();

    const columns: ColumnsType<any> = [
        {
            title: 'Complaint Type',
            key: 'complaintTypeName',
            dataIndex: 'complaintTypeName',

        },
        // {
        //     title: 'Adm No',
        //     key: 'admNo',
        //     dataIndex: 'admNo',

        // },
        {
            title: 'Complaint',
            key: 'complaint',
            dataIndex: 'complaint',
        },
        {
            title: 'Entry Date',
            key: 'entryDateVar',
            dataIndex: 'entryDateVar',

        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_, record) => <Row style={{ justifyContent: 'space-between' }}>
                <CloseOutlined onClick={() => onFinishPatForm(record, true)} style={{ color: 'red' }} />
            </Row>
        }

    ];

    const [complaintType, setComplaintType] = useState<any>([])

    useEffect(() => {
        getComplaintType();

    }, [])
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    
    useEffect(() => {
        filterForm.setFieldValue("Complain",transcript)
    }, [transcript])

    const handleChangeFilter = (value: any) => { }

    const startListening = () => {
        SpeechRecognition.startListening({ continuous: true })
    };

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
    const onFinishPatForm = async (values: any, isDelete: any = false) => {
        console.log(values)
        const date = moment(new Date()).format(dateFormat);
        const params = {
            "patientCaseID": patientCaseID,
            "admNo": admNo,
            "col1": values?.complaintTypeID ? values?.complaintTypeID : "",
            "col2": values?.complain ? values?.complain : "",
            "col3": isDelete ? values?.admNo : "",
            "col4": values?.isML ? "" + values?.isML : "",
            "col5": values?.complaintML ? values?.complaintML : "",
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
            "type": 1
        }
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




       
        return (
            <Form
                form={filterForm}
                onFinish={onFinishPatForm}
                layout="vertical"
                size={'small'}
            >

                <Row gutter={16}>

                    <Col span={6}>
                        <Form.Item name="complainTypeID" label="Complaint Type" rules={[{ required: true }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={complaintType}
                                placeholder="Select"
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
                        <Form.Item name="Complain"
                            label={<Row >
                                Complaint 
                                <p style={{backgroundColor:'lightgreen'}}>{listening ? 'Listening' : ''}</p>
                                <Button
                                    icon={<AudioOutlined color={listening ? 'red' : 'blue'} />}
                                    onTouchStart={startListening}
                                    onMouseDown={startListening}
                                    onTouchEnd={SpeechRecognition.stopListening}
                                    onMouseUp={SpeechRecognition.stopListening}
                                ></Button>
                                <Button type={'link'} onClick={resetTranscript}>Clear</Button>
                            </Row>} rules={[{ required: false }]}>
                                {console.log(transcript)}
                            <Input.TextArea onChange={(e)=>e.target.value} placeholder="Please Enter" />
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
                dataSource={result2}
                pagination={false}
            />
        </Space>
    );
};

export default Complain;