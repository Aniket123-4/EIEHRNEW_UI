import React, { useEffect, useRef, useState } from 'react';
import './styles/AddComplaint.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetComplaintType, requestGetGender, requestGetRateType } from '@/services/apiRequest/dropdowns';
import { requestAddOnlineLogin } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useParams } from '@umijs/max';
import moment from 'moment';
import dayjs from 'dayjs';
import { values } from 'lodash';




const { Option } = Select;


const AddOnlineLogin = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any, props: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [complaintType, setComplaintType] = useState<any>([{ value: "1", label: "Type 1" }])
    const [ccListOptions, setCcListOptions] = useState<any>([{ value: "+91", label: "+91" }])
    const [gender, setGender] = useState<any>([])
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [emailID, setEmailID] = useState<string>("");
    const [mobileNo, setMobileNo] = useState<string>("");


    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        // getComplaintType();
        PostForm()
        getGender();
    }, [])

    const getComplaintType = async () => {
        const staticParams = {

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

    const getGender = async () => {
        const res = await requestGetGender();
        console.log(res);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            setGender(dataMaskForDropdown)
        }
    }

    const goBack = () => {
        history.push("/")
    }

    const PostForm = () => {
        console.log(props)
    }

    const addOnlineLogin = async (values: any, type: any = 1) => {
        console.log(values);

        try {
            const staticParams = {
                // "fName": "string",
                // "lName": "string",
                // "password": "string",
                // "otp":"",
                // "curMobileNoCC": "string",
                // "eMail": emailID,
                // "curMobileNo": mobileNo,
                "mName": values?.mName ? values?.mName : "",
                "genderID": 1,
                "fNameML": "",
                "dob": "2023-11-06T09:11:58.560Z",
                "nationalityID": 0,
                "uniqueID": 0,
                "uniqueName": "",
                "curAddress": "",
                "onlinePatientID": -1,
                "formID": -1,
                "type": type,
            };

            setLoading(true)
            const msg = await requestAddOnlineLogin({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                message.success(msg.msg);
                setMobileNo(values['curMobileNo'])
                setEmailID(values['eMail'])
                setOTPVisible(true);
                if (type == 5)
                    {const urlParams = new URL(window.location.href).searchParams;
                    setTimeout(() => {
                    history.push(urlParams.get('redirect') || '/user/login');
                }, 1000)}
                return;
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
                onFinish={addOnlineLogin}
                initialValues={{
                    curMobileNoCC: ccListOptions[0].value,
                    eMail: emailID,
                    curMobileNo: mobileNo
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}  >
                                <Form.Item
                                    name="fName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please Enter First Name' }]}
                                // initialValue={institute}
                                >
                                    <Input size={'large'} placeholder="Please Enter First Name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}  >
                                <Form.Item
                                    name="mName"
                                    label="Middle Name"
                                    rules={[{ message: 'Please Enter Middle> Name' }]}
                                >
                                    <Input size={'large'} placeholder="Please Enter Middle Name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}  >
                                <Form.Item
                                    name="lName"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Please Enter Last Name' }]}
                                >
                                    <Input size={'large'} placeholder="Please Enter Last Name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="eMail"
                                    label="Email"
                                    rules={[{ required: true, message: 'Please enter email' }]}
                                >
                                    <Input type="email" size={'large'} placeholder="Please Enter Email" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[{ required: true, message: 'Please enter password' }]}
                                >
                                    <Input type="password" size={'large'} placeholder="Please Enter Password" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="password1"
                                    label="Confirm Password"
                                    rules={[{ required: true, message: 'Please enter password' }]}
                                >
                                    <Input type="password" size={'large'} placeholder="Please Enter Password" />
                                </Form.Item>
                            </Col>
                            {/* <Col className="gutter-row" span={2}>
                                <Form.Item
                                    name="curMobileNoCC"
                                    label="CC"
                                    rules={[{ required: true, message: 'Please enter Mobile number cc' }]}
                                >
                                    <Select
                                        size={'large'}
                                        placeholder="Select CC"
                                        optionFilterProp="children"
                                        options={ccListOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="curMobileNo"
                                    label="Mobile number"
                                    rules={[
                                        { required: true, type: 'string', message: 'Please enter mobile number' },
                                        {
                                            pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                            message: 'Please enter a valid mobile number',
                                        }
                                    ]}
                                >
                                    <Input maxLength={10} size={'large'} placeholder="Please enter mobile number" />
                                </Form.Item>
                            </Col> */}
                            <Col className="gutter-row" span={6}>
                                <Space.Compact>
                                    <Form.Item
                                        initialValue={selectedRows?.curMobileNoCC}
                                        style={{ width: '20%' }}
                                        name="curMobileNoCC"
                                        label="  CC"
                                        rules={[{ required: false, message: 'Please Enter Mobile Number CC' }]}
                                    >
                                        <Input size={'large'} placeholder="Please Enter MobileNo CC" />

                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: '80%' }}
                                        initialValue={selectedRows?.curMobileNo}
                                        name="curMobileNo"
                                        label="Mobile Number"
                                        rules={[
                                            { required: true, type: 'string', message: 'Please Enter Mobile Number' },
                                            {
                                                pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                message: 'Please enter a valid mobile number',
                                            }
                                        ]}
                                    >
                                        <Input maxLength={10} size={'large'} placeholder="Please enter mobile number" />
                                    </Form.Item>

                                </Space.Compact>

                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    initialValue={{ value: "1", label: "Male" }}
                                    name="genderID"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please select gender' }]}
                                >
                                    <Select
                                        size={'large'}
                                        placeholder="Select Gender"
                                        optionFilterProp="children"
                                        options={gender}
                                    />
                                </Form.Item>
                            </Col>


                        </Row>
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button size={'large'} type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button onClick={goBack} size={'large'} style={{ marginLeft: 10 }} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>

                </>
            </Form>
        )
    }

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // requestForValidateOTP(values);
    };

    const addOtpForm = () => {
        return (
            <>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        eMail: emailID,
                        curMobileNo: mobileNo
                    }}
                    onFinish={(v) => addOnlineLogin({
                        eMail: emailID,
                        curMobileNo: mobileNo,
                        otp: v.otp,
                        "password": "25",
                        "curMobileNoCC": "",
                        "fName": "sk",
                        "mName": "km",
                        "lName": "singh",
                        "fNameML": "",
                        "userID": "-1",
                    }, 5)}
                >
                    <h2>{'OTP Verification'}</h2>
                    <Form.Item
                        name="otp"
                        rules={[{ required: true, message: 'Please input your valid otp!' }]}
                    >
                        <Input placeholder="Enter the otp here" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Verify
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={(v) => addOnlineLogin({
                            eMail: emailID,
                            curMobileNo: mobileNo
                        }, 4)} type="link" className="login-form-button">
                            Resend the OTP
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }

    return (
        <PageContainer
            title="Patient Registration"
            header={{
                // ghost: true,
            }}
            style={{}}

        >
            <Card
                style={{ marginTop: 10, boxShadow: '2px 2px 2px #4874dc' }}
                title=""
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <Row justify="space-around" align="middle">
                        {!isOtpVisible ? addForm() : addOtpForm()}
                    </Row>
                </Spin>
            </Card>
        </PageContainer >
    );
};

export default AddOnlineLogin;