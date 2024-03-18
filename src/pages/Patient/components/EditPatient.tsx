import type { ProFormInstance } from '@ant-design/pro-components';
import {
    PageContainer,
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Image, theme, Spin, InputNumber, Card, Divider, Checkbox, Typography, Tabs, Upload, Avatar, Table, Popconfirm } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useParams } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestAddOnlinePatDoc, requestFileUpload, requestGetPatientSearch, requestPatientRegistration } from '../services/api';
import { requestGetBloodGroup, requestGetCivilStatus, requestGetCountry, requestGetDistrict, requestGetDocType, requestGetGender, requestGetRelation, requestGetReligion, requestGetState } from '@/services/apiRequest/dropdowns';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ColumnsType } from 'antd/es/table';
import { requestGetDocuments } from '@/pages/Candidate/services/api';

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
const inputStyle = { borderColor: 'blue', color: 'black' };

const EditPatient = ({ visible, isEditable, }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [isFormDisable, setIsFormDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [patientId, setPatientId] = useState<any>();
    const [state, setState] = useState<any>([{ value: '1', label: "Uttar Pradesh" }])
    const [district, setDistrict] = useState<any>([{ value: '1', label: "Kanpur" }])
    const [country, setCountry] = useState<any>([{ value: '1', label: "India" }])
    const [nationality, setNationality] = useState<any>([{ value: '1', label: "Indian" }])
    const [gender, setGender] = useState<any>([])
    const [civilStatus, setCivilStatus] = useState<any>([{ value: '1', label: "Married" }])
    const [bloodGroup, setBloodGroup] = useState<any>([{ value: '1', label: "O+" }])
    const [religion, setReligion] = useState<any>([{ value: '1', label: "Hindu" }])
    const [relation, setRelation] = useState<any>([{ value: '1', label: "Father" }])
    const [lstType_Patient, setLstType_Patient] = useState([]);
    const [patient, setPatientDetails] = useState([]);
    const [patientDoc, setPatientDoc] = useState<any>('');
    const [patientDocs, setPatientDocs] = useState<any>('');
    const [patientDocUpload, setPatientDocUpload] = useState<any>();
    const [istType_Pat, setIstType_Pat] = useState([]);
    const [fileList, setFileList] = useState<UploadFile[]>([
    ]);
    const [docType, setDocType] = useState<any>([{ value: '1', label: "Aadhaar" }])
    const user = JSON.parse(localStorage.getItem("user") as string);



    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Image must smaller than 10MB!');
        }
        return isJpgOrPng && isLt2M;
    };


    const contentStyle: React.CSSProperties = {
        // lineHeight: '260px',
        // textAlign: 'center',

        color: 'black',
        textShadow: 'red',

        // marginTop: 60,
        // height: 350,
    };

    useEffect(() => {
        getGender()
        getCivilStatus()
        getBloodGroup()
        getState()
        getDistrict()
        getReligion()
        getRelation()
        getCountry()
        getDocType();
        let customDate = moment().format("YYYY-MM-DD");
        console.log(moment() && moment() > moment(customDate, "YYYY-MM-DD"))

    }, [])

    useEffect(() => {
        const patientID = history.location.pathname.split('/')[3];
        setPatientId(patientID)
        if (history.location.search === "?true")
            setIsFormDisable(true)
        console.log(history.location.search);
        getPatientDetails(patientID)
    }, [])

    const getPatientDetails = async (patientID: any = "") => {

        const params = {
            patientNo: '',
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
            fromDate: '1900-01-01',
            toDate: dayjs(),
        }
        try {
            setLoading(true)
            const staticParams = {
                isDeleted: false,
                userID: -1,
                formID: -1,
                type: 2,
                patientID: patientID,
            }
            const response = await requestGetPatientSearch({ ...params, ...staticParams });
            setLoading(false)
            setPatientDetails(response?.result)
            setPatientDoc(response?.result2[0])
            setPatientDocs(response?.result1[0])

            if (response?.isSuccess) {
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
                        "curTehsilName": patientData1?.curTehsilName,
                        "perTehsilName": patientData1?.perTehsilName,
                        "perVillageName": patientData1?.perVillageName,
                        "curVillageName": patientData1?.curVillageName,

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
            } else {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const downloadDoc = async (item: any) => {
        const params = {
            fileName: user?.verifiedUser?.userID + "_" + patientDocs.uidDocID,
            filePath: ""
        }
        const res1 = await requestGetDocuments(params);
        //window.location.href = `data:application/octet-stream;base64,${res1.result}`;
        if (res1.isSuccess == true) {
            fetch(window.location.href)
                .then(resp => resp.blob())
                .then(blob => {
                    const url = `data:application/octet-stream;base64,${res1.result}`;
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = prompt("Enter filename and extension (e.g. myImage.jpg):", window.location.href.split('\/').pop() === "" ? window.location.hostname + ".html" : item.docName);
                    document.body.appendChild(a);
                    if (a.download !== "null") {
                        a.click();
                        alert('Your file ' + a.download + ' has downloaded!');
                    }
                    window.URL.revokeObjectURL(url);
                })
                .catch(() => alert('Could not download file.'));
        }
        else {
            message.error("File Not Found")
        }
        // window.location.href = file;
        //console.log(res1)
    }
    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }
    const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

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
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setGender(dataMaskForDropdown)
        }
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
    const getState = async () => {
        const res = await requestGetState();
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.stateID, label: item.stateName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setState(dataMaskForDropdown)
        }
    }
    const getDistrict = async (stateId: any = 1) => {
        const res = await requestGetDistrict({ value: stateId });
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.districtID, label: item.districtName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setDistrict(dataMaskForDropdown)
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
    const onUpload = (info: any) => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as RcFile, async (url) => {
                // console.log(url, info.file.name)
                addPatientDoc({ docBase64: url, docName: info.file.name })
                // const param = {
                //     "fileName": info.file.name,
                //     "data": url
                // }
                // const res = await requestFileUpload(param);
                // if (res.isSuccess == true)
                //     message.success(`${res.msg}`);
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
    const addPatientReg = async (values: any) => {
        values['isVIP'] = values.isVIP ? values.isVIP : false;
        values['uidDocName'] = patientDocUpload?.uidDocName ? patientDocUpload.uidDocName : "";
        values['uidDocExt'] = patientDocUpload?.uidDocExt ? patientDocUpload.uidDocExt : "";
        values['uidDocID'] = patientDocUpload?.uidDocID ? patientDocUpload.uidDocID : 0;
        values['passIssueDate'] = convertDate(values?.passIssueDate)
        values['dob'] = convertDate(values?.dob);
        console.log(values)
        let serviceFrom = convertDate(values.serviceFrom);
        try {
            const staticParams = {
                "lstType_Patient": lstType_Patient,
                "istType_Pat": istType_Pat,
                "patientID": patient[0]?.patientID,
                "patientNo": patient[0]?.patientNo,
                //"uidDocExt": "",
                "uidDocPath": "",
                //"uidDocID": 0,
                // "vUniqueID": 0,
                // "vUniqueName": 0,
                //"uidDocName": "",

                "curPhoneAC": "",
                "perPhoneAC": "",
                "userID": -1,
                "formID": -1,
                "type": 1
            };
            console.log(staticParams)
            setLoading(true)
            const msg = await requestPatientRegistration({ ...values, ...staticParams });
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
    const goBack = () => {
        history.push("/patient/search")
    }
    const onChangePic: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        console.log(newFileList)
        setFileList(newFileList);
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
            render: (v) => <Typography>{v != 0 ? relation[v].label : 'NA'}</Typography>

            // <Select
            //     size='small'
            //     disabled={true}
            //     defaultValue={v}
            //     options={relation}
            // />,
            ,
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
            render: (v) => <Typography>{v != 0 ? bloodGroup[v].label : 'NA'}</Typography>,
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
                    <Button onClick={() => handleEdit(record, 1)}>
                        <a>Edit</a>
                    </Button>
                ) : null,
        },
    ];
    const column1: ColumnsType<DataType> = [
        {
            title: 'SrNo.',
            dataIndex: 'col2',
            key: 'col2',
            render: (text, record, index) => <a>{index + 1}</a>,
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
            render: (v) => <Typography>{v != 0 ? relation[v].label : 'NA'}</Typography>
            // render: (v) =>
            //     <Select
            //         size='small'
            //         disabled={true}
            //         defaultValue={v}
            //         options={relation}
            //     />,
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
            render: (v) => <Typography>{v != 0 ? bloodGroup[v].label : 'NA'}</Typography>,
        },
        {
            title: 'Phone Number',
            key: 'col8',
            dataIndex: 'col8',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: { key: React.Key }, index) =>
                istType_Pat.length >= 1 ? (
                    <Button onClick={() => handleEdit(record, 2)}>
                        <a>Edit</a>
                    </Button>
                ) : null,
        },
    ];
    const handleEdit = (record: any, type: number) => {
        if (type == 1) {
            const values = form1.getFieldsValue()
            if (values.col3 != undefined)
                message.error("Please Submit Previous Record First")
            if (values.col3 == "" || values.col3 == undefined) {
                form1.setFieldsValue(record);
                const newData = lstType_Patient.filter((item, index) => item.col3 !== record.col3);
                setLstType_Patient(newData);
            }
        }
        if (type == 2) {
            const values = form2.getFieldsValue()
            if (values.col3 != undefined)
                message.error("Please Submit Previous Record First")
            if (values.col3 == "" || values.col3 == undefined) {
                form2.setFieldsValue(record);
                const newData = istType_Pat.filter((item) => item.col3 !== record.col3);
                setIstType_Pat(newData);
            }
        }
    };
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
    const formList = () => {
        const addFamilyItem = () => {
            let flag = 0;
            const values = form1.getFieldsValue()
            const family = {
                "col1": values.col1 ? values.col1 : "",
                "col2": values.col2 ? values.col2 : (lstType_Patient.length + 1).toString(),
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
                        console.log(lstType_Patient)
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
                        <Col span={5}>
                            <Form.Item
                                name={'col3'}
                                label="Contact Name"
                                rules={[{ required: false, message: 'Please Enter Contact Name' },
                                { validator: validateCharacters }]}
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
                                { validator: validateCharacters }]}
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
                    title={<div style={{ textAlign: "end" }}>
                        <Button onClick={goBack} type="primary">
                            Back
                        </Button>
                    </div>}
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                >
                    {patient && <Form
                        disabled={isFormDisable}
                        layout={'vertical'}
                        form={form}
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
                                        // initialValue={patient[0]?.fName}
                                        name="fName"
                                        label="First Name"
                                        rules={[{ required: true, message: 'Please enter First Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please enter First Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.mName}
                                        name="mName"
                                        label="Middle Name"
                                        rules={[{ required: false, message: 'Please enter Middle Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please enter Middle Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.lName}
                                        name="lName"
                                        label="Last Name"
                                        rules={[{ required: true, message: 'Please enter Last Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please enter Last Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.fatherName}
                                        name="fatherName"
                                        label="Father Name"
                                        rules={[{ required: true, message: 'Please enter Father Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please enter Father Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.fNameML}
                                        name="fNameML"
                                        label="First Name In Other Language"
                                        rules={[{ required: false, message: 'Please enter First Name' }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please enter First Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.mNameML}
                                        name="mNameML"
                                        label="Middle Name In Other Language"
                                        rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please enter Middle Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.lNameML}
                                        name="lNameML"
                                        label="Last Name In Other Language"
                                        rules={[{ required: false, message: 'Please Enter Last Name' }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please Enter Last Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.fatherNameML}
                                        name="fatherNameML"
                                        label="Father Name In Other Language"
                                        rules={[{ required: false, message: 'Please enter Father Name In Other Language' }]}
                                    >
                                        <Input style={inputStyle} placeholder="Father Name In Other Language" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.motherNameML}
                                        name="motherNameML"
                                        label="Mother Name In Other Language"
                                        rules={[{ required: false, message: 'Please Enter Mother Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please enter Mother Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.motherName}
                                        name="motherName"
                                        label="Mother Name"
                                        rules={[{ required: false, message: 'Please Enter Mother Name' }]}
                                    >
                                        <Input style={inputStyle} placeholder="Please Enter Mother Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.eMail}
                                        name="eMail"
                                        label="Email"
                                        rules={[{ required: true, type: 'email', message: 'Please Enter Email' }]}
                                    >
                                        <Input style={inputStyle} maxLength={30} placeholder="Please Enter Email" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.alternateEmail}
                                        name="alternateEmail"
                                        label="Alternate Email"
                                        rules={[{ required: false, type: 'email', message: 'Please enter an alternate Email' }]}
                                    >
                                        <Input maxLength={30} placeholder="Please Enter Alternate Email" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.dob}
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
                                        // initialValue={patient[0]?.genderID}
                                        name="genderID"
                                        label="Gender"
                                        rules={[{ required: false, message: 'Please choose the Gender' }]}
                                    >
                                        <Select style={inputStyle}
                                            placeholder="Please choose the Gender"
                                            options={gender}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.civilStatusID}
                                        name="civilStatusID"
                                        label="Civil Status"
                                        rules={[{ required: false, message: 'Please choose the Civil Status' }]}
                                    >
                                        <Select style={inputStyle}
                                            placeholder="Please choose the Civil Status"
                                            options={civilStatus}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.bGroupID}
                                        name="bGroupID"
                                        label="Blood Group"
                                        rules={[{ required: false, message: 'Please Choose Blood Group' }]}
                                    >
                                        <Select style={inputStyle}
                                            placeholder="Please Choose Blood Group"
                                            options={bloodGroup}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.religionID}
                                        name="religionID"
                                        label="Religion"
                                        rules={[{ required: false, message: 'Please Choose Religion' }]}
                                    >
                                        <Select style={inputStyle}
                                            placeholder="Please Choose Religion"
                                            options={religion}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.nationalityID}
                                        name="nationalityID"
                                        label="Nationality"
                                        rules={[{ required: false, message: 'Please Choose Nationality' }]}
                                    >
                                        <Select style={inputStyle}
                                            placeholder="Please Choose Nationality"
                                            options={nationality}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patient[0]?.birthPlace}
                                        name="birthPlace"
                                        label="Birth Place"
                                        rules={[{ required: false, message: 'Please Enter The Birth Place' }]}
                                    >
                                        <Input style={inputStyle} maxLength={30} placeholder="Please Enter The Birth Place" />
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
                                        // initialValue={patientAddress?.curHouseNo}
                                        name="curHouseNo"
                                        label="HouseNo"
                                        rules={[{ required: false, message: 'Please Enter The HouseNo' }]}
                                    >
                                        <Input style={inputStyle} maxLength={10} placeholder="Please Enter The HouseNo" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.curAddress}
                                        name="curAddress"
                                        label="Address"
                                        rules={[{ required: false, message: 'Please Enter The Address' }]}
                                    >
                                        <Input style={inputStyle} maxLength={80} placeholder="Please Enter The Address" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.curPinCode}
                                        name="curPinCode"
                                        label="PinCode"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' }]}
                                    >
                                        <Input style={inputStyle} maxLength={6} placeholder="Please Enter The PinCode" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.curStateID}
                                        name="curStateID"
                                        label="State"
                                        rules={[{ required: false, message: 'Please Choose The State' }]}
                                    >
                                        <Select style={inputStyle}
                                            onSelect={(id) => getDistrict(id)}
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
                                        <Select style={inputStyle}
                                            placeholder="Please choose the District"
                                            options={district}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curVillageName"
                                        label="Village"
                                        rules={[{ required: false, message: 'Please Enter The Village' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Village" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curTehsilName"
                                        label="Tehsil"
                                        rules={[{ required: false, message: 'Please Enter The Tehsil' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Tehsil" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curCountryID"
                                        label="Country"
                                        rules={[{ required: false, message: 'Please Choose The District' }]}
                                    >
                                        <Select style={inputStyle}
                                            placeholder="Please choose the District"
                                            options={country}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact style={{ alignItems: 'center' }}>
                                        <Form.Item
                                            // initialValue={patientAddress?.curMobileNoCC}
                                            style={{ width: '20%' }}
                                            name="curMobileNoCC"
                                            label={<Typography style={{ marginLeft: 5 }}>{'CC'}</Typography>}
                                            rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                        >
                                            <Input style={inputStyle} maxLength={3} size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            // initialValue={patientAddress?.curMobileNo}
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
                                            <Input style={inputStyle} maxLength={10} size={'middle'} placeholder="Please enter mobile number" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact style={{ alignItems: 'center' }}>
                                        <Form.Item
                                            // initialValue={patientAddress?.curPhoneCC}
                                            style={{ width: '25%' }}
                                            name="curPhoneCC"
                                            label={<Typography style={{ marginLeft: 5 }}>{'CC'}</Typography>}
                                            rules={[{ required: false, message: 'Please Enter Phone Number CC' }]}
                                        >
                                            <Input style={inputStyle} maxLength={4} size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            // initialValue={patientAddress?.curPhoneNo}
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
                                            <Input style={inputStyle} maxLength={10} size={'middle'} placeholder="Please Enter Phone No" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
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
                                        // initialValue={patientAddress?.perHouseNo}
                                        name="perHouseNo"
                                        label="HouseNo"
                                        rules={[{ required: false, message: 'Please Enter The HouseNo' }]}
                                    >
                                        <Input style={inputStyle} maxLength={10} placeholder="Please Enter The HouseNo" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.perAddress}
                                        name="perAddress"
                                        label="Address"
                                        rules={[{ required: false, message: 'Please Enter The Address' }]}
                                    >
                                        <Input style={inputStyle} maxLength={80} placeholder="Please Enter The Address" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.perPinCode}
                                        name="perPinCode"
                                        label="PinCode"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' }]}
                                    >
                                        <Input style={inputStyle} maxLength={6} placeholder="Please Enter The PinCode" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        // initialValue={patientAddress?.perStateID}
                                        name="perStateID"
                                        label="State"
                                        rules={[{ required: false, message: 'Please Choose The State' }]}
                                    >
                                        <Select style={inputStyle}
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
                                        <Select style={inputStyle}
                                            placeholder="Please choose the District"
                                            options={district}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perVillageName"
                                        label="Village"
                                        rules={[{ required: false, message: 'Please Enter The Village' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Village" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perTehsilName"
                                        label="Tehsil"
                                        rules={[{ required: false, message: 'Please Enter The Tehsil' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Tehsil" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perCountryID"
                                        label="Country"
                                        rules={[{ required: false, message: 'Please Choose The District' }]}
                                    >
                                        <Select style={inputStyle}
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
                                            <Input style={inputStyle} size={'middle'} placeholder="CC" />

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
                                            <Input style={inputStyle} maxLength={10} size={'middle'} placeholder="Please enter mobile number" />
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
                                            <Input style={inputStyle} size={'middle'} placeholder="CC" />

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
                                            <Input style={inputStyle} maxLength={10} size={'middle'} placeholder="Please Enter Phone No" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
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
                                        rules={[{ required: false, message: 'Please Choose The DocType' }]}
                                    >
                                        <Select style={inputStyle}
                                            placeholder="Please Choose The DocType"
                                            options={docType}
                                        />
                                        {/* <Input maxLength={80} placeholder="Please Enter The DocName" /> */}
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
                                        <Input style={inputStyle} maxLength={16} placeholder="Please Enter The Doc Number" />
                                    </Form.Item>
                                    {/* <Form.Item
                                        name="uidDocID"
                                        label="Document ID"
                                        rules={[{ required: false, message: 'Please Enter The Doc ID' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Doc ID" />
                                    </Form.Item> */}
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="passIssueDate"
                                        label="PassPort Issue Date"
                                        rules={[{ required: false, message: 'Please Choose The PassPort Issue Date' }]}
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
                                        label="Passport Issue Place"
                                        rules={[{ required: false, message: 'Please Enter The Passport Issue Place' }]}
                                    >
                                        <Input style={inputStyle} maxLength={80} placeholder="Please Enter The Passport Issue Place" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Col span={6}>
                                <Row>
                                    <Form.Item
                                        name="docs"
                                        getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                                            addPatientDoc({ docBase64: url, docName: v.file.name })
                                            //form.({ photo: url });
                                            //setPasetFieldsValuetientDoc({ signature: patientDoc?.signature, photo: pic[1] });
                                        })}
                                        label="">
                                        <Upload
                                        //onChange={onUpload}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Button onClick={downloadDoc}>Download</Button>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Space align="center" size={24}>
                                    Photo:
                                    <Avatar size={120}
                                        src={patientDoc?.photo ?
                                            `data:image/png;base64,${patientDoc?.photo}`
                                            : "https://bootdey.com/img/Content/avatar/avatar6.png"}
                                    />
                                    <Form.Item
                                        name="photo"
                                        getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                                            const pic = url.split(',')
                                            form.setFieldsValue({ photo: url });
                                            setPatientDoc({ signature: patientDoc?.signature, photo: pic[1] });
                                        })}
                                        label=""
                                        rules={[{ required: false, message: 'Please Select Photo' }]}
                                    >
                                        <Upload
                                            name="avatar"
                                            listType="picture-circle"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            fileList={fileList}
                                            onChange={onChangePic}
                                            beforeUpload={beforeUpload}
                                            maxCount={1}
                                        >
                                            {uploadButton}
                                        </Upload>
                                    </Form.Item>
                                </Space>

                            </Col>
                            <Col span={6}>
                                <Space align="center" size={24}>
                                    Signature:
                                    <Image width={100}
                                        src={patientDoc?.signature ?
                                            `data:image/png;base64,${patientDoc?.signature}`
                                            : "https://bootdey.com/img/Content/avatar/avatar6.png"}
                                    />
                                    <Form.Item
                                        name="signature"
                                        getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                                            const pic = url.split(',')
                                            form.setFieldsValue({ signature: url });
                                            setPatientDoc({ photo: patientDoc?.photo, signature: pic[1] });
                                        })}
                                        label=""
                                        rules={[{ required: false, message: 'Please Choose Signature Pic' }]}
                                    >
                                        <Upload
                                            showUploadList={false}
                                            // beforeUpload={beforeUpload}
                                            // onChange={(info) => handleChange(info, item)}
                                            // onPreview={onPreview}
                                            fileList={fileList}
                                            onChange={onChangePic}
                                            beforeUpload={beforeUpload}
                                            className="avatar-uploader"
                                            maxCount={1}
                                            listType="picture-card"
                                        >
                                            {uploadButton}

                                            {/* <Button icon={<UploadOutlined />}>Upload</Button> */}
                                        </Upload>
                                    </Form.Item>
                                </Space>
                            </Col>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>

                        <Form.Item
                            name="isVIP"
                            valuePropName="checked"
                            label=""
                            rules={[{ required: false, message: 'Please Enter The HouseNo' }]}
                        >
                            <Checkbox>isVIP</Checkbox>

                        </Form.Item>
                        <Row style={{ marginTop: 30 }} justify="center" align="middle">
                            <Col style={{ justifyContent: 'flex-end' }}>
                                <Button size={'middle'} type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button onClick={goBack} size={'middle'} style={{ marginLeft: 10 }} type="default" >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>}
                </Card>
            </PageContainer>
        )
    }

    return (
        <>
            <Spin tip="Please wait..." spinning={loading}>
                <Row justify="space-around" align="middle">
                    {addPatientRegForm()}
                </Row>
            </Spin>
        </>
    );
};



export default EditPatient;