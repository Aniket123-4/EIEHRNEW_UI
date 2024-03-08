import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Table, message, TimePicker } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getUserInLocalStorage } from '@/utils/common';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';


const ClinicalFinding = ({ patientDetails, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result10 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [isRecording, setisRecording] = useState(false);
    const [note, setNote] = useState(null);
    const [notesStore, setnotesStore] = useState([]);

    const columns: ColumnsType<any> = [
        {
            title: 'Clinical Finding',
            key: 'clinicalFinding',
            dataIndex: 'clinicalFinding',

        }, {
            title: 'Entry Date',
            key: 'entryDate',
            dataIndex: 'entryDate',

        }
    ];



    const formView = () => {

        useEffect(() => {
            startRecordController();
        }, [isRecording]);
        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo": admNo,
                "col1": "",
                "col2": "",
                "col3": "",
                "col4": "",
                "col5": values?.clinicalFinding,
                "col6": "",
                "col7": "",
                "col8": "",
                "col9": "",
                "col10": "",
                "col11": "",
                "col12": "",
                "col13": "",
                "col14": "",
                "col15": "",
                "col16": "",
                "col17": "",
                "col18": "",
                "col19": "",
                "col20": "",
                "col21": "",
                "col22": "",
                "isForDelete": false,
                "lstType_DocPatient": [
                    {
                        "col1": "",
                        "col2": "",
                        "col3": "",
                        "col4": "",
                        "col5": "",
                        "col6": "",
                        "col7": "",
                        "col8": "",
                        "col9": "",
                        "col10": "",
                        "col11": "",
                        "col12": "",
                        "col13": "",
                        "col14": "",
                        "col15": ""
                    }
                ],
                "lstType_Patient": [
                    {
                        "col1": "",
                        "col2": "",
                        "col3": "",
                        "col4": "",
                        "col5": "",
                        "col6": "",
                        "col7": "",
                        "col8": "",
                        "col9": "",
                        "col10": "",
                        "col11": "",
                        "col12": "",
                        "col13": "",
                        "col14": "",
                        "col15": ""
                    }
                ],
                "userID": verifiedUser?.userID,
                "formID": -1,
                "type": 13
            }
            try {
                setLoading(true)
                const response = await requestAddDelPatientForDoctorOPIP({ ...params });
                setLoading(false)

                if (response?.isSuccess) {
                    tabForm.resetFields();
                }
                onSaveSuccess({
                    tab: "CLINICAL_FINDING",
                    response
                })

            } catch (e) {
                setLoading(false)
            }
        };



        const handleChangeFilter = (value: any) => { }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const microphone = new SpeechRecognition();

        microphone.continuous = true;
        microphone.interimResults = true;
        microphone.lang = "en-US";

        const startRecordController = () => {
            if (isRecording) {
                microphone.start();
                microphone.onend = () => {
                    console.log("continue..");
                    microphone.start();
                };
            } else {
                microphone.stop();
                microphone.onend = () => {
                    console.log("Stopped microphone on Click");
                };
            }
            microphone.onstart = () => {
                console.log("microphones on");
            };

            microphone.onresult = (event: any) => {
                const recordingResult: any = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result) => result.transcript)
                    .join("");
                console.log(recordingResult);
                setNote(recordingResult);
                microphone.onerror = (event: any) => {
                    console.log(event.error);
                };
            };
        };
        const storeNote = () => {
            console.log(notesStore,note,isRecording)
            setnotesStore([...notesStore, note]); 
            setNote("");
        };

        return (
            <Form
                form={tabForm}
                onFinish={onFinishPatForm}
                layout="vertical"
                size={'small'}
            >
                <>
                    <h1>Record Voice Notes</h1>
                    <div>
                        <div className="noteContainer">
                            <h2>Record Note Here</h2>
                            {isRecording ? <span>Recording... </span> : <span>Stopped </span>}
                            <button className="button" onClick={storeNote} disabled={!note}>
                                Save
                            </button>
                            <button onClick={() => setisRecording((prevState) => !prevState)}>
                                Start/Stop
                            </button>
                            <p>{note}</p>
                        </div>
                        <div className="noteContainer">
                            <h2>Notes Store</h2>
                            **{notesStore.map((note) => (
                                <p key={note}>{note}</p>
                            ))}**
                        </div>
                    </div>
                </>



                <Form.Item>
                    <Button type="primary" loading={loading} htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        )
    }

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                {formView()}
            </Card>
            <Table
                columns={columns}
                size="small"
                dataSource={result10}
                pagination={false}
            />
        </Space>
    );
};

export default ClinicalFinding;