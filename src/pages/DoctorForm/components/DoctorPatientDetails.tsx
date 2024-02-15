import React, { useEffect, useRef, useState } from 'react';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Modal, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Tabs, Descriptions, List } from 'antd';
import { history, type IRoute } from 'umi';
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
    const [msg, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [formFilter] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [patientID, setPatientID] = useState<any>();
    const [patientNo, setPatientNo] = useState<any>();
    const [patientCaseID, setPatientCaseID] = useState<any>();
    const [patientCaseNo, setPatientCaseNo] = useState<any>();
    const [admNo, setAdmNo] = useState<any>();
    const [patientBasicDetails, setPatientBasicDetails] = useState<any>(null);
    const [patientDetails, setPatientDetails] = useState<any>();
    const [isModalOpenForPatHistory, setIsModalOpenForPatHistory] = useState(false);
    const [defaultActiveKey, setDefaultActiveKey] = useState("BASIC_INFORMATION");
    const [openPastCaseDrawer, setOpenPastCaseDrawer] = useState(false);

    const showPastCaseDrawer = () => {
        setOpenPastCaseDrawer(true);
    };

    const onClosePastCaseDrawer = () => {
        setOpenPastCaseDrawer(false);
    };


    const onSaveSuccess = (data: any) => {
        console.log("onSaveSuccess", data)
        const { tab, response }: any = data;

        setDefaultActiveKey(tab)


        if (!response?.isSuccess) {
            message.error(response?.msg);
        } else {
            message.success(response?.msg);

        }

        getPatientDetails(
            patientID,
            patientNo,
            patientCaseID,
            patientCaseNo,
            false
        );
    }

    const items: TabsProps['items'] = [
        {
            key: 'BASIC_INFORMATION',
            label: 'BASIC INFORMATION',
            children: patientBasicDetails && <BasicDetails patientBasicDetails={patientBasicDetails} patientCaseID={patientCaseID} admNo={admNo} />,
        }, {
            key: 'GENERAL_INFORMATION',
            label: 'GENERAL INFORMATION',
            children: <GeneralInformation patientDetails={patientDetails} patientCaseID={patientCaseID} admNo={admNo} />,
        },
        {
            key: 'COMPLAIN',
            label: 'PRESCRIPTION',
            children: [<Complain patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
            <Medication patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />]
        },
        {
            key: 'VITAL_SIGN',
            label: 'VITAL SIGN',
            children: <VitalSign patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        },
        {
            key: 'DIAGNOSIS',
            label: 'DIAGNOSIS',
            children: <Diagnosis patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        },
        // {
        //     key: 'MEDICATION',
        //     label: 'MEDICATION',
        //     children: <Medication patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        // },
        {
            key: 'INVESTIGATION',
            label: 'INVESTIGATION',
            children: <Investigation patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        },
        {
            key: 'PATIENT_HISTORY',
            label: 'PATIENT HISTORY',
            children: <PatientHistory patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        },
        {
            key: 'PATIENT_DOCUMENT',
            label: 'PATIENT DOCUMENT',
            children: <PatientDocument patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        },
        {
            key: 'REFERAL_DOCTOR',
            label: 'REFERAL DOCTOR',
            children: <ReferalDoctor patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        },
        {
            key: 'CLINICAL_FINDING',
            label: 'CLINICAL FINDING',
            children: <ClinicalFinding patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        },
        {
            key: 'DISCHARGE_SUMMARY',
            label: 'DISCHARGE SUMMARY',
            children: <DischargeSummary patientDetails={patientDetails} patientCaseID={patientCaseID} onSaveSuccess={onSaveSuccess} admNo={admNo} />,
        }
    ];

    useEffect(() => {
        const patientID: string = history.location.pathname.split('/')[3];
        const patientNo = history.location.pathname.split('/')[4];
        const patientCaseID = history.location.pathname.split('/')[5];
        const patientCaseNo = history.location.pathname.split('/')[6];
        const admNo = history.location.pathname.split('/')[7];

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
            patientCaseNo,
            true
        );

        setPatientID(patientID)
        setPatientNo(patientNo)
        setPatientCaseID(patientCaseID)
        setPatientCaseNo(patientCaseNo)
        setAdmNo(admNo)
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
        patientCaseNo: string,
        isPatientHistory: boolean
    ) => {

        try {
            const staticParams = {
                patientCaseID: patientCaseID,
                patientCaseNo: patientCaseNo,
                patientID: patientID,
                patientNo: patientNo,
                caseTypeID: 1,
                patientName: '',
                fromDate: '01 Jan 1900',
                toDate: '01 Jan 1900',
                userID: -2,
                formID: 1,
                type: 2
            }

            setLoading(true)
            const response = await requestGetPatientForDoctorOPIP({ ...staticParams });
            setLoading(false)
            setPatientDetails(response)
            console.log("response.result5.length", response.result5)
            console.log("response.result7.length", response.result7.length)
            if (isPatientHistory && response.result7.length > 0) {
                const dataExists = checkDataExists(response.result7[0]);
                console.log({ dataExists })
                if (dataExists) {
                    setIsModalOpenForPatHistory(true);
                }
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

    const checkDataExists = (data: any) => {
        const keysToCheck = ['allergy', 'warnings', 'addiction', 'socialHistory', 'familyHistory', 'personalHistory', 'pastMedicalHistory', 'obstetrics'];

        for (const key of keysToCheck) {
            if (data[key] && data[key].trim() !== "") {
                return true;
            }
        }

        return false;
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

        let desData: any = [];
        if (patientDetails?.result7) {
            desData = [
                {
                    label: 'Allergy',
                    key: '1',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.allergy : ""
                }, {
                    label: 'Warnings',
                    key: '2',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.warnings : ""
                },
                {
                    label: 'Addiction',
                    key: '3',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.addiction : ""
                },
                {
                    label: 'Social History',
                    key: '4',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.socialHistory : ""

                }, {
                    label: 'Family History',
                    key: '5',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.familyHistory : ""
                },
                {
                    label: 'Personal History',
                    key: '6',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.personalHistory : ""
                },
                {
                    label: 'Past Medical History',
                    key: '7',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.pastMedicalHistory : ""
                },
                {
                    label: 'Obstetrics',
                    key: '8',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.obstetrics : ""
                }, {
                    label: 'entryDateVar',
                    key: '8',
                    children: patientDetails?.result7.length > 0 ? patientDetails?.result7[0]?.entryDateVar : ""
                },
            ];
        }
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

    const onPressOnCase = (item: any) => {
        console.log(item)
        const patientID: string = item?.patientID;
        // const patientNo: string = patientNo;
        const patientCaseID: string = item?.patientCaseID;
        const patientCaseNo: string = item?.patientCaseNo;

        getPatientDetails(
            patientID,
            patientNo,
            patientCaseID,
            patientCaseNo,
            false
        );
        onClosePastCaseDrawer();
    }

    const pastCasesDrawer = () => {


        return (
            <Drawer title="Patient Past Cases" onClose={onClosePastCaseDrawer} open={openPastCaseDrawer}>
                {patientDetails ?
                    <List
                        itemLayout="vertical"
                        dataSource={patientDetails?.result11}
                        renderItem={(item, index) => (

                            <List.Item>
                                <Card
                                    hoverable={true}
                                    onClick={() => onPressOnCase(item)}
                                    bodyStyle={{ padding: 5, margin: 5 }}
                                >
                                    <h3>{`Case No: ${item?.patientCaseNo}`}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: item?.displayName }} />
                                </Card>

                            </List.Item>

                        )}
                    /> : null}
            </Drawer>
        )
    }

    return (
        <>
            {contextHolder}
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title={
                        <>
                            {patientBasicDetails &&
                                <div>
                                    <h3 style={{ marginTop: 5 }}>
                                        {`${patientBasicDetails?.result1[0]?.candName}`}
                                    </h3>
                                    <h4 style={{ marginTop: -15 }}>
                                        {`${patientBasicDetails?.result1[0]?.patientNo}`}
                                    </h4>
                                </div>
                            }
                        </>

                    }
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                    extra={<>
                        <Button type="primary" loading={loading} onClick={showPastCaseDrawer}>
                            Past Case
                        </Button>
                    </>}
                >

                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {patientBasicDetails ?
                                <Tabs
                                    defaultActiveKey={defaultActiveKey}
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
                {pastCasesDrawer()}
            </Space >
        </>
    );
});

export default DoctorPatientDetails;

