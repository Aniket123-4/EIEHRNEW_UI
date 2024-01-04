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



const VitalSign = ({ patientDetails = {} }: any) => {
    const { result3 } = patientDetails;

    const columns: ColumnsType<any> = [
        {
            title: 'Adm No',
            key: 'admNo',
            dataIndex: 'admNo',

        }, {
            title: 'Vital Parameter',
            key: 'vitalParameterName',
            dataIndex: 'vitalParameterName',

        },
        {
            title: 'Vital Unit',
            key: 'vitalUnitName',
            dataIndex: 'vitalUnitName',
        },
        {
            title: 'Vital Serial No',
            key: 'vitalSerialNo',
            dataIndex: 'vitalSerialNo',

        }, {
            title: 'vital Date',
            key: 'vitalDateTimeVar',
            dataIndex: 'vitalDateTimeVar',

        },
        //  {
        //     title: 'vitalDateVar',
        //     key: 'vitalDateVar',
        //     dataIndex: 'vitalDateVar',

        // },
         {
            title: 'Result',
            key: 'vitalResult',
            dataIndex: 'vitalResult',

        }, {
            title: 'Comment',
            key: 'vitalComment',
            dataIndex: 'vitalComment',

        }, {
            title: 'Descp',
            key: 'vitalDescp',
            dataIndex: 'vitalDescp',

        }, {
            title: 'Enter By',
            key: 'enterBy',
            dataIndex: 'enterBy',

        }
      
    ];

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Table
                columns={columns}
                size="small"
                dataSource={result3}
                pagination={false}
            />
        </Space>
    );
};

export default VitalSign;