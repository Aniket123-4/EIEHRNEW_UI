import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Image, Select, Space, message, theme, Card, Descriptions, Row, Col, List, Typography, Table, Tag, DatePicker, Divider, Modal } from 'antd';

import { requestAddOnlinePatDoc, requestAddUpdatePatientDoc, requestFileUpload, requestGetDoctorPatientList, requestGetPatientByTokenNo, requestGetPatientDoc, requestGetPatientHeader, requestGetTokenNoQueueJump, requestUpdatePatientTokenNo } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import { requestGetCandidateList, requestGetDocuments } from '@/pages/Candidate/services/api';
import { FileAddOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Upload, { RcFile } from 'antd/es/upload';
import { requestGetDocType, requestGetUniqueID, requestGetUserList } from '@/services/apiRequest/dropdowns';
import { convertDate, convertDateInSSSZFormat } from '@/utils/helper';
import dayjs from 'dayjs';
import PatientDetailsCommon from './PatientDetailsCommon';
import { requestGetInvGroup } from '@/pages/Investigation/services/api';
import { requestGetInvParameterMasterList } from '@/pages/Complaint/services/api';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';


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


const DoctorPatientStatus = React.forwardRef(() => {
    const [form] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [patientData, setPatientData] = useState<any>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctorList, setDoctorList] = useState<any>([])
    const [statusList, setStatusList] = useState<any>([])
    const [modalData, setModalData] = useState<any>([])
    const [showModalData, setShowModalData] = useState<any>([])

    const { verifiedUser } = getUserInLocalStorage();


    interface DataType {
        rowID: string;
        locName: string;
        tokenNo: number;
    }
    useEffect(() => {
        getDoctorList();
    }, [])

    const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };
    const filterOption = (input: string, doctorList?: { label: string; value: string }) =>
        (doctorList?.label ?? '').toLowerCase().includes(input.toLowerCase());


    const columns: ColumnsType<DataType> = [
        {
            title: 'Doctor Name',
            dataIndex: 'userName',
            key: 'userName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Patient Admitted',
            dataIndex: 'patientAdmitted',
            key: 'patientAdmitted',
            width: '18%',
            render: (_, record, key) => <Button onClick={() => showModal(record, 'patientAdmitted')
            } size='small' block >{record.patientAdmitted}</Button>,
        },
        {
            title: 'Seen By Doctor',
            dataIndex: 'seenByDoc',
            key: 'seenByDoc',
            width: '18%',
            render: (_, record) => <Button onClick={() => showModal(record, 'seenByDoc')
            } size='small' block >{record.seenByDoc}</Button>,
        },
        {
            title: 'Patient CheckedOut',
            dataIndex: 'patientCheckedOut',
            key: 'patientCheckedOut',
            width: '18%',
            render: (_, record) => <Button onClick={() => showModal(record, 'patientCheckedOut')
            } size='small' block >{record.patientCheckedOut}</Button>,
        },
        {
            title: 'Patient Not Seen',
            dataIndex: 'patientNotSeen',
            key: 'patientNotSeen',
            width: '18%',
            render: (_, record) => <Button onClick={() => showModal(record, 'patientNotSeen')
            } size='small' block >{record.patientNotSeen}</Button>,
        },
        // {
        //     title: 'Cash Count',
        //     dataIndex: 'cashCount',
        //     key: 'cashCount',
        //     width: 150,
        //     render: (_, record) => <Button onClick={() => showModal(record, 'cashCount')
        //     } size='small' block >{record.cashCount}</Button>,
        // },
        // {
        //     title: 'Credit Count',
        //     dataIndex: 'creditCount',
        //     key: 'creditCount',
        //     width: 150,
        //     render: (_, record) => <Button onClick={() => showModal(record, 'creditCount')
        //     } size='small' block >{record.creditCount}</Button>,
        // },
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
    const getDoctorPatientList = async (values: any) => {
        values['fromDate'] = convertDate(values['fromDate']);
        try {
            const staticParams = {
                // "fromDate": "string",
                // "doctorID": 0,
                "toDate": dayjs(),

                "userID": -1,
                "formID": -1,
                "type": 5
            };
            setLoading(true)
            const res = await requestGetDoctorPatientList({ ...values, ...staticParams });
            console.log(res);
            setLoading(false)
            if (res.isSuccess === true) {
                setStatusList(res.result)
                setModalData(res?.result1)
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
                    onFinish={getDoctorPatientList}>
                    <Row style={{ alignItems: 'end' }}>
                    
                        <Form.Item name="fromDate" label="From Date" 
                        rules={[{ required: true, message: "Please Select Date" }]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={'DD MMM YYYY'}
                                disabledDate={(current) => {
                                    return current && current >= dayjs();
                                }}
                                getPopupContainer={(trigger) => trigger.parentElement!}
                            />
                        </Form.Item>
                    
                       <Col xs={24} xl={6}>
                        <Form.Item name="doctorID" label="Doctor"
                        initialValue={"-1"}
                            rules={[{ required: true, message: "Please Select Doctor" }]}>
                            <Select
                                showSearch
                                //style={{ width: 200 }}
                                placeholder="Select"
                                filterOption={filterOption}
                                notFoundContent={null}
                                options={(doctorList).map((d) => ({
                                    value: d.value,
                                    label: d.label,
                                }))}
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
                <Typography style={labelStyle}>Patient Doctor Status</Typography>
                <Card>
                    <Table size='small' columns={columns} dataSource={statusList} pagination={false} />
                    <Row style={{ background: '#40a9ff' }}></Row>
                </Card>
            </div>
        </>
    );
});

export default DoctorPatientStatus;