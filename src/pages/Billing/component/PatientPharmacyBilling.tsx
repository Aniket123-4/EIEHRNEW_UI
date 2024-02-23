import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col, Table, Button, Tabs, Select, Modal, message, Input, Popconfirm, Tag, Dropdown, MenuProps, InputNumber } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DownOutlined, MinusOutlined, PlayCircleFilled, PlusOutlined, PrinterOutlined } from '@ant-design/icons';
import { TabsProps } from 'antd/lib';
import moment from 'moment';
import { dateFormat } from '@/utils/constant';
import PatientDetailsCommon from '@/pages/Patient/components/PatientDetailsCommon';
import { requestAddPatientBill, requestGetPatientBillNo } from '@/pages/Patient/services/api';
import { requestAddPatientPharmaBill, requestGetItemBalanceWithBaarCode, requestGetPatientPharmaBill, requestGetPatientPharmaBillReport } from '../services/api';
import PrintReport from '@/components/Print/PrintReport';
const { Title, Text, Link } = Typography;

const TabGenerateBill = ({ patientBillData, isLoading, editableColumns, disableBtn, ChangePrice }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generateBillData, setGenerateBillData] = useState();
    const [remark, setRemark] = useState("");
    const [patientBillDataList, setPatientBillDataList] = useState<any>(patientBillData);
    // const [disableBtn, setDisableBtn] = useState<any>(true);


    useEffect(() => {
        const data = { ...patientBillData };
        setPatientBillDataList(data)
    }, [patientBillData, isLoading])
    const getItemWithBarCode = async (itemId: any) => {
        const params1 = {
            "baarCode": "",
            "itemID": itemId,
            "itemCatID": -1,
            "sectionID": -1,
            "fundID": -1,
            "productID": -1,
            "unitID": -1,
            "curDate": moment(),
            "userID": -1,
            "formID": -1,
            "type": 2
        }
        const res1 = await requestGetItemBalanceWithBaarCode(params1);
    }


    const columns1 = [
        {
            title: 'Net Amount',
            dataIndex: 'totNetAmount',
            key: 'totNetAmount',
        },
        {
            title: 'Gross Amount',
            dataIndex: 'totGrossAmt',
            key: 'totGrossAmt',
        },
        {
            title: 'Final Gross Amount',
            dataIndex: 'totFinalGrossAmount',
            key: 'totFinalGrossAmount',
        }, {
            title: 'Discount Amount',
            dataIndex: 'disCountAmt',
            key: 'disCountAmt',
        }, {
            title: 'Balance Amount',
            dataIndex: 'balanceAmt',
            key: 'balanceAmt',
        }, {
            title: 'Actual Pay Amount',
            dataIndex: 'actualPayAmt',
            key: 'actualPayAmt',
        },
    ];
    const columns2 = [
        {
            title: 'Balance Qty Sum',
            dataIndex: 'balQuantitySum',
            key: 'balQuantitySum',
        },
        {
            title: 'Balance Qty',
            dataIndex: 'balanceQuantity',
            key: 'balanceQuantity',
        },
        {
            title: 'IsBilled',
            dataIndex: 'isBilled',
            key: 'isBilled',
            render: (text: any) =>
                <Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Yes' : 'No'}</Tag>,
        }, {
            title: 'Item Name',
            dataIndex: 'itemName',
            key: 'itemName',
        }, {
            title: 'Sale Price',
            dataIndex: 'salePricePerUnit',
            key: 'salePricePerUnit',
        }, {
            title: 'Unit',
            dataIndex: 'unitName',
            key: 'unitName',
        },
        {
            title: 'Voucher',
            dataIndex: 'voucherNo',
            key: 'voucherNo',
        },
    ];
    const columns3 = [
        {
            title: 'Doctor',
            dataIndex: 'doctorName',
            key: 'doctorName',
        },
        {
            title: 'Clinic',
            dataIndex: 'clinic',
            key: 'clinic',
        },
        {
            title: 'Admission No',
            dataIndex: 'admNo',
            key: 'admNo',
        },
        {
            title: 'Entry Date',
            dataIndex: 'entryDate',
            key: 'entryDate',
            render: (text: any) => <Typography>{moment(text).format('DD MMM YYYY')}</Typography>
        }, {
            title: 'InvParameter',
            dataIndex: 'invParameterName',
            key: 'invParameterName',
        },
        {
            title: 'Patient FileNo',
            dataIndex: 'patientFileNo',
            key: 'patientFileNo',
        },
    ];

    const generateBill = async (value: any = { type: 1, patientBillID: -1 }) => {
        console.log(patientBillDataList.result1, "patientBillDataList,", value)
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
                "col15": patientBillDataList?.result1[i]?.grossAmount.toString(),
                "col16": patientBillDataList?.result1[i]?.netAmount.toString(),
                "col17": patientBillDataList?.result1[i]?.finalGrossAmount.toString(),
                "col18": patientBillDataList?.result1[i]?.isConsultency ? "1" : "0",
                "col19": patientBillDataList?.result1[i]?.isMedic ? "1" : "0",
                "col20": patientBillDataList?.result1[i]?.isRoom ? "1" : "0",
                "col21": patientBillDataList?.result1[i]?.isManual ? "1" : "0",
                "col22": remark,//patientBillDataList?.result1[i]?.remark,
                "col23": patientBillDataList?.result1[i]?.barCode,
                "col24": patientBillDataList?.result1[i]?.qty.toString(),
                "col25": patientBillDataList?.result1[i]?.itemInID,
                "col26": patientBillDataList?.result1[i]?.itemCatID,
                "col27": patientBillDataList?.result1[i]?.productID,
                "col28": patientBillDataList?.result1[i]?.unitID,
                "col29": patientBillDataList?.result1[i]?.salePricePerUnit,
                "col30": patientBillDataList?.result1[i]?.finalSalePricePerUnit,
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
            "patientBillID": value?.patientBillID,
            "paidAmt": 0,
            "payDate": "",
            "payTypeID": -1,
            "payTypeNo": "",
            "payTypeDetail": "",
            "isCancel": false,
            "userID": -1,
            "formID": -1,
            "type": value?.type
        }
        if (disableBtn === false) {
            const res = await requestAddPatientPharmaBill(staticParams);
            if (res.isSuccess) {
                setRemark("")
                if (value?.patientBillID == -1) {
                    setGenerateBillData(res)
                    showModal();
                }
                else {
                    message.success(res.msg)
                }
            } else {
                message.error(res.msg);
            }
        }
        else
            message.error("Please Set All Medicine Price");
    }

    const deleteBill = (record: any) => {
        console.log({ patientBillDataList })
        console.log({ record: record?.patientBillCompID })
        const data: any = { ...patientBillDataList };
        const filteredResult = data?.result1?.filter(item => item.patientBillCompID !== record?.patientBillCompID);
        data.result1 = filteredResult;
        console.log(data);
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
                columns={editableColumns}
                size="small"
                dataSource={patientBillDataList?.result1}
                pagination={false}
            />
            <Table
                columns={columns3}
                size="small"
                dataSource={patientBillDataList?.result3}
                pagination={false}
            />
            <Table
                columns={columns1}
                size="small"
                dataSource={patientBillDataList?.result2}
                pagination={false}
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
                                        {'Save Bill'}
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
                            generateBill({ type: 2, patientBillID: generateBillData?.result[0]?.billID })
                        }}
                    >
                        {'Pay'}
                    </Button>
                </>}
            >
                <p>{generateBillData?.msg}</p>
            </Modal>

        </>
    )
}

