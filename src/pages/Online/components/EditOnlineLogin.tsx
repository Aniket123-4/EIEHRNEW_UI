import React, { useEffect, useRef, useState } from 'react';
import './styles/AddComplaint.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetComplaintType, requestGetCountry, requestGetDocType, requestGetGender, requestGetRateType } from '@/services/apiRequest/dropdowns';
import { requestAddOnlineLogin } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useParams } from '@umijs/max';
import moment from 'moment';
import dayjs from 'dayjs';
import { getUserInLocalStorage } from '@/utils/common';
import TextArea from 'antd/es/input/TextArea';
import { convertDate } from '@/utils/helper';




const { Option } = Select;

const dateFormat = 'DD MMM YYYY';
const EditOnlineLogin = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any, props: any) => {
    const { verifiedUser } = getUserInLocalStorage();
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [complaintType, setComplaintType] = useState<any>([{ value: "1", label: "Type 1" }])
    const [gender, setGender] = useState<any>([])
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [docType, setDocType] = useState<any>([])
    const [selectedDocType, setSelectedDocType] = useState<number>(-1);
    const [nationality, setNationality] = useState<any>([{ value: '1', label: "Indian" }])




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
        getDocType();
        getCountry();
    }, [])

    const getGender = async () => {
        const res = await requestGetGender();
        console.log(res);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setGender(dataMaskForDropdown)
        }
    }
    const getDocType = async () => {
        const res = await requestGetDocType();
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.uniqueID, label: item.uniqueName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setDocType(dataMaskForDropdown)
        }
    }
    const getCountry = async () => {
        const res = await requestGetCountry();
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.countryID, label: item.nationality }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setNationality(dataMaskForDropdown)
        }
    }

    const goBack = () => {
        history.push("/")
    }

    const PostForm = () => {
        form.setFieldsValue(
            {
                "fName": selectedRows?.fName,
                "mName": selectedRows?.mName,
                "lName": selectedRows?.lName,
                "curMobileNoCC": selectedRows?.curMobileNoCC,
                "curMobileNo": selectedRows?.curMobileNo,
                "genderID": selectedRows?.genderID,
                "dob": dayjs(selectedRows?.dob, dateFormat),
                "nationalityID": selectedRows?.nationalityID,
                "fNameML": selectedRows?.fNameML,
                "uniqueID": selectedRows?.vUniqueID,
                "uniqueName": selectedRows?.uniqueName,
                "curAddress": selectedRows?.curAddress,
            });
    }
    const validateCharacters = (rule, value, callback) => {
        const regex = /^[A-Za-z\s]+$/;
        if (!regex.test(value)) {
            if (value) {
                callback('Only characters are allowed');
            } else {
                callback();
            }

        } else {
            callback();
        }
    };

    const addOnlineLogin = async (values: any) => {
        values['dob'] = convertDate(values['dob']);
        try {
            const staticParams = {
                // "fName": "string",
                // "mName": "string",
                // "lName": "string",
                "eMail": "",
                "password": "",
                "curMobileNoCC": "+91",
                // "curMobileNo": selectedRows?.curMobileNo,
                // "genderID": 0,

                // "fNameML": "string",
                // "dob": "2023-10-28T08:46:25.580Z",
                // "nationalityID": 0,
                // "uniqueID": 0,
                // "uniqueName": "",
                // "curAddress": "",
                "onlinePatientID": verifiedUser?.userID,
                "formID": -1,
                "type": 2
            };

            setLoading(true)
            const msg = await requestAddOnlineLogin({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                // form.resetFields();
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


    const addForm = () => {
        return (
            <Form
                layout="vertical"
                // hideRequiredMark
                form={form}
                onFinish={addOnlineLogin}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}  >
                                <Form.Item
                                    // initialValue={selectedRows?.fName}
                                    name="fName"
                                    label="First name"
                                    rules={[{ required: true, message: 'Please enter first name' },
                                {validator:validateCharacters}]}
                                // initialValue={institute}
                                >
                                    <Input size={'large'} placeholder="Please enter first name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}  >
                                <Form.Item
                                    // initialValue={selectedRows?.mName}
                                    name="mName"
                                    label="Middle name"
                                    rules={[{ message: 'Please enter middle name' },
                                {validator:validateCharacters}]}
                                >
                                    <Input size={'large'} placeholder="Please enter middle name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}  >
                                <Form.Item
                                    // initialValue={selectedRows?.lName}
                                    name="lName"
                                    label="Last name"
                                    rules={[{ required: true, message: 'Please enter last name' },
                                {validator:validateCharacters}]}
                                >
                                    <Input size={'large'} placeholder="Please enter last name" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Space.Compact>
                                    <Form.Item
                                        // initialValue={selectedRows?.curMobileNoCC}
                                        style={{ width: '20%' }}
                                        name="curMobileNoCC"
                                        label="  CC"
                                        rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                    >
                                        <Input size={'large'} placeholder="Please enter MobileNoCC" />

                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: '80%' }}
                                        // initialValue={selectedRows?.curMobileNo}
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

                                </Space.Compact>

                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    // initialValue={selectedRows?.genderID}
                                    name="genderID"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please select gender' }]}
                                >
                                    <Select
                                        // defaultValue={selectedRows?.genderID}
                                        size={'large'}
                                        placeholder="Select gender"
                                        optionFilterProp="children"
                                        options={gender}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    // initialValue={dayjs(selectedRows?.dob, dateFormat)}
                                    name="dob"
                                    label="DOB"
                                    rules={[{ required: true, message: 'Please choose the DOB' }]}
                                >
                                    {/* 12 age min DD-MMM-YYYY */}
                                    <DatePicker
                                        size={'large'}
                                        style={{ width: '100%' }}
                                        format={'DD-MMM-YYYY'}
                                        // disabledDate={(current) => {
                                        //     let customDate = moment().format("YYYY-MM-DD");
                                        //     return current && current > dayjs().subtract(12, 'year');
                                        // }}
                                        defaultValue={dayjs(selectedRows?.dob, dateFormat)}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    // initialValue={selectedRows?.nationalityID}
                                    name="nationalityID"
                                    label="Nationality"
                                    rules={[{ required: true, message: 'Please select Nationality' }]}
                                >
                                    <Select
                                        size={'large'}
                                        placeholder="Select nationality"
                                        options={nationality}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    initialValue={selectedRows?.fNameML}
                                    name="fNameML"
                                    label="First name ml"
                                    rules={[{ message: 'Please Enter Name in Other Language ' }]}
                                >
                                    <Input size={'large'} placeholder="Please Enter Name in Other Language" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    // initialValue={selectedRows?.vUniqueID}
                                    name="uniqueID"
                                    label="Doc Type"
                                    rules={[{ required: true, message: 'Please Select Doc Type ' }]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Please Select Doc Type"
                                        options={docType}
                                    />
                                    {/* <Input type="number" size={'large'} placeholder="Please Select Doc Type" /> */}
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    // initialValue={selectedRows?.vUniqueName}
                                    name="uniqueName"
                                    label="Document Number"
                                    rules={[{ required: true, message: 'Please Enter Document Number' }]}
                                >
                                    <Input size={'large'} placeholder="Please Enter Document Number" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    // initialValue={selectedRows?.curAddress}
                                    name="curAddress"
                                    label="Address"
                                    rules={[{ required: true, message: 'Please enter address ' }]}
                                >
                                    {/* <Input size={'large'} placeholder="Please enter address" /> */}
                                    <TextArea placeholder="Address" />
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
            </Form >
        )
    }

    return (
        //         <PageContainer
        //             title=" "
        //             header={{
        //                 // ghost: true,
        //                 breadcrumb: {
        //                     items: [
        //                         {
        //                             path: 'AddOnlineLogin',
        //                             title: 'AddOnlineLogin',
        //                         },
        //                     ],
        //                 },
        //             }}
        //             style={{ backgroundColor: '#4874dc', height: 90}}

        // >
        <Card
            style={{ marginTop: -35, height: '100%', width: '100%', boxShadow: '2px 2px 2px #4874dc' }}
            title="Edit Profile"
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Spin tip="Please wait..." spinning={loading}>
                {/* <div style={contentStyle}>
                {addForm()}
            </div> */}

                <Row justify="space-around" align="middle">
                    {addForm()}
                </Row>
            </Spin>
        </Card>
        // </PageContainer >
    );
};

export default EditOnlineLogin;