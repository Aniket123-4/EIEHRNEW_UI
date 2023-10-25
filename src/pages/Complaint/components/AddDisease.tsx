import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';

const { Option } = Select;


const AddDisease = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
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
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        marginTop: 20,
        height: 350
    };


    useEffect(() => {
        getComplaintType();
        getRateType();
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

    const addDisease = async (values: any) => {
        console.log(values);
        try {
            const staticParams = {
                // "diseaseTypeID": "string",
                // "diseaseTypeName": "string",
                // "diseaseTypeCode": "string",
                // "specialTypeID": "string",
                "sortOrder": 1,
                "diseasesID": "-1",
                "isActive": "1",
                "formID": -1,
                "type": 1

            };

            setLoading(true)
            const msg = await requestAddDisease({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                form.resetFields();
                onClose();
                message.success(msg.msg);
                onSaveSuccess(msg);
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


    const addForm = () => {
        return (
            <Form
                layout="vertical"
                hideRequiredMark
                form={form}
                onFinish={addDisease}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <Col span={100}>
                        <Row gutter={1}>
                            <Form.Item
                                name="diseaseTypeName"
                                label="Disease name"
                                rules={[{ required: true, message: 'Please enter disease type name' }]}
                            // initialValue={institute}
                            >
                                <Input placeholder="Please enter disease type name" />
                            </Form.Item>
                        </Row>
                        <Row gutter={1}>
                            <Form.Item
                                // initialValue={institute}
                                name="diseaseTypeID"
                                label="Disease Type"
                                rules={[{ required: true, message: 'Please select disease type' }]}
                            >
                                <Select
                                    placeholder="Complaint Type"
                                    optionFilterProp="children"
                                    options={diseaseType}
                                />
                            </Form.Item>
                        </Row>
                        <Row gutter={1}>
                            <Form.Item
                                name="diseaseTypeCode"
                                label="Disease code"
                                rules={[{ required: true, message: 'Please enter disease code' }]}
                            >
                                <Input placeholder="Please enter disease code" />
                            </Form.Item>
                        </Row>
                        <Row gutter={1}>
                            <Form.Item
                                name="specialTypeID"
                                label="special type"
                                rules={[{ required: true, message: 'Please enter special type' }]}
                            >
                                <Input placeholder="Please enter special type" />
                            </Form.Item>
                        </Row>
                        <Row>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Row>
                    </Col>

                </>
            </Form>
        )
    }

    return (
        <PageContainer>
            <Card
                title="Create a new complai`nt master"
                width={1000}
                onClose={onClose}
                open={true}
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

export default AddDisease;