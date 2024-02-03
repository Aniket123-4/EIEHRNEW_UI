import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker, Descriptions, Avatar } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import DoctorSlotBookingList from './DoctorSlotBookingList';
import { ColumnsType } from 'antd/es/table';
import { UserOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;



const BasicDetails = ({ patientBasicDetails = {},admNo }: any) => {

    console.log(patientBasicDetails);

    const result1 = patientBasicDetails?.result1[0];

    const basicDetails = [
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
        }
        // {
        //     key: '14',
        //     label: 'Insurance Company',
        //     children: result1?.insuranceComp
        // }
    ];

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                <Space align="center" size={24}>
                    <Avatar size={164} icon={<UserOutlined />} />
                </Space>

            </div>

            {patientBasicDetails && <Descriptions
                bordered
                size={'small'}
                items={basicDetails}
            />}
        </Space>
    );
};

export default BasicDetails;