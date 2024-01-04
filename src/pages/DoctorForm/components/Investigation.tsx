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


const Investigation = ({ patientDetails = {} }: any) => {
    const { result6 } = patientDetails;

    const columns: ColumnsType<any> = [
        {
            title: 'Inv Parameter',
            key: 'invParameterName',
            dataIndex: 'invParameterName',
            fixed: 'left',

        }, {
            title: 'Inv Serial No',
            key: 'invSerialNo',
            dataIndex: 'invSerialNo',
            fixed: 'left',
        },
        {
            title: 'Date',
            key: 'invParameterDateVar',
            dataIndex: 'invParameterDateVar',
        },
        {
            title: 'Result',
            key: 'invParameterResult',
            dataIndex: 'invParameterResult',

        }, {
            title: 'Section',
            key: 'sectionName',
            dataIndex: 'sectionName',

        }, {
            title: 'Remark',
            key: 'invRemark',
            dataIndex: 'invRemark',

        }, {
            title: 'Insurance Comp',
            key: 'insuranceComp',
            dataIndex: 'insuranceComp',

        },
        {
            title: 'Entry',
            key: 'entryDate',
            dataIndex: 'entryDate',

        },
        {
            title: 'Unit',
            key: 'unitName',
            dataIndex: 'unitName',

        },
        {
            title: 'Lab Serial No',
            key: 'labSerialNo',
            dataIndex: 'labSerialNo',

        },
        {
            title: 'Enter By',
            key: 'enterBy',
            dataIndex: 'enterBy',

        }, {
            title: 'Sample Receiving',
            key: 'sampleReceivingDate',
            dataIndex: 'sampleReceivingDate',

        }, {
            title: 'Submit Date',
            key: 'submitDate',
            dataIndex: 'submitDate',

        }, {
            title: 'Is Nursing Done',
            key: 'isNursingDone',
            dataIndex: 'isNursingDone',

        }, {
            title: 'Is XRay Exists',
            key: 'isXRayExists',
            dataIndex: 'isXRayExists',

        }, {
            title: 'No Of Injection',
            key: 'noOfInjection',
            dataIndex: 'noOfInjection',

        }, {
            title: 'ML',
            key: 'invParameterNameML',
            dataIndex: 'invParameterNameML',

        }, {
            title: 'Is Normal',
            key: 'isNormal',
            dataIndex: 'isNormal',

        }, {
            title: 'Remark',
            key: 'remarkDoc',
            dataIndex: 'remarkDoc',

        }, {
            title: 'Volume',
            key: 'volume',
            dataIndex: 'volume',

        }, {
            title: 'Group',
            key: 'invGroupName',
            dataIndex: 'invGroupName',
            fixed: 'right',
        },
        {
            title: 'Normal text',
            key: 'normaltext',
            dataIndex: 'normaltext',
            fixed: 'right',
        },

    ];

    return (
        <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            <Card>
                <Table
                    columns={columns}
                    size="small"
                    dataSource={result6}
                    pagination={false}
                />
            </Card>
        </Space>
    );
};

export default Investigation;