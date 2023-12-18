import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Descriptions, DescriptionsProps } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestGetInvGroup, requestGetInvestigation, requestGetPatientHeader, requestGetPatientSearch } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';
import { getUserInLocalStorage } from '@/utils/common';
import { requestAddPatRequest } from '@/pages/Booking/services/api';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}

const PatientDetailsCommon = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [patientData, setPatientData] = useState({});
    const [caseChoice, setCaseChoice] = useState([]);


    const onFinishPatForm = async (values: any) => {

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
            {
                key: '4',
                label: 'Age',
                children: result1?.age
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
            {
                key: '14',
                label: 'Insurance Company',
                children: result1?.insuranceComp
            }
        ];

        setPatientData({ patentBasicDetails })
        if (!response?.isSuccess) {
            message.error(response?.msg);
        }
    };

    const handleChangeCase = () => {

    }

    return (
        <Card>
            <Form
                onFinish={onFinishPatForm}
                form={form}
                layout="vertical"
            >
                <Space>
                    <Form.Item name="patientNo" label="Patient No" rules={[{ required: true }]}>
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ marginTop: 28 }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item name="case" label="Case No" rules={[{ required: false }]}>
                        <Select
                            style={{ width: 200 }}
                            onChange={handleChangeCase}
                            options={caseChoice}
                            placeholder="Select"
                        />
                    </Form.Item>
                </Space>
            </Form >
            <>
                {patientData && <Descriptions
                    bordered
                    size={'small'}
                    items={patientData?.patentBasicDetails}
                />}
            </>
        </Card>
    );
});

export default PatientDetailsCommon;