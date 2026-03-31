import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Typography, Popconfirm, Checkbox, InputRef, Radio } from 'antd';
import { requestGetComplaintType, requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddDirectItemReceipt, requestGetDirectItem, requestGetItem } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { convertDate } from '@/utils/helper';

const { Option } = Select;

interface Item {
    key: string;
    name: string;
    isActive: any;
    address: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}


const DirectItemList = ({ refresh, editRecord }: any) => {
    const [searchText, setSearchText] = useState('');

    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [directItemList, setDirectItemList] = useState<any>([])
    const { token } = theme.useToken();
    const [editingKey, setEditingKey] = useState('');
    const [approved, setApproved] = useState(0);
    const isEditing = (record: Item) => record.key === editingKey;
    // const [isActive, setisActive] = useState<any>([{ value: "true", label: "True" }, { value: "false", label: "False" }])
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        getDirectItemList();
        console.log(refresh)
    }, [refresh])



    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: 'VoucherNo',
            dataIndex: 'issueVoucherNo',
            key: 'issueVoucherNo',
            // render: (text) => <a>{text}</a>,
            // width: '35%',
        },
        {
            title: 'issueDate',
            dataIndex: 'issueDate',
            key: 'issueDate',
            // width: '25%',
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplierName',
            key: 'supplierName',
            // width: '25%',
        },
        {
            title: 'IsApproved',
            dataIndex: 'isFinalApproved',
            key: 'isFinalApproved',
            // width: '15%',
            render: (text: any) =>
                <Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Yes' : 'No'}</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            width: '25%',
            render: (_: any, record: any) => {
                return (
                    <Col style={{ textAlign: 'center' }}>
                        {/* <Typography.Link style={{ width: 100 }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Button type='link' style={{ padding: 5 }} onClick={() => approve(record)}>
                            Approve
                        </Button> */}
                        <Button block type='primary' size='small' onClick={() => approve(record)}>Approve</Button>
                        <Button block size='small' onClick={() => edit(record)}>Edit</Button>
                    </Col>
                );
            },
        },
    ];

    const cancel = () => {
        setEditingKey('');
    };
    const approve = async (record: any) => {
        console.log(record)
        setApproved(record?.itemIssueID)
        const staticParams = {
            "itemIssueID": record?.itemIssueID,
            "issueVoucherNo": "string",
            "issueDate": "19000101",
            "supplierID": 0,
            "type_Pats": [
                {
                    "col1": "",
                    "col2": "",
                    "col3": "",
                    "col4": "",
                    "col5": "",
                    "col6": "",
                    "col7": "",
                    "col8": "",
                    "col9": "",
                    "col10": "",
                    "col11": "",
                    "col12": "",
                    "col13": "",
                    "col14": "",
                    "col15": ""
                }
            ],
            "userID": -1,
            "formID": -1,
            "type": 3
        };
        const res = await requestAddDirectItemReceipt({ ...staticParams });
        console.log(res?.result[0]?.msg)
        if (res?.result[0]?.isSuccess == true) {
            setLoading(false)
            message.error(res?.result[0]?.msg);
            form.resetFields();
            getDirectItemList();
        }
        else {
            setLoading(false)
            message.error(res?.result[0]?.msg);
        }
    };
    const edit = (record: any) => {
        editRecord(record);
    };

    const formSubmit = async (values: any) => {
        console.log(values);
    }

    const getDirectItemList = async (isFinalApproved: any = 0) => {
        const staticParams = {
            "itemIssueID": -1,
            "issueVoucherNo": "",
            "fromDate": '19000101',
            "toDate": convertDate(dayjs().add(1, 'year')),
            "isFinalApproved": isFinalApproved,
            "supplierID": -1,

            "userID": -1,
            "formID": -1,
            "type": 1
        }
        setLoading(true)
        const res = await requestGetDirectItem(staticParams);
        if (res?.result.length > 0 || res?.isSuccess == true) {
            setDirectItemList(res.result)
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }
    return (
        // <PageContainer
        //     style={{ backgroundColor: '#4874dc', height: 120 }}
        // >
        <Form
            form={form}
            component={false}
        >
            <Card
                title={<Space direction='horizontal'  style={{ alignItems: 'space-between' }}>
                    <Typography style={{color:'#0050b3',fontWeight:600,fontSize:18}}>Saved Voucher List</Typography>
                    <Radio.Group options={[{ label: 'Pending', value: '0' }, { label: 'Approved', value: '1' },]}
                        onChange={(value) => getDirectItemList(value.target.value)} defaultValue={'0'}
                        buttonStyle="solid"
                        optionType="button" />
                </Space>}
                style={{ height: 650, boxShadow: '2px 2px 2px #4874dc' }}
                headStyle={{ backgroundColor: '#e6f7ff', border: 0 }}
            >
                {directItemList &&
                    <Spin tip="Please wait..." spinning={loading}>
                        <Table
                            scroll={{ y: 400 }}
                            columns={columns}
                            dataSource={directItemList}
                        // rowClassName="editable-row"
                        // pagination={{
                        //     onChange: cancel,
                        // }}
                        />
                    </Spin>}
            </Card>
        </Form>
        // </PageContainer>
    );
};

export default DirectItemList;