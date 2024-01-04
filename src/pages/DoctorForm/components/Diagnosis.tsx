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



const Diagnosis = ({ patientDetails={} }: any)  => {
    const { result4 } = patientDetails;

    const columns: ColumnsType<any> = [
        {
            title: 'admNo',
            key: 'admNo',
            dataIndex: 'admNo',

        }, 
        {
            title: 'enterDate',
            key: 'enterDateVar',
            dataIndex: 'enterDateVar',
        },
        {
            title: 'Diagnosis Comment',
            key: 'diagnosisComment',
            dataIndex: 'diagnosisComment',

        },{
            title: 'Disease Name',
            key: 'diseaseName',
            dataIndex: 'diseaseName',

        }, {
            title: 'Disease Type',
            key: 'diseaseTypeName',
            dataIndex: 'diseaseTypeName',

        }, {
            title: 'Special Type',
            key: 'specialTypeName',
            dataIndex: 'specialTypeName',
        }
      
    ];

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                <Table
                    columns={columns}
                    size="small"
                    dataSource={result4}
                    pagination={false}
                />
            </Card>
        </Space>
    );
};

export default Diagnosis;