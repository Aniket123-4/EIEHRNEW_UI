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



const Complain = ({ patientDetails = {} }: any) => {
    const { result2 } = patientDetails;

    const columns: ColumnsType<any> = [
        {
            title: 'Complaint Type',
            key: 'complaintTypeName',
            dataIndex: 'complaintTypeName',

        }, {
            title: 'Adm No',
            key: 'admNo',
            dataIndex: 'admNo',

        },
        {
            title: 'Complaint',
            key: 'complaint',
            dataIndex: 'complaint',
        },
        {
            title: 'Entry Date',
            key: 'entryDateVar',
            dataIndex: 'entryDateVar',

        }, {
            title: 'Complaint ML',
            key: 'complaintML',
            dataIndex: 'complaintML',

        }
      
    ];

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                <Table
                    columns={columns}
                    size="small"
                    dataSource={result2}
                    pagination={false}
                />
            </Card>
        </Space>
    );
};

export default Complain;