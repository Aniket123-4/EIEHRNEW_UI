import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Modal } from 'antd';
import {
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProColumns,
    ProDescriptions,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { requestReport } from './services/api';

const { Option } = Select;
const { confirm } = Modal;

const Report: React.FC = () => {
    const [openEditCandidate, setOpenEditCandidate] = useState(false);
    const [openAddCandidate, setOpenAddCandidate] = useState(false);
    const [openViewCandidate, setOpenViewCandidate] = useState(false);
    const actionRef = useRef<any>();
    const [selectedRows, setSelectedRows] = useState<Object>({});
    const [isEditable, setIsEditable] = useState<boolean>(false);

    const columns: ProColumns<API.RuleListItem>[] = [
        {
            title: '#Candidate Name',
            dataIndex: 'firstName',
        },
        {
            title: 'Email',
            dataIndex: 'emailID',
            valueType: 'textarea',
        },
        {
            title: 'Mobile No',
            dataIndex: 'mobileNo',
            sorter: true,
        },
        {
            title: 'panNo',
            dataIndex: 'panNo',
        },
        {
            title: 'Inst. Name',
            dataIndex: 'instName',
            sorter: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" size={"small"} onClick={() => onView(record)} icon={<EyeOutlined />} />
                    <Button type="primary" size={"small"} onClick={() => onEdit(record)} icon={<EditOutlined />} />
                    <Button type="primary" danger size={"small"} onClick={() => onDelete(record)} icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    const onEdit = (record: any) => {
        setSelectedRows(record)
        setIsEditable(true)
        setOpenEditCandidate(true);
    };

    const onView = (record: any) => {
        console.log(record)
        setSelectedRows(record)
        setOpenViewCandidate(true);
    };

    const onDelete = (record: any) => {
        setSelectedRows(record)
        showDeleteConfirm();
    };

    const addCandidate = () => {
        setSelectedRows({});
        setIsEditable(false)
        setOpenAddCandidate(true);
    };


    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleFilled />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const reloadTable = () => {
        actionRef.current.reload();
    }

    return (
        <PageContainer >
            <Space align="baseline">
                <Button type="primary" onClick={addCandidate} icon={<PlusOutlined />}>
                    New Candidate
                </Button>
            </Space>
            <br />
            <br />
            <ProTable<API.RuleListItem, API.PageParams>
                headerTitle={'Candidate List'}
                actionRef={actionRef}
                rowKey="key"
                search={false}
                request={async (

                ) => {
                    // Here you need to return a Promise, and you can transform the data before returning it
                    // If you need to transform the parameters you can change them here

                    const params = {
                        "fromDate": "2023-09-01T12:21:36.322Z",
                        "toDate": "2023-09-01T12:21:36.322Z",
                        "finYearID": "-1",
                        "instituteID": "-1",
                        "roomTypeID": "-1",
                        "rateTypeID": "-1",
                        "userID": "-1",
                        "formID": "-1",
                        "type": "1"
                    }

                    const msg = await requestReport(params);
                    console.log(msg.data.totBookDate)
                    return Promise.resolve({
                        data: msg.data.totBookDate,
                        success: true,
                    });
                }}

                columns={columns}
            />

        </PageContainer>
    );
};

export default Report;