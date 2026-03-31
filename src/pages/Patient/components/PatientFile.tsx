import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Image, Select, Space, message, theme, Card, Descriptions, Row, Col, List, Typography, Spin } from 'antd';

import { requestAddOnlinePatDoc, requestAddUpdatePatientDoc, requestFileUpload, requestGetPatientDoc, requestGetPatientHeader } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import { requestGetCandidateList, requestGetDocuments } from '@/pages/Candidate/services/api';
import { DownloadOutlined, FileAddOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Upload, { RcFile } from 'antd/es/upload';
import { requestGetDocType, requestGetUniqueID } from '@/services/apiRequest/dropdowns';
import { convertDate, convertDateInSSSZFormat } from '@/utils/helper';
import dayjs from 'dayjs';
import PatientDetailsCommon from './PatientDetailsCommon';
import { requestGetInvGroup } from '@/pages/Investigation/services/api';
import { requestGetInvParameterMasterList } from '@/pages/Complaint/services/api';


const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}
interface PatientType {
    patientDocID: number,
    docName: string,
    docExt: string,
    docPath: string,
    remark: string,
}

const PatientFile = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [addDocform] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [patientData, setPatientData] = useState<any>();
    const [caseChoice, setCaseChoice] = useState([]);
    const [docList, setDocList] = useState<any>([])
    const [imageUrl, setImageUrl] = useState<string>();
    const [docName, setDocName] = useState<any>("")
    const [docType, setDocType] = useState<any>("-1")
    const [groupList, setGroupList] = useState([]);
    const [invParameter, setInvParameter] = useState([{ value: "-1", label: "Select" }]);

    const [lstType_PatientDoc, setlstType_PatientDoc] = useState<any>([])
    const { verifiedUser } = getUserInLocalStorage();




    useEffect(() => {
        getPatientDoc();
        //getDocType();
        getInvGroup();
    }, [patientData])

    const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const onFinishPatForm = async (values: any) => {
        values['case'] = values.case ? values.case : -1;
        const params = {
            patientNo: values?.patientNo,
            patientID: -1,
            userID: -2,
            formID: 1,
            type: 1
        }
        console.log(JSON.stringify(params));
        const response = await requestGetPatientHeader(params);
        setLoading(false)
        console.log(response?.result1);

        const result1 = response?.result1[0];

        const caseChoiceMaskForDropdown = response?.result3?.map((item: any) => {
            return { value: item.patientCaseID, label: item.patientCaseNo }
        });
        setCaseChoice(caseChoiceMaskForDropdown)
        const patentBasicDetails = [
            {
                key: '1',
                label: 'Patient No',
                children: result1?.patientNo,
            },
            {
                key: '2',
                label: 'Name',
                children: result1?.candName
            },
            {
                key: '3',
                label: 'DOB',
                children: result1?.dob
            },
            {
                key: '4',
                label: 'Age',
                children: result1?.age
            },
            {
                key: '5',
                label: 'Address',
                children: result1?.curAddress
            },
            {
                key: '6',
                label: 'Mobile No',
                children: result1?.curMobileNo
            },
            {
                key: '7',
                label: 'Phone No',
                children: result1?.curPhoneNo
            },
            {
                key: '8',
                label: 'Marital Status',
                children: result1?.civilStatusName
            },
            {
                key: '9',
                label: 'Blood Group',
                children: result1?.bloodGroup
            },
            {
                key: '10',
                label: 'Email',
                children: result1?.email
            },
            {
                key: '11',
                label: 'Emergency Name',
                children: result1?.emerGencyName
            },
            {
                key: '12',
                label: 'Emergency Contact',
                children: result1?.emerGencyContact
            },
            {
                key: '13',
                label: 'Gender',
                children: result1?.genderName
            },
            {
                key: '14',
                label: 'Insurance Company',
                children: result1?.insuranceComp
            }
        ];

        setPatientData({ ...response?.result1[0], "patientCaseID": values.case, })
        // setPatientData({ patentBasicDetails })
        if (!response?.isSuccess) {
            message.error(response?.msg);
        }
    };
    const handleChangeDocGroup = async (v: any) => {
        //form.setFieldsValue({docTypeID:"-1"})
        getInvParameter(v)
    }
    const handleChangeDocType = (v: any) => {
        setDocType(v);
    }

    const getInvParameter = async (id: any) => {
        const params1 = {
            "invParameterID": -1,
            invGroupID: id,
            "isActive": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetInvParameterMasterList(params1);
        // console.log(res);
        // if (res?.result?.length > 0) {
        const dataMaskForDropdown = res?.result?.map((item: any) => {
            return { value: item.invParameterID, label: item.invName }
        })
        dataMaskForDropdown.unshift({ value: "-1", label: "Select" })
        setInvParameter(dataMaskForDropdown);
        // }
    }

    const updateDocList = async (v: any, url: any) => {
        const fr = addDocform.getFieldsValue()
        var re: any = /(?:\.([^.]+))?$/;
        var ext = re?.exec(v.file.name)[1];
        const res = await requestGetUniqueID();
        const p: any = {
            patientDocID: res?.result,
            docName: v.file.name,
            docExt: ext,
            docPath: "",
            remark: "",
            base64: fr.docBase64
        }
        setlstType_PatientDoc([...lstType_PatientDoc, p])
        console.log(lstType_PatientDoc, p);
    }
    const getInvGroup = async () => {
        try {
            const staticParams = {
                invGroupID: -1,
                discountParameterID: -1,
                isActive: -1,
                formID: -1,
                type: 1
            };
            setLoading(true)
            const res = await requestGetInvGroup({ ...staticParams });
            if (res?.result.length > 0) {
                const dataMaskForDropdown = res?.result?.map((item: any) => {
                    return { value: item.invGroupID, label: item.invGroupName }
                })
                dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
                setLoading(false)
                setGroupList(dataMaskForDropdown)
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }



    const getPatientDoc = async (type: any = 1) => {
        console.log(patientData)
        const params = {
            "patientID": patientData?.patientID,
            "patientCaseID": patientData?.patientCaseID,
            "userID": -1,
            "formID": -1,
            "type": type

        }
        setLoading(true)
        const res = await requestGetPatientDoc(params);
        setLoading(false)

        if (res.isSuccess = true) {
            if (type == 1) {
                setDocList(res.result)
            }
            if (type == 2) {
                downloadZipDoc({ file: res?.result1, docName: res?.result })
            }
        }
    }
    const previewDoc = async (item: any) => {
        setImageUrl("")
        const params = {
            fileName: item.phyName,
            filePath: ""
        }
        const res1 = await requestGetDocuments(params);
        if (res1.isSuccess == true) {
            setImageUrl(`data:image/png;base64,${res1.result}`)
            if (res1.result.startsWith("JVB")) {
                window.open(`data:application/pdf;base64,${res1.result}`);
            }
        }
        else {
            message.error("File Not Found")
        }
    }

    function uniqueNames(data: any, key: any) {
        return [
            ...new Map(
                data.map((x: any) => [key(x), x])).values()
        ]
    }

    const addPatientDoc = async (values: any) => {
        var re = /(?:\.([^.]+))?$/;
        console.log(values, patientData, lstType_PatientDoc)
        const lstType_PatientDoc1 = uniqueNames(lstType_PatientDoc, (it:any) => it.docName)
        const paramsOfDoc = {
            "patientID": patientData?.patientID,
            "patientCaseID": patientData?.patientCaseID,
            "docTypeID": values?.docTypeID,
            "lstType_PatientDoc": lstType_PatientDoc1,

            "docDateTime": convertDateInSSSZFormat(dayjs()),
            "isDelete": false,
            "userID": -1,
            "formID": -1,
            "type": 1
        }

        // lstType_PatientDoc.map((item)=>{
        //     console.log(item)
        // })
        setLoading(true)
        const res = await requestAddUpdatePatientDoc(paramsOfDoc);
        if (res?.isSuccess == true) {
            lstType_PatientDoc.map(async (item: any) => {
                const param1 = {
                    "fileName": item?.patientDocID + "." + item?.docExt,
                    "data": item.base64
                }
                const res1 = await requestFileUpload(param1);
                if (res1.isSuccess == true) {
                    //message.success(res.msg)
                    getPatientDoc()
                }
                else
                    message.error(res1.msg)
            })
            message.success(res.msg)
            setlstType_PatientDoc([])
            setLoading(false)
        }
        setLoading(false)
        addDocform.resetFields()
    }
    const downloadDoc = async (item: any) => {
        const params = {
            fileName: item.phyName,
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
                    a.download = prompt("Enter filename and extension (e.g. myImage.docx)") || 'default-filename.docx';
                    // a.download = prompt("Enter filename and extension (e.g. myImage.jpg):", window.location.href.split('\/').pop() === "" ? window.location.hostname + ".html" : item.docName);
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
    }
    const downloadZipDoc = async (item: any) => {

        //window.location.href = `data:application/octet-stream;base64,${res1.result}`;
        if (item?.file) {
            fetch(window.location.href)
                .then(resp => resp.blob())
                .then(blob => {
                    const url = `data: application/zip;base64,${item.file}`;
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                   a.download = prompt("Enter filename and extension (e.g. myImage.docx)") || 'default-filename.docx';
                    // a.download = prompt("Enter filename and extension (e.g. myImage.jpg):", window.location.href.split('\/').pop() === "" ? window.location.hostname + ".html" : item.docName + ".zip");
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
    }

return (
    <Card
        style={{
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 16 }}
    >
        <PatientDetailsCommon
            patData={patientData}
            onChange={(value: any) => setPatientData(value)}
        />

        {patientData && (
            <Spin spinning={loading}>
                <div style={{ marginTop: 12 }}>

                    {/* ================= UPLOAD SECTION ================= */}
                    <Card
                        title={
                            <span style={{ color: "#000", fontWeight: 600 }}>
                                📂 Upload New Document
                            </span>
                        }
                        style={{
                            borderRadius: 8,
                            marginBottom: 20,
                            borderBottom: "4px solid",
                            borderImage:
                                "linear-gradient(to right, #1677ff, #69c0ff) 1",
                        }}
                        headStyle={{
                            background: "#e6f4ff",
                            padding: "8px 16px",
                        }}
                        bodyStyle={{
                            background: "#f9fbfd",
                            padding: "12px 16px",
                        }}
                    >
                        <Form
                            layout="vertical"
                            form={addDocform}
                            onFinish={(values) => addPatientDoc(values)}
                        >
                            <Row gutter={12} align="bottom">

                                <Col flex="1">
                                    <Form.Item
                                        name="docGroupID"
                                        label="Document Group"
                                        style={{ marginBottom: 8 }}
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            size="middle"
                                            placeholder="Select Group"
                                            options={groupList}
                                            onSelect={() =>
                                                addDocform.setFieldValue(
                                                    "docTypeID",
                                                    ""
                                                )
                                            }
                                            onChange={handleChangeDocGroup}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col flex="1">
                                    <Form.Item
                                        name="docTypeID"
                                        label="Document Type"
                                        style={{ marginBottom: 8 }}
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            size="middle"
                                            placeholder="Select Type"
                                            options={invParameter}
                                            onChange={handleChangeDocType}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col flex="1">
                                    <Form.Item
                                        name="docBase64"
                                        label="Attach Document"
                                        style={{ marginBottom: 8 }}
                                        getValueFromEvent={(v) =>
                                            getBase64(
                                                v.file.originFileObj as RcFile,
                                                (url) => {
                                                    addDocform.setFieldsValue({
                                                        docBase64: url,
                                                    });
                                                    setDocName(v.file.name);
                                                    updateDocList(v, url);
                                                }
                                            )
                                        }
                                        rules={[{ required: true }]}
                                    >
                                        <Upload
                                            maxCount={10}
                                            showUploadList={false}
                                        >
                                            <Button icon={<FileAddOutlined />}>
                                                Upload
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>

                                <Col>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ marginBottom: 8 }}
                                    >
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    {/* ================= DOCUMENT LIST SECTION ================= */}
                    <Card
                        title={
                            <Row
                                justify="space-between"
                                align="middle"
                                style={{ width: "100%" }}
                            >
                                <span
                                    style={{
                                        color: "#000",
                                        fontWeight: 600,
                                    }}
                                >
                                    📑 Uploaded Documents
                                </span>

                                <Button
                                    size="small"
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    onClick={() => getPatientDoc(2)}
                                >
                                    Download All
                                </Button>
                            </Row>
                        }
                        style={{
                            borderRadius: 8,
                            borderBottom: "4px solid",
                            borderImage:
                                "linear-gradient(to right, #52c41a, #b7eb8f) 1",
                        }}
                        headStyle={{
                            background: "#e6f4ff",
                            padding: "8px 16px",
                        }}
                        bodyStyle={{
                            padding: 12,
                            maxHeight: 350,
                            overflowY: "auto",
                        }}
                    >
                        {docList && (
                            <List
                                size="small"
                                dataSource={docList}
                                renderItem={(item: any) => (
                                    <List.Item
                                        style={{
                                            padding: "8px 4px",
                                        }}
                                    >
                                        <Row
                                            justify="space-between"
                                            align="middle"
                                            style={{ width: "100%" }}
                                        >
                                            <Space size={8}>
                                                <Image
                                                    width={32}
                                                    height={32}
                                                    preview={false}
                                                    src={
                                                        item.docExt === "pdf"
                                                            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/391px-PDF_file_icon.svg.png"
                                                            : "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                                    }
                                                    onClick={() =>
                                                        previewDoc(item)
                                                    }
                                                />
                                                <Typography.Text>
                                                    {item.docName}
                                                </Typography.Text>
                                            </Space>

                                            <Button
                                                size="small"
                                                icon={<DownloadOutlined />}
                                                onClick={() =>
                                                    downloadDoc(item)
                                                }
                                            >
                                                Download
                                            </Button>
                                        </Row>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </div>
            </Spin>
        )}
    </Card>
);

});

export default PatientFile;