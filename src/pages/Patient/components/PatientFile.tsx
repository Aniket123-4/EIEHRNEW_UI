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
                children: result1?.patientNo
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
        const lstType_PatientDoc1 = uniqueNames(lstType_PatientDoc, it => it.docName)
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
                    a.download = prompt("Enter filename and extension (e.g. myImage.jpg):", window.location.href.split('\/').pop() === "" ? window.location.hostname + ".html" : item.docName + ".zip");
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
        <Card>
            {/* <Form
                onFinish={onFinishPatForm}
                form={form}
                layout="vertical"
            >
                <Space>
                    <Form.Item name="patientNo" label="Patient No" rules={[{ required: true }]}>
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ marginTop: 28 }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item name="case" label="Case No" rules={[{ required: false }]}>
                        <Select
                            style={{ width: 200 }}
                            onChange={handleChangeCase}
                            options={caseChoice}
                            placeholder="Select"
                        />
                    </Form.Item>
                </Space>
            </Form > */}
            <PatientDetailsCommon
                patData={patientData}
                onChange={(value: any) => setPatientData(value)} />
            <>
                {patientData &&
                    <div>
                        {/* <Row style={{ backgroundColor: 'lightgreen', padding: 5 }}>
                            <Col span={5}>Name</Col>
                            <Col span={5}>Date of Birth</Col>
                            <Col span={4}>Blood Group</Col>
                            <Col span={5}>Mobile No</Col>
                            <Col span={5}>Phone No</Col>
                        </Row>
                        <Row style={{ padding: 5 }}>
                            <Col span={5}>{patientData.candName}</Col>
                            <Col span={5}>{patientData.dob}</Col>
                            <Col span={4}>{patientData.bloodGroup}</Col>
                            <Col span={5}>{patientData.curMobileNo}</Col>
                            <Col span={5}>{patientData.curPhoneNo}</Col>
                        </Row>
                        <Row style={{ backgroundColor: 'lightgreen', padding: 5 }}>
                            <Col span={5}>EmergencyContact</Col>
                            <Col span={5}>Date of Birth</Col>
                            <Col span={14}>Address</Col>
                        </Row>
                        <Row style={{ padding: 5 }}>
                            <Col span={5}>{patientData.emerGencyName}</Col>
                            <Col span={5}>{patientData.dob}</Col>
                            <Col span={14}>{patientData.curAddress}</Col>
                        </Row> */}
                        <Spin spinning={loading}>
                            <Card>
                                <Row>
                                    <Col span={12}>
                                        <Card
                                            title={
                                                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography>
                                                        {'New Upload'}
                                                    </Typography>
                                                </Row>
                                            }>

                                            <Form
                                                layout={'horizontal'}
                                                form={addDocform}
                                                onFinish={async (values) => {
                                                    addPatientDoc(values)
                                                }}>
                                                <Form.Item
                                                    name="docGroupID"
                                                    label="Document Group" rules={[{ required: true, message: "Please Select Document Group" }]}>
                                                    <Select
                                                        defaultValue={"-1"}
                                                        onSelect={() => addDocform.setFieldValue('docTypeID', "")}
                                                        style={{ width: 200 }}
                                                        onChange={handleChangeDocGroup}
                                                        options={groupList}
                                                        placeholder="Select"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name="docTypeID"
                                                    label="Document Type" rules={[{ required: true, message: "Please Select Document Type" }]}>
                                                    <Select
                                                        // value={docType}
                                                        defaultValue={"-1"}
                                                        style={{ width: 200 }}
                                                        onChange={handleChangeDocType}
                                                        options={invParameter}
                                                        placeholder="Select"
                                                    />
                                                </Form.Item>
                                                <Row>
                                                    <Form.Item
                                                        name="docBase64"
                                                        getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                                                            addDocform.setFieldsValue({ docBase64: url })
                                                            setDocName(v.file.name)
                                                            //if (v.file.status === "done")
                                                            updateDocList(v, url)
                                                        })}
                                                        label=""
                                                        rules={[{ required: true, message: 'Please Attach Document' }]}
                                                    >
                                                        <Upload
                                                            maxCount={10}
                                                        >
                                                            <Button icon={<FileAddOutlined />}>Attach</Button>
                                                        </Upload>
                                                    </Form.Item>
                                                </Row>
                                                <Button type='primary' htmlType='submit'>Submit</Button>

                                            </Form>
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card
                                            style={{
                                                height: 400,
                                                overflow: 'auto',
                                                padding: '0 16px',
                                                border: '1px solid rgba(140, 140, 140, 0.35)',
                                            }}
                                            title={<><Space>
                                                <Typography>Uploaded Documents</Typography>
                                                <Button onClick={() => getPatientDoc(2)}><DownloadOutlined /></Button>
                                            </Space></>}>
                                            {docList && <List
                                                dataSource={docList}
                                                renderItem={(item: any) => (
                                                    <Card style={{ boxShadow: '2px 2px 2px #4874dc', marginTop: 8 }} key={item.docID}>
                                                        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Row>
                                                                <Image
                                                                    onClick={() => previewDoc(item)}
                                                                    preview={{
                                                                        imageRender: () => (
                                                                            <Image
                                                                                width="50%"
                                                                                src={imageUrl}
                                                                                preview={false}
                                                                            />
                                                                        )
                                                                    }}
                                                                    width={40}
                                                                    height={40}
                                                                    style={{ borderRadius: 10 }}
                                                                    src={item.docExt == "pdf" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/391px-PDF_file_icon.svg.png"
                                                                        : item.docExt == "png" || item.docExt == "jpg" ? "https://img.freepik.com/free-photo/yellow-flower-green-background_1340-31703.jpg?t=st=1703678882~exp=1703682482~hmac=db2ea321b3844d6f0b22893020850a836e62bc82f64fc2dba66c956d77360baa&w=360"
                                                                            : "noImage"
                                                                    }
                                                                />
                                                                <Typography style={{ marginLeft: 10 }}>{item.docName}</Typography>
                                                            </Row>
                                                            <Button onClick={() => downloadDoc(item)}>Download</Button>
                                                        </Row>
                                                    </Card>
                                                )}
                                            />}
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Spin>
                    </div>
                    // <Descriptions
                    //     bordered
                    //     size={'small'}
                    //     items={patientData?.patentBasicDetails}
                    // />
                }
            </>
        </Card>
    );
});

export default PatientFile;