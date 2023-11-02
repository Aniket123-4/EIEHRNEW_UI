import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvGroup, requestAddInvParameter } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';


const { Option } = Select;


const AddInvGroup = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [row, setRow] = useState(1);
    const [col, setCol] = useState(1);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [isService, setIsService] = useState<any>([{ value: "1", label: "Yes" },{ value: "0", label: "Yes" }])
    const [rateType, setRateType] = useState<any>([])
    const [institute, setInstitute] = useState<any>([])


    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        // getComplaintType();
        // getRateType();
    }, [])

    const getComplaintType = async () => {
        const res = await requestGetRoomType({});
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.roomTypeID, label: item.roomTypeName }
            })
            setDiseaseType(dataMaskForDropdown)
        }
    }

    const getRateType = async () => {
        const res = await requestGetRateType({});
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { label: item.rateTypeName, value: item.rateTypeID }
            })
            setRateType(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }

    const addInvGroup = async (values: any) => {
        console.log(values);
        try {
            const staticParams = {
                // "invGroupID": "string",
                // "invGroupName": "string",
                // "invGroupCode": "string",
                // "invGroupDesc": "string",
                // "discountParameterID": 0,
                "isActive": true,
                "formID": -1,
                "type": 1,
                //"isService": 1
            };

            setLoading(true)
            const msg = await requestAddInvGroup({ ...values, ...staticParams });
            setLoading(false)
            console.log(msg);
            // if (msg.isSuccess === "True") {
            //     form.resetFields();
            //     onClose();
            //     message.success(msg.msg);
            //     onSaveSuccess(msg);
            //     return;
            // } else {
            //     message.error(msg.msg);
            // }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };


    const addForm = () => {
        return (
            <Form
                layout="vertical"
                hideRequiredMark
                form={form}
                onFinish={addInvGroup}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>

                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}  >
                                <Form.Item
                                    name="invGroupName"
                                    label="Investigation group name"
                                    rules={[{ required: true, message: 'Please enter group name' }]}
                                // initialValue={institute}
                                >
                                    <Input style={{height: 40,fontSize:16}} placeholder="Please enter investigation group name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    // initialValue={institute}
                                    name="invGroupID"
                                    label="investigation group"
                                    rules={[{ required: true, message: 'Please select investigation group' }]}
                                >
                                    <Select
                                        placeholder="Investigation group"
                                        optionFilterProp="children"
                                        options={isService}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    // initialValue={institute}
                                    name="isService"
                                    label="Is this a service"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <Select
                                        placeholder="Yes"
                                        optionFilterProp="children"
                                        options={isService}
                                    />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row  gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="invGroupCode"
                                    label="investigation group code"
                                    rules={[{ required: true, message: 'Please enter investigation group code' }]}
                                >
                                    <Input style={{height: 40,fontSize:16}} placeholder="Please enter investigation group code" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="invGroupDesc"
                                    label="Investigation group description"
                                    rules={[{ required: true, message: 'Please enter investigation group description' }]}
                                >
                                    <Input style={{height: 40,fontSize:16}} placeholder="Please enter investigation group description" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="discountParameterID"
                                    label="Discount"
                                    rules={[{ required: true, message: 'Please enter discount' }]}
                                >
                                    <Input style={{height: 40,fontSize:16}} placeholder="Please enter discount" />
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
        <PageContainer style={{ backgroundColor: '#4874dc', height: 120 }}>
            <Card
                title="Create a new Investigation Group"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {addForm()}
                    </div>
                </Spin>
            </Card>
        </PageContainer>
    );
};

export default AddInvGroup;