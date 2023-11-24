import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, Divider, Modal } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestDiseaseList, requestDiseaseTypeList, requestSpecialList } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import DiseaseList from './DiseaseList';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import InvServiceList from './InvServiceList';


const { Option } = Select;


const AddInvService = () => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([])
    const [isActive, setIsActive] = useState(true);
    const [specialList, setSpecialist] = useState([]);
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);



    const contentStyle: React.CSSProperties = {
        // lineHeight: '260px',
        // textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getSpecialType();
        getDiseaseType();
    }, [])

    const getSpecialType = async () => {
        const res = await requestSpecialList({});
        // console.log(res);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.diseaseTypeID, label: item.diseaseTypeName }
            })
            setSpecialist(dataMaskForDropdown)
        }
    }
    const getDiseaseType = async () => {
        const params = {
            "diseaseTypeID": -1,
            "specialTypeID": -1,
            "isActive": -1,
            "type": 1
        }
        const res = await requestDiseaseTypeList(params);
        console.log(res);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: number) => {
                return { value: item.diseaseTypeID, label: item.diseaseTypeName }
            })
            setDiseaseType(dataMaskForDropdown)
            // console.log(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }

    const addDisease = async (values: any, type: number = 1) => {
        values['isActive'] =values.isActive.toString();
        // values['diseaseTypeID'] = values.diseaseTypeID ? values.diseaseTypeID.toString() : "-1";
        try {
            const staticParams = {
                // "diseaseTypeID": values['diseaseTypeID'] ? values['diseaseTypeID'] : "-1",
                // "diseaseTypeName": "string",
                // "diseaseTypeCode": " string",
                // "specialTypeID": "string",
                // "isActive": isActive.toString(),
                "sortOrder": 1,
                "diseasesID": "-1",
                "formID": -1,
                "type": type

            };
            console.log(values, staticParams)
            setLoading(true)
            const msg = await requestAddDisease({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                message.success(msg.msg);
                setIsModalOpen(false);
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };
    const onChange = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isActive: e.target.checked
        })
        setIsActive(e.target.checked)
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase());//.toLowerCase()
    const addForm = () => {
        return (
            <Form
                layout="vertical"
                // hideRequiredMark
                form={form}
                onFinish={(values) => addDisease(values, 2)}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="serviceName"
                                    label="Battery of Test Name"
                                    rules={[{ required: true, message: 'Please enter service name' }]}
                                // initialValue={institute}
                                >
                                    <Input size={'large'} placeholder="Please enter service name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="serviceFrom"
                                    label="Effective From Date"
                                    rules={[{ required: true, message: 'Please Select From Date' }]}
                                >
                                    <DatePicker
                                        size={'large'}
                                        style={{ width: '100%' }}
                                        format={'DD-MMM-YYYY'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="serviceTo"
                                    label="Effective To Date"
                                    rules={[{ required: true, message: 'Please select to date' }]}
                                >
                                    <DatePicker
                                        size={'large'}
                                        style={{ width: '100%' }}
                                        format={'DD-MMM-YYYY'}
                                    />
                                </Form.Item>
                            </Col>
                            
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="serviceCost"
                                    label="Cost"
                                    rules={[{ required: true, message: 'Please enter cost' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter cost" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="CGSTPercent"
                                rules={[{ required: false, message: 'Please select SGST Percent' }]}
                                label="CGST"
                            >
                                <Input size={'large'} placeholder="Please enter CGST Percent" />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="SGSTPercent"
                                label="SGST"
                                rules={[{ required: false, message: 'Please enter SGST Percent' }]}
                            >
                                <Input size={'large'} placeholder="Please enter SGST Percent" />
                            </Form.Item>
                        </Col>

                        </Row>
                        
                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="isActive"
                                valuePropName="checked"
                                initialValue={true}
                                // rules={[{ required: false, message: 'Please select isActive' }]}
                                label=""
                                rules={[{ required: false, message: 'Please select' }]}
                            >
                                <Checkbox>isActive</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button onClick={goBack}
                                style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>
                    <Modal
                        title="Add new Disease Type"
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={[
                        ]}>
                        <Form
                            onFinish={(v) => addDisease(v = { diseaseTypeID: '-1', ...v }, 1)}>

                            <Form.Item
                                name="diseaseTypeName"
                                label="Disease Type Name"
                                rules={[{ required: true, message: 'Please enter disease code' }]}
                            >
                                <Input size={'large'} placeholder="Please enter disease code" />
                            </Form.Item>
                            <Form.Item
                                name="DiseaseTypeCode"
                                label="Disease Type Code"
                                rules={[{ required: true, message: 'Please enter disease code' }]}
                            >
                                <Input size={'large'} placeholder="Please enter disease code" />
                            </Form.Item>
                            <Form.Item
                                name="specialTypeID"
                                label="Special type"
                                rules={[{ required: true, message: 'Please enter special type' }]}
                            >
                                <Select
                                    showSearch
                                    size={'large'}
                                    placeholder="Select Special Type"
                                    options={specialList}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button style={{marginLeft:10}} onClick={handleCancel}
                                type="default" >
                                Cancel
                            </Button>
                        </Form>
                    </Modal>
                </>
            </Form>
        )
    }

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                    title="Add new Investigation Service"
                // extra={[
                //     <Button key="rest" onClick={() => {
                //         history.push("/complaints/DiseaseList")
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
                <InvServiceList />
            </Space>
        </PageContainer>
    );
};

export default AddInvService;