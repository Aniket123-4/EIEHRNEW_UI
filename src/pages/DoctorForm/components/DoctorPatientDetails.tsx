import React, { useEffect, useRef, useState } from 'react';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Modal, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Tabs, Descriptions } from 'antd';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history, type IRoute } from 'umi';
import { activeStatus, dateFormat } from '@/utils/constant';
import { convertDate } from '@/utils/helper';
import dayjs from 'dayjs';
import moment from 'moment';
import type { TabsProps } from 'antd';
import { requestGetPatientForDoctorOPIP } from '../services/api';
import GeneralInformation from './GeneralInformation';
import Complain from './Complain';
import VitalSign from './VitalSign';
import Diagnosis from './Diagnosis';
import Medication from './Medication';
import Investigation from './Investigation';
import PatientHistory from './PatientHistory';
import ReferalDoctor from './ReferalDoctor';
import ClinicalFinding from './ClinicalFinding';
import PatientDocument from './PatientDocument';
import { requestGetPatientHeader } from '@/pages/Patient/services/api';
import BasicDetails from './BasicDetails';
import DischargeSummary from './DischargeSummary';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const DoctorPatientDetails = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [formFilter] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const [patientID, setPatientID] = useState<string>();
    const [patientNo, setPatientNo] = useState<string>();
    const [patientCaseID, setPatientCaseID] = useState<string>();
    const [patientCaseNo, setPatientCaseNo] = useState<string>();
    const [patientBasicDetails, setPatientBasicDetails] = useState<any>(null);
    const [patientDetails, setPatientDetails] = useState<any>();
    const [isModalOpenForPatHistory, setIsModalOpenForPatHistory] = useState(false);

    const items: TabsProps['items'] = [
        {
            key: '0',
            label: 'BASIC INFORMATION',
            children: patientBasicDetails && <BasicDetails patientBasicDetails={patientBasicDetails} patientCaseID={patientCaseID} />,
        }, {
            key: '1',
            label: 'GENERAL INFORMATION',
            children: <GeneralInformation patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '2',
            label: 'COMPLAIN',
            children: <Complain patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '3',
            label: 'VITAL SIGN',
            children: <VitalSign patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '4',
            label: 'DIAGNOSIS',
            children: <Diagnosis patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '5',
            label: 'MEDICATION',
            children: <Medication patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '7',
            label: 'INVESTIGATION',
            children: <Investigation patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '8',
            label: 'PATIENT HISTORY',
            children: <PatientHistory patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '9',
            label: 'PATIENT DOCUMENT',
            children: <PatientDocument patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '10',
            label: 'REFERAL DOCTOR',
            children: <ReferalDoctor patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '11',
            label: 'CLINICAL FINDING',
            children: <ClinicalFinding patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
        {
            key: '12',
            label: 'DISCHARGE SUMMARY',
            children: <DischargeSummary patientDetails={patientDetails} patientCaseID={patientCaseID} />,
        },
    ];

    useEffect(() => {
        const patientID: string = history.location.pathname.split('/')[3];
        const patientNo = history.location.pathname.split('/')[4];
        const patientCaseID = history.location.pathname.split('/')[5];
        const patientCaseNo = history.location.pathname.split('/')[6];

        getPatientBasicDetails(
            patientID,
            patientNo,
            patientCaseID,
            patientCaseNo
        );

        getPatientDetails(
            patientID,
            patientNo,
            patientCaseID,
            patientCaseNo
        );

        setPatientID(patientID)
        setPatientNo(patientNo)
        setPatientCaseID(patientCaseID)
        setPatientCaseNo(patientCaseNo)
    }, [])

    const getPatientBasicDetails = async (patientID: string,
        patientNo: string,
        patientCaseID: string,
        patientCaseNo: string) => {
        const params = {
            patientNo: patientNo,
            patientID: patientID,
            userID: -2,
            formID: 1,
            type: 1
        }
        const response = await requestGetPatientHeader(params);
        setLoading(false)
        setPatientBasicDetails(response)
    }

    const getPatientDetails = async (
        patientID: string,
        patientNo: string,
        patientCaseID: string,
        patientCaseNo: string) => {

        try {
            const staticParams = {
                patientCaseID: patientCaseID,
                patientCaseNo: patientCaseNo,
                patientID: patientID,
                patientNo: patientNo,
                caseTypeID: 1,
                patientName: '',
                fromDate: '',
                toDate: '',
                userID: -2,
                formID: 1,
                type: 2
            }

            setLoading(true)
            const response = await requestGetPatientForDoctorOPIP({ ...staticParams });
            setLoading(false)
            setPatientDetails(response)

            if (response.result7.length > 0) {
                setIsModalOpenForPatHistory(true);
            }

            if (!response?.isSuccess) {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    const onChange = (key: string) => {
        console.log(key);
    };

    const showModal = () => {
        setIsModalOpenForPatHistory(true);
    };

    const handleOk = () => {
        setIsModalOpenForPatHistory(false);
    };

    const handleCancel = () => {
        setIsModalOpenForPatHistory(false);
    };


    const patHistoryModal = () => {

        const desData = [

            {
                label: 'Allergy',
                key: '1',
                children: patientDetails?.result7[0]?.allergy
            }, {
                label: 'Warnings',
                key: '2',
                children: patientDetails?.result7[0]?.warnings
            },
            {
                label: 'Addiction',
                key: '3',
                children: patientDetails?.result7[0]?.addiction
            },
            {
                label: 'Social History',
                key: '4',
                children: patientDetails?.result7[0]?.socialHistory

            }, {
                label: 'Family History',
                key: '5',
                children: patientDetails?.result7[0]?.familyHistory
            },
            {
                label: 'Personal History',
                key: '6',
                children: patientDetails?.result7[0]?.personalHistory
            },
            {
                label: 'Past Medical History',
                key: '7',
                children: patientDetails?.result7[0]?.pastMedicalHistory
            },
            {
                label: 'Obstetrics',
                key: '8',
                children: patientDetails?.result7[0]?.obstetrics
            },
        ];
        return (
            <>
                <Modal
                    width={900}
                    title="Patient History"
                    footer={[]}
                    open={isModalOpenForPatHistory}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Space>
                        {patientDetails && <Descriptions
                            bordered
                            items={desData}
                        />}
                    </Space>
                </Modal>
            </>
        )
    }

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card
                title=""
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {patientBasicDetails ?
                            <Tabs
                                defaultActiveKey="0"
                                tabPosition={'left'}
                                style={{
                                }}
                                items={items}
                                onChange={onChange}
                            /> : null}
                    </div>
                </Spin>
            </Card>
            {patHistoryModal()}
        </Space>
    );
});

export default DoctorPatientDetails;