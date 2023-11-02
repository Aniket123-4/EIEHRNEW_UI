import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';

const { Option } = Select;

const AddInvParameter = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([{ value: "1", label: "Type 1" }])
    const { token } = theme.useToken();

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

    const addForm = () => {
        return (
            <Form
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
                            <Col className="gutter-row" span={8}  >
                                <Form.Item
                                    name="invGroupName"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please enter name' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter investigation group name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="invCode"
                                    label="Code"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="invGroupID"
                                    label="Group"
                                    rules={[{ required: true, message: 'Please select group' }]}
                                >
                                    <Select
                                        placeholder="Group"
                                        optionFilterProp="children"
                                        options={diseaseType}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>


                        </Row>
                        <Row gutter={16}>

                            <Col className="gutter-row" span={8}  >
                                <Form.Item
                                    name="invRange"
                                    label="Range"
                                    rules={[{ required: true, message: 'Please enter range' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter range" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="unitID"
                                    label="Unit"
                                    rules={[{ required: true, message: 'Please select unit' }]}
                                >
                                    <Select
                                        placeholder="Unit"
                                        optionFilterProp="children"
                                        options={diseaseType}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="invNameML"
                                    label="Name ML"
                                    rules={[{ required: true, message: 'Please enter name ml' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter name ml" />
                                </Form.Item>
                            </Col>



                        </Row>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="isVATApplicable"
                                    label="VAT Applicable"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <Select
                                        placeholder="VAT Applicable"
                                        optionFilterProp="children"
                                        options={[{ label: 'True', value: '1' }]}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="vatPercent"
                                    label="VAT Percent"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="cgstPercent"
                                    label="CGST Percent"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="sgstPercent"
                                    label="SGST Percent"
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
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
            style={{ backgroundColor: '#4874dc', height: 120 }}

        >
            <Card
                title="Create investigation"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
                extra={[
                    <Button key="rest" onClick={() => {
                        history.push("/investigation/list")
                    }}
                    >List</Button>,
                ]}
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

export default AddInvParameter;