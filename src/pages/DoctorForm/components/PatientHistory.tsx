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

const { RangePicker } = DatePicker;



const PatientHistory = ({ patientDetails = {} }: any) => {
    const { result7 } = patientDetails;

    const columns: ColumnsType<any> = [
        {
            title: 'Allergy',
            key: 'allergy',
            dataIndex: 'allergy',
        }, {
            title: 'Warnings',
            key: 'warnings',
            dataIndex: 'warnings',
        },
        {
            title: 'Addiction',
            key: 'addiction',
            dataIndex: 'addiction',
        },
        {
            title: 'Social History',
            key: 'socialHistory',
            dataIndex: 'socialHistory',

        }, {
            title: 'Family History',
            key: 'familyHistory',
            dataIndex: 'familyHistory',
        },
        {
            title: 'Personal History',
            key: 'personalHistory',
            dataIndex: 'personalHistory',
        },
        {
            title: 'Past Medical History',
            key: 'pastMedicalHistory',
            dataIndex: 'pastMedicalHistory',
        },
        {
            title: 'Obstetrics',
            key: 'obstetrics',
            dataIndex: 'obstetrics',
        },

    ];

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                <Table
                    columns={columns}
                    size="small"
                    dataSource={result7}
                    pagination={false}
                />
            </Card>
        </Space>
    );
};

export default PatientHistory;