import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import InvestigationGroupList from './InvestigationGroupList';
import InvestigationList from './InvestigationList';
import { PlusCircleFilled,PlusOutlined } from '@ant-design/icons';
import { requestGetInvGroup, requestGetInvUnit } from '../services/api';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import AddInvGroup from '@/pages/Complaint/components/AddInvGroup';
import AddInvUnit from '@/pages/Complaint/components/AddInvUnit';

const { Option } = Select;

const AddInvParameter = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [unitType, setUnitType] = useState<any>([{ value: "1", label: "" }])
    const [groupList, setGroupList] = useState<any>([{ value: "1", label: "" }])
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const [openAddUnit, setOpenAddUnit] = useState(false);
    const [vatApplicable, setVatApplicable] = useState(false);

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    const formSubmit = async (values: any) => {
        console.log(values);
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
    useEffect(() => {
        getInvGroupList();
        getInvUnitList();
    }, [])

    const getInvGroupList = async () => {
        const params = {
            "invGroupID": -1,
            "discountParameterID": 1,
            "isActive": 1,
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
        formRef.current?.setFieldsValue({
            isVATApplicable: e.target.checked
        })
        setVatApplicable(e.target.checked)
    };

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const addForm = () => {
        return (
            <Form
                ref={formRef}
                layout="vertical"
                form={form}
                onFinish={formSubmit}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>

                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}  >
                                <Form.Item
                                    name="invGroupName"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please enter name' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter investigation group name" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={5}>
                                <Form.Item
                                    name="invGroupID"
                                    label="Group"
                                    rules={[{ required: true, message: 'Please select group' }]}

                                >
                                    <Select
                                        showSearch
                                        filterOption={filterOption}
                                        style={{ width: "121%" }}
                                        placeholder="Group"
                                        optionFilterProp="children"
                                        options={groupList}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                <PlusOutlined  onClick={addGroup} size={25} />
                                <Modal
                                    title="Add Group"
                                    open={open}
                                    onOk={hideModal}
                                    onCancel={hideModal}
                                    okText="Submit"
                                    cancelText=""
                                >
                                    <AddInvUnit/>
                                </Modal>

                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="invCode"
                                    label="Code"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            {/* </Row> */}
                            {/* <Row gutter={16}> */}

                            <Col className="gutter-row" span={6}  >
                                <Form.Item
                                    name="invRange"
                                    label="Range"
                                    rules={[{ required: true, message: 'Please enter range' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter range" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={5}>
                                <Form.Item
                                    name="unitID"
                                    label="Unit"
                                    rules={[{ required: true, message: 'Please select unit' }]}
                                >
                                    <Select
                                        style={{ width: "121%" }}
                                        showSearch
                                        filterOption={filterOption}
                                        placeholder="Unit"
                                        optionFilterProp="children"
                                        options={unitType}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                <PlusCircleFilled onClick={addGroup}/>
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

                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="invNameML"
                                    label="Name in Other Language"
                                    rules={[{ required: true, message: 'Please enter name ml' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter name ml" />
                                </Form.Item>
                            </Col>



                            {/* </Row> */}
                            {/* <Row gutter={16}> */}
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="isVATApplicable"
                                    label="VAT Applicable"
                                >
                                    <Checkbox onChange={onChange}>VAT Applicable</Checkbox>
                                    {/* <Select
                                        placeholder="VAT Applicable"
                                        optionFilterProp="children"
                                        options={[{ label: 'True', value: '1' }]}
                                        size={'large'}
                                    /> */}
                                </Form.Item>
                            </Col>
                            {vatApplicable && 
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="vatPercent"
                                    label="VAT Percent"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>}

                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="cgstPercent"
                                    label="CGST Percent"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="sgstPercent"
                                    label="SGST Percent"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="invRate"
                                    label="Rate"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" />
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
            // style={{ backgroundColor: '#4874dc', height: 120 }}
        >
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title="Create investigation"
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {addForm()}
                        </div>
                    </Spin>
                </Card>
                <InvestigationList />
            </Space>
        </PageContainer>
    );
};

export default AddInvParameter;