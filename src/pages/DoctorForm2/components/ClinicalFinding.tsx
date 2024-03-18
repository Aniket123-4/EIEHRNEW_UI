import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Table, message, TimePicker, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getUserInLocalStorage } from '@/utils/common';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { AudioOutlined } from '@ant-design/icons';


const ClinicalFinding = ({ patientDetails, patientCaseID, onSaveSuccess, admNo }: any) => {
    const { result10 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [note, setNote] = useState<string>("");


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
    
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        // const prevValue=tabForm.getFieldValue("clinicalFinding") ? tabForm.getFieldValue("clinicalFinding") :""
        tabForm.setFieldValue("clinicalFinding",transcript)
    }, [transcript])

    const startListening = () => SpeechRecognition.startListening({ continuous: true });

    const formView = () => {

        // useEffect(() => {
        //     startRecordController();
        // }, [isRecording]);
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

        const onChangeNote = (value: any) => {
            resetTranscript
            //tabForm.setFieldValue("clinicalFinding",value)
            console.log(transcript)
        }


        if (!browserSupportsSpeechRecognition) {
            return <span>Browser doesn't support speech recognition.</span>;
        }
        return (
            <>
                <Form
                    form={tabForm}
                    onFinish={onFinishPatForm}
                    layout="vertical"
                    size={'small'}
                >
                    <div>
                        <Form.Item name="clinicalFinding"
                            label={<Row >
                                Complaint
                                <p style={{ backgroundColor: 'lightgreen' }}>{listening ? 'Listening' : ''}</p>
                                <Button
                                    icon={<AudioOutlined color={listening ? 'red' : 'blue'} />}
                                    onTouchStart={startListening}
                                    onMouseDown={startListening}
                                    onTouchEnd={SpeechRecognition.stopListening}
                                    onMouseUp={SpeechRecognition.stopListening}
                                ></Button>
                                <Button type={'link'} onClick={resetTranscript}>Clear</Button>
                            </Row>

                            }>
                            <Input.TextArea onChange={(e)=>{resetTranscript;onChangeNote(e.target.value)}} />

                        </Form.Item>
                        {/* <p>{listening ? 'Listening' : ''}</p>
                        <Button
                            icon={<AudioOutlined color={listening ? 'red' : 'blue'} />}
                            onTouchStart={startListening}
                            onMouseDown={startListening}
                            onTouchEnd={SpeechRecognition.stopListening}
                            onMouseUp={SpeechRecognition.stopListening}
                        ></Button>
                        <Button type={'link'} onClick={resetTranscript}>Clear</Button>*/}
                    </div>
                    <Button type="primary" loading={loading} htmlType='submit'>
                        Submit
                    </Button>
                </Form>
            </>
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