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
        console.log(response?.result);
        const result1 = response?.result1[0];
        if (response?.result2) {
            const result2 = response?.result2[0];
            setPatientImage(result2);
        }
        console.log(Object.keys(props).length)


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
        Object.keys(props).length ? props?.onChange({ ...result1, "patientCaseID": values.case }) : null;
        //getGetPatientSearchList("")
        if (!response?.isSuccess) {
            message.error(response?.msg);
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
        if (res.result.length > 0) {
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
                return { value: item.patientCaseID, label: item.admNo }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "All" });
            setAdmissionNo(dataMaskForDropdown)
        }
    }
    const handleChangeCase = (v: any) => {
        Object.keys(props).length ? props?.onChange({ ...props?.patData, "patientCaseID": v }) : null;
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
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ marginTop: 28 }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item name="case" label="Case No" rules={[{ required: props.required ? props.required :false }]}>
                        <Select
                            style={{ width: 200 }}
                            onChange={handleChangeCase}
                            options={caseChoice}
                            placeholder="Select"
                        />
                    </Form.Item>
                    <Form.Item name="AdmissionNo" label="Admission No" rules={[{ required: props.required ? props.required :false }]}>
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
                            style={{justifyContent:'center', color: 'black', borderColor: 'black' }}
                            src={patientImage?.photo? `data:image/png;base64,${patientImage?.photo}`:null} >No Image</Avatar>}
                    </Col>
                </Row>}
            </>
        </Card>
    );
});

export default PatientDetailsCommon;