import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col, Table, Button, Tabs, Select, Modal, message, Input, Popconfirm, Form } from 'antd';
import PatientDetailsCommon from './PatientDetailsCommon';
import { requestAddPatientBill, requestGetPatientBill, requestGetPatientBillNo, requestGetPatientBillReport } from '../services/api';
import { ColumnsType } from 'antd/es/table';
import { PlayCircleFilled, PrinterOutlined } from '@ant-design/icons';
import { TabsProps } from 'antd/lib';
import moment from 'moment';
import { dateFormat } from '@/utils/constant';
import PrintReport from '@/components/Print/PrintReport';
const { Title, Text, Link } = Typography;

const TabGenerateBill = ({ patientBillData, patientData }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generateBillData, setGenerateBillData] = useState();
    const [remark, setRemark] = useState("");
    const [patientBillDataList, setPatientBillDataList] = useState<any>(patientBillData);

    useEffect(() => {
        const data = { ...patientBillData };
        setPatientBillDataList(data)
    }, [patientBillData])

    const columns: ColumnsType<any> = [
        {
            title: 'Test Parameter',
            key: 'invParameterName',
            dataIndex: 'invParameterName',
            width: '30%'

        }, {
            title: 'Case Type',
            key: 'vPreEmpType',
            dataIndex: 'vPreEmpType',
            width: '10%'
        },
        {
            title: 'Payable %',
            width: '10%',
            key: 'compRebate',
            dataIndex: 'compRebate',
        },
        {
            title: 'Final Gross Amt',
            width: '10%',
            key: 'finalGrossAmount',
            dataIndex: 'finalGrossAmount',
        },
        {
            title: 'Disc Amt',
            key: 'grossAmount',
            width: '10%',
            dataIndex: 'remainingAmt',

        },
        {
            title: 'Net Amt',
            key: 'netAmount',
            width: '10%',
            dataIndex: 'netAmount',

        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (_, record) => (
                <Button danger size={'small'} onClick={() => { deleteBill(record) }} >Delete</Button>
            ),
        },

    ];

    const columns1 = [
        {
            title: 'Final Gross Amt',
            dataIndex: 'totFinalGrossAmount',
            key: 'totFinalGrossAmount',
        },
        {
            title: 'Total Disc Amt',
            dataIndex: 'disCountAmt',
            key: 'disCountAmt',
        },

        // {
        //     title: 'Gross Amt',
        //     dataIndex: 'totGrossAmt',
        //     key: 'totGrossAmt',
        // },
        {
            title: 'Balance Amt',
            dataIndex: 'balanceAmt',
            key: 'balanceAmt',
        },
        {
            title: 'Net Amt',
            dataIndex: 'totNetAmount',
            key: 'totNetAmount',
        },
        {
            title: 'Actual Pay Amt',
            dataIndex: 'actualPayAmt',
            key: 'actualPayAmt',
        },
    ];

    const generateBill = async () => {
        const typPatientBill = [];
        for (let i = 0; i < patientBillDataList?.result1.length; i++) {
            let data = {
                "col1": patientBillDataList?.result1[i]?.patientBillID,
                "col2": patientBillDataList?.result1[i]?.patientBillCompID,
                "col3": patientBillDataList?.result1[i]?.patientID,
                "col4": patientBillDataList?.result1[i]?.patientCaseID,
                "col5": patientBillDataList?.result1[i]?.admNo,
                "col6": patientBillDataList?.result1[i]?.invGroupID,
                "col7": patientBillDataList?.result1[i]?.discountParameterID,
                "col8": patientBillDataList?.result1[i]?.invParameterID,
                "col9": patientBillDataList?.result1[i]?.noOfDays,
                "col10": patientBillDataList?.result1[i]?.quantityPerDay,
                "col11": patientBillDataList?.result1[i]?.compID,
                "col12": patientBillDataList?.result1[i]?.compRebate,
                "col13": patientBillDataList?.result1[i]?.insuranceCompID,
                "col14": patientBillDataList?.result1[i]?.insuranceRebate,
                "col15": patientBillDataList?.result1[i]?.grossAmount,
                "col16": patientBillDataList?.result1[i]?.netAmount,
                "col17": patientBillDataList?.result1[i]?.finalGrossAmount,
                "col18": patientBillDataList?.result1[i]?.isConsultency ? "1" : "0",
                "col19": patientBillDataList?.result1[i]?.isMedic ? "1" : "0",
                "col20": patientBillDataList?.result1[i]?.isRoom ? "1" : "0",
                "col21": patientBillDataList?.result1[i]?.isManual ? "1" : "0",
                "col22": remark,//patientBillDataList?.result1[i]?.remark,
                "col23": patientBillDataList?.result1[i]?.barCode,
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
            };
            typPatientBill.push(data)
        }

        const staticParams = {
            "typPatientBill": typPatientBill,
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
            setRemark("")
            setGenerateBillData(res)
            showModal();
            // getPatientBill();
        } else {
            message.error(res.msg);
        }
    }

    const deleteBill = (record: any) => {
        


        console.log({ patientBillDataList })
        console.log({ record: record?.patientBillCompID })
        const data: any = { ...patientBillDataList };
        const filteredResult = data?.result1?.filter(item => item.patientBillCompID !== record?.patientBillCompID);
        data.result1 = filteredResult;

        function calculateSum(array:any, property:any) {
            let sum = 0;
            array.forEach((element:any) => {
                sum += parseFloat(element[property]);
            });
            return sum;
        }
        data.result2[0].totNetAmount = calculateSum(data.result1, 'netAmount');
        data.result2[0].actualPayAmt = calculateSum(data.result1, 'netAmount');
        data.result2[0].totFinalGrossAmount = calculateSum(data.result1, 'finalGrossAmount');
        data.result2[0].grossAmount = calculateSum(data.result1, 'grossAmount');
        data.result2[0].disCountAmt = calculateSum(data.result1, 'remainingAmt');

        console.log(data.result2[0]);
        setPatientBillDataList(data)
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

    const onChangeRemark = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRemark(e.target.value);
    };

    return (
        <>
            <Table
                columns={columns}
                size="small"
                dataSource={patientBillDataList?.result1}
                pagination={false}


            />

            <Table
                style={{ marginTop: 20 }}
                dataSource={patientBillData?.result2} pagination={false}
                columns={columns1}

                size="small"
                footer={() => <>
                    {patientBillData?.result1?.length > 0 ?
                        <div
                        >
                            <Row>

                                <Col span={8}></Col>
                                <Col span={8}>
                                    <label style={{ marginTop: 20 }}>Remark</label>
                                    <Input.TextArea rows={4} placeholder="maxLength is 200" value={remark} maxLength={200}
                                        onChange={onChangeRemark}
                                    />
                                    <Button
                                        style={{ marginTop: 20, alignItems: 'center' }}
                                        type={'primary'}
                                        onClick={() => {
                                            if (remark.length > 0) {
                                                generateBill()
                                            } else {
                                                message.error("Please add a remark");
                                            }
                                        }}
                                    >
                                        {'Pay Bill'}
                                    </Button>

                                </Col>
                                <Col span={8}></Col>

                            </Row>


                        </div> : null}

                </>}
            />



            <Modal title="Payment Info" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                footer={<>
                    <Button
                        type={'primary'}
                        onClick={() => {
                            handleCancel()
                        }}
                    >
                        {'Ok'}
                    </Button>
                </>}
            >
                <p>{generateBillData?.msg}</p>
            </Modal>

        </>
    )
}

