import type { ProFormInstance } from '@ant-design/pro-components';
import {
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { requestAddInstitute } from '../services/api';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';


const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const EditInstitute = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState<any>([])
    const [district, setDistrict] = useState<any>([])
    const [city, setCity] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [gender, setGender] = useState<any>([])
    const [marital, setMarital] = useState<any>([])
    const [branch, setBranch] = useState<any>([{ value: 1, label: "Branch 1" }])

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        marginTop: 60,
        height: 300,
    };

    useEffect(() => {

    }, [])



    useEffect(() => {
        console.log({ selectedRows })
        if (isEditable) {

            getState();
            getDistrict(selectedRows?.stateID, { value: selectedRows?.stateID, label: selectedRows?.stateID });
            getCity(selectedRows?.districtID, { value: selectedRows?.districtID, label: selectedRows?.districtID });
            getArea(selectedRows?.cityID, { value: selectedRows?.cityID, label: selectedRows?.cityID });
            getGender();
            getMarital();


            formRef.current?.setFieldsValue({
                instituteName: selectedRows?.instituteName,
                instituteCode: selectedRows?.instituteCode,
                emailID: selectedRows?.emailID ? selectedRows?.emailID : "-",
                phoneNo: selectedRows?.phoneNo ? selectedRows?.phoneNo : "-",
                website: selectedRows?.website,
                mobileNo: selectedRows?.mobileNo,
                estdDate: dayjs(selectedRows?.estdDate, dateFormat),
            })
        } else {
            formRef.current?.resetFields();
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


    const getState = async () => {
        const res = await requestGetState();
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.stateID, label: item.stateName }
            })
            setState(dataMaskForDropdown)
            // if(isEditable){
            //     formRef.current?.setFieldsValue({
            //         stateID:{ value: selectedRows?.stateID, label: selectedRows?.stateName },
            //     })
            // }
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
            })
            setCity(dataMaskForDropdown)
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

    const addInstitute = async (values: any) => {
        console.log(values)
        try {
            values['estdDate'] = convertDate(values['estdDate']);

            const staticParams = {
                userID: "-1",
                formID: "-1",
                instituteID: selectedRows?.instituteID,
                faxNo: "0",
                // longitude: "2.552",
                // latitude: "3.255",
                type:"2"
            };

            setLoading(true)
            const msg = await requestAddInstitute({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                formRef.current?.resetFields();
                onClose();
                message.success(msg.msg);

                onSaveSuccess(msg);
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

    const reset = () => {
        console.log("reset")
        formRef.current?.resetFields();
    }

    const closeDrawer = () => {
        onClose();
    }

    console.log({ sEEEEelected: selectedRows })
    return (
        <>
            <Drawer
                title={`${isEditable ? `Edit ${selectedRows?.instituteName}` : "Add a new Institute"}`}
                width={1000}
                onClose={closeDrawer}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}
                extra={<Space align="baseline">
                    <Button type="primary" onClick={reset}>
                        New Institute
                    </Button>
                </Space>}
            >

                <>
                    <Spin tip="Please wait..." spinning={loading}>
                        <StepsForm
                            formRef={formRef}
                            onFinish={async (values) => {
                                addInstitute(values)
                            }}

                            formProps={{
                                validateMessages: {
                                    required: 'This is required',
                                },
                            }}
                        >
                            {/* Basic Information */}
                            <StepsForm.StepForm
                                name="basicInformation"
                                title="Basic Information"
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
                                                initialValue={selectedRows?.instituteName}
                                                name="instituteName"
                                                label="Institute Name"
                                                rules={[{ required: true, message: 'Please enter Institute Name' }]}
                                            >
                                                <Input placeholder="Please enter Institute Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.instituteCode}
                                                name="instituteCode"
                                                label="Institute Code"
                                                rules={[{ required: false, message: 'Please enter Institute Code' }]}
                                            >
                                                <Input placeholder="Please enter Institute Code" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.mobileNo}
                                                name="mobileNo"
                                                label="Mobile No"
                                                rules={[{ required: false, message: 'Please enter Mobile No' }]}
                                            >
                                                <Input maxLength={11} placeholder="Please enter mobileNo" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.emailID}
                                                name="emailID"
                                                label="Email"
                                                rules={[{ required: false, message: 'Please enter Email' }]}
                                            >
                                                <Input maxLength={80} placeholder="Please enter Email" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.phoneNo}
                                                name="phoneNo"
                                                label="Phone Number"
                                                rules={[{ required: false, message: 'Please enter Phone Number' }]}
                                            >
                                                <Input maxLength={80} placeholder="Please enter Phone Number" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.website}
                                                name="website"
                                                label="Website"
                                                rules={[{ required: false, message: 'Please enter Website' }]}
                                            >
                                                <Input maxLength={30} placeholder="Please enter Website" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                // initialValue={selectedRows?.estdDate}
                                                name="estdDate"
                                                label="Established Date"
                                                rules={[{ required: false, message: 'Please choose the Established Date' }]}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>


                                </div>
                            </StepsForm.StepForm>
                            {/* Basic Information */}
                            <StepsForm.StepForm
                                name="facilities"
                                title="Facilities Information"
                                stepProps={{
                                    description: '',
                                }}
                                onFinish={async () => {
                                    console.log(formRef.current?.getFieldsValue());
                                    // onCurrentChange(1);
                                    return true;
                                }}
                            >
                                <div style={contentStyle}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.noOfFaculty}
                                                name="noOfFaculty"
                                                label="No Of Faculty"
                                                rules={[{ required: true, message: 'Please enter Institute Name' }]}
                                            >
                                                <Input placeholder="Please enter Institute Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.noOfStudent}
                                                name="noOfStudent"
                                                label="No Of Student"
                                                rules={[{ required: false, message: 'Please enter Institute Code' }]}
                                            >
                                                <Input placeholder="Please enter Institute Code" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.overAllRanking}
                                                name="overAllRanking"
                                                label="OverAllRanking"
                                                rules={[{ required: false, message: 'Please enter Mobile No' }]}
                                            >
                                                <Input maxLength={11} placeholder="Please enter mobileNo" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.latitude} label="latitude" name="latitude">

                                                <Input onChange={(e) => {  }}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.longitude}
                                                label="longitude"
                                                name="longitude">
                                                <Input />

                                            </Form.Item>
                                        </Col>

                                    </Row>


                                </div>
                            </StepsForm.StepForm>



                            {/* Address Information */}
                            <StepsForm.StepForm
                                name="address"
                                title="Address Information"
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
                                                initialValue={selectedRows?.stateID}
                                                name="stateID"
                                                label="State"
                                                rules={[{ required: false, message: 'Please choose the State' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    autoComplete="new-state"
                                                    placeholder="State"
                                                    options={state}
                                                    onChange={(value, item) => {
                                                        getDistrict(value, item)
                                                        formRef.current?.resetFields(["districtID", "cityID", "areaID"]);
                                                    }}

                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.districtID}
                                                name="districtID"
                                                label="District"

                                                rules={[{ required: false, message: 'Please choose the District' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="District"
                                                    autoComplete="new-state"
                                                    options={district}
                                                    onChange={(value, item) => {
                                                        getCity(value, item)
                                                        formRef.current?.resetFields(["cityID", "areaID"]);
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.cityID}
                                                name="cityID"
                                                label="City"
                                                rules={[{ required: false, message: 'Please choose the City' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Search to City"
                                                    options={city}
                                                    autoComplete="new-state"
                                                    optionFilterProp="children"
                                                    onChange={(value, item) => {
                                                        getArea(value, item)
                                                        formRef.current?.resetFields(["areaID"]);
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.areaID}
                                                name="areaID"
                                                label="Area"
                                                rules={[{ required: false, message: 'Please choose the Area' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Search to Area"
                                                    optionFilterProp="children"
                                                    options={area}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>

                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.landMark}
                                                name="landMark"
                                                label="Landmark"
                                                rules={[{ required: false, message: 'Please enter Landmark' }]}
                                            >
                                                <Input placeholder="Please enter Landmark" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.campusArea}
                                                name="campusArea"
                                                label="Campus Area"
                                                rules={[{ required: false, message: 'Please enter Campus Area' }]}
                                            >
                                                <Input placeholder="Please enter Campus Area" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.instituteAddress}
                                                name="instituteAddress"
                                                label="Institute Address"
                                                rules={[{ required: false, message: 'Please enter Institute Address' }]}
                                            >
                                                <Input placeholder="Please enter Institute Address" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                            </StepsForm.StepForm>

                        </StepsForm>
                    </Spin>

                </>

            </Drawer>
        </>
    );
};

export default EditInstitute;