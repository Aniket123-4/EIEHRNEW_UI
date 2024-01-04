import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import DoctorSlotBookingList from './DoctorSlotBookingList';

const { RangePicker } = DatePicker;



const Medication = ({ patientDetails={} }: any) => {
    const { result1 } = patientDetails;

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'patNameTitle',
            dataIndex: 'patNameTitle',

        }, {
            title: 'Patient Number',
            key: 'patientNo',
            dataIndex: 'patientNo',

        },
        {
            title: 'Case Number',
            key: 'patientCaseNo',
            dataIndex: 'patientCaseNo',
        },
        {
            title: 'Age',
            key: 'age',
            dataIndex: 'age',

        }, {
            title: 'Section',
            key: 'sectionName',
            dataIndex: 'sectionName',

        }, {
            title: 'Doctor Name',
            key: 'doctorName',
            dataIndex: 'doctorName',

        }, {
            title: 'Insurance Comp',
            key: 'insuranceComp',
            dataIndex: 'insuranceComp',

        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} onClick={() => {
                    }}>action</Button>

                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                <Table
                    columns={columns}
                    size="small"
                    dataSource={result1}
                    pagination={false}
                />
            </Card>
        </Space>
    );
};

export default Medication;