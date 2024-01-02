import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddPatient } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';


const { Option } = Select;


const AddPatRequest = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [row, setRow] = useState(1);
    const [col, setCol] = useState(1);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([{ value: "1", label: "Type 1" }])
    const [rateType, setRateType] = useState<any>([])
    const [institute, setInstitute] = useState<any>([])


    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        //getComplaintType();
    }, [])

    const getComplaintType = async () => {
        const res = await requestGetRoomType({});
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.roomTypeID, label: item.roomTypeName }
            })
            setDiseaseType(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }

    const addPatientRequest = async (values: any) => {
        console.log(values);
        try {
            const staticParams = {
                "userWeekSlotID": 0,
                // "patientName": "string",
                // "phoneNo": "string",
                // "email": "string",
                // "patientId": 0,
                "remarkId": 0,
                "remark": "string",
                "userID": 0,
                "otpNo": "",
                "formID": -1,
                "type": 1

            };

            setLoading(true)
            const msg = await requestAddPatient({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                form.resetFields();
                onClose();
                message.success(msg.msg);
                onSaveSuccess(msg);
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };


    const addForm = () => {
        return (
            <Form
                layout="vertical"
                // hideRequiredMark
                form={form}
                onFinish={addPatientRequest}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="patientName"
                                    label="Patient Name"
                                    rules={[{ required: true, message: 'Please enter Patient name' }]}
                                // initialValue={institute}
                                >
                                    <Input size='large' placeholder="Please enter patient name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="phoneNo"
                                    label="Mobile number"
                                    rules={[
                                        { required: true, type: 'string', message: 'Please enter mobile number' },
                                        {
                                            pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                            message: 'Please enter a valid mobile number',
                                        }
                                    ]}
                                >
                                    <Input maxLength={10} size='large' placeholder="Please enter mobile number" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="eMail"
                                    label="Email *"
                                    rules={[{ required: true, message: 'Please enter email' }]}
                                >
                                    <Input type="email" size='large' placeholder="Please enter email" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="invUnitType"
                                    label="Investigation unit Type"
                                    rules={[{ required: true, message: 'Please select investigation type' }]}
                                >
                                    <Select
                                        size='large'
                                        placeholder="Complaint Type"
                                        optionFilterProp="children"
                                        options={diseaseType}
                                    />
                                </Form.Item>
                            </Col>
                            <Col  className="gutter-row" span={8}>
                                <Form.Item
                                    name="patientId"
                                    label="Patient Id"
                                    rules={[{ required: true, message: 'Please select patient' }]}
                                >
                                    <Select
                                        size='large'
                                        placeholder="PatientId"
                                        optionFilterProp="children"
                                        options={diseaseType}
                                    />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="remark"
                                    label="Remark"
                                    rules={[{ required: true, message: 'Please enter remark' }]}
                                >
                                    <Input size='large' placeholder="Please enter remark" />
                                </Form.Item>
                            </Col>
                            {/* <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="otpNo"
                                    label="Otp"
                                    rules={[{ required: true, message: 'Please enter Otp' }]}
                                >
                                    <Input size='large' placeholder="Please enter Otp" />
                                </Form.Item>
                            </Col> */}

                        </Row>
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button size='large' type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button onClick={goBack}
                                size='large'
                                style={{ marginLeft: 10 }}
                                type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>
                </>
            </Form>
        )
    }

    return (
        <PageContainer style={{ backgroundColor: '#4874dc', height: 120, }}>
            <Card
                style={{ height: '100%', width: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                title="Create a new Appointment"
                extra={[
                    <Button key="rest" onClick={() => {
                        history.push("/complaints/DiseaseList")
                    }}
                    >List</Button>,
                ]}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {addForm()}
                    </div>
                </Spin>
            </Card>
        </PageContainer>
    );
};

export default AddPatRequest;