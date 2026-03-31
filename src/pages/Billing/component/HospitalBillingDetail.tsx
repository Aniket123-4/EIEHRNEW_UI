import React, { useEffect, useRef, useState } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, InputNumber, Table, TableColumnsType, Dropdown, Badge, Modal } from 'antd';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import moment from 'moment';
import { requestGetHospitalBill } from '../services/api';
import '../services/index.css'
import { dateFormat } from '@/utils/constant';
import dayjs from 'dayjs';
import { convertDate } from '@/utils/helper';



const { Option } = Select;
interface DataType {
    key: React.Key;
    name: string;
    payDate: string;
    grossAmount: string;
    totalAmount: number;
    discountAmount: string;
    netAmount: string;
}

interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
}

const items = [
    { key: '1', label: 'Action 1' },
    { key: '2', label: 'Action 2' },
];
const { RangePicker } = DatePicker;

const HospitalBillingDetail = ({ }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [mainData, setMainData] = useState<any>([]);
    const [modalData, setModalData] = useState([]);




    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getHospitalBill({dateRange:[moment().subtract(1, 'months'),moment()]});
        // getRateType();
    }, [])

    const getHospitalBill = async (values:any) => {
        values['fromDate']=convertDate(values?.dateRange[0]);
        values['toDate']=convertDate(values?.dateRange[1]);;
        console.log(values)
        const staticParams = {
            "fromDate": values?.fromDate,
            "toDate": values?.toDate,
            "userID": -2,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetHospitalBill(staticParams);
        console.log(res);
        if (res.isSuccess && res.result) {
            const dataMaskForDropdown = res.result.lstPayDateResp?.map((item: any, index: string) => {
                return { key: index.toString(), ...item };
            });
            setTableData(dataMaskForDropdown)
            setMainData({
                netAmountVAT: res?.result?.netAmountVAT,
                totNetAmount: res?.result?.totNetAmount,
                totFinalGrossAmount: res?.result?.totFinalGrossAmount
            })
            console.log(res.result);
        }
    }

    const goBack = () => {
        history.push("/")
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const expandedRowRender1 = () => {
        return (
            <a>hiii</a>
        )
    }
    const showModal = (data: any) => {
        setModalData(data);
        setIsModalOpen(true);
    };
    const BillingModal = () => {
        const modalColumns: TableColumnsType<ExpandedDataType> = [
            { title: 'Name', dataIndex: 'patientName', key: 'patientName' },
            { title: 'CaseNo', dataIndex: 'patientCaseNo', key: 'patientCaseNo' },
            { title: 'PatientNo', dataIndex: 'patientNo', key: 'patientNo' },
            { title: 'Visit No', dataIndex: 'admNo', key: 'admNo' },
            { title: 'ParameterName', dataIndex: 'invParameterName', key: 'invParameterName' },
            { title: 'Net Amount', dataIndex: 'netAmount', key: 'netAmount' },
            { title: 'GST', dataIndex: 'netAmountVAT', key: 'netAmountVAT' },
            { title: 'Final Amount', dataIndex: 'finalGrossAmount', key: 'finalGrossAmount' },
            { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
        ];
        console.log(modalData)
        return (
            <Modal
                title="Billing Details"
                width={'75%'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[]}
               
            >
                <Table size='small' columns={modalColumns} dataSource={modalData?.lstPayBIllCompResp} pagination={false} />
            </Modal>
        );
    };

    const expandedRowRender = (record: any) => {
        const dataMask = record?.lstTotalPayResp.map((item: any, index: string) => {
            return { key: index.toString(), ...item };
        });
        const modalColumns: TableColumnsType<ExpandedDataType> = [
            { title: 'Name', dataIndex: 'patientName', key: 'patientName' },
            { title: 'CaseNo', dataIndex: 'patientCaseNo', key: 'patientCaseNo' },
            { title: 'PatientNo', dataIndex: 'patientNo', key: 'patientNo' },
            { title: 'Visit No', dataIndex: 'admNo', key: 'admNo' },
            { title: 'ParameterName', dataIndex: 'invParameterName', key: 'invParameterName' },
            { title: 'Net Amount', dataIndex: 'netAmount', key: 'netAmount' },
            { title: 'GST', dataIndex: 'netAmountVAT', key: 'netAmountVAT' },
            { title: 'Final Amount', dataIndex: 'finalGrossAmount', key: 'finalGrossAmount' },
            { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
        ];
        const columns: TableColumnsType<any> = [
            { title: 'Name', dataIndex: 'patientName', key: 'patientName' },
            { title: 'PayDate', dataIndex: 'payDateVar', key: 'payDateVar' },
            { title: 'Gross Amount', dataIndex: 'totFinalGrossAmount', key: 'totFinalGrossAmount' },
            { title: 'Total Amount', dataIndex: 'totNetAmount', key: 'totNetAmount' },
            { title: 'Discount', dataIndex: 'disCountAmt', key: 'disCountAmt' },
            { title: 'ReceiptNo', dataIndex: 'receiptNo', key: 'receiptNo' },
            { title: 'CaseNo', dataIndex: 'patientCaseNo', key: 'patientCaseNo' },
            {
                title: 'Status',
                key: 'state',
                render: () => <Badge status="success" text="Finished" />,
            },
            // { title: 'Action', key: 'operation', render: (_, record) => <Button size='small' onClick={() => showModal(record)}>View</Button> },
            // {
            //     title: 'Action',
            //     dataIndex: 'operation',
            //     key: 'operation',
            //     render: () => (
            //         <Space size="middle">
            //             <a>Pause</a>
            //             <a>Stop</a>
            //             <Dropdown menu={{ items }}>
            //                 <a>
            //                     More <DownOutlined />
            //                 </a>
            //             </Dropdown>
            //         </Space>
            //     ),
            // },
        ];
        return <Table
            bordered
            className={'ant-table1'}
            size='small'
            expandable={{
                expandedRowRender: (record) => <Table size='small' columns={modalColumns} dataSource={record?.lstPayBIllCompResp} pagination={false} />,
            }}
            columns={columns} dataSource={dataMask} pagination={false} />;
    };

    const parentColumns: TableColumnsType<ExpandedDataType> = [
        { title: 'Pay Date', dataIndex: 'payDateVar', key: 'payDateVar', render: (txt) => <a>{txt}</a> },
        { title: 'Final Amt', dataIndex: 'totFinalGrossAmount', key: 'totFinalGrossAmount' },
        { title: 'Net Amt', dataIndex: 'totNetAmount', key: 'totNetAmount' },
        { title: 'Discount', dataIndex: 'disCountAmt', key: 'disCountAmt' },
        { title: 'GST', dataIndex: 'netAmountVAT', key: 'netAmountVAT' },
    ];

    return (
        <>
            <Form
                ref={formRef}
                layout="horizontal"
                form={form}
                onFinish={getHospitalBill}
                preserve={true}
                scrollToFirstError={true}
            >
                <>
                    <Card className="gutter-example">
                        <Row gutter={16}>

                            <Col className="gutter-row" span={8} xs={24} xl={10}>
                                <Form.Item
                                    initialValue={[dayjs().subtract(1, 'months'), dayjs()]}
                                    name="dateRange"
                                    label="From - To Date"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <RangePicker
                                        defaultValue={[dayjs('1900-01-01'), dayjs()]}
                                        format={dateFormat}
                                        style={{ width: "100%" }}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col style={{ justifyContent: 'flex-end'}}>
                                <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                {/* <Button onClick={goBack} style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                    Cancel
                                </Button> */}
                            </Col>
                        </Row>
                    </Card>
                </>
            </Form>
            <Row gutter={16}>
                <Col span={8} xs={24} xl={8}>
                    <Card title="Total NetAmount" bordered={false} style={{margin:'2px'}} >
                        {mainData?.netAmountVAT}
                    </Card>
                </Col>
                <Col span={8} xs={24} xl={8} >
                    <Card title="Total GrossAmount" bordered={false} style={{margin:'2px'}}>
                        {mainData?.totFinalGrossAmount}
                        
                    </Card>
                </Col>
                <Col span={8} xs={24} xl={8}>
                    <Card title="GST" bordered={false} style={{margin:'2px'}}>
                        {mainData?.netAmountVAT}
                    </Card>
                </Col>
            </Row>
            <Table
            size="small"
                className={"ant-table "}
                bordered
                columns={parentColumns}
                expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
                dataSource={tableData}
            />
        </>
    );
}

export default HospitalBillingDetail;