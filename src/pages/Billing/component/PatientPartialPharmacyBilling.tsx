import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, InputNumber, Table } from 'antd';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { requestAddPatientBalanceBill, requestGetBalanceBill } from '../services/api';
import moment from 'moment';
import { convertDate } from '@/utils/helper';
import dayjs from 'dayjs';
import { dateFormat } from '@/utils/constant';


const { RangePicker } = DatePicker;
const { Option } = Select;


const PatientPartialPharmacyBilling = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [patientList, setPatientList] = useState<any>([])
    const [balanceBillList, setBalanceBillList] = useState<any>([])
    const [isActive, setIsActive] = useState(true);



    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getBalanceBill({ dateRange: [moment().subtract(1, 'months'), moment()] });
        // getRateType();
    }, [])

    const getBalanceBill = async (values: any) => {
        form.resetFields()
        values['fromDate'] = convertDate(values?.dateRange[0]);
        values['toDate'] = convertDate(values?.dateRange[1]);;
        const staticParams = {
            "userID": -1,
            "formID": -1,
            "type": 1,
            "fromDate": values.fromDate,
            "toDate": values.toDate
        }
        const res = await requestGetBalanceBill(staticParams);
        setBalanceBillList(res?.result)
        // console.log(res.result);
        if (res.isSuccess == true) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.patientBillID, label: item.patientName }
            })
            setPatientList(dataMaskForDropdown)
            // console.log(dataMaskForDropdown)
        }
    }

    const goBack = () => {
        history.push("/")
    }


    const addComplaint = async (values: any) => {
        const payAmt = balanceBillList.find((item: any) => item.patientBillID === values.oldPatientBillID)
        console.log(values, payAmt);
        try {
            const staticParams = {
                "userID": -1,
                "formID": -1,
                "type": 1
            };
            if (parseFloat(values.paidAmt) > parseFloat(payAmt.balanceAmt))
                message.error("PLEASE ENTER LESS OR EQUAL TO BALANCE AMOUNT")
            else {
                setLoading(true)
                const msg = await requestAddPatientBalanceBill({ ...values, ...staticParams });
                console.log(msg.msg, msg.isSuccess);
                setLoading(false)
                if (msg.isSuccess === true) {
                    message.success(msg.msg);
                    form.resetFields();
                    filterForm.setFieldValue("dateRange",[dayjs().subtract(1, 'months'), dayjs()])
                    getBalanceBill({ dateRange: [moment().subtract(1, 'months'), moment()] })
                } else {
                    message.error(msg.msg);
                }
            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };

    const onChangeServiceStatus = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isService: e.target.checked ? "true" : "false"
        })
        setIsActive(e.target.checked)
        // setVatApplicable(e.target.checked)

    };
    const setEditField = (data: any) => {
        console.log(data)
        form.setFieldsValue({
            oldPatientBillID: data?.patientBillID,
            paidAmt: data?.balanceAmt,
        })
        window.scrollTo(0, 0)
    };

    const addForm = () => {
        return (
            <Form
                ref={formRef}
                layout="vertical"
                form={form}
                onFinish={addComplaint}
                initialValues={{
                }}
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}  >
                                <Form.Item
                                    // required={true}
                                    name="oldPatientBillID"
                                    label="Patient"
                                    rules={[{ required: true, message: 'Please Select Patient' }]}
                                >
                                    <Select
                                        showSearch
                                        options={patientList}
                                        placeholder="Select Patient"
                                    // filterOption={filterOption}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="paidAmt"
                                    label="Pay Amt"
                                    rules={[{ required: true, message: 'Please Enter Amount to Pay' }]}
                                >
                                    <Input min={1} type='number' placeholder="Please Enter Amount to Pay" />
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* <Col className="gutter-row" span={2}>
                            <Form.Item
                                name="isActive"
                                // label="Is this a service"
                                rules={[{ required: true, message: 'Please check' }]}
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Checkbox >IsActive</Checkbox>
                            </Form.Item>
                        </Col> */}
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                Pay
                            </Button>
                            <Button onClick={goBack} style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>

                </>
            </Form>
        )
    }
    const BalanceList = () => {
        const columns: any = [
            {
                title: 'Patient Name',
                key: 'patientName',
                dataIndex: 'patientName',

            },
            {
                title: 'Mobile No',
                key: 'mobileNo',
                dataIndex: 'mobileNo',
            },
            {
                title: 'Email',
                key: 'email',
                dataIndex: 'email',

            },
            {
                title: 'ActualPayAmt',
                key: 'actualPayAmt',
                dataIndex: 'actualPayAmt',

            },
            {
                title: 'BalanceAmt',
                key: 'balanceAmt',
                dataIndex: 'balanceAmt',

            },
            {
                title: 'PatientNo',
                key: 'patientNo',
                dataIndex: 'patientNo',

            },
            {
                title: 'PatientCaseNo',
                key: 'patientCaseNo',
                dataIndex: 'patientCaseNo',

            },
            {
                title: 'PayDate',
                key: 'payDate',
                dataIndex: 'payDate',
                render: (text: any) => <Typography>{moment(text).format('DD MMM YYYY')}</Typography>

            },
            {
                title: 'Pay',
                key: 'pay',
                render: (record: any) => <Button onClick={() => setEditField(record)}>{'Pay'}</Button>
            },

        ];

        return (
            <Table
                title={() => <Form
                    ref={formRef}
                    layout="horizontal"
                    form={filterForm}
                    onFinish={getBalanceBill}
                    preserve={true}
                    scrollToFirstError={true}
                >
                    <>
                            <Row gutter={16}>
                                <Form.Item
                                    initialValue={[dayjs().subtract(1, 'months'), dayjs()]}
                                    name="dateRange"
                                    label="From - To Date"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <RangePicker
                                        defaultValue={[dayjs().subtract(1, 'months'), dayjs()]}
                                        format={dateFormat}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                                <Button style={{marginLeft:20}}  type="primary" htmlType="submit">
                                    Filter
                                </Button>
                            </Row>
                    </>
                </Form>}
                scroll={{ y: 180 }}
                columns={columns}
                size="small"
                dataSource={balanceBillList}
                pagination={false}
            />
        )
    }

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                    title="Partial Pay Amt"
                // extra={[
                //     <Button key="rest" onClick={() => {
                //         history.push("/complaints/list")
                //     }}
                //     >List</Button>,
                // ]}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {addForm()}
                        </div>
                    </Spin>
                </Card>
                <BalanceList refresh={loading}
                    editRecord={(data: any) => setEditField(data)} />
            </Space>
        </PageContainer>
    );
};

export default PatientPartialPharmacyBilling;