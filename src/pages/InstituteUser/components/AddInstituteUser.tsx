import type { ProFormInstance } from '@ant-design/pro-components';
import {
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { requestAddInstituteUser } from '../services/api';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetBranch, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import '../styles/addCandidate.css'
import { functions } from 'lodash';
//import jwt from 'jwt-decode'
//import { fetchMenuData, currentUser as queryCurrentUser } from '../services/apiRequest/api';


const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const AddInstituteUser = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess, isdrawer }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<any>([])
    const [district, setDistrict] = useState<any>([])
    const [city, setCity] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [gender, setGender] = useState<any>([])
    const [marital, setMarital] = useState<any>([])
    const [branch, setBranch] = useState<any>([{ value: 1, label: "Branch 1" }]);
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [candidateData, setCandidateData] = useState({});
    const { initialState, setInitialState } = useModel('@@initialState');

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        marginTop: 60,
        height: 300,
    };

    useEffect(() => {

        console.log("initialState");
        console.log(initialState);

        getState()
        getGender()
        getMarital()
        // getformidbyname()

    }, [])

    useEffect(() => {
        console.log({ selectedRows })
        if (isEditable) {
            formRef.current?.setFieldsValue({
                firstName: selectedRows?.firstName,
                middleName: selectedRows?.middleName,
                lastName: selectedRows?.lastName ? selectedRows?.lastName : "-",
                candPassword: selectedRows?.candPassword ? selectedRows?.candPassword : "-",
                emailID: selectedRows?.emailID,
                mobileNo: selectedRows?.mobileNo,
                dob: dayjs(selectedRows?.dob, dateFormat),
                // panNo: selectedRows?.panNo,
                //aadhaarNo: selectedRows?.aadhaarNo,
                //maritalStatusID: { value: selectedRows?.maritalStatusID, label: selectedRows?.maritalStatusName },
                genderID: { value: selectedRows?.genderID, label: selectedRows?.genderName },

            })
        }
    }, [selectedRows])

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }

    const getGender = async () => {
        const res = await requestGetGender();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            setGender(dataMaskForDropdown)
        }
    }

    const getMarital = async () => {
        const res = await requestGetMarital();
        if (res?.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.maritalStatusID, label: item.maritalStatusName }
            })
            console.log({ dataMaskForDropdown })
            setMarital(dataMaskForDropdown)
        }
    }

    const getBranch = async () => {
        const res = await requestGetBranch();
        if (res?.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.maritalStatusID, label: item.maritalStatusName }
            })
            console.log({ dataMaskForDropdown })
            setMarital(dataMaskForDropdown)
        }
    }


    const getState = async () => {
        const res = await requestGetState();
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.stateID, label: item.stateName }
            })
            console.log({ dataMaskForDropdown })
            setState(dataMaskForDropdown)
        }
    }

    const getDistrict = async (value: any, item: any) => {
        const res = await requestGetDistrict(item);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.districtID, label: item.districtName }
            })
            setDistrict(dataMaskForDropdown)
        }
    }

    const getCity = async (value: any, item: any) => {
        const res = await requestGetCity(item);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.cityID, label: item.cityName }
            });
            setCity(dataMaskForDropdown);
        }
    }

    const getArea = async (value: any, item: any) => {
        const res = await requestGetArea(item);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.areaID, label: item.areaName }
            })
            setArea(dataMaskForDropdown)
        }
    }


    function getformidbyname(values: string | undefined) {
        // initialState.data.formRight.leght
        var formid = "";
        for (let i = 0; i < initialState.data.formRight.length; i++) {
            console.log(initialState.data.formRight[i]['displayName'])
            if (initialState.data.formRight[i]['displayName'] == values) {
                formid = initialState.data.formRight[i]['formID'];
            }
            // Code to be repeated
        }
        return formid;
        //console.log(initialState.data.formRight.length)
    }

    function getuserid() {
        // initialState.data.formRight.leght

        // const user = jwt(initialState?.currentUser?.verifiedUser.token);


        // return user.UserId;
        //console.log(initialState.data.formRight.length)
    }



    const addCandidate = async (values: any) => {
        try {
            values['dob'] = convertDate(values['dob']);

            const staticParams = {
                userID: "-1",

                //userID: getuserid(),
                //formID: getformidbyname('Institute User Profile'),
                formID: '10',
                type: 1,
                otp: "",
                // Token: initialState?.currentUser?.verifiedUser.token,
            };

            setLoading(true)
            var token = initialState?.currentUser?.verifiedUser.token;
            const msg = await requestAddInstituteUser({ ...values, ...staticParams, token: token });
            setLoading(false)
            if (msg.isSuccess === "True") {
                formRef.current?.resetFields();
                message.success(msg.msg);
                setOTPVisible(true);
                setCandidateData({ ...values, ...staticParams })
                requestForOTP({ ...values, ...staticParams })
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'pages.login.failure',
                defaultMessage: 'Login failed, please try again!',
            });
            console.log({ error });
            message.error(defaultLoginFailureMessage);
        }
    };

    const requestForOTP = async (params: any) => {
        try {
            setLoading(true)
            params['type'] = 4;
            // var token = initialState?.currentUser?.verifiedUser.token;
            // params['token'] =token;
            const msg = await requestAddInstituteUser(params);
            setLoading(false)
            if (msg.isSuccess === "True") {
                // message.success(msg.msg);
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            const defaultLoginFailureMessage = "Please try again!";
            message.error(defaultLoginFailureMessage);
        }
    }

    const requestForValidateOTP = async (params: any) => {
        try {
            setLoading(true)
            const data: any = { ...candidateData };
            data['type'] = 5;
            data['otp'] = params.otp;
            //  var token = initialState?.currentUser?.verifiedUser.token;

            // data['token'] = token;
            const msg = await requestAddInstituteUser(data);
            setLoading(false)
            if (msg.isSuccess === "True") {
                message.success(msg.msg);
                const urlParams = new URL(window.location.href).searchParams;
                setTimeout(() => {
                    history.push(urlParams.get('redirect') || '/user/login');
                }, 1000)
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            const defaultLoginFailureMessage = "Please try again!";
            message.error(defaultLoginFailureMessage);
        }
    }

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        requestForValidateOTP(values);
    };
    const reset = () => {
        console.log("reset")
        formRef.current?.resetFields();
    }
    const closeDrawer = () => {
        onClose();
    }
    const goBack = () => {
        history.push("/")
    }

    const addCandidateForm = () => {
        return (
            isdrawer ? <Drawer
                title={`${isEditable ? `Edit ${selectedRows?.firstName}` : "Create a new Institute User"}`}
                width={1000}
                onClose={closeDrawer}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}
                extra={<Space align="baseline">
                    <Button type="primary" onClick={reset}>
                        New Institute User
                    </Button>
                </Space>}
            >

                <>
                    <Spin tip="Please wait..." spinning={loading}>
                        <StepsForm
                            containerStyle={{ alignSelf: 'center', width: '100%', marginInline: 10 }}
                            formRef={formRef}
                            onFinish={async (values) => {
                                addCandidate(values)
                            }}

                            formProps={{
                                validateMessages: {
                                    required: 'This is required',
                                },
                            }}
                        >
                            <StepsForm.StepForm
                                name="basicInformation"
                                title="Basic Details"
                                stepProps={{
                                    description: '',
                                }}
                                onFinish={async () => {
                                    console.log(formRef.current?.getFieldsValue());
                                    return true;
                                }}
                            >
                                <div style={contentStyle}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="firstName"
                                                label="First Name"
                                                rules={[{ required: true, message: 'Please enter First Name' }]}
                                            >
                                                <Input placeholder="Please enter First Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="middleName"
                                                label="Middle Name"
                                                rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                            >
                                                <Input placeholder="Please enter Middle Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="lastName"
                                                label="Last Name"
                                                rules={[{ required: true, message: 'Please enter Last Name' }]}
                                            >
                                                <Input placeholder="Please enter Last Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="userPassword"
                                                label="Password"
                                                rules={[{ required: true, message: 'Please enter Password' }]}
                                            >
                                                <Input placeholder="Please enter Password" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="mobileNo"
                                                label="Mobile No"
                                                rules={[
                                                    { required: true, type: 'string', message: 'Please enter mobile number' },
                                                    {
                                                        pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                        message: 'Please enter a valid mobile number',
                                                    }
                                                ]}
                                            >
                                                <Input
                                                    maxLength={10}
                                                    placeholder="Please enter mobileNo" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="emailID"
                                                label="Email"
                                                rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
                                            >
                                                <Input maxLength={80} placeholder="Please enter Email" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="dob"
                                                label="DOB"
                                                rules={[{ required: false, message: 'Please choose the DOB' }]}
                                            >
                                                {/* 12 age min DD-MMM-YYYY */}
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    format={'DD-MMM-YYYY'}
                                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="genderID"
                                                label="Gender"
                                                rules={[{ required: false, message: 'Please choose the Gender' }]}
                                            >
                                                <Select
                                                    placeholder="Please choose the Gender"
                                                    options={gender}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </StepsForm.StepForm>

                            {/* Identity Proofs */}



                            {/* Address Information */}

                        </StepsForm>
                    </Spin>

                </>

            </Drawer> :
                <>
                    <Spin tip="Please wait..." spinning={loading}>
                        <Form
                            layout="vertical"
                            style={{ alignSelf: 'center', width: '95%', marginInline: 20 }}
                            // containerStyle={{ alignSelf: 'center', width: '100%', marginInline: 10 }}
                            // formRef={formRef}
                            onFinish={async (values) => {
                                addCandidate(values)
                            }}

                            formProps={{
                                validateMessages: {
                                    required: 'This is required',
                                },
                            }}

                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                        >

                            <div style={contentStyle}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item
                                            name="firstName"
                                            label="First Name"
                                            rules={[{ required: true, message: 'Please enter First Name' }]}
                                        >
                                            <Input placeholder="Please enter First Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="middleName"
                                            label="Middle Name"
                                            rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                        >
                                            <Input placeholder="Please enter Middle Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="lastName"
                                            label="Last Name"
                                            rules={[{ required: true, message: 'Please enter Last Name' }]}
                                        >
                                            <Input placeholder="Please enter Last Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="userPassword"
                                            label="Password"
                                            rules={[{ required: true, message: 'Please enter Password' }]}
                                        >
                                            <Input type="password" placeholder="Please enter Password" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="mobileNo"
                                            label="Mobile No"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please enter mobile number' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid mobile number',
                                                }
                                            ]}
                                        >
                                            <Input
                                                maxLength={10}
                                                placeholder="Please enter mobileNo" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="emailID"
                                            label="Email"
                                            rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
                                        >
                                            <Input maxLength={80} placeholder="Please enter Email" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="dob"
                                            label="DOB"
                                            rules={[{ required: false, message: 'Please choose the DOB' }]}
                                        >
                                            {/* 12 age min DD-MMM-YYYY */}
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                format={'DD-MMM-YYYY'}
                                                getPopupContainer={(trigger) => trigger.parentElement!}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="genderID"
                                            label="Gender"
                                            rules={[{ required: false, message: 'Please choose the Gender' }]}
                                        >
                                            <Select
                                                placeholder="Please choose the Gender"
                                                options={gender}
                                            />
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center', alignContent: 'center'
                                }}>
                                    <Form.Item>
                                        <Button style={{marginRight:20}} type="primary" htmlType="submit" className="login-form-button">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button onClick={goBack} type="primary" htmlType="submit" className="login-form-button">
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                </div>
                            </div>


                            {/* Identity Proofs */}
                            {/* Address Information */}

                        </Form>

                    </Spin>

                </>
        )
    }

    const addOtpForm = () => {
        return (
            <>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
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
                        <Button type="link" htmlType="submit" className="login-form-button">
                            Resend the OTP
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }

    return (
        <>
            <Spin tip="Please wait..." spinning={loading}>
                <Row justify="space-around" align="middle">
                    {!isOtpVisible ? addCandidateForm() : addOtpForm()}
                </Row>
            </Spin>
        </>
    );
};



export default AddInstituteUser;