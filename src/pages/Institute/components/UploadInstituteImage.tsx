import type { ProFormInstance } from '@ant-design/pro-components';
import {
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Upload } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { requestAddInstitute, requestAddInstituteImage } from '../services/api';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetBranch, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';
import { getUserInLocalStorage } from '@/utils/common';
import { UploadOutlined } from '@ant-design/icons';


const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const UploadInstituteImage = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
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



    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }
    const convertImage = (inputImageData: any,index:number) => {
        console.log(inputImageData)
        // return inputImageData[index].thumbUrl
    }


    const addInstituteImage = async (values: any,index:string) => {
        try {
            // values['instituteImage'] = convertImage(values['instituteImage'],index);

            console.log({values:index})
            const staticParams = {
                "instituteID": selectedRows?.instituteID,
                "slNo": `${index}`,
                // "instituteImage": values?.instituteImage,
                "userID": "-1",
                "formID": "-1",
                "type": "1"
            };

            setLoading(true)
            const msg = await requestAddInstituteImage({ ...values, ...staticParams });
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
    const onFinish = (values:any) => {
        console.log({values:values})
        for(let i=0; i<values.instituteImage.length;i++)
        addInstituteImage({instituteImage:values?.instituteImage[i].thumbUrl},i)
        // console.log(values.instituteImage[i].thumbUrl)
    }

    const closeDrawer = () => {
        onClose();
    }
    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };


    return (
        <>
            <Drawer
                title={`${isEditable ? `Edit ${selectedRows?.firstName}` : "Upload Institute Image"}`}
                width={1000}
                onClose={closeDrawer}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}
            // extra={<Space align="baseline">
            //     <Button type="primary" onClick={reset}>
            //         New Institute
            //     </Button>
            // </Space>}
            >

                <>
                    <Spin tip="Please wait..." spinning={loading}>
                        <Form
                            form={form}
                            name="control-hooks"
                            onFinish={onFinish}
                            layout="vertical"
                            style={{}}
                        >
                            <Space size={'middle'}>
                                <Form.Item
                                    name="instituteImage"
                                    label="Upload"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    extra=""
                                >
                                    <Upload name="logo" action="/upload.do" listType="picture">
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    </Upload>
                                </Form.Item>
                                <Button type="primary" key="console" htmlType='submit'>
                                    Save
                                </Button>

                            </Space>
                        </Form>
                    </Spin>

                </>

            </Drawer>
        </>
    );
};

export default UploadInstituteImage;