import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, InputNumber, Checkbox } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvGroup, requestAddInvParameter } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { constant } from 'lodash';
import { BOOLEAN_CHOICES } from '@/utils/constant';
import InvestigationGroupList from './InvestigationGroupList';

const { Option } = Select;

const AddInvGroup = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const investigationGroupListRef = useRef();

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };


    const goBack = () => {
        history.push("/")
    }

    const addInvGroup = async (values: any) => {
        try {
            const staticParams = {
                invGroupID: "-1",
                isService: +values.isService,
                formID: -1,
                type: 1,
            };

            setLoading(true)
            const msg = await requestAddInvGroup({ ...values, ...staticParams });
            setLoading(false)
            console.log(msg);

            if (msg?.isSuccess) {
                message.success(msg?.msg);
                form.resetFields();
                if (investigationGroupListRef.current) {
                    investigationGroupListRef.current.getGroupList();
                }
            } else {
                message.error(msg?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    };


    const addForm = () => {
        return (
            <Form
                layout="vertical"
                form={form}
                onFinish={addInvGroup}
                initialValues={{
                }}
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}  >
                                <Form.Item
                                    name="invGroupName"
                                    label="Group name"
                                    rules={[{ required: true, message: 'Please enter group name' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="invGroupCode"
                                    label="Code"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>


                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="discountParameterID"
                                    label="Discount"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        style={{ width: "100%" }}
                                        size={'large'}
                                        placeholder="Please enter"
                                        formatter={(value) => `${value}%`}
                                        parser={(value) => value!.replace('%', '')}

                                    />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16}>


                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="invGroupDesc"
                                    label="Description"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <Input.TextArea size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>



                        </Row>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="isService"
                                    rules={[{ required: false, message: 'Please select' }]}
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Checkbox>Is Service</Checkbox>
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

            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title="Investigation Group"
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {addForm()}
                        </div>
                    </Spin>
                </Card>

                <InvestigationGroupList ref={investigationGroupListRef} />
            </Space>

        </PageContainer>
    );
};

export default AddInvGroup;