import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Image, Select, Space, message, theme, Card, Descriptions, Row, Col, List, Typography, Table, Tag, DatePicker, Divider, Modal, Slider, TreeSelect } from 'antd';

import { requestAddOnlinePatDoc, requestAddUpdatePatientDoc, requestFileUpload, requestGetDoctorPatientList, requestGetPatientByTokenNo, requestGetPatientDoc, requestGetPatientHeader, requestGetSummaryList, requestGetTokenNoQueueJump, requestUpdatePatientTokenNo } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import { requestGetCandidateList, requestGetDocuments } from '@/pages/Candidate/services/api';
import { FileAddOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Upload, { RcFile } from 'antd/es/upload';
import { requestGetDocType, requestGetUniqueID, requestGetUserList } from '@/services/apiRequest/dropdowns';
import { convertDate, convertDateInSSSZFormat } from '@/utils/helper';
import dayjs from 'dayjs';
import PatientDetailsCommon from './PatientDetailsCommon';
import { requestGetInvGroup } from '@/pages/Investigation/services/api';
import { requestDiseaseList, requestGetInvParameterMasterList } from '@/pages/Complaint/services/api';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
const {RangePicker}=DatePicker;


const { Option } = Select;
const borderStyle = { border: '1px solid #40a9ff', borderRadius: 10, backgroundColor: 'white', padding: '15px 10px 10px' };
const labelStyle = {
    position: 'absolute',
    background: '#40a9ff',
    marginTop: -28,
    padding: '2px 10px',
    marginLeft: 10,
    borderRadius: 10,
    color: 'white'
}


const AgeWiseSummary = React.forwardRef(() => {
    const [patientData, setPatientData] = useState<any>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctorList, setDoctorList] = useState<any>([])
    const [statusList, setStatusList] = useState<any>([])
    const [summaryList, setSummaryList] = useState<any>([])
    const [modalData, setModalData] = useState<any>([])
    const [diseaseList, setDiseaseList] = useState<any>([])
    const [showModalData, setShowModalData] = useState<any>([])
    const [loading, setLoading] = useState<any>(false)

    const { verifiedUser } = getUserInLocalStorage();


    interface DataType {
        rowID: string;
        locName: string;
        tokenNo: number;
    }
    useEffect(() => {
        getDoctorList();
        getDiseaseList();
    }, [])

    const getDiseaseList = async () => {
        const params = {
            "diseaseID": "-1",
            "diseaseTypeID": "-1",
            "specialTypeID": "-1",
            "isActive": "-1",
            "type": 1
        }
        const res = await requestDiseaseList(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: string) => {
                return { value: item.diseaseID, title:`${item.diseaseName}[${item.diseaseNameHindi}]`,key:`0-${index}` }
            })
            setDiseaseList(dataMaskForDropdown)
            // getDiseaseLinkedList(dataMaskForDropdown[0].value)
        }
    }
    const filterOption = (input: string, doctorList?: { label: string; value: string }) =>
        (doctorList?.label ?? '').toLowerCase().includes(input.toLowerCase());


    const columns: ColumnsType<DataType> = [
        {
            title: 'Patient Name',
            dataIndex: 'candName',
            key: 'candName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: '18%',
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
            width: '18%'
        },
        {
            title: 'MobileNo',
            dataIndex: 'curMobileNo',
            key: 'curMobileNo',
            width: '18%'
        },
        {
            title: 'PatientNo',
            dataIndex: 'patientNo',
            key: 'patientNo',
            width: '18%',
            // render: (_, record) => <Button onClick={() => showModal(record, 'patientNotSeen')
            // } size='small' block >{record.patientNotSeen}</Button>,
        },
    ];
    const modalColumns: ColumnsType<DataType> = [
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            key: 'patientNo',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Patient Name',
            dataIndex: 'patientName',
            key: 'patientName',
            width: '150',
            // render: (v) => <Button size='small' block >{v}</Button>,
        },
        {
            title: 'Case No',
            dataIndex: 'patientCaseNo',
            key: 'patientCaseNo',
            width: 150,
        },
        {
            title: ' Visit Date',
            dataIndex: 'actualVisitDate',
            key: 'actualVisitDate',
            width: 150,
            render: (v) => <Typography>{moment(v).format('DD MMM YYYY')}</Typography>,
        },
        {
            title: 'IsSeen',
            dataIndex: 'isSeen',
            key: 'isSeen',
            width: 150,
            render: (v) => <a>{v == true ? "Yes" : "No"}</a>,
        },
    ];

    const getDoctorList = async () => {
        const params = {
            "CommonID": -1,
            "Type": 3,
        }
        const res = await requestGetUserList(params);
        console.log(res)
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.userID, label: item.userName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "All" })
            setDoctorList(dataMaskForDropdown)
        }
    }
    const getSummaryList = async (values: any) => {
        console.log(values)
        values['ageFrom'] = values['ageRange'][0];
        values['ageTo'] = values['ageRange'][1];
        values['lstType_rows'] = values.lstType_rows.map((item:any,index:any)=>{return{
            "rowID": index,
            "rowValue": item
        }})
        try {
            const staticParams = {
                // "fromDate": "string",
                // "doctorID": 0,
                patientID:"-1",
                "userID": -1,
                "formID": -1,
                "type": 1
            };
            setLoading(true)
            const res = await requestGetSummaryList({ ...values, ...staticParams });
            setLoading(false)
            if (res.isSuccess === true) {
                setSummaryList(res.result)
            } else {
                message.error(res.msg);
            }

        } catch (error) {
            setLoading(false)
            message.error('please try again');
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showModal = (value: any, key: any) => {
        console.log(key, value);
        const show = modalData?.filter((item: any) => {
            switch (key) {
                case 'patientAdmitted':
                    return (value.userID == item.consultantDocID)
                case 'patientCheckedOut':
                    return (value.userID == item.consultantDocID && item.patientStatusID === "3")
                case 'patientNotSeen':
                    return (value.userID == item.consultantDocID && item.isSeen === false)
                case 'seenByDoc':
                    return (value.userID == item.consultantDocID && item.isSeen === true)
            }
        })
        setShowModalData(show);
        setIsModalOpen(true);
    };

    const model = () => {
        return (
            <Modal
                //title={selectedPatientData?.candName}
                open={isModalOpen}
                width={800}
                height={300}
                style={{ top: 20 }}
                onOk={() => handleCancel()}
                onCancel={() => handleCancel()}
                footer={[]}
            >
                <Table
                    size='small'
                    pagination={false}
                    columns={modalColumns}
                    dataSource={showModalData} />
                <div style={{ textAlign: 'center', paddingTop: 10 }}>
                    {/* <Button type='primary'
                        onClick={updateCaseCheckout}>
                        Submit</Button> */}
                </div>
            </Modal>
        )
    }

    return (
        <>
            <div style={borderStyle}>
                {model()}
                <Typography
                    style={labelStyle}>Filters</Typography>
                <Form
                    layout='vertical'
                    onFinish={getSummaryList}>
                    <Row gutter={10} style={{ alignItems: 'end' }}>
                    
                        <Col xs={24} xl={10}>
                        <Form.Item name="ageRange" 
                        initialValue={[20,50]}
                        label="Age Between" 

                        rules={[{ required: true, message: "Please Select Date" }]}>
                            <Slider range defaultValue={[20, 50]}/>
                        </Form.Item>
                        </Col>
                    
                       <Col xs={24} xl={6}>
                        <Form.Item name="lstType_rows" label="Disease"
                        // initialValue={"-1"}
                            rules={[{ required: true, message: "Please Select Diseases" }]}>
                            <TreeSelect 
                            treeData={diseaseList}
                            value
                            treeCheckable= {true}
                            placeholder= 'Please select'
                            style= {{
                                width: '100%',
                              }}
                            />
                        </Form.Item>
                        </Col>
                        <Col xs={24} xl={8}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Fetch
                            </Button>
                        </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <h2></h2>
            <div style={borderStyle}>
                <Typography style={labelStyle}>Age Wise Summary</Typography>
                <Card>
                    <Table size='small' columns={columns} dataSource={summaryList} pagination={false} />
                    <Row style={{ background: '#40a9ff' }}></Row>
                </Card>
            </div>
        </>
    );
});

export default AgeWiseSummary;