const TabBillReceipt = ({ patientBillData, patientData, tabChange }: any) => {
    const [patientBillNoData, setPatientBillNoData] = useState<any>([]);
    const [patientBill, setPatientBill] = useState<any>();
    const [loading, setLoading] = useState<any>(false);
    const [base64Data, setBase64Data] = useState<any>("");
    const [showPdf, setShowPdf] = useState<any>(false);

    const columns: ColumnsType<any> = [
        {
            title: 'Medicine',
            key: 'invParameterName',
            dataIndex: 'invParameterName',

        },
        // {
        //     title: 'Case Type',
        //     key: 'vPreEmpType',
        //     dataIndex: 'vPreEmpType',

        // },
        {
            title: 'Payable Amt',
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

        }

    ];

    useEffect(() => {
        getPatientBillNo();
    }, [tabChange])

    const getPatientBillNo = async () => {
        console.log(patientBillData)
        const staticParams = {
            "patientCaseID": patientData?.patientCaseID,
            "patientCaseNo": "",
            "admNo": patientBillData?.result3[0]?.admNo,
            "isCancel": false,
            "userID": -1,
            "formID": -1,
            "type": 1
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
        const res = await requestGetPatientPharmaBill(staticParams);
        setLoading(false)
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
        const res = await requestAddPatientPharmaBill(staticParams);
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
            const res = await requestGetPatientPharmaBillReport(staticParams);
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


    return (
        <>
            <Row>
                <Col span={8}>
                    <label>{'Bill No'}</label><br />
                    <Select
                        style={{ width: '95%' }}
                        onChange={handleChangeFilter}
                        placeholder={"Select"}
                        options={patientBillNoData}
                    />
                </Col>
                <Col span={2}>
                <label>{''}</label><br />
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
                                // style={{ marginTop: 22 }}
                                size={'middle'} type='primary'
                                danger
                            >
                                Cancel
                            </Button>
                        </Popconfirm> : null}

                    {base64Data&&<PrintReport showModal={showPdf} base64Data={base64Data} onCancel={handleCancel} onOk={handleCancel} />}
                </Col >
                <Col span={4}>
                    <label>{''}</label><br />
                    <Button onClick={printReport} style={{ marginLeft: 5, }} icon={<PrinterOutlined />}></Button>
                </Col>
                <Col span={8}></Col>
            </Row>

            <Table
                style={{ marginTop: 30 }}
                columns={columns}
                size="small"
                dataSource={patientBill?.result1}
                pagination={false}
                loading={loading}
                bordered
            />
        </>
    )
}

const PatientPharmacyBilling: React.FC = () => {

    const [patientData, setPatientData] = useState<any>();
    const [patientBillData, setPatientBillData] = useState<any>();
    const [rateList, setRateList] = useState<any>([]);
    const [tabChange, setTabChange] = useState<any>(true);
    const [rateDropDown, setRateDropDown] = useState<any>([]);
    const [disableBtn, setDisableBtn] = useState<any>(true);
    const [loading, setLoading] = useState<any>(0);

    useEffect(() => {
        getPatientBill();
    }, [patientData])

    useEffect(() => {
        console.log(patientBillData)
    }, [patientBillData])

    const updatePrice = (data: any) => {
        setPatientBillData(data)
        console.log(patientBillData)
    }
    const columns: ColumnsType<any> = [
        {
            title: 'Inv Parameter',
            key: 'invParameterName',
            dataIndex: 'invParameterName',
            render: (_, record) => <Dropdown onOpenChange={(open) => setRate(record, open)} menu={{ items: rateDropDown }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        {record?.invParameterName}
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
        },
        {
            title: 'Dose',
            key: 'dose',
            dataIndex: 'dose',
        },
        {
            title: 'PricePerUnit',
            key: 'salePricePerUnit',
            dataIndex: 'salePricePerUnit',
        },
        {
            title: 'Quantity',
            key: 'qty',
            dataIndex: 'qty',
            render: (_, record) => <Space.Compact style={{ justifyContent: 'space-between', width: 120 }}>
                <Button onClick={() => ChangePrice(record, 'decQty')} icon={<MinusOutlined />} ></Button>

                <InputNumber disabled min={1} style={{ textAlign: 'center' }}
                    placeholder="Quantity" value={record.qty} />
                <Button onClick={() => ChangePrice(record, 'incQty')} icon={<PlusOutlined />}></Button>
            </Space.Compact>
        },
        {
            title: 'Gross Amount',
            key: 'grossAmount',
            dataIndex: 'grossAmount',

        },
        {
            title: 'Payable Amt',
            key: 'compRebate',
            dataIndex: 'compRebate',
        },
        {
            title: 'Final Gross Amount',
            key: 'finalGrossAmount',
            dataIndex: 'finalGrossAmount',
        },
        {
            title: 'Net Amount',
            key: 'netAmount',
            dataIndex: 'netAmount',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button danger size={'small'} onClick={() => { deleteBill(record) }} >Delete</Button>
            ),
        },

    ];


    const ChangePrice = async (data: any, status: any) => {
        setLoading(loading + 1)
        if (status != "status") {
            var qty: any = parseInt(data?.qty);
            const qtyIndex = patientBillData.result1.findIndex((obj => obj.invParameterID == data.invParameterID));
            if (status == 'incQty') {
                patientBillData.result1[qtyIndex].qty = ++qty
            }
            if (status == 'decQty') {
                patientBillData.result1[qtyIndex].qty = --qty
            }
            const netAmt = data.salePricePerUnit * patientBillData.result1[qtyIndex].qty * parseInt(patientBillData.result1[qtyIndex].compRebate, 10) / 100;
            patientBillData.result1[qtyIndex].salePricePerUnit = data.salePricePerUnit
            patientBillData.result1[qtyIndex].expDate = data.eslDate
            patientBillData.result1[qtyIndex].netAmount = netAmt
            patientBillData.result1[qtyIndex].finalGrossAmount = netAmt
            patientBillData.result1[qtyIndex].grossAmount = data.salePricePerUnit * patientBillData.result1[qtyIndex].qty

            patientBillData.result2[0].totNetAmount = patientBillData?.result1?.reduce((n: any, { netAmount }: any) => parseInt(n, 10) + parseInt(netAmount, 10), 0);
            patientBillData.result2[0].totFinalGrossAmount = patientBillData?.result1?.reduce((n: any, { finalGrossAmount }: any) => parseInt(n, 10) + parseInt(finalGrossAmount, 10), 0);
            patientBillData.result2[0].totGrossAmt = patientBillData?.result1?.reduce((n: any, { grossAmount }: any) => parseInt(n, 10) + parseInt(grossAmount, 10), 0);
            patientBillData.result2[0].actualPayAmt = patientBillData?.result1?.reduce((n: any, { netAmount }: any) => parseInt(n, 10) + parseInt(netAmount, 10), 0);
            await setPatientBillData(patientBillData)
        }
        else {
            const objIndex = patientBillData.result1.findIndex((obj => obj?.invParameterID == data?.itemID));
            const netAmt = data.salePricePerUnit * patientBillData.result1[objIndex].qty * parseInt(patientBillData.result1[objIndex].compRebate, 10) / 100;

            patientBillData.result1[objIndex].salePricePerUnit = data.salePricePerUnit
            patientBillData.result1[objIndex].expDate = data.eslDate
            patientBillData.result1[objIndex].netAmount = netAmt
            patientBillData.result1[objIndex].finalGrossAmount = netAmt
            patientBillData.result1[objIndex].finalSalePricePerUnit = data.salePricePerUnit
            patientBillData.result1[objIndex].grossAmount = data.salePricePerUnit * patientBillData.result1[objIndex].qty


            patientBillData.result1?.map((item: any, index: number) => {
                if (patientBillData.result1[index].netAmount != 0)
                    setDisableBtn(false)
            })
            patientBillData.result2[0].totNetAmount = patientBillData?.result1?.reduce((n: any, { netAmount }: any) => parseInt(n, 10) + parseInt(netAmount, 10), 0);
            patientBillData.result2[0].totFinalGrossAmount = patientBillData?.result1?.reduce((n: any, { finalGrossAmount }: any) => parseInt(n, 10) + parseInt(finalGrossAmount, 10), 0);
            patientBillData.result2[0].totGrossAmt = patientBillData?.result1?.reduce((n: any, { grossAmount }: any) => parseInt(n, 10) + parseInt(grossAmount, 10), 0);
            patientBillData.result2[0].actualPayAmt = patientBillData?.result1?.reduce((n: any, { netAmount }: any) => parseInt(n, 10) + parseInt(netAmount, 10), 0);
            await setPatientBillData(patientBillData)
            updatePrice(patientBillData)
        }
    }

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Generate Bill',
            children: <TabGenerateBill
                disableBtn={disableBtn}
                // setCalcData={(v:any,t:any)=>setRate(v,t)} 
                editableColumns={columns}
                patientData={patientData}
                patientBillData={patientBillData}
                ChangePrice={ChangePrice}
                isLoading={loading}
            />,
        },
        {
            key: '2',
            label: 'Bill Receipt',
            children: <TabBillReceipt tabChange={tabChange} patientData={patientData} patientBillData={patientBillData} />,
        }
    ];



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
        const res = await requestGetPatientPharmaBill(staticParams);
        setPatientBillData(res)
    }

    const rateColumns = [
        {
            title: 'Voucher No',
            dataIndex: 'voucherNo',
            key: 'voucherNo',
            render: (_, record) => <Button onClick={() => ChangePrice(record, "status")}>{record?.voucherNo}</Button>
        },
        {
            title: 'Unit',
            dataIndex: 'unitName',
            key: 'unitName',
        },
        {
            title: 'PricePerUnit',
            dataIndex: 'salePricePerUnit',
            key: 'salePricePerUnit',
        },
        {
            title: 'IsBilled',
            dataIndex: 'isBilled',
            key: 'isBilled',
            render: (text: any) => <Typography>{text == true ? "YES" : "NO"}</Typography>
        },
        {
            title: 'Expiry Date',
            dataIndex: 'eslDate',
            key: 'eslDate',
            render: (text: any) => <Typography>{moment(text).format('DD MMM YYYY')}</Typography>
        },
        {
            title: 'Balance Qty',
            dataIndex: 'balanceQuantity',
            key: 'balanceQuantity',
        },
        {
            title: 'BalQtySum',
            dataIndex: 'balQuantitySum',
            key: 'balQuantitySum',
        }
    ];


    const setRate = async (data: any, open: any) => {
        if (open) {
            const params1 = {
                "baarCode": "",
                "itemID": data?.invParameterID,
                "itemCatID": -1,
                "sectionID": -1,
                "fundID": -1,
                "productID": -1,
                "unitID": -1,
                "curDate": moment(),
                "userID": -1,
                "formID": -1,
                "type": 2
            }
            const res = await requestGetItemBalanceWithBaarCode(params1);
            if (res) {
                const dataMaskDropDown = res?.result?.map((item: any, index: number) => {
                    return {
                        key: index,
                        value: item.itemInID,
                        label: (
                            <>
                                {res?.result.length == index + 1 &&
                                    <Table
                                        columns={rateColumns}
                                        size="small"
                                        dataSource={res?.result}
                                        pagination={false}
                                    />}
                            </>
                        )
                    }
                })
                setRateDropDown(dataMaskDropDown)
            }
        }
    }

    const onChangePatientData = (data: any) => {
        console.log("onChangePatientData", patientBillData)
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
                    <Tabs onChange={(v) => setTabChange(v)} defaultActiveKey="1" items={tabItems} />

                </Card>
            </Space>

        </PageContainer>
    );
};

export default PatientPharmacyBilling;
