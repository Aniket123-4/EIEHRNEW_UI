import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col, Table, Button, Tabs, Select, Modal, message } from 'antd';
import PatientDetailsCommon from './PatientDetailsCommon';
import { requestAddPatientBill, requestGetPatientBill, requestGetPatientBillNo } from '../services/api';
import { ColumnsType } from 'antd/es/table';
import { PlayCircleFilled } from '@ant-design/icons';
import { TabsProps } from 'antd/lib';
import moment from 'moment';
import { dateFormat } from '@/utils/constant';
const { Title, Text, Link } = Typography;

const TabGenerateBill = ({ patientBillData, patientData }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generateBillData, setGenerateBillData] = useState();

    const columns: ColumnsType<any> = [
        {
            title: 'Inv Parameter',
            key: 'invParameterName',
            dataIndex: 'invParameterName',

        }, {
            title: 'Pre Emp Type',
            key: 'vPreEmpType',
            dataIndex: 'vPreEmpType',

        },
        {
            title: 'Rebate',
            key: 'compRebate',
            dataIndex: 'compRebate',
        },
        {
            title: 'Gross Amount',
            key: 'grossAmount',
            dataIndex: 'grossAmount',

        }, {
            title: 'Net Amount',
            key: 'netAmount',
            dataIndex: 'netAmount',

        }, {
            title: 'Final Gross Amount',
            key: 'finalGrossAmount',
            dataIndex: 'finalGrossAmount',

        },
        //  {
        //     title: 'insuranceAmtVAT',
        //     key: 'insuranceAmtVAT',
        //     dataIndex: 'insuranceAmtVAT',

        // }

    ];

    const generateBill = async () => {
        const staticParams = {
            "typPatientBill": [
                {
                    "col1": patientBillData?.result[0]?.patientBillID,
                    "col2": patientBillData?.result[0]?.patientBillCompID,
                    "col3": patientBillData?.result[0]?.patientID,
                    "col4": patientBillData?.result[0]?.patientCaseID,
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
                    "col15": patientBillData?.result[0]?.grossAmount,
                    "col16": patientBillData?.result[0]?.netAmount,
                    "col17": patientBillData?.result[0]?.finalGrossAmount,
                    "col18": "1",
                    "col19": "0",
                    "col20": "0",
                    "col21": "0",
                    "col22": "CASH",
                    "col23": "",
                    "col24": "",
                    "col25": "",
                    "col26": "",
                    "col27": "",
                    "col28": "",
                    "col29": "",
                    "col30": "",
                    "col31": "",
                    "col32": "",
                    "col33": "",
                    "col34": "",
                    "col35": "",
                    "col36": "",
                    "col37": "",
                    "col38": "",
                    "col39": "",
                    "col40": ""
                }
            ],
            "totDiscountAmt": 0,
            "billDate": moment(new Date()).format(dateFormat),
            "patientBillID": -1,
            "paidAmt": 0,
            "payDate": "",
            "payTypeID": -1,
            "payTypeNo": "",
            "payTypeDetail": "",
            "isCancel": false,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestAddPatientBill(staticParams);
        if (res.isSuccess) {
            setGenerateBillData(res)
            showModal();
        } else {
            message.error(res.msg);
        }
    }

    const makePayment = async () => {
        const staticParams = {
            "typPatientBill": [
                {
                    "col1": patientBillData?.result[0]?.patientBillID,
                    "col2": patientBillData?.result[0]?.patientBillCompID,
                    "col3": patientBillData?.result[0]?.patientID,
                    "col4": patientBillData?.result[0]?.patientCaseID,
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
                    "col15": patientBillData?.result[0]?.grossAmount,
                    "col16": patientBillData?.result[0]?.netAmount,
                    "col17": patientBillData?.result[0]?.finalGrossAmount,
                    "col18": "1",
                    "col19": "0",
                    "col20": "0",
                    "col21": "0",
                    "col22": "CASH",
                    "col23": "",
                    "col24": "",
                    "col25": "",
                    "col26": "",
                    "col27": "",
                    "col28": "",
                    "col29": "",
                    "col30": "",
                    "col31": "",
                    "col32": "",
                    "col33": "",
                    "col34": "",
                    "col35": "",
                    "col36": "",
                    "col37": "",
                    "col38": "",
                    "col39": "",
                    "col40": ""
                }
            ],
            "totDiscountAmt": 0,
            "billDate": moment(new Date()).format(dateFormat),
            "patientBillID": generateBillData?.result[0]?.billID,
            "paidAmt": 0,
            "payDate": "",
            "payTypeID": -1,
            "payTypeNo": "",
            "payTypeDetail": "",
            "isCancel": false,
            "userID": -1,
            "formID": -1,
            "type": 2
        }
        const res = await requestAddPatientBill(staticParams);
        if (res.isSuccess) {
            setGenerateBillData(res)
            showModal();
        } else {
            message.error(res.msg);
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    return (
        <>
            <Table
                columns={columns}
                size="small"
                dataSource={patientBillData?.result}
                pagination={false}
                bordered
                footer={() => <>
                    {patientBillData?.result?.length > 0 ?
                        <Space
                            align='center'
                        >

                            <Button
                                type={'primary'}
                                onClick={() => {
                                    generateBill()
                                }}
                            >
                                {'Generate Bill'}
                            </Button>
                        </Space> : null}

                </>}
            />
            <Modal title="Generate Bill Info" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                footer={<>
                    <Button
                        type={'primary'}
                        onClick={() => {
                            makePayment()
                        }}
                    >
                        {'Make Payment'}
                    </Button>
                </>}
            >
                <p>{generateBillData?.msg}</p>
            </Modal>

        </>
    )
}

const TabBillReceipt = ({ patientBillData, patientData }: any) => {
    const [patientBillNoData, setPatientBillNoData] = useState<any>([]);
    const [patientBill, setPatientBill] = useState<any>();
    const [loading, setLoading] = useState<any>(false);

    const columns: ColumnsType<any> = [
        {
            title: 'Inv Parameter',
            key: 'invParameterName',
            dataIndex: 'invParameterName',

        }, {
            title: 'Pre Emp Type',
            key: 'vPreEmpType',
            dataIndex: 'vPreEmpType',

        },
        {
            title: 'Rebate',
            key: 'compRebate',
            dataIndex: 'compRebate',
        },
        {
            title: 'Gross Amount',
            key: 'grossAmount',
            dataIndex: 'grossAmount',

        }, {
            title: 'Net Amount',
            key: 'netAmount',
            dataIndex: 'netAmount',

        }, {
            title: 'Final Gross Amount',
            key: 'finalGrossAmount',
            dataIndex: 'finalGrossAmount',

        }, {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">

                    <Button size={'small'} type='primary' onClick={() => {

                    }}>
                        cancel
                    </Button>
                </Space>
            ),
        },

    ];

    useEffect(() => {
        getPatientBillNo();
    }, [])

    const getPatientBillNo = async () => {
        const staticParams = {
            "patientCaseID": "4697307429349901111",
            "patientCaseNo": "",
            "admNo": 1,
            "isCancel": false,
            "userID": -1,
            "formID": -1,
            "type": 2
        }

        const res = await requestGetPatientBillNo(staticParams);
        if (res.result.length > 0) {

            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.billID, label: item.billNo }
            });
            setPatientBillNoData(dataMaskForDropdown)
        }
    }

    const getPatientBill = async (patientBillID: string) => {
        const staticParams = {
            "patientCaseID": patientData?.patientCaseID,
            "patientCaseNo": "",
            "admNo": patientData?.admNo ? patientData?.admNo : -1,
            "patientBillID": patientBillID,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        setLoading(true)
        const res = await requestGetPatientBill(staticParams);
        setLoading(false)

        console.log(res);
        setPatientBill(res)
    }

    const handleChangeFilter = (data: any) => {
        console.log(data)
        getPatientBill(data)
    }
    return (
        <>

            <label>{'Bill No'}</label><br />
            <Select
                style={{ width: '30%' }}
                onChange={handleChangeFilter}
                options={patientBillNoData}
            />
            <Table
                style={{ marginTop: 30 }}
                columns={columns}
                size="small"
                dataSource={patientBill?.result}
                pagination={false}
                loading={loading}
                bordered
            />
        </>
    )
}

