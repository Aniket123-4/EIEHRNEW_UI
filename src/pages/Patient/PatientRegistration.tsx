import type { ProFormInstance } from '@ant-design/pro-components';
import {
    PageContainer,
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Divider, Checkbox, Typography, Tabs, Upload } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestPatientRegistration } from './services/api';
import { requestGetGender, requestGetState } from '@/services/apiRequest/dropdowns';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const PatientRegistration = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<any>([])
    const [district, setDistrict] = useState<any>([])
    const [country, setCountry] = useState<any>([])
    const [city, setCity] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [gender, setGender] = useState<any>([])
    const [marital, setMarital] = useState<any>([])
    const [branch, setBranch] = useState<any>([{ value: 1, label: "Branch 1" }]);
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [candidateData, setCandidateData] = useState({});
    const [dobValidation, setDobValidation] = useState<any>();
    const [activeTab, setActiveTab] = useState<any>("1");
    const [lstType_Patient, setLstType_Patient] = useState([]);


    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        // marginTop: 60,
        height: 350,
    };

    useEffect(() => {
        getGender()
        getState()
        let customDate = moment().format("YYYY-MM-DD");
        console.log(moment() && moment() > moment(customDate, "YYYY-MM-DD"))
    }, [])

    const initialTabItems = [
        { label: 'Patient Information', children: '', key: '1' },
        { label: 'Family Information', children: '', key: '2' },
        { label: 'Documents', children: '', key: '3' },
    ];

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }


    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // requestForValidateOTP(values);
    };
    const getGender = async () => {
        const res = await requestGetGender();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            setGender(dataMaskForDropdown)
        }
    }
    const getState = async () => {
        const res = await requestGetState();
        console.log(res);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.stateID, label: item.stateName }
            })
            console.log({ dataMaskForDropdown })
            setState(dataMaskForDropdown)
        }
    }
    const addPatientReg = async (values: any) => {
        // values['isActive'] = values.isActive;
        console.log(values)
        let serviceFrom = convertDate(values.serviceFrom);
        let serviceTo = convertDate(values.serviceTo);
        try {
            const staticParams = {
                "patientID": 0,
                "patientNo": "-1",
                // "fName": "",
                // "fNameML": "",
                // "mName": "",
                // "mNameML": "string",
                // "lName": "string",
                // "lNameML": "string",
                // "genderID": 0,
                // "fatherName": "string",
                // "fatherNameML": "string",
                // "motherName": "string",
                // "motherNameML": "string",
                // "dob": "2023-12-04T05:39:01.048Z",
                // "birthPlace": "string",
                // "civilStatusID": 0,  //?
                // "bGroupID": 0, //?
                // "religionID": 0,  //?
                // "nationalityID": 0,  //?
                // "curHouseNo": "string",
                // "curAddress": "string",
                // "curPinCode": "string",
                // "curStateID": 0,  //?
                // "curDistrictID": 0,  //?
                // "curCountryID": 0,  //?
                // "curMobileNoCC": "string",
                // "curMobileNo": "string",
                // "curPhoneCC": "string",
                // "curPhoneAC": "string",  //?
                // "curPhoneNo": "string",
                // "eMail": "string",
                // "alternateEmail": "string",
                // "perHouseNo": "string",
                // "perAddress": "string",
                // "perPinCode": "string",
                // "perStateID": 0,
                // "perDistrictID": 0,
                // "perCountryID": 0,
                // "perMobileNoCC": "string",
                // "perMobileNo": "string",
                // "perPhoneCC": "string",
                // "perPhoneAC": "string",
                // "perPhoneNo": "string",

                "lstType_Patient": [
                    {//RelationID,ContactSerialNo,ContactName,ContactMobileNoCC,ContactMobileNo,
                        //ContactPhoneCC,ContactPhoneAC,ContactPhoneNo,BloodGroup,'','','','','','' 
                        "col1": "",
                        "col2": "",
                        "col3": "",
                        "col4": "string",
                        "col5": "string",
                        "col6": "string",
                        "col7": "string",
                        "col8": "string",
                        "col9": "string",
                        "col10": "string",
                        "col11": "string",
                        "col12": "string",
                        "col13": "string",
                        "col14": "string",
                        "col15": "string"
                    }
                ],
                "istType_Pat": [
                    {
                        "col1": "string",
                        "col2": "string",
                        "col3": "string",
                        "col4": "string",
                        "col5": "string",
                        "col6": "string",
                        "col7": "string",
                        "col8": "string",
                        "col9": "string",
                        "col10": "string",
                        "col11": "string",
                        "col12": "string",
                        "col13": "string",
                        "col14": "string",
                        "col15": "string"
                    }
                ],
                "photo": "string",
                "signature": "string",
                // "isVIP": false,
                // "uidDocName": "string",
                "uidDocExt": "string",
                "uidDocPath": "string",
                "uidDocID": 0,
                "vUniqueID": 0,
                "vUniqueName": 0,
                // "passIssueDate": "2023-12-04T05:39:01.048Z",
                // "passIssuePlace": "",

                "userID": -1,
                "formID": -1,
                "type": 1
            };
            setLoading(true)
            const msg = await requestPatientRegistration({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                message.success(msg.msg);
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
    const goBack = () => {
        history.push("/")
    }

    const onChange = (e: CheckboxChangeEvent) => {
        const addressFields = form.getFieldsValue()
        if (e.target.checked == true)
            form.setFieldsValue(
                {
                    "perHouseNo": addressFields.curHouseNo,
                    "perAddress": addressFields.curAddress,
                    "perPinCode": addressFields.curPinCode,
                    "perStateID": addressFields.curStateID,
                    "perDistrictID": addressFields.curDistrictID,
                    "perCountryID": addressFields.curCountryID,
                    "perMobileNoCC": addressFields.curMobileNoCC,
                    "perMobileNo": addressFields.curMobileNo,
                    "perPhoneCC": addressFields.curPhoneCC,
                    "perPhoneAC": addressFields.curPhoneAC,
                    "perPhoneNo": addressFields.curPhoneNo,
                });
        else
            form.setFieldsValue({
                "perHouseNo": "",
                "perAddress": "",
                "perPinCode": "",
                "perStateID": "",
                "perDistrictID": "",
                "perCountryID": "",
                "perMobileNoCC": "",
                "perMobileNo": "",
                "perPhoneCC": "",
                "perPhoneAC": "",
                "perPhoneNo": "",
            })
    };

    const addPatientRegForm = () => {
        return (
            <PageContainer
                style={{ width: '100%' }}
            // title={'Patient Registration'}
            >
                <Card
                    title={''}
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Form
                        layout={'vertical'}
                        form={form}
                        onFinish={async (values) => {
                            addPatientReg(values)
                        }}
                    >
                        <Card title={<Typography style={{color:'white',fontSize:18  }}>{"Patient"}</Typography>} style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="fName"
                                        label="First Name"
                                        rules={[{ required: true, message: 'Please enter First Name' }]}
                                    >
                                        <Input style={{ borderColor: 'blue' }} placeholder="Please enter First Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="mName"
                                        label="Middle Name"
                                        rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                    >
                                        <Input placeholder="Please enter Middle Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="lName"
                                        label="Last Name"
                                        rules={[{ required: true, message: 'Please enter Last Name' }]}
                                    >
                                        <Input placeholder="Please enter Last Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="fatherName"
                                        label="Father Name"
                                        rules={[{ required: true, message: 'Please enter Father Name' }]}
                                    >
                                        <Input placeholder="Please enter Father Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="fNameML"
                                        label="First Name in Other Language"
                                        rules={[{ required: true, message: 'Please enter First Name' }]}
                                    >
                                        <Input placeholder="Please enter First Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="mNameML"
                                        label="Middle Name in Other Language"
                                        rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                    >
                                        <Input placeholder="Please enter Middle Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="lNameML"
                                        label="Last Name in Other Language"
                                        rules={[{ required: true, message: 'Please enter Last Name' }]}
                                    >
                                        <Input placeholder="Please enter Last Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="fatherNameML"
                                        label="Father Name other lang"
                                        rules={[{ required: false, message: 'Please enter Father Name' }]}
                                    >
                                        <Input placeholder="Please enter Father Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="motherNameML"
                                        label="Mother Name other lang"
                                        rules={[{ required: false, message: 'Please enter Mother Name' }]}
                                    >
                                        <Input placeholder="Please enter Mother Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="motherName"
                                        label="Mother Name"
                                        rules={[{ required: false, message: 'Please enter Mother Name' }]}
                                    >
                                        <Input placeholder="Please enter Mother Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="eMail"
                                        label="Email"
                                        rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter Email" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="alternateEmail"
                                        label="Email"
                                        rules={[{ required: false, type: 'email', message: 'Please enter an alternate Email' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter Alternate Email" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="dob"
                                        label="DOB"
                                        rules={[{ required: false, message: 'Please choose the DOB' }]}
                                    >
                                        {/* 12 age min DD-MMM-YYYY */}
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format={'DD-MMM-YYYY'}
                                            // disabledDate={(current) => {
                                            //     let customDate = moment().format("YYYY-MM-DD");
                                            //     return current && current > dayjs().subtract(12, 'year');
                                            // }}
                                            getPopupContainer={(trigger) => trigger.parentElement!}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
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
                                <Col span={6}>
                                    <Form.Item
                                        name="birthPlace"
                                        label="Birth Place"
                                        rules={[{ required: false, message: 'Please Enter The Birth Place' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Birth Place" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>
                        <Card title={<Typography style={{color:'white',fontSize:18  }}>{"Current Address"}</Typography>}
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="curHouseNo"
                                        label="HouseNo"
                                        rules={[{ required: false, message: 'Please Enter The HouseNo' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The HouseNo" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curAddress"
                                        label="Address"
                                        rules={[{ required: false, message: 'Please Enter The Address' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Address" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curPinCode"
                                        label="PinCode"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The PinCode" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curStateID"
                                        label="State"
                                        rules={[{ required: false, message: 'Please Choose The State' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the State"
                                            options={state}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curDistrictID"
                                        label="District"
                                        rules={[{ required: false, message: 'Please Choose The District' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the District"
                                            options={district}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curCountryID"
                                        label="Country"
                                        rules={[{ required: false, message: 'Please Choose The District' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the District"
                                            options={country}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '20%' }}
                                            initialValue={'+91'}
                                            name="curMobileNoCC"
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '80%' }}
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
                                            <Input maxLength={10} size={'middle'} placeholder="Please enter mobile number" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '25%' }}
                                            name="curPhoneCC"
                                            initialValue={'0512'}
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please Enter Phone Number CC' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '75%' }}
                                            name="curPhoneNo"
                                            label="Phone number"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please Enter Phone No' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid phone number',
                                                }
                                            ]}
                                        >
                                            <Input maxLength={10} size={'middle'} placeholder="Please Enter Phone No" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curPhoneAC"
                                        label="PhoneAC"
                                        rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter PhoneAC" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>
                        <Card title={<Space direction='horizontal'>
                            <Typography>{<Typography style={{color:'white',fontSize:18  }}>{"Permanent Address"}</Typography>}</Typography>
                            <Checkbox style={{color:'white',fontSize:14  }} onChange={onChange}>Same as Current</Checkbox>
                        </Space>
                        }
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="perHouseNo"
                                        label="HouseNo"
                                        rules={[{ required: false, message: 'Please Enter The HouseNo' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The HouseNo" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perAddress"
                                        label="Address"
                                        rules={[{ required: false, message: 'Please Enter The Address' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Address" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perPinCode"
                                        label="PinCode"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The PinCode" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perStateID"
                                        label="State"
                                        rules={[{ required: false, message: 'Please Choose The State' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the State"
                                            options={state}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perDistrictID"
                                        label="District"
                                        rules={[{ required: false, message: 'Please Choose The District' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the District"
                                            options={district}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perCountryID"
                                        label="Country"
                                        rules={[{ required: false, message: 'Please Choose The District' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the District"
                                            options={country}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '20%' }}
                                            initialValue={'+91'}
                                            name="perMobileNoCC"
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '80%' }}
                                            name="perMobileNo"
                                            label="Mobile number"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please enter mobile number' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid mobile number',
                                                }
                                            ]}
                                        >
                                            <Input maxLength={10} size={'middle'} placeholder="Please enter mobile number" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '25%' }}
                                            name="perPhoneCC"
                                            initialValue={'0512'}
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please Enter Phone Number CC' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '75%' }}
                                            name="perPhoneNo"
                                            label="Phone number"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please Enter Phone No' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid phone number',
                                                }
                                            ]}
                                        >
                                            <Input maxLength={10} size={'middle'} placeholder="Please Enter Phone No" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perPhoneAC"
                                        label="PhoneAC"
                                        rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter PhoneAC" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>

                        <Card title={<Space direction='horizontal'>
                        <Typography style={{color:'white',fontSize:18  }}>{"Family Information"}</Typography>
                        </Space>
                        }
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="col1"
                                        label="Relation"
                                        rules={[{ required: false, message: 'Please Select The Relation with Patient' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the Relation"
                                            options={state}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col2"
                                        label="ContactSerialNo"
                                        rules={[{ required: false, message: 'Please Enter The ContactSerialNo' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The ContactSerialNo" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col3"
                                        label="ContactName"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The PinCode" />
                                    </Form.Item>
                                </Col>

                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '20%' }}
                                            initialValue={'+91'}
                                            name="col4"
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '80%' }}
                                            name="col5"
                                            label="Mobile number"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please enter mobile number' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid mobile number',
                                                }
                                            ]}
                                        >
                                            <Input maxLength={10} size={'middle'} placeholder="Please enter mobile number" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '25%' }}
                                            name="col6"
                                            initialValue={'0512'}
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please Enter Phone Number CC' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '75%' }}
                                            name="col8"
                                            label="Phone number"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please Enter Phone No' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid phone number',
                                                }
                                            ]}
                                        >
                                            <Input maxLength={10} size={'middle'} placeholder="Please Enter Phone No" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col7"
                                        label="PhoneAC"
                                        rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter PhoneAC" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col9"
                                        label="BloodGroup"
                                        rules={[{ required: false, message: 'Please Enter BloodGroup' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the BloodGroup"
                                            options={state}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Card title={<Space direction='horizontal'>
                        <Typography style={{color:'white',fontSize:18  }}>{"Emergency Contact"}</Typography>
                        </Space>
                        }
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="col1"
                                        label="Relation"
                                        rules={[{ required: false, message: 'Please Select The Relation with Patient' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the Relation"
                                            options={state}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col2"
                                        label="ContactSerialNo"
                                        rules={[{ required: false, message: 'Please Enter The ContactSerialNo' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The ContactSerialNo" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col3"
                                        label="ContactName"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The PinCode" />
                                    </Form.Item>
                                </Col>

                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '20%' }}
                                            initialValue={'+91'}
                                            name="col4"
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '80%' }}
                                            name="col5"
                                            label="Mobile number"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please enter mobile number' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid mobile number',
                                                }
                                            ]}
                                        >
                                            <Input maxLength={10} size={'middle'} placeholder="Please enter mobile number" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '25%' }}
                                            name="col6"
                                            initialValue={'0512'}
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please Enter Phone Number CC' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '75%' }}
                                            name="col8"
                                            label="Phone number"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please Enter Phone No' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid phone number',
                                                }
                                            ]}
                                        >
                                            <Input maxLength={10} size={'middle'} placeholder="Please Enter Phone No" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col7"
                                        label="PhoneAC"
                                        rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter PhoneAC" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col9"
                                        label="BloodGroup"
                                        rules={[{ required: false, message: 'Please Enter BloodGroup' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the BloodGroup"
                                            options={state}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Card title={<Space direction='horizontal'>
                        <Typography style={{color:'white',fontSize:18  }}>{"Documents"}</Typography>
                        </Space>
                        }
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="uidDocName"
                                        label="Document Name"
                                        rules={[{ required: false, message: 'Please Enter The DocName' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The DocName" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="passIssueDate"
                                        label="PassPort Issue Date"
                                        rules={[{ required: false, message: 'Please Choose The PassPort Issue Date' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Choose The PassPort Issue Date" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="passIssuePlace"
                                        label="Passport Issue Place"
                                        rules={[{ required: false, message: 'Please Enter The Passport Issue Place' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Passport Issue Place" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Col span={6}>
                                    <Form.Item
                                        name="photo"
                                        label="Photo"
                                        rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                    >
                                        <Upload
                                            listType="picture"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            maxCount={1}
                                        // beforeUpload={beforeUpload}
                                        // onChange={(info) => handleChange(info, item)}
                                        // onPreview={onPreview}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="signature"
                                        label="Signature"
                                        rules={[{ required: false, message: 'Please Choose Signature Pic' }]}
                                    >
                                        <Upload
                                            listType="text"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            // beforeUpload={beforeUpload}
                                            // onChange={(info) => handleChange(info, item)}
                                            // onPreview={onPreview}
                                            maxCount={1}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>

                                </Col>
                        </Card>
                        <Form.Item
                            name="isVIP"
                            valuePropName="checked"
                            label=""
                            rules={[{ required: false, message: 'Please Enter The HouseNo' }]}
                        >
                            <Checkbox>isVIP</Checkbox>

                        </Form.Item>
                        <Row style={{ marginTop: 40 }} justify="center" align="middle">
                            <Form.Item >
                                <Button type="primary" htmlType="submit" >
                                    Register
                                </Button>
                            </Form.Item>
                        </Row>
                    </Form>
                </Card>
            </PageContainer>
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
                    {!isOtpVisible ? addPatientRegForm() : addOtpForm()}
                </Row>
                {/* <Card>
                    <Tabs
                        tabPosition={'top'}
                        items={initialTabItems}
                        onChange={(activeKey) => setActiveTab(activeKey)}
                    />
                    <div style={{ marginTop: 3 }}>
                        {activeTab === "1" && addPatientRegForm()}
                        {activeTab === "2" && addFamilyDetailsForm()}
                        {activeTab === "3" && <UpdateDocsUpload />}
                    </div>
                </Card> */}
            </Spin>
        </>
    );
};



export default PatientRegistration;