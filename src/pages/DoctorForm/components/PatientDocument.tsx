import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker, List, Image, Typography } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import DoctorSlotBookingList from './DoctorSlotBookingList';
import { requestGetPatientDoc } from '@/pages/Patient/services/api';
import { requestGetDocuments } from '@/pages/Candidate/services/api';

const { RangePicker } = DatePicker;



const PatientDocument = ({ patientDetails = {},admNo }: any) => {
    const { result1 } = patientDetails;
    const [docList, setDocList] = useState<any>([])
    const [imageUrl, setImageUrl] = useState<string>();


    useEffect(() => {
        getPatientDoc();
    }, [])

    const getPatientDoc = async (type: any = 1) => {
        console.log({patientDetails})
        const params = {
            "patientID": patientDetails?.result1[0]?.patientID,
            "patientCaseID": patientDetails?.result1[0]?.patientCaseID,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetPatientDoc(params);
        if (res.isSuccess = true) {
            setDocList(res.result)
        }
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

    const previewDoc = async (item: any) => {
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

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                {docList && <List
                    dataSource={docList}
                    renderItem={(item) => (
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
        </Space>
    );
};

export default PatientDocument;