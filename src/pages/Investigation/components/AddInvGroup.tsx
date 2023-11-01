import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, InputNumber } from 'antd';
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
    const [current, setCurrent] = useState(0);
    const [row, setRow] = useState(1);
    const [col, setCol] = useState(1);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([{ value: "1", label: "Type 1" }])
    const [rateType, setRateType] = useState<any>([])
    const [institute, setInstitute] = useState<any>([])


    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
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
                isService: true,
                formID: -1,
                type: 1,
            };

            setLoading(true)
            const msg = await requestAddInvGroup({ ...values, ...staticParams });
            setLoading(false)
            console.log(msg);
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
                                    <InputNumber style={{ width: "100%" }} size={'large'} placeholder="Please enter" />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16}>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="isService"
                                    label="Is Service"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <Select
                                        placeholder="Please select"
                                        optionFilterProp="children"
                                        options={BOOLEAN_CHOICES}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>

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

                <InvestigationGroupList />
            </Space>

        </PageContainer>
    );
};

export default AddInvGroup;