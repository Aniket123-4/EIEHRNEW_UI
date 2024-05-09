import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import InvestigationList from './InvestigationList';
import { MinusCircleOutlined, PlusCircleFilled, PlusOutlined } from '@ant-design/icons';
import { requestAddInvGroup, requestAddInvParameter, requestGetInvGroup, requestGetInvParameter, requestGetInvUnit, requestGetPatientType } from '../services/api';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import AddInvGroup from '@/pages/Complaint/components/AddInvGroup';
import { checkPrice } from '@/utils/validate';


const { Option } = Select;

const gridStyle: React.CSSProperties = {
    textAlign: 'center',
};


const AddInvParameter = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [selectedInvestigation, setSelectedInvestigation] = useState("-1")
    const [loading, setLoading] = useState(false)
    const [unitType, setUnitType] = useState<any>([{ value: "1", label: "" }])
    const [groupList, setGroupList] = useState<any>([{ value: "1", label: "" }])
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const [openAddUnit, setOpenAddUnit] = useState(false);
    const [vatApplicable, setVatApplicable] = useState(false);
    const [isRange, setIsRange] = useState(false);
    const [lstType_Patient, setLstType_Patient] = useState([]);
    const investigationListRef = useRef();

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    useEffect(() => {
        getInvGroupList();
        getInvUnitList();
        getPatientType();
    }, [])

    const formSubmit = async (values: any) => {
        values['isRangeRequired'] = values.isRangeRequired + "";
        if (!values['lstType_Patient']) {
            values['lstType_Patient'] = []
        }
        const staticData = {
            invParameterID: selectedInvestigation,
            isActive: true,
            formID: 0,
            type: 0,
            isEditorReq: "true",
            invNameML:'',
            InvRange: "0"
        }
        console.log(values);

        try {
            setLoading(true)
            const msg = await requestAddInvParameter({ ...values, ...staticData });
            setLoading(false)
            console.log(msg);

            if (msg?.isSuccess) {
                message.success(msg?.msg);
                form.resetFields();
                getInvGroupList();
                getInvUnitList();
                getPatientType();
                if (investigationListRef.current) {
                    investigationListRef.current.getList();
                }
            } else {
                message.error(msg?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }

    }

    const goBack = () => {
        history.push("/")
    }
    const addGroup = () => {
        setOpen(true);
    }
    const hideModal = () => {
        setOpen(false);
    };


    const getPatientType = async () => {
        const res = await requestGetPatientType();
        console.log(res.result.length > 0);
        if (res.result.length > 0) {
            const dataMask = res?.result?.map((item: any) => {
                return {
                    col1: "",
                    col2: "",
                    col3: "",
                    col4: item.patientTypeID,
                    col5: "",
                    col6: "",
                    col7: "",
                    col8: "",
                    col9: "",
                    col10: "",
                    col11: "",
                    col12: "",
                    col13: "",
                    col14: "",
                    col15: "",
                    patientTypeName: item?.patientTypeName
                }
            })
            setLstType_Patient(dataMask)
        }
    }

    const getInvGroupList = async () => {
        const params = {
            "invGroupID": -1,
            "discountParameterID": -1,
            "isActive": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetInvGroup(params);
        console.log(res.result.length > 0);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.invGroupID, label: item.invGroupName }
            })
            setGroupList(dataMaskForDropdown)
        }
    }
    const getInvUnitList = async () => {
        const params = {
            "invUnitID": "-1",
            "invUnitType": "",
            "isActive": "1",
            "type": 1
        }
        const res = await requestGetInvUnit(params);
        console.log(res.result.length > 0);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.invUnitID, label: item.invUnitName }
            })
            setUnitType(dataMaskForDropdown)
            console.log(unitType)
        }
    }

    const onChange = (e: CheckboxChangeEvent) => {
        setVatApplicable(e.target.checked)
    };

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onEditRecord = (data: any) => {
        getInvParameter(data?.invParameterID)
    }

    const getInvParameter = async (invParameterID: any) => {
        const params = {
            invParameterID,
            invGroupID: 1,
            isActive: 1,
            formID: -1,
            type: 1
        }
        const res = await requestGetInvParameter(params);
        console.log(res.result);
        const data = res.result;
        const data1 = res.result1;

        setSelectedInvestigation(data?.invParameterID)
        setIsRange(data?.isRangeRequired);
        setVatApplicable(data?.isVATApplicable);

        if (data1.length > 0) {
            const dataMask = data1?.map((item: any) => {
                return {
                    col1: "",
                    col2: "",
                    col3: "",
                    col4: item?.patientTypeID,
                    col5: item?.rangeFrom ? item?.rangeFrom : "0",
                    col6: item?.rangeTo ? item?.rangeTo : "0",
                    col7: "",
                    col8: "",
                    col9: "",
                    col10: "",
                    col11: "",
                    col12: "",
                    col13: "",
                    col14: "",
                    col15: "",
                    patientTypeName: item?.patientTypeName
                }
            });
            // console.log({ isVATApplicable: data?.isVATApplicable })
            setLstType_Patient(dataMask)
        } else {
            getPatientType();
        }


        form?.setFieldsValue({
            invName: data?.invName,
            invCode: data?.invCode,
            invGroupID: data?.m39_InvGroupID,
            invNameML: data?.invNameML,
            invRate: data?.invRate,
            isRangeRequired: data?.isRangeRequired,
            isVATApplicable: data?.isVATApplicable,
            sgstPercent: data?.sgstPercent,
            vatPercent: data?.vatPercent,
            cgstPercent: data?.cgstPercent,
            unitID: data?.invUnitID,
        });
    }


    const formList = () => {
        return (
            <>
                <Form.List
                    initialValue={lstType_Patient}
                    name="lstType_Patient">
                    {(lstType_Patient, { add, remove }) => (
                        <>
                            {lstType_Patient.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={16} >
                                    <Col className="gutter-row" span={8} xs={24} xl={8} >
                                        <Form.Item
                                            {...restField}
                                            label="Patient Type"
                                            name={[name, 'patientTypeName']}
                                            rules={[{ required: false, message: 'Patient Type' }]}
                                        >
                                            <Input disabled placeholder="Patient Type" />
                                        </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={8} xs={24} xl={8} >

                                        <Form.Item
                                            {...restField}
                                            label="Range From"
                                            name={[name, 'col5']}
                                            rules={[{ required: false, message: 'Range From' }]}
                                        >
                                            <InputNumber stringMode style={{ width: '100%' }} placeholder="Range From" />
                                        </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={8} xs={24} xl={8} >

                                        <Form.Item
                                            {...restField}
                                            label="Range To"
                                            name={[name, 'col6']}
                                            rules={[{ required: false, message: 'Range To' }]}
                                        >
                                            <InputNumber stringMode style={{ width: '100%' }} placeholder="Range To" />
                                        </Form.Item>
                                    </Col>

                                </Row>
                            ))}
                        </>
                    )}
                </Form.List>
            </>
        )
    }

    const addForm = () => {
        return (
            <Form
                ref={formRef}
                layout="vertical"
                form={form}
                onFinish={formSubmit}
                preserve={true}
                scrollToFirstError={true}
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6} xs={24} xl={6} >
                                <Form.Item
                                    name="invName"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please enter name' }]}
                                >
                                    <Input size={'large'} placeholder="Name" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6} xs={24} xl={6}>
                                <Form.Item
                                    name="invGroupID"
                                    label="Group"
                                    rules={[{ required: true, message: 'Please select group' }]}

                                >
                                    <Select
                                        showSearch
                                        filterOption={filterOption}
                                        placeholder="Group"
                                        optionFilterProp="children"
                                        options={groupList}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6} xs={24} xl={6}>
                                <Form.Item
                                    name="invCode"
                                    label="Code"
                                    rules={[{ required: true, message: 'Code' }]}
                                >
                                    <Input style={{ width: '100%' }} size={'large'} placeholder="Please enter" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6} xs={24} xl={6}>
                                <Form.Item
                                    name="unitID"
                                    label="Unit"
                                    rules={[{ required: true, message: 'Please select unit' }]}
                                >
                                    <Select
                                        size={'large'}
                                        placeholder="Unit"
                                        optionFilterProp="children"
                                        dropdownRender={(menu) => (
                                            <>
                                                {/* <Space style={{ padding: 4 }}>
                                                    <Button type="primary" icon={<PlusOutlined />} onClick={addGroup}>
                                                        Add New
                                                    </Button>
                                                </Space>
                                                <Divider style={{ margin: '8px 0' }} /> */}
                                                {menu}
                                            </>
                                        )}
                                        options={unitType}
                                    />

                                </Form.Item>
                            </Col>





                        </Row>

                        <Row gutter={16}>
                            {/* <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="invNameML"
                                    label="Unit Name in Other Language"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col> */}
                            <Col className="gutter-row" span={6} >
                                <Form.Item
                                    name="isService"
                                    label=""
                                    rules={[{ required: false, message: 'Please select' }]}
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Checkbox>Is Service</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="isRangeRequired"
                                    label=""
                                    rules={[{ required: false, message: 'Please select' }]}
                                    valuePropName="checked"
                                    initialValue={false}
                                >
                                    <Checkbox onChange={(e => { setIsRange(e.target.checked) })}>Is Range</Checkbox>
                                </Form.Item>
                            </Col>


                        </Row>

                        {isRange ?
                            <Row gutter={16} style={{ marginBottom: "2%" }} >
                                <Col span={24}>
                                    <Card style={{ textAlign: 'center', background: '#3f51b51f' }}>
                                        {formList()}
                                    </Card>
                                </Col>
                            </Row> : <></>}


                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="isVATApplicable"
                                    label=""
                                    rules={[{ required: false, message: 'Please select' }]}
                                    valuePropName="checked"
                                    initialValue={false}
                                >
                                    <Checkbox onChange={(e => { setVatApplicable(e.target.checked) })}>GST Applicable</Checkbox>
                                </Form.Item>
                            </Col>
                            {vatApplicable &&
                                <Col className="gutter-row" span={6} xs={24} xl={6}>
                                    <Form.Item
                                        name="vatPercent"
                                        label="GST Percent"
                                        rules={[{ required: vatApplicable ? true : false, message: 'Please enter' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            size={'large'}
                                            placeholder="Please enter"
                                            formatter={(value) => `${value}%`}
                                            parser={(value) => value!.replace('%', '')}
                                            min={0}
                                            max={100}
                                        />
                                    </Form.Item>
                                </Col>}

                            {vatApplicable &&
                                <Col className="gutter-row" span={6} xs={24} xl={6}>
                                    <Form.Item
                                        name="cgstPercent"
                                        label="CGST Percent"
                                        rules={[{ required: vatApplicable ? true : false, message: 'Please enter' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            size={'large'}
                                            placeholder="Please enter"
                                            formatter={(value) => `${value}%`}
                                            parser={(value) => value!.replace('%', '')}
                                            min={0}
                                            max={100}
                                        />
                                    </Form.Item>
                                </Col>}

                            {vatApplicable &&
                                <Col className="gutter-row" span={6} xs={24} xl={6}>
                                    <Form.Item
                                        name="sgstPercent"
                                        label="SGST Percent"
                                        rules={[{ required: vatApplicable ? true : false, message: 'Please enter' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            size={'large'}
                                            placeholder="Please enter"
                                            formatter={(value) => `${value}%`}
                                            parser={(value) => value!.replace('%', '')}
                                            min={0}
                                            max={100}
                                        />
                                    </Form.Item>
                                </Col>}

                            <Col className="gutter-row" span={6} xs={24} xl={6} xs={24} xl={6} >
                                <Form.Item
                                    name="invRate"
                                    label="Rate"
                                    rules={[{ required: true, message: 'Please enter' }]}

                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        size={'large'}
                                        placeholder="Please enter"
                                        min={0}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                Submit
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

    return (
        <PageContainer
        title=" "
        // style={{ backgroundColor: '#4874dc', height: 120 }}
        >
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title="Create Investigation Test"
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {addForm()}
                        </div>
                    </Spin>
                </Card>
                <InvestigationList
                    onEditRecord={onEditRecord}
                    ref={investigationListRef}
                />
            </Space>
            <Modal
                title="Add Unit"
                open={openAddUnit}
                onOk={hideModal}
                onCancel={hideModal}
                okText="Submit"
                cancelText=""
            >
                <AddInvGroup />
            </Modal>
        </PageContainer>
    );
};

export default AddInvParameter;