const PatientBilling: React.FC = () => {

    const [patientData, setPatientData] = useState<any>();
    const [patientBillData, setPatientBillData] = useState<any>();




    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Generate Bill',
            children: <TabGenerateBill patientData={patientData} patientBillData={patientBillData} />,
        },
        {
            key: '2',
            label: 'Bill Receipt',
            children: <TabBillReceipt patientData={patientData} patientBillData={patientBillData} />,
        }

    ];


    useEffect(() => {
        getPatientBill();
    }, [patientData])

    const getPatientBill = async () => {
        const staticParams = {
            "patientCaseID": patientData?.patientCaseID,
            "patientCaseNo": "",
            "admNo": patientData?.admNo ? patientData?.admNo : -1,
            "patientBillID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetPatientBill(staticParams);
        console.log(res);
        setPatientBillData(res)
    }

    const onChangePatientData = (data: any) => {
        console.log("onChangePatientData", data)
        setPatientData(data)
    }





    return (
        <PageContainer
            header={{
                title: ``,
                breadcrumb: {
                    items: [],
                },
            }}
        >
            <Space
                direction="vertical"
                style={{ display: 'flex' }}
            >
                <PatientDetailsCommon
                    patData={patientData}
                    onChange={onChangePatientData}
                />
                <Card title="Billing Details"
                >
                    <Tabs defaultActiveKey="1" items={tabItems} />

                </Card>
            </Space>

        </PageContainer>
    );
};

export default PatientBilling;
