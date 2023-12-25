import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, theme, Card, Radio, Modal, Tabs, TabsProps, InputNumber, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import { dateFormat } from '@/utils/constant';
import { requestAddUpdatePatientCase, requestGetPatientDailyCount, requestGetPatientSearchOPIP } from '../services/api';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import { requestGetInvParameterMasterList } from '@/pages/Complaint/services/api';
import { ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { convertDate, convertDateInSSSZFormat } from '@/utils/helper';

const { Option } = Select;

const { Text, Link } = Typography;

const AddUpdatePatientCase = React.forwardRef((props) => {
    const [filterForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [selectedConsultantDocID, setSelectedConsultantDocID] = useState();
    const [sections, setSections] = useState<any>([])
    const [invParameter, setInvParameter] = useState<any>([])
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [selectedRowsState, setSelectedRows] = useState<any>([]);
    const [formVisible, setFormVisible] = useState<any>(false);
    const [rowSelectionVisible, setRowSelectionVisible] = useState<any>(false);
    const [doctorList, setDoctorList] = useState<any>([])


    const columns: ProColumns<any>[] = [
        {
            title: 'inv Parameter ID',
            dataIndex: 'invParameterID',
            key: 'invParameterID',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Inv Parameter Name',
            dataIndex: 'invParameterName',
            key: 'invParameterName',
        },
        // {
        //     title: 'Checked',
        //     key: 'isChecked',
        //     dataIndex: 'isChecked',
        //     render: (text) => <a>{text ? <Tag color="green">Yes</Tag> : <Tag color="magenta">No</Tag>}</a>,
        // },
        {
            title: 'isSaved',
            key: 'isSaved',
            dataIndex: 'isSaved',
            render: (text) => <a>{text ? <Tag color="green">Yes</Tag> : <Tag color="magenta">No</Tag>}</a>,
        }
    ];

    useEffect(() => {
        setSelectedRows([])

        if (props?.preEmpType === "5") {
            setSelectionType('radio')
        } else {
            setSelectionType('checkbox')
        }
        if (props?.checkinData?.result4.length === 0) {
            setFormVisible(true)
        } else {
            setFormVisible(false)
        }
        filterForm.setFieldsValue({
            patientCaseID: -1,
            patientID: -1,
            caseType: 1,
            admissionDate: dayjs(moment(), dateFormat),
            dischargeDate: '',
            consultantDocID: '',
            referToDocID: '',
            sectionID: '',
            admTypeID: -1,
            patientFoundID: 1,
            proDiagnosis: '',
            patientFileNo: props?.patientData?.patientNo,
            deductablePercentage: 100,
            allergy: '',
            warnings: '',
            addiction: '',
            socialHistory: '',
            familyHistory: '',
            personalHistory: '',
            pastMedicalHistory: '',
            obstetrics: '',
            isNextVisit: true,
            priority: 0,
            invParameterID: '',
            preEmpTypeID: 1,
            lstType_ro: [
                {
                    rowID: 1,
                    rowValue: '12'
                }
            ],
            serviceID: ''
        })
    }, [props?.preEmpType])


    useEffect(() => {

        getSectionList();
        getInvParameter();

    }, []);


    const getInvParameter = async () => {
        const params1 = {
            invParameterID: -1,
            invGroupID: -1,
            isActive: -1,
            formID: -1,
            type: 2
        }
        const res = await requestGetInvParameterMasterList(params1);
        // console.log(res);
        // if (res?.result?.length > 0) {
        const dataMaskForDropdown = res?.result?.map((item: any) => {
            return { value: item.invParameterID, label: item.invName }
        });
        console.log(dataMaskForDropdown);
        setInvParameter(dataMaskForDropdown)
        // }
    }



    const getSectionList = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetSection(params);

        if (res.result.length > 0) {

            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.sectionID, label: item.sectionName }
            });
            // dataMaskForDropdown.unshift({ value: -1, label: "All" });
            setSections(dataMaskForDropdown)
        }
    }

    const getDoctorList = async (value: any, item: any) => {
        const params = {
            "CommonID": item.value,
            "Type": 3,
        }
        const res = await requestGetUserList(params);
        console.log(res)
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.userID, label: item.userName }
            })
            setDoctorList(dataMaskForDropdown)
        }
    }



    const onFinishPatForm = async (values: any) => {
        // if (!values.admissionDate) {
        values['admissionDate'] = convertDate(values?.admissionDate);
        // }

        // if (!values.dischargeDate) {
        values['dischargeDate'] = values?.admissionDate;
        // }

        if (values.invParameterID === "") {
            values['invParameterID'] = 1;
        }
        console.log(values);

        const { preEmpType }: any = props;

        const lstType = preEmpType === "1" || preEmpType === "2" || preEmpType === "3" || preEmpType === "4" || preEmpType === "5" ? [] : selectedRowsState.map((row, index) => {
            return {
                rowID: index + 1,
                rowValue: row?.invParameterID
            }
        });

        const serviceID = preEmpType === "6" || preEmpType === "7" ? 1 : selectedRowsState[0]?.invParameterID;

        const params = {
            ...values,
            referToDocID: selectedConsultantDocID,
            patientID: -1,
            userID: -1,
            formID: -1,
            type: 2,
            lstType_ro: lstType,
            serviceID: serviceID,
            isNextVisit: true,
            patientCaseID: -1,
            patientFoundID: 1,
            preEmpTypeID: 1,
            admTypeID: 1,
            caseType: 1,
        }
        console.log(JSON.stringify(params));
        const response = await requestAddUpdatePatientCase(params);
        setLoading(false)

        if (response?.isSuccess) {
            filterForm.resetFields()
            message.success(response?.msg);
        } else {
            message.error(response?.msg);
        }

        props.handleCancel();
    };

    const handleChangeFilter = (value: any, tag: string) => {
        console.log(`handleChangeFilter`);
        console.log(value);
        switch (tag) {
            case 'consultantDocID':
                setSelectedConsultantDocID(value)
                break;
            case 'sectionID':
                setSelectedConsultantDocID(value)
                break;
        }
    }

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record: any) => {
            // const rowIndex = list.findIndex((item) => item.key === record.key);
            // return {
            //     disabled: !record.isFree//enable first 2 rows only
            // };
        }
    };



    return (
        <>
            <Form
                form={filterForm}
                onFinish={onFinishPatForm}
                layout="vertical"
            >

                {!formVisible ? <Card title={<Typography style={{ color: 'white', fontSize: 18 }}>
                    {"Battery of Service"}</Typography>} style={{ boxShadow: '2px 2px 2px #4874dc' }}
                    headStyle={{ backgroundColor: '#004080', border: 0 }}>
                    <Table
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        pagination={false}
                        dataSource={props?.checkinData?.result4.map((item, index) => { return { ...item, key: index } })}
                    />
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        {rowSelectionVisible ? <Text style={{ marginTop: 20 }} type="danger">Selection required</Text> : null}
                        <Button
                            type="primary"
                            style={{ marginTop: 10 }}
                            loading={loading} onClick={() => {
                                if (selectedRowsState.length == 0) {
                                    setRowSelectionVisible(true)
                                } else {
                                    setFormVisible(true)
                                }
                            }}
                        >
                            Next
                        </Button>
                    </Space>
                </Card> : null}

                {formVisible ?
                    <>

                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            <Card title={<Typography style={{ color: 'white', fontSize: 18 }}>
                                {"General"}</Typography>} style={{ boxShadow: '2px 2px 2px #4874dc' }}
                                headStyle={{ backgroundColor: '#004080', border: 0 }}>

                                <Row gutter={16}>
                                    {/* <Col span={8}>
                        <Form.Item name="patientCaseID" label="Patient Case" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col> */}
                                    {/* <Col span={8}>
                        <Form.Item name="caseType" label="Case Type" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col> */}
                                    <Col span={8}>
                                        <Form.Item name="admissionDate" label="Admission Date" rules={[{ required: true }]}>
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                format={dateFormat}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="sectionID" label="Section" rules={[{ required: true }]}>
                                            <Select
                                                onChange={(data) => handleChangeFilter(data, "sectionID")}
                                                options={sections}
                                                showSearch
                                                defaultActiveFirstOption={true}
                                                onChange={(value, item) => {
                                                    getDoctorList(value, item)
                                                    filterForm.setFieldsValue({
                                                        consultantDocID: ''
                                                    })
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="consultantDocID" label="Consultant" rules={[{ required: true }]}>
                                            <Select
                                                showSearch
                                                onChange={(data) => handleChangeFilter(data, "consultantDocID")}
                                                options={doctorList}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    {/* <Col span={8}>
                        <Form.Item name="dischargeDate" label="Discharge Date" rules={[{ required: false }]}>
                            <DatePicker
                                style={{ width: "100%" }}
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Col> */}

                                </Row>


                                {/* <Row gutter={16}>

                    <Col span={8}>
                        <Form.Item name="admTypeID" label="admTypeID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: 1, label: "All" }]}
                                defaultValue={1}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item name="patientFoundID" label="patientFoundID" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: 1, label: "All" }]}
                                defaultValue={1}
                            />
                        </Form.Item>
                    </Col>
                </Row> */}


                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item name="proDiagnosis" label="Pro Diagnosis" rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="patientFileNo" label="Patient FileNo" rules={[{ required: true }]}>
                                            <Input disabled />
                                        </Form.Item>

                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="deductablePercentage" label="Deductable Percentage" rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="invParameterID" label="Inv Parameter" rules={[{ required: false }]}>
                                            <Select
                                                onChange={(data) => handleChangeFilter(data, "invParameterID")}
                                                options={invParameter}
                                                showSearch
                                            />
                                        </Form.Item>

                                    </Col>
                                </Row>
                            </Card>




                            <Card title={
                                <Typography style={{ color: 'white', fontSize: 18 }}>
                                    {"Allergic"}
                                </Typography>
                            } style={{ boxShadow: '2px 2px 2px #4874dc' }}
                                headStyle={{ backgroundColor: '#004080', border: 0 }}>

                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item name="allergy" label="Allergy" rules={[{ required: false }]}>
                                            <Input />
                                        </Form.Item>

                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="warnings" label="Warnings" rules={[{ required: false }]}>
                                            <Input />
                                        </Form.Item>

                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="addiction" label="Addiction" rules={[{ required: false }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item name="socialHistory" label="Social History" rules={[{ required: false }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="familyHistory" label="Family History" rules={[{ required: false }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="personalHistory" label="Personal History" rules={[{ required: false }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item name="pastMedicalHistory" label="Past Medical History" rules={[{ required: false }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="obstetrics" label="Obstetrics" rules={[{ required: false }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    {/* <Col span={8}>
                                        <Form.Item name="serviceID" label="Service ID" rules={[{ required: false }]}>
                                            <Select
                                                onChange={handleChangeFilter}
                                                options={[]}
                                                defaultValue={1}
                                            />
                                        </Form.Item>
                                    </Col> */}
                                </Row>
                            </Card>

                            <Form.Item>
                                <Button type="primary" loading={loading} htmlType="submit">
                                    Submit
                                </Button>

                            </Form.Item>


                        </Space>


                    </> : null}
            </Form >
        </>
    );
});

export default AddUpdatePatientCase;




