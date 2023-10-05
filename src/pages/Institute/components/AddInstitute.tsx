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
import { requestGetArea, requestGetBranch, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';
import { getUserInLocalStorage } from '@/utils/common';


const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const AddInstitute = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState<string[]>([])
    const [district, setDistrict] = useState<any>([])
    const [city, setCity] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [gender, setGender] = useState<any>([])
    const [marital, setMarital] = useState<any>([])
    const [branch, setBranch] = useState<any>([{ value: 1, label: "Branch 1" }])
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const data = getUserInLocalStorage();

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        marginTop: 60,
        height: 300,
    };

    useEffect(() => {
        getState()
        getGender()
        getMarital()
        getLatLong()
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
                panNo: selectedRows?.panNo,
                aadhaarNo: selectedRows?.aadhaarNo,
                maritalStatusID: { value: selectedRows?.maritalStatusID, label: selectedRows?.maritalStatusName },
                genderID: { value: selectedRows?.genderID, label: selectedRows?.genderName },

            })
        } else {
            // formRef.current?.resetFields();
        }

    }, [selectedRows])

    const onCurrentChange = (current: number) => {
        console.log(current)
        switch (current) {
            case 1:
                console.log('current 2')
                formRef.current?.setFieldsValue({
                    panNo: selectedRows?.panNo,
                    aadhaarNo: selectedRows?.aadhaarNo,
                    maritalStatusID: { value: selectedRows?.maritalStatusID, label: selectedRows?.maritalStatusName },
                    genderID: { value: selectedRows?.genderID, label: selectedRows?.genderName },
                });
                break;

            case 2:
                formRef.current?.setFieldsValue({
                    instUiqueID: selectedRows?.instUiqueID,
                    branchID: { value: 1, label: selectedRows?.branchName },
                    otherBranchName: selectedRows?.otherBranchName,
                    instName: selectedRows?.instName,
                });
                break;

            case 3:
                formRef.current?.setFieldsValue({
                    candidateAddress: selectedRows?.candidateAddress,
                    stateID: { value: selectedRows?.stateID, label: selectedRows?.stateName },
                    districtID: { value: selectedRows?.districtID, label: selectedRows?.districtName },
                    cityID: { value: selectedRows?.cityID, label: selectedRows?.cityName },
                    areaID: { value: selectedRows?.areaID, label: selectedRows?.areaID },
                    landmark: selectedRows?.landmark,
                    sessionName: selectedRows?.sessionName
                });
                break;
        }
    }

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
    const getLatLong = async () => {
        const location = window.navigator && window.navigator.geolocation
        if (location) {
            location.getCurrentPosition((position) => {
                setLatitude(position.coords.latitude.toString());
                setLongitude(position.coords.longitude.toString());
                console.log(latitude)
            })
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
        try {
            values['estdDate'] = convertDate(values['estdDate']);

            const staticParams = {
                "userID": data?.verifiedUser?.userID,
                "formID": "-1",
                "instituteID": "-1",
                "faxNo": "0",
                "longitude": longitude,
                "latitude": latitude,
                "type":"1"
            };

            setLoading(true)
            const msg = await requestAddInstitute({ ...values, ...staticParams });
            console.log(msg)
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


    return (
        <>
            <Drawer
                title={`${isEditable ? `Edit ${selectedRows?.firstName}` : "Create a new Institute"}`}
                width={1000}
                onClose={closeDrawer}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}
                extra={<Space align="baseline">
                    {/* <Button type="primary" onClick={reset}>
                        New Institute
                    </Button> */}
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
                                    onCurrentChange(1);
                                    return true;
                                }}
                            >
                                <div style={contentStyle}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="instituteName"
                                                label="Institute Name"
                                                rules={[{ required: true, message: 'Please enter Institute Name' }]}
                                            >
                                                <Input placeholder="Please enter Institute Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="instituteCode"
                                                label="Institute Code"
                                                rules={[{ required: true, message: 'Please enter Institute Code' }]}
                                            >
                                                <Input placeholder="Please enter Institute Code" />
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
                                                <Input maxLength={11} placeholder="Please enter mobileNo" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="PhoneNo"
                                                label="PhoneNo"
                                                rules={[{ required: true, message: 'Please enter PhoneNo ' }]}
                                            >
                                                <Input maxLength={11} placeholder="Please enter mobileNo" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="emailID"
                                                label="Email"
                                                rules={[{ required: true, type: "email", message: 'Please enter Email' }]}
                                            >
                                                <Input maxLength={80} placeholder="Please enter Email" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="website"
                                                label="Website"
                                                rules={[{ required: true, type:"url", message: 'Please enter Website' }]}
                                            >
                                                <Input maxLength={30} placeholder="Please enter Website" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="estdDate"
                                                label="Established Date"
                                                rules={[{ required: true, message: 'Please choose the Established Date' }]}
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
                                    onCurrentChange(1);
                                    return true;
                                }}
                            >
                                <div style={contentStyle}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="noOfFaculty"
                                                label="No Of Faculties"
                                                rules={[{ required: true,  message: 'Please enter Number of Faculties' }]}
                                            >   
                                                <Input type='number' placeholder="Please enter Institute Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="noOfStudent"
                                                label="No Of Students"
                                                rules={[{ required: false,  message: 'Please enter Number of Student' }]}
                                            >
                                                <Input type='number' placeholder="Please enter Institute Code" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8}>
                                            <Form.Item
                                                name="overAllRanking"
                                                label="OverAllRanking"
                                                rules={[{ required: false, message: 'Please enter Mobile No' }]}
                                            >
                                                <Input type='number' maxLength={11} placeholder="Please enter mobileNo" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="latitude"
                                            rules={[{ required: false, type:"float" }]}>
                                                {latitude &&
                                                    <Input onChange={(e) => { setLatitude(e.target.value); valid(e.target.value) }}
                                                        defaultValue={latitude} />}
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="longitude">
                                                {<Input onChange={(e) => { setLongitude(e.target.value) }} defaultValue={longitude?longitude:""} />}

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
                                                name="stateID"
                                                label="State"
                                                rules={[{ required: true, message: 'Please choose the State' }]}
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
                                                name="districtID"
                                                label="District"

                                                rules={[{ required: true, message: 'Please choose the District' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="District"
                                                    //autoComplete="new-state"
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
                                                name="landmark"
                                                label="Landmark"
                                                rules={[{ required: false, message: 'Please enter Landmark' }]}
                                            >
                                                <Input placeholder="Please enter Landmark" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="campusArea"
                                                label="Campus Area"
                                                rules={[{ required: false, message: 'Please enter Campus Area' }]}
                                            >
                                                <Input placeholder="Please enter Campus Area" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="instituteAddress"
                                                label="Institute Address"
                                                rules={[{ required: true, message: 'Please enter Institute Address' }]}
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

export default AddInstitute;