const TabBillReceipt = ({ patientBillData, patientData, tabChange }: any) => {
    const [form] = Form.useForm();
    const [patientBillNoData, setPatientBillNoData] = useState<any>([]);
    const [patientBill, setPatientBill] = useState<any>();
    const [loading, setLoading] = useState<any>(false);
    const [base64Data, setBase64Data] = useState<any>("");
    const [showPdf, setShowPdf] = useState<any>(false);

    const columns: ColumnsType<any> = [
        {
            title: 'Test',
            key: 'invParameterName',
            dataIndex: 'invParameterName',
            width: '30%'
        },
        {
            title: 'Payable %',
            key: 'compRebate',
            dataIndex: 'compRebate',
            width: '10%'
        },
        // {
        //     title: 'Gross Amt',
        //     key: 'grossAmount',
        //     dataIndex: 'grossAmount',
        //     width: '10%'
        // },
         {
            title: 'Final Gross Amt',
            key: 'finalGrossAmount',
            width: '10%',
            dataIndex: 'finalGrossAmount',
        },
        {
            title: 'Net Amt',
            key: 'netAmount',
            dataIndex: 'netAmount',
            width: '10%'
        },
        {
            title: 'Remark',
            key: 'remark',
            dataIndex: 'remark',
            width: '30%'
        }

    ];

    useEffect(() => {
        getPatientBillNo();
        form.resetFields(['Bill_No'])
        setPatientBill([])
    }, [tabChange])

    const handleCancel = () => {
        setShowPdf(false);
    };
    const printReport = async () => {
        try {
            setLoading(true);
            const staticParams = {
                "patientCaseID": patientData?.patientCaseID,
                "patientCaseNo": "",
                "admNo": patientBillData?.result3[0]?.admNo,
                "patientBillID": patientBill?.result1[0]?.patientBillID,
                "userID": -1,
                "formID": -1,
                "type": 1,
                "show": false,
                "exportOption": ".pdf"
            }
            const res = await requestGetPatientBillReport(staticParams);
            setBase64Data(res?.result)
            setShowPdf(true)
            if (res.isSuccess === true) {
                setLoading(false)
            }
            setLoading(false)
        } catch (error) {
            console.log({ error });
            message.error('please try again');
            setLoading(false)
        }
    }

    const getPatientBillNo = async () => {
        console.log(patientData)
        const staticParams = {
            "patientCaseID": patientData?.patientCaseID,
            "patientCaseNo": "",
            "admNo": patientBillData?.result3[0]?.admNo,
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
            "admNo": patientBillData?.result3[0]?.admNo,
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

    const cancelBill = async () => {
        const typPatientBill: any = [];
        // for (let i = 0; i < patientBillData?.result1.length; i++) {
        //     let data = {
        //         "col1": patientBillData?.result1[i]?.patientBillID,
        //         "col2": patientBillData?.result1[i]?.patientBillCompID,
        //         "col3": patientBillData?.result1[i]?.patientID,
        //         "col4": patientBillData?.result1[i]?.patientCaseID,
        //         "col5": patientBillData?.result1[i]?.admNo,
        //         "col6": patientBillData?.result1[i]?.invGroupID,
        //         "col7": patientBillData?.result1[i]?.discountParameterID,
        //         "col8": patientBillData?.result1[i]?.invParameterID,
        //         "col9": patientBillData?.result1[i]?.noOfDays,
        //         "col10": patientBillData?.result1[i]?.quantityPerDay,
        //         "col11": patientBillData?.result1[i]?.compID,
        //         "col12": patientBillData?.result1[i]?.compRebate,
        //         "col13": patientBillData?.result1[i]?.insuranceCompID,
        //         "col14": patientBillData?.result1[i]?.insuranceRebate,
        //         "col15": patientBillData?.result1[i]?.grossAmount,
        //         "col16": patientBillData?.result1[i]?.netAmount,
        //         "col17": patientBillData?.result1[i]?.finalGrossAmount,
        //         "col18": patientBillData?.result1[i]?.isConsultency ? "1" : "0",
        //         "col19": patientBillData?.result1[i]?.isMedic ? "1" : "0",
        //         "col20": patientBillData?.result1[i]?.isRoom ? "1" : "0",
        //         "col21": patientBillData?.result1[i]?.isManual ? "1" : "0",
        //         "col22": remark,//patientBillData?.result1[i]?.remark,
        //         "col23": patientBillData?.result1[i]?.barCode,
        //         "col24": "",
        //         "col25": "",
        //         "col26": "",
        //         "col27": "",
        //         "col28": "",
        //         "col29": "",
        //         "col30": "",
        //         "col31": "",
        //         "col32": "",
        //         "col33": "",
        //         "col34": "",
        //         "col35": "",
        //         "col36": "",
        //         "col37": "",
        //         "col38": "",
        //         "col39": "",
        //         "col40": ""
        //     };
        //     typPatientBill.push(data)
        // }

        const staticParams = {
            "typPatientBill": typPatientBill,
            "totDiscountAmt": 0,
            "billDate": moment(new Date()).format(dateFormat),
            "patientBillID": patientBill?.result1[0]?.patientBillID,
            "paidAmt": 0,
            "payDate": "",
            "payTypeID": -1,
            "payTypeNo": "",
            "payTypeDetail": "",
            "isCancel": true,
            "userID": -1,
            "formID": -1,
            "type": 2
        }
        const res = await requestAddPatientBill(staticParams);
        if (res.isSuccess) {
            message.success(res?.msg);
        } else {
            message.error(res.msg);
        }
    }

    const confirm = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e);
        cancelBill();
    };

    const cancel = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e);

    };


    return (
        <>
            <Row>
                <Col span={8}>
                    {/* <label>{'Bill No'}</label><br /> */}
                    <Form
                        form={form}
                    >
                        <Form.Item
                            name={'Bill_No'}
                            label={'Bill No'}>
                            <Select
                                style={{ width: '80%' }}
                                onChange={handleChangeFilter}
                                placeholder={"Select"}
                                options={patientBillNoData}
                            />
                        </Form.Item>
                    </Form>

                </Col>
                <Col span={2}>
                    {patientBill?.result1?.length > 0 ?
                        <Popconfirm
                            title="Cancel Bill"
                            description="Are you sure to cancel this Bill?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                // style={{ marginTop: 20 }}
                                size={'middle'} type='primary'
                                danger
                            >
                                Cancel
                            </Button>
                        </Popconfirm> : null}
                    {base64Data && <PrintReport showModal={showPdf}
                        base64Data={base64Data} onCancel={handleCancel} onOk={handleCancel} />}

                </Col>
                <Col span={4}>
                    {/* <label>{''}</label><br /> */}
                    <Button onClick={printReport} style={{ marginLeft: 5, }} icon={<PrinterOutlined />}></Button>
                </Col>
                <Col span={8}></Col>
            </Row>

            <Table
                // style={{ marginTop: 30 }}
                columns={columns}
                size="small"
                dataSource={patientBill?.result1}
                pagination={false}
                loading={loading}
                bordered
                footer={()=>patientBill?.result2 &&<div style={{width:'40%'}} >
                    <Row style={{ justifyContent: 'space-between',marginRight:40 }}>
                        <Typography style={{}}>{'Total Net Amt'}</Typography>
                    <Typography >{patientBill?.result2[0]?.totNetAmount}</Typography>
                    </Row>
                    <Row style={{ justifyContent: 'space-between',marginRight:40 }}>
                        <Typography style={{}}>{'Total Received Amt'}</Typography>
                    <Typography >{patientBill?.result2[0]?.actualPayAmt}</Typography>
                    </Row>
                </div>}
            />
        </>
    )
}

const PatientBilling: React.FC = () => {

    const [patientData, setPatientData] = useState<any>();
    const [patientBillData, setPatientBillData] = useState<any>();
    const [tabChange, setTabChange] = useState<any>(true);

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Generate Bill',
            children: <TabGenerateBill patientData={patientData} patientBillData={patientBillData} />,
        },
        {
            key: '2',
            label: 'Bill Receipt',
            children: <TabBillReceipt tabChange={tabChange} patientData={patientData} patientBillData={patientBillData} />,
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
        const data1 = res?.result1?.map((item: any) => {
            return (item.remainingAmt)
        })
        if (data1) {
            var sum = data1.reduce((accumulator: any, currentValue: any) => {
                return parseFloat(accumulator) + parseFloat(currentValue)
            }, 0)
            res.result2[0]['disCountAmt'] = sum.toString();
            console.log(data1, res);
            setPatientBillData(res)
        }
        else {
            setPatientBillData(res)

        }

    }

    const onChangePatientData = (data: any) => {
        console.log("onChangePatientData", data)
        setPatientData(data)
        setTabChange(tabChange + 1)
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
