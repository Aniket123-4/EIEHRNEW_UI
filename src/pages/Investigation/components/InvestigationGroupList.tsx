import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    code: string;
    discount: number;
    description: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>View</a>
                <a>Edit</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        code: 'BKJKJ',
        discount: 20,
        description: 'ml',
    },
    {
        key: '1',
        name: 'John Brown',
        code: '698698',
        discount: 20,
        description: 'ml',
    },

];


const InvestigationGroupList = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
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
                                        options={[{ name: 'True', id: '1' }]}
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
                title="Investigation Group List"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <div style={contentStyle}>
                    <Table columns={columns} dataSource={data} />
                </div>
            </Card>
        </PageContainer>
    );
};

export default InvestigationGroupList;