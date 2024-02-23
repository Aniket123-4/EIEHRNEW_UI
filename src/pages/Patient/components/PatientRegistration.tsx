import type { ProFormInstance } from '@ant-design/pro-components';
import {
    PageContainer,
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Divider, Checkbox, Typography, Tabs, Upload, Table, Popconfirm, CollapseProps } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestAddOnlinePatDoc, requestFileUpload, requestGetPatientSearch, requestPatientRegistration } from '../services/api';
import { requestGetBloodGroup, requestGetCivilStatus, requestGetCountry, requestGetDistrict, requestGetDocType, requestGetGender, requestGetRelation, requestGetReligion, requestGetState } from '@/services/apiRequest/dropdowns';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ColumnsType } from 'antd/es/table';

const { Search } = Input;
interface DataType {
    col1: string
    col2: string,
    col3: string
    col4: string
    col5: string
    col6: string
    col7: string
    col8: string
    col9: string
    col10: string,
    col11: string,
    col12: string,
    col13: string,
    col14: string,
    col15: string
}
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const PatientRegistration = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<any>([{ value: '1', label: "Uttar Pradesh" }])
    const [district, setDistrict] = useState<any>([{ value: '1', label: "Kanpur" }])
    const [country, setCountry] = useState<any>([{ value: '1', label: "India" }])
    const [nationality, setNationality] = useState<any>([{ value: '1', label: "Indian" }])
    const [gender, setGender] = useState<any>([])
    const [civilStatus, setCivilStatus] = useState<any>([{ value: '1', label: "Married" }])
    const [bloodGroup, setBloodGroup] = useState<any>([{ value: '1', label: "O+" }])
    const [religion, setReligion] = useState<any>([{ value: '1', label: "Hindu" }])
    const [relation, setRelation] = useState<any>([{ value: '1', label: "Father" }])
    const [docType, setDocType] = useState<any>([{ value: '1', label: "Aadhaar" }])
    const [selectedDoc, setSelectedDoc] = useState<any>()
    const [family, setFamily] = useState<any>([])
    const [emergency, setEmergency] = useState<any>([])
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [lstType_Patient, setLstType_Patient] = useState([]);
    const [istType_Pat, setIstType_Pat] = useState([]);
    const [patientNo, setPatientNo] = useState("");
    const [docName, setDocName] = useState<any>("");
    const user = JSON.parse(localStorage.getItem("user") as string);
    const [patientDocUpload, setPatientDocUpload] = useState<any>();
    const [patient, setPatientDetails] = useState([]);




    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        // marginTop: 60,
        height: 350,
    };

    useEffect(() => {
        getGender();
        getCivilStatus();
        getBloodGroup();
        getState();
        getDistrict();
        getCountry();
        getReligion();
        getRelation();
        getDocType();
        getFamilyGrid()
        let customDate = moment().format("YYYY-MM-DD");
        // console.log(moment() && moment() > moment(customDate, "YYYY-MM-DD"))
    }, [])

    useEffect(() => {

    }, [lstType_Patient])

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
    const onDocTypeSelect =  (v:any) => {
        setSelectedDoc(v)
    };
    const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };
    const getByteArray = async (img: RcFile, callback: (url: string) => void) => {
        const reader1 = new FileReader();
        reader1.addEventListener('load', () => callback(reader1.result as string));
        reader1.readAsArrayBuffer(img)
    };
    const getFile = (e: any) => {
        if (e.file.status === 'uploading') {
            console.log('Upload event:', e.file.status);
            return "";
        }
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.file.originFileObj;
    };

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // requestForValidateOTP(values);
    };
    const getPatientSearch = async (v: any) => {
        setLoading(true);
        const params = {
            patientNo: v.patientNo,
            patientUIDNo: '',
            ageGreater: 0,
            genderID: -1,
            civilStatusID: -1,
            bloodGroupID: -1,
            nationalityID: -1,
            serviceTypeID: -1,
            patientName: '',
            patientMobileNo: '',
            patientPhoneNo: '',
            patientDOB: '1900-01-01',
            fromDate: '1900-01-21',
            toDate: '2023-12-21',
            isDeleted: false,
            userID: -1,
            formID: -1,
            type: 2,
            patientID: -1,
        }
        const response = await requestGetPatientSearch({ ...params });
        setPatientDetails(response?.result)
        setLoading(false)
        // setPatientDoc(response?.result2[0])
        // setPatientDocs(response?.result1[0])

        if (response?.isSuccess&& response?.result.length>0) {
            const patientData = response?.result[0]
            const patientData1 = response?.result1[0]
            const patientDoc = response?.result2[0]
            // const familyData = response?.result3[0]
            // const familyData1 = response?.result4[0]

            const dataMaskForFamily = response?.result3?.map((item: any, index: number) => {
                return {
                    "col1": item.relationID,
                    "col2": item.contactSerialNo,
                    "col3": item.contactName,
                    "col4": item.contactMobileNoCC,
                    "col5": item.contactMobileNo,
                    "col6": item.contactPhoneCC,
                    "col7": "",
                    "col8": item.contactPhoneNo,
                    "col9": item.bGroupID,
                    "col10": "",
                    "col11": "",
                    "col12": "",
                    "col13": "",
                    "col14": "",
                    "col15": "",
                    ind: index + 1
                };
            })
            const family = dataMaskForFamily.filter((item) => item.col3 !== "");
            setLstType_Patient(family);
            const dataMaskForDropdown = response?.result4?.map((item: any, index: number) => {
                return {
                    "col1": item.relationID,
                    "col2": item.contactSerialNo,
                    "col3": item.contactName,
                    "col4": item.contactMobileNoCC,
                    "col5": item.contactMobileNo,
                    "col6": item.contactPhoneCC,
                    "col7": "",
                    "col8": item.contactPhoneNo,
                    "col9": item.bGroupID,
                    "col10": "",
                    "col11": "",
                    "col12": "",
                    "col13": "",
                    "col14": "",
                    "col15": "",
                    ind: index
                };
            })
            const newData = dataMaskForDropdown.filter((item) => item.col3 !== "");
            setIstType_Pat(newData);

            form.setFieldsValue(
                {
                    "fName": patientData?.fName,
                    "mName": patientData?.mName,
                    "lName": patientData?.lName,
                    "fatherName": patientData?.fatherName,
                    "fNameML": patientData?.fNameML,
                    "mNameML": patientData?.mNameML,
                    "lNameML": patientData?.lNameML,
                    "fatherNameML": patientData?.fatherNameML,
                    "motherNameML": patientData?.motherNameML,
                    "motherName": patientData?.motherName,
                    "eMail": patientData1?.eMail,
                    "alternateEmail": patientData1?.alternateEmail,
                    "dob": dayjs(patientData?.dob),
                    "genderID": patientData?.genderID,
                    "civilStatusID": patientData?.civilStatusID,
                    "bGroupID": patientData?.bGroupID,
                    "religionID": patientData?.religionID,
                    "nationalityID": patientData?.nationalityID,
                    "birthPlace": patientData?.birthPlace,
                    "curHouseNo": patientData1?.curHouseNo,
                    "curAddress": patientData1?.curAddress,
                    "curPinCode": patientData1?.curPinCode,
                    "curStateID": patientData1?.curStateID,
                    "curDistrictID": patientData1?.curDistrictID,
                    "curCountryID": patientData1?.curCountryID,
                    "curMobileNoCC": patientData1?.curMobileNoCC,
                    "curMobileNo": patientData1?.curMobileNo,
                    "curPhoneCC": patientData1?.curPhoneCC,
                    "curPhoneNo": patientData1?.curPhoneNo,

                    "perHouseNo": patientData1?.perHouseNo,
                    "perAddress": patientData1?.perAddress,
                    "perPinCode": patientData1?.perPinCode,
                    "perStateID": patientData1?.perStateID,
                    "perDistrictID": patientData1?.perDistrictID,
                    "perCountryID": patientData1?.perCountryID,
                    "perMobileNoCC": patientData1?.perMobileNoCC,
                    "perMobileNo": patientData1?.perMobileNo,
                    "perPhoneCC": patientData1?.perPhoneCC,
                    "perPhoneNo": patientData1?.perPhoneNo,

                    //"uidDocName": patientData1?.uidDocName,
                    "passIssueDate": dayjs(patientData1.passportIssueDate),
                    "passIssuePlace": patientData1?.passportIssuePlace,
                    "photo": patientDoc?.photo ? `data:image/png;base64,${patientDoc?.photo}` : "",
                    "signature": patientDoc?.signature ? `data:image/png;base64,${patientDoc?.signature}` : "",
                    "isVIP": true,
                    // "patientID": -1,
                    // "patientNo": patientData?.patientNo,
                    //"uidDocExt": "",
                    "uidDocPath": "",
                    // "uidDocID": 1,
                    "vUniqueID": patientData.vUniqueID,
                    "vUniqueName": patientData.vUniqueName,

                });
        }
        else {
            message.error("Patient Not Found For Given Patient No ")
        }
    }
    const getGender = async () => {
        const res = await requestGetGender();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setGender(dataMaskForDropdown)
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
            const dataMaskForCountry = res?.map((item: any) => {
                return { value: item.countryID, label: item.countryName }
            })
            dataMaskForCountry.unshift({ value: "-1", label: "Select" });
            setCountry(dataMaskForCountry)
        }
    }
    const saveFileSelected = (e) => {
        //in case you wan to print the file selected
        console.log(e.target.files[0]);
        // setFile(e.target.files[0]);
    };

    const onUpload = (info: any) => {
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as RcFile, async (url) => {
                // console.log(url, info.file.name)
                setDocName(info.file.name)

                addPatientDoc({ docBase64: url, docName: info.file.name })

                // const param = {
                //     "fileName": info.file.name,
                //     "data": url
                // }
                // const res = await requestFileUpload(param);
                // if (res.isSuccess == true)
                //     {
                //         message.success(`${res.msg}`);
                //     }
                // else
                //     message.error(`Some Error Occurred`);
            })
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }

    }

    const addPatientDoc = async (values: any) => {
        var re = /(?:\.([^.]+))?$/;
        var ext = re?.exec(values.docName)[1];
        console.log(values)

        const params = {
            "onlinePatientID": user?.verifiedUser?.userID,
            "slNo": 1,
            "docName": values.docName,
            "docExt": ext,
            "docPath": "",
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestAddOnlinePatDoc(params);

        // console.log(res.result['0'].docID);

        if (res?.isSuccess == true) {
            const param1 = {
                "fileName": res?.result['0']?.docID,
                "data": values.docBase64
            }
            const res1 = await requestFileUpload(param1);

            if (res1.isSuccess == true)
                setPatientDocUpload({
                    "uidDocID": res?.result['0']?.docID.split('_')[1],
                    "uidDocExt": ext,
                    "uidDocName": values.docName,
                })
            else
                message.error(res1.msg)
        }
    }

    const getFamilyGrid = async () => {
        const params = {
            "patientNo": "",
            "patientUIDNo": "",
            "ageGreater": 0,
            "genderID": -1,
            "civilStatusID": -1,
            "bloodGroupID": -1,
            "nationalityID": -1,
            "serviceTypeID": -1,
            "patientName": "",
            "patientMobileNo": "",
            "patientPhoneNo": "",
            "patientDOB": "1900-01-01",
            "fromDate": "1900-01-21",
            "toDate": "2023-12-21",
            "isDeleted": false,
            "userID": -1,
            "formID": -1,
            "type": 2,
            "patientID": -1
        }
        const res = await requestGetPatientSearch(params);

        const dataMask: [] = res?.result3?.map((item: any, index: number) => {
            return {
                col1: "",
                col2: item?.contactSerialNo,
                col3: "",
                col4: "",
                col5: "",
                col6: "",
                col7: "",
                col8: "",
                col9: "",
                col10: "",
                col11: "",
                col12: "",
                col13: "",
                col14: "",
                col15: "",
                // name: `${index}`
            }
        })
        //setLstType_Patient([dataMask[0]])
        setEmergency(res.result3);
        // setLstType_Patient(res.result4)
    }

    const getCivilStatus = async () => {
        const param = { "civilStatusID": "-1", "type": 1 }
        const res = await requestGetCivilStatus(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.civilStatusID, label: item.civilStatusName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setCivilStatus(dataMaskForDropdown)
        }
    }
    const getBloodGroup = async () => {
        const param = { "bGroupID": -1, "type": 1 }
        const res = await requestGetBloodGroup(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.bGroupID, label: item.bGroupName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setBloodGroup(dataMaskForDropdown)
        }
    }
    const getReligion = async () => {
        const param = { "religionID": "-1", "type": 1 }
        const res = await requestGetReligion(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.religionID, label: item.religionName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setReligion(dataMaskForDropdown)
        }
    }
    const getRelation = async () => {
        const param = { "relationID": "-1", "type": 1 }
        const res = await requestGetRelation(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.relationID, label: item.relationName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setRelation(dataMaskForDropdown)
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
    const getDistrict = async (stateId: any = 1) => {
        const res = await requestGetDistrict({ value: stateId });
        console.log(res);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.districtID, label: item.districtName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setDistrict(dataMaskForDropdown)
        }
    }
    const getState = async () => {
        const res = await requestGetState();
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.stateID, label: item.stateName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setState(dataMaskForDropdown)
        }
        form.setFieldsValue(
            {
                "mName": "",
                "fNameML": "",
                "mNameML": "",
                "lNameML": "",
                "fatherNameML": "",
                "motherNameML": "",
                "alternateEmail": "",

                "curHouseNo": "0",
                "curAddress": "",
                "curPinCode": "",
                "curStateID": "-1",
                "curDistrictID": "-1",
                "curCountryID": "-1",
                "curPhoneCC": "",
                "curPhoneNo": "",
                "perHouseNo": "0",
                "perAddress": "",
                "perPinCode": "",
                "perStateID": "-1",
                "perDistrictID": "-1",
                "perCountryID": "-1",
                "perMobileNoCC": "",
                "perMobileNo": "",
                "perPhoneCC": "",
                "perPhoneNo": "",
                //"uidDocName": "",
                "passIssueDate": dayjs(),
                "passIssuePlace": "",
                "vUniqueID": "-1",
                "bGroupID": "-1",
                "civilStatusID": "-1",
                "genderID": "-1",
                "nationalityID": "-1",
                "religionID": "-1",
            });
    }
    const addPatientReg = async (values: any) => {
        values['dob'] = convertDate(values.dob);
        values['isVIP'] = values.isVIP ? values.isVIP : false;
        values['passIssueDate'] =values.passIssueDate? convertDate(values.passIssueDate) : '1900-01-01';
        values['signature'] = values?.signature ? values.signature : '';
        values['photo'] = values?.photo ? values.photo : '';
        values['mName'] = values?.mName ? values.mName : ' ';
        values['vUniqueID'] = values?.vUniqueID ? values.vUniqueID : -1;
        values['uidDocName'] = patientDocUpload?.uidDocName ? patientDocUpload.uidDocName : "";
        values['uidDocExt'] = patientDocUpload?.uidDocExt ? patientDocUpload.uidDocExt : "";
        values['uidDocID'] = patientDocUpload?.uidDocID ? patientDocUpload.uidDocID : 0;
        values['civilStatusID'] = values?.civilStatusID ? values.civilStatusID : ' ';


        try {
            const staticParams = {
                // "fName": "",
                "fNameML": "",
                // "mName": "",
                "mNameML": "",
                // "lName": "string",
                "lNameML": "",
                // "genderID": 0,
                // "fatherName": "string",
                "fatherNameML": "",
                // "motherName": "string",
                "motherNameML": "",
                // "dob": "2023-12-04T05:39:01.048Z",
                "birthPlace": "",
                // "civilStatusID": 0,  
                // "bGroupID": 0, 
                // "religionID": 0,  
                // "nationalityID": 0,  
                // "curHouseNo": "string",
                // "curAddress": "string",
                // "curPinCode": "string",
                // "curStateID": 0,  
                // "curDistrictID": 0,  
                // "curCountryID": 0,  
                // "curMobileNoCC": "string",
                // "curMobileNo": "string",
                // "curPhoneCC": "string",
                "curPhoneAC": "0",
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
                "perPhoneAC": "0",
                // "perPhoneNo": "string",

                // "lstType_Patient": [
                //     {//RelationID,ContactSerialNo,ContactName,ContactMobileNoCC,ContactMobileNo,
                //         //ContactPhoneCC,ContactPhoneAC,ContactPhoneNo,BloodGroup,'','','','','','' 
                //         "col1": values.Fcol1 ? values.Fcol1 : "",
                //         "col2": values.Fcol2 ? values.Fcol2 : "1",
                //         "col3": values.Fcol3 ? values.Fcol3 : "",
                //         "col4": values.Fcol4 ? values.Fcol4 : "",
                //         "col5": values.Fcol5 ? values.Fcol5 : "",
                //         "col6": values.Fcol6 ? values.Fcol6 : "",
                //         "col7": values.Fcol7 ? values.Fcol7 : "",
                //         "col8": values.Fcol8 ? values.Fcol8 : "",
                //         "col9": values.Fcol9 ? values.Fcol9 : "",
                //         "col10": "",
                //         "col11": "",
                //         "col12": "",
                //         "col13": "",
                //         "col14": "",
                //         "col15": ""
                //     }
                // ],
                "lstType_Patient": lstType_Patient,
                "istType_Pat": istType_Pat,
                // "photo": "",
                // "signature": "",
                // "isVIP": false,
                // "passIssueDate": "2023-12-04T05:39:01.048Z",
                // "passIssuePlace": "",

                "uidDocName": "",
                "uidDocExt": "",
                "uidDocPath": "",
                //"uidDocID": 0,

                // "vUniqueID": 0,
                // "vUniqueName": 0,
                "patientID": patient[0]?.patientID ? patient[0]?.patientID : -1,
                "patientNo": patient[0]?.patientNo ? patient[0]?.patientNo : "",
                // "patientID": -1,
                // "patientNo": "",
                "userID": -1,
                "formID": -1,
                "type": 1
            };
            setLoading(true)
            const msg = await requestPatientRegistration({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                setIstType_Pat([])
                setLstType_Patient([])
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

    const columns: ColumnsType<DataType> = [
        {
            title: 'SrNo.',
            dataIndex: 'col2',
            key: 'col2',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Contact Name',
            dataIndex: 'col3',
            key: 'col3',
        },
        {
            title: 'Relation',
            dataIndex: 'col1',
            key: 'col1',
            render: (v) =>
                <Select
                    size='small'
                    disabled={true}
                    defaultValue={v}
                    options={relation}
                />,
        },
        {
            title: 'Mobile Number',
            key: 'col5',
            dataIndex: 'col5',
        },
        {
            title: 'Blood Group',
            key: 'col9',
            dataIndex: 'col9',
            render: (v) =>
                <Select
                    size='small'
                    disabled={true}
                    defaultValue={v}
                    options={bloodGroup}
                />,
        },
        {
            title: 'Phone Number',
            key: 'col8',
            dataIndex: 'col8',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: { key: React.Key }) =>
                lstType_Patient.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.col2, 1)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const column1: ColumnsType<DataType> = [
        {
            title: 'SrNo.',
            dataIndex: 'col2',
            key: 'col2',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Contact Name',
            dataIndex: 'col3',
            key: 'col3',
        },
        {
            title: 'Relation',
            dataIndex: 'col1',
            key: 'col1',
            render: (v) =>
                <Select
                    size='small'
                    disabled={true}
                    defaultValue={v}
                    options={relation}
                />,
        },
        {
            title: 'Mobile Number',
            key: 'col5',
            dataIndex: 'col5',
        },
        {
            title: 'Blood Group',
            key: 'col9',
            dataIndex: 'col9',
            render: (v) =>
                <Select
                    size='small'
                    disabled={true}
                    defaultValue={v}
                    options={bloodGroup}
                />,
        },
        {
            title: 'Phone Number',
            key: 'col8',
            dataIndex: 'col8',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: { key: React.Key }) =>
                istType_Pat.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.col2, 2)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleDelete = (key: any, type: number) => {
        if (type == 1) {
            const newData = lstType_Patient.filter((item) => item.col2 !== key);
            setLstType_Patient(newData);
        }
        if (type == 2) {
            const newData = istType_Pat.filter((item) => item.col2 !== key);
            setIstType_Pat(newData);
        }
    };

    const formList = () => {
        const addFamilyItem = () => {
            let flag = 0;
            const values = form1.getFieldsValue()
            const family = {
                "col1": values.col1 ? values.col1 : "",
                "col2": (lstType_Patient.length + 1).toString(),
                "col3": values.col3 ? values.col3 : "",
                "col4": values.col4 ? values.col4 : "",
                "col5": values.col5 ? values.col5 : "",
                "col6": values.col6 ? values.col6 : "",
                "col7": values.col7 ? values.col7 : "",
                "col8": values.col8 ? values.col8 : "",
                "col9": values.col9 ? values.col9 : "",
                "col10": "",
                "col11": "",
                "col12": "",
                "col13": "",
                "col14": "",
                "col15": ""
            }
            const error = form1.getFieldsError()
            error.map((item, index) => {
                if (item.errors.length > 0 || (values.col3 == "" && index == 0)) {
                    flag = 1
                    message.error(`Please check the error`);
                }
                else
                    if (flag == 0 && index == error.length - 1 && values.col3) {
                        setLstType_Patient([...lstType_Patient, family])
                        form1.resetFields()
                    }
            })
        }
        return (
            <>
                <Form
                    form={form1}
                >
                    <Row style={{ height: 120 }} gutter={16}>
                        {/* <Col span={6}>
                            <Form.Item
                                name={'col2'}
                                label="ContactSerialNo"
                                rules={[
                                    { required: true, message: 'Please Enter The ContactSerialNo' },
                                    {
                                        pattern: /^[1-3\b]+$/,
                                        message: 'Please Enter a SerialNo between 1-3',
                                    }
                                ]}
                            >
                                <Input maxLength={1} placeholder="Please Enter The ContactSerialNo" />
                            </Form.Item>
                        </Col> */}
                        <Col span={5}>
                            <Form.Item
                                name={'col3'}
                                label="Contact Name"
                                rules={[{ required: false, message: 'Please Enter Contact Name' },
                                {validator:validateCharacters}]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Contact Name" />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                name={'col1'}
                                label="Relation"
                                rules={[{ required: false, message: 'Please Select The Relation with Patient' }]}
                            >
                                <Select
                                    placeholder="Please choose the Relation"
                                    options={relation}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Space.Compact>
                                <Form.Item
                                    style={{ width: '25%' }}
                                    initialValue={'+91'}
                                    name={'col4'}
                                    label="  CC"
                                    rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                >
                                    <Input maxLength={3} size={'middle'} placeholder="CC" />

                                </Form.Item>
                                <Form.Item
                                    style={{ width: '75%' }}
                                    name={'col5'}
                                    label="Mobile Number"
                                    rules={[
                                        { required: false, type: 'string', message: 'Please enter mobile number' },
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
                        <Col span={5}>
                            <Space.Compact>
                                <Form.Item
                                    style={{ width: '25%' }}
                                    name={'col6'}
                                    initialValue={'0512'}
                                    label="  CC"
                                    rules={[{ required: false, message: 'Please Enter Phone Number CC' }]}
                                >
                                    <Input size={'middle'} placeholder="CC" />

                                </Form.Item>
                                <Form.Item
                                    style={{ width: '75%' }}
                                    name={'col8'}
                                    label="Phone number"
                                    rules={[
                                        { required: false, type: 'string', message: 'Please Enter Phone No' },
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
                        <Col span={4}>
                            <Form.Item
                                name={'col9'}
                                label="BloodGroup"
                                rules={[{ required: false, message: 'Please Select BloodGroup' }]}
                            >
                                <Select
                                    placeholder="Please choose the BloodGroup"
                                    options={bloodGroup}
                                />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginTop: 30 }} span={5}>
                            <Button onClick={addFamilyItem} type="primary">
                                Add
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Table pagination={false} columns={columns} dataSource={lstType_Patient} />
            </>
        )
    }
    const formList1 = () => {
        const addFamilyItem = () => {
            let flag = 0;
            const values = form2.getFieldsValue()
            const family = {
                "col1": values.col1 ? values.col1 : "",
                "col2": (istType_Pat.length + 1).toString(),
                "col3": values.col3 ? values.col3 : "",
                "col4": values.col4 ? values.col4 : "",
                "col5": values.col5 ? values.col5 : "",
                "col6": values.col6 ? values.col6 : "",
                "col7": values.col7 ? values.col7 : "",
                "col8": values.col8 ? values.col8 : "",
                "col9": values.col9 ? values.col9 : "",
                "col10": "",
                "col11": "",
                "col12": "",
                "col13": "",
                "col14": "",
                "col15": ""
            }
            const error = form2.getFieldsError()
            error.map((item, index) => {
                if (item.errors.length > 0 || (values.col3 == "" && index == 0)) {
                    flag = 1
                    message.error(`Please check the error`);
                }
                else
                    if (flag == 0 && index == error.length - 1 && values.col3) {
                        setIstType_Pat([...istType_Pat, family])
                        form2.resetFields()
                    }
            })
        }
        return (
            <>
                <Form
                    form={form2}
                >
                    <Row style={{ height: 120 }} gutter={16}>
                        <Col span={5}>
                            <Form.Item
                                name={'col3'}
                                label="Contact Name"
                                rules={[{ required: false, message: 'Please Enter Contact Name' },
                                {validator:validateCharacters}]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Contact Name" />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                name={'col1'}
                                label="Relation"
                                rules={[{ required: false, message: 'Please Select The Relation with Patient' }]}
                            >
                                <Select
                                    placeholder="Please choose the Relation"
                                    options={relation}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Space.Compact>
                                <Form.Item
                                    style={{ width: '25%' }}
                                    initialValue={'+91'}
                                    name={'col4'}
                                    label="  CC"
                                    rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                >
                                    <Input maxLength={3} size={'middle'} placeholder="CC" />

                                </Form.Item>
                                <Form.Item
                                    style={{ width: '75%' }}
                                    name={'col5'}
                                    label="Mobile Number"
                                    rules={[
                                        { required: false, type: 'string', message: 'Please enter mobile number' },
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
                        <Col span={5}>
                            <Space.Compact>
                                <Form.Item
                                    style={{ width: '25%' }}
                                    name={'col6'}
                                    initialValue={'0512'}
                                    label="  CC"
                                    rules={[{ required: false, message: 'Please Enter Phone Number CC' }]}
                                >
                                    <Input size={'middle'} placeholder="CC" />

                                </Form.Item>
                                <Form.Item
                                    style={{ width: '75%' }}
                                    name={'col8'}
                                    label="Phone number"
                                    rules={[
                                        { required: false, type: 'string', message: 'Please Enter Phone No' },
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
                        <Col span={4}>
                            <Form.Item
                                name={'col9'}
                                label="BloodGroup"
                                rules={[{ required: false, message: 'Please Select BloodGroup' }]}
                            >
                                <Select
                                    placeholder="Please choose the BloodGroup"
                                    options={bloodGroup}
                                />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginTop: 30 }} span={5}>
                            <Button onClick={addFamilyItem} type="primary">
                                Add
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Table pagination={false} columns={column1} dataSource={istType_Pat} />
            </>
        )
    }

    const addPatientRegForm = () => {
                return (
            <PageContainer
                style={{ width: '100%' }}
            // title={'Patient Registration'}
            >
                <Card
                    title={
                        <Row align={'middle'}>
                            <Form
                            // onFinish={getPatientSearch}
                            >
                                <Form.Item
                                    style={{ paddingTop: 15 }}
                                    name={"patientNo"}
                                    label="Search by Patient No :"
                                    rules={[{ required: true, message: 'Please Enter Patient Number' }]}>
                                    {/* <Input style={{ width: 200, marginLeft: 10 }}></Input> */}
                                    <Search placeholder="Input Search Text"
                                        loading={loading}
                                        onSearch={(v)=>getPatientSearch({patientNo:v})} enterButton />
                                </Form.Item>
                            </Form>
                            {/* <Typography>Search by Patient No :</Typography>
                            <Button onClick={() => getPatientSearch()} type="link" shape="default" icon={<SearchOutlined />} /> */}
                        </Row>
                    }
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Form
                        layout={'vertical'}
                        form={form}
                        preserve={true}
                        scrollToFirstError={true}
                        onFinish={async (values) => {
                            addPatientReg(values)
                        }}
                    >
                        <Card title={<Typography style={{ color: 'white', fontSize: 18 }}>
                            {"Patient"}</Typography>} style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="fName"
                                        label="First Name"
                                        rules={[{ required: true, message: 'Please enter First Name' },
                                        {validator:validateCharacters}]}
                                    >
                                        <Input style={{ borderColor: 'blue' }} placeholder="Please enter First Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="mName"
                                        label="Middle Name"
                                        rules={[{ required: false, message: 'Please enter Middle Name' },
                                        {validator:validateCharacters}]}
                                    >
                                        <Input placeholder="Please enter Middle Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="lName"
                                        label="Last Name"
                                        rules={[{ required: true, message: 'Please enter Last Name' },
                                        {validator:validateCharacters}]}
                                    >
                                        <Input placeholder="Please enter Last Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="fatherName"
                                        label="Father Name"
                                        rules={[{ required: true, message: 'Please enter Father Name' },
                                        {validator:validateCharacters}]}
                                    >
                                        <Input placeholder="Please enter Father Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="motherName"
                                        label="Mother Name"
                                        rules={[{ required: false, message: 'Please enter Mother Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input placeholder="Please enter Mother Name" />
                                    </Form.Item>
                                </Col>
                                {/* <Col span={6}>
                                    <Form.Item
                                        name="fNameML"
                                        label="First Name In Other Language"
                                        rules={[{ required: false, message: 'Please enter First Name' }]}
                                    >
                                        <Input placeholder="Please enter First Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="mNameML"
                                        label="Middle Name In Other Language"
                                        rules={[{ required: false, message: 'Please enter Middle Name' },
                                    {validator:validateCharacters}]}
                                    >
                                        <Input placeholder="Please enter Middle Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="lNameML"
                                        label="Last Name In Other Language"
                                        rules={[{ required: false, message: 'Please enter Last Name' }]}
                                    >
                                        <Input placeholder="Please enter Last Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="fatherNameML"
                                        label="Father Name In Other Language"
                                        rules={[{ required: false, message: 'Please enter Father Name' }]}
                                    >
                                        <Input placeholder="Please enter Father Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="motherNameML"
                                        label="Mother Name In Other Language"
                                        rules={[{ required: false, message: 'Please enter Mother Name' }]}
                                    >
                                        <Input placeholder="Please enter Mother Name" />
                                    </Form.Item>
                                </Col> */}
                                <Col span={6}>
                                    <Form.Item
                                        name="genderID"
                                        label="Gender"
                                        rules={[{ required: true, message: 'Please choose the Gender' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the Gender"
                                            options={gender}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="civilStatusID"
                                        label="Marital Status"
                                        rules={[{ required: false, message: 'Please choose the Civil Status' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the Civil Status"
                                            options={civilStatus}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="dob"
                                        label="DOB"
                                        rules={[{ required: true, message: 'Please choose the DOB' }]}
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
                                        name="eMail"
                                        label="Email"
                                        rules={[{ required: false, type: 'email', message: 'Please enter Email' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter Email" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="alternateEmail"
                                        label="Alternate Email"
                                        rules={[{ required: false, type: 'email', message: 'Please enter an alternate Email' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter Alternate Email" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="bGroupID"
                                        label="Blood Group"
                                        rules={[{ required: true, message: 'Please Choose Blood Group' }]}
                                    >
                                        <Select
                                            placeholder="Please Choose Blood Group"
                                            options={bloodGroup}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="religionID"
                                        label="Religion"
                                        rules={[{ required: true, message: 'Please Choose Religion' }]}
                                    >
                                        <Select
                                            placeholder="Please Choose Religion"
                                            options={religion}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="nationalityID"
                                        label="Nationality"
                                        rules={[{ required: true, message: 'Please Choose Nationality' }]}
                                    >
                                        <Select
                                            placeholder="Please Choose Nationality"
                                            options={nationality}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="birthPlace"
                                        label="Birth Place"
                                        rules={[{ required: true, message: 'Please Enter The Birth Place' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Birth Place" />
                                    </Form.Item>
                                </Col>
                            </Row>
                                                    </Card>
                        <Divider orientation="left"><h4></h4></Divider>
                        <Card title={<Typography style={{ color: 'white', fontSize: 18 }}>
                            {"Current Address"}</Typography>}
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
                                        name="curvillage"
                                        label="Village"
                                        rules={[{ required: false, message: 'Please Enter The Village' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Village" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curtehsil"
                                        label="Tehsil"
                                        rules={[{ required: false, message: 'Please Enter The Tehsil' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Tehsil" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curPinCode"
                                        label="PinCode"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' },
                                        {
                                            pattern: /^[0-9\b]+$/,
                                            message: 'Please Enter a Valid Pincode',
                                        }]}
                                    >
                                        <Input maxLength={6} placeholder="Please Enter The PinCode" />
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
                                            <Input maxLength={3} size={'middle'} placeholder="CC" />

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
                                            <Input maxLength={4} size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '75%' }}
                                            name="curPhoneNo"
                                            label="Phone number"
                                            rules={[
                                                { required: false, type: 'string', message: 'Please Enter Phone No' },
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
                                {/* <Col span={6}>
                                    <Form.Item
                                        name="curPhoneAC"
                                        label="PhoneAC"
                                        rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter PhoneAC" />
                                    </Form.Item>
                                </Col> */}
                            </Row>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>
                        <Card title={<Space direction='horizontal'>
                            {<Typography style={{ color: 'white', fontSize: 18 }}>
                                {"Permanent Address"}</Typography>}
                            <Checkbox style={{ color: 'white', fontSize: 14 }} onChange={onChange}>Same as Current</Checkbox>
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
                                        name="curvillage"
                                        label="Village"
                                        rules={[{ required: false, message: 'Please Enter The Village' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Village" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curtehsil"
                                        label="Tehsil"
                                        rules={[{ required: false, message: 'Please Enter The Tehsil' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Tehsil" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perPinCode"
                                        label="PinCode"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' },
                                        {
                                            pattern: /^[0-9\b]+$/,
                                            message: 'Please Enter a Valid Pincode',
                                        }]}
                                    >
                                        <Input maxLength={6} placeholder="Please Enter The PinCode" />
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
                                                { required: false, type: 'string', message: 'Please enter mobile number' },
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
                                                { required: false, type: 'string', message: 'Please Enter Phone No' },
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
                                {/* <Col span={6}>
                                    <Form.Item
                                        name="perPhoneAC"
                                        label="PhoneAC"
                                        rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter PhoneAC" />
                                    </Form.Item>
                                </Col> */}
                            </Row>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>

                        <Card title={<Space direction='horizontal'>
                            <Typography style={{ color: 'white', fontSize: 18 }}>
                                {"Family Information"}</Typography>
                        </Space>
                        }
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            {formList()}
                            {/* lstType_Patient && lstType_Patient.length > 0 &&  */}
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>

                        <Card title={<Space direction='horizontal'>
                            <Typography style={{ color: 'white', fontSize: 18 }}>
                                {"Emergency Contact"}</Typography>
                        </Space>
                        }
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            {formList1()}
                            {/* <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="col3"
                                        label="ContactName"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The PinCode" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col1"
                                        label="Relation"
                                        rules={[{ required: false, message: 'Please Select The Relation with Patient' }]}
                                    >
                                        <Select
                                            placeholder="Please Choose The Relation"
                                            options={relation}
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
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '20%' }}
                                            initialValue={'+91'}
                                            name="col4"
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please Enter Mobile Number cc' }]}
                                        >
                                            <Input size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '80%' }}
                                            name="col5"
                                            label="Mobile number"
                                            rules={[
                                                { required: false, type: 'string', message: 'Please enter mobile number' },
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
                                                { required: false, type: 'string', message: 'Please Enter Phone No' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please Enter a Valid Phone Number',
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
                                        <Input maxLength={80} placeholder="Please Enter PhoneAC" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="col9"
                                        label="BloodGroup"
                                        rules={[{ required: false, message: 'Please Enter BloodGroup' }]}
                                    >
                                        <Select
                                            placeholder="Please Choose The BloodGroup"
                                            options={bloodGroup}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row> */}
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>
                        <Card title={<Space direction='horizontal'>
                            <Typography style={{ color: 'white', fontSize: 18 }}>
                                {"Documents"}</Typography>
                        </Space>
                        }
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="vUniqueID"
                                        label="Document Type"
                                        rules={[{ required: true, message: 'Please Select The DocType' }]}
                                    >
                                        <Select
                                            onSelect={onDocTypeSelect}
                                            placeholder="Please Choose The DocName"
                                            options={docType}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item

                                        name="vUniqueName"
                                        label="Document Number"
                                        rules={[
                                            { required: true, message: 'Please Enter Doc Number' },
                                            {
                                                pattern: /^[0-9\b]+$/,
                                                message: 'Please Enter a Valid Doc Number',
                                            }
                                        ]}
                                    >
                                        <Input disabled={selectedDoc==undefined || selectedDoc==-1} maxLength={16} placeholder="Please Enter The Doc Number" />
                                    </Form.Item>
                                </Col>
                                { <><Col span={6}>
                                    <Form.Item
                                        name="passIssueDate"
                                        label="Issue Date"
                                        rules={[{ required: false, message: 'Please Choose The Issue Date' }]}
                                    >
                                        {/* <Input maxLength={80} placeholder="Please Choose The PassPort Issue Date" /> */}
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format={'DD-MMM-YYYY'}
                                            getPopupContainer={(trigger) => trigger.parentElement!}
                                        />
                                    </Form.Item>
                                </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            name="passIssuePlace"
                                            label="Document Issue Place"
                                            rules={[{ required: false, message: 'Please Enter The Doc Issue Place' }]}
                                        >
                                            <Input maxLength={80} placeholder="Please Enter The Doc Issue Place" />
                                        </Form.Item>
                                    </Col>
                                </>}
                            </Row>
                            <Col span={6}>
                                <Upload
                                    onChange={onUpload}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                            <Divider></Divider>
                            <Col span={6}>
                                <Form.Item
                                    name="photo"
                                    getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                                        form.setFieldsValue({ photo: url })
                                    })}
                                    label="Photo"
                                    rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                >
                                    <Upload
                                        className="avatar-uploader"
                                        // showUploadList={false}
                                        maxCount={1}
                                        listType="picture-circle"
                                    // defaultFileList={[...fileList]}
                                    // beforeUpload={beforeUpload}
                                    // onPreview={onPreview}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="signature"
                                    getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                                        form.setFieldsValue({ signature: url })
                                    })}
                                    label="Signature"
                                    rules={[{ required: false, message: 'Please Choose Signature Pic' }]}
                                >
                                    <Upload

                                        // showUploadList={false}
                                        // beforeUpload={beforeUpload}
                                        // onChange={(info) => handleChange(info, item)}
                                        // onPreview={onPreview}
                                        className="avatar-uploader"
                                        maxCount={1}
                                        listType="picture-card"
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </Form.Item>

                            </Col>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>

                        <Form.Item
                            name="isVIP"
                            valuePropName="checked"
                            label=""
                        >
                            <Checkbox>isVIP</Checkbox>

                        </Form.Item>
                        <Row style={{ marginTop: 30 }} justify="center" align="middle">
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