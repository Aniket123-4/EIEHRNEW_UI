import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Descriptions, DescriptionsProps, Avatar } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestFnGetPatientSearch, requestGetPatientHeader, requestGetPatientVisitNo } from '../services/api';


const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;



const PatientDetailsCommon = React.forwardRef((props: any) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [patientData, setPatientData] = useState({});
    const [patientImage, setPatientImage] = useState<any>();
    const [caseChoice, setCaseChoice] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [admissionNo, setAdmissionNo] = useState([]);


    useEffect(() => {
        getGetPatientSearchList("");
    }, [])


    const onFinishPatForm = async (values: any) => {
        form.resetFields(["case","AdmissionNo"])
        values['case'] = values.case ? values.case : -1;
        setAdmissionNo([])
        const params = {
            patientNo: values?.patientNo,
            patientID: -1,
            userID: -2,
            formID: 1,
            type: 1
        }
        const response = await requestGetPatientHeader(params);
        setLoading(false)
        if (response?.result1 != null && response?.isSuccess == true) {
            //console.log(response?.result1[0].candName);
            form.setFieldValue("Search", response?.result1[0].candName)
            const result1 = response?.result1[0];
            console.log(result1)
            if (response?.result2) {
                const result2 = response?.result2[0];
                setPatientImage(result2);
            }

            const caseChoiceMaskForDropdown = response?.result3?.map((item: any) => {
                return { value: item.patientCaseID, label: item.patientCaseNo }
            });
            setCaseChoice(caseChoiceMaskForDropdown)
            if(caseChoiceMaskForDropdown)
                {
                    form.setFieldValue("case",caseChoiceMaskForDropdown[0].value);
                    getPatientVisitNo(caseChoiceMaskForDropdown[0].value);
                    // Object.keys(props).length ? props?.onChange({ ...result1, "patientCaseID": values.case }) : null;
                    props?.onChange({ ...result1, "patientCaseID": caseChoiceMaskForDropdown[0].value });
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
                            label: 'Civil Status',
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
                    ];
                    setPatientData({ patentBasicDetails })
                }
                else{
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
                        // {
                        //     key: '4',
                        //     label: 'Age',
                        //     children: result1?.age
                        // },
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
                            label: 'Civil Status',
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
                        // {
                        //     key: '14',
                        //     label: 'Insurance Company',
                        //     children: result1?.insuranceComp
                        // }
                    ];
                    setPatientData({ patentBasicDetails })
                    props?.onChange({ ...result1, "patientCaseID": values.case });
                }
        }
        if (!response?.isSuccess || response?.result1 == null) {
            setPatientImage("");
            setPatientData({})
            message.error("NO PATIENT FOUND");
            form.resetFields();
        }
    };

    const getGetPatientSearchList = async (value: string = "") => {
        const params = {
            "patientNo": "",
            "patientName": value,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestFnGetPatientSearch(params);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.patientNo, label: item.patientName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setPatientList(dataMaskForDropdown)
        }
    }
    const getPatientVisitNo = async (value: any) => {
        const params = {
            "patientCaseID": value.toString(),
            "patientCaseNo": 1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetPatientVisitNo(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.rowID, label: item.admNo }
            })
            // dataMaskForDropdown.unshift({ value: "-1", label: "All" });
            if(dataMaskForDropdown)
                form.setFieldValue("AdmissionNo",dataMaskForDropdown[0].value)
            setAdmissionNo(dataMaskForDropdown)
        }
    }
    const handleChangeCase = (v: any) => {
        Object.keys(props).length ? props?.onChange({ ...props?.patData, "patientCaseID": v }) : null;
        form.resetFields(["AdmissionNo"])
        getPatientVisitNo(v)
    }
    const handleChangeAdmission = (v: any) => {
        console.log({ props, "admNo": v?.label });
        Object.keys(props).length ? props?.onChange({ ...props?.patData, "admNo": v?.label }) : null;
    }
    const onChange = (value: string) => {
        onFinishPatForm({ patientNo: value })
        form.setFieldsValue({
            "patientNo": value
        })
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
        getGetPatientSearchList(value);
    };

    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, patientList?: { label: string; value: string }) =>
        (patientList?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Card>
            <Form
                onFinish={onFinishPatForm}
                form={form}
                layout="vertical"
            >
                <Space>

                    <Form.Item name="Search" label="Search">
                        <Select
                            style={{ width: 200 }}
                            showSearch
                            placeholder="Please Input For Search"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            notFoundContent={null}
                            options={(patientList).map((d) => ({
                                value: d?.value,
                                label: d?.label,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="patientNo" label="Patient No" rules={[{ required: true }]}>
                        <Input allowClear maxLength={20} />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ marginTop: 28 }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item name="case" label="Case No" rules={[{ required: props.required ? props.required : false }]}>
                        <Select
                            style={{ width: 200 }}
                            onChange={handleChangeCase}
                            options={caseChoice}
                            placeholder="Select"
                        />
                    </Form.Item>
                    <Form.Item name="AdmissionNo" label="Admission No" rules={[{ required: props.required ? props.required : false }]}>
                        <Select
                            style={{ width: 200 }}
                            onChange={handleChangeAdmission}
                            labelInValue={true}
                            options={admissionNo}
                            placeholder="Select"
                        />
                    </Form.Item>
                </Space>
            </Form >
            <>
                {patientData && <Row>
                    <Col span={22}>
                        <Descriptions
                            bordered
                            size={'small'}
                            items={patientData?.patentBasicDetails}
                        />
                    </Col>
                    <Col span={2}>
                        {patientImage &&
                            <Avatar size={100}
                                style={{ justifyContent: 'center', color: 'black', borderColor: 'black' }}
                                src={patientImage?.photo ? `data:image/png;base64,${patientImage?.photo}` : null} >No Image</Avatar>}
                    </Col>
                </Row>}
            </>
        </Card>
    );
});

export default PatientDetailsCommon;