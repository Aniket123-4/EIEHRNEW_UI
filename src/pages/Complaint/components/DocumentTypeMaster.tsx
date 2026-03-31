import { requestGetUniqueID } from "@/services/apiRequest/dropdowns";
import { PageContainer } from "@ant-design/pro-components";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Input,
    message,
    Row,
    Space,
    Spin,
    theme,
    Typography,
} from "antd";
import React, { useState } from "react";
import DocumentTypeList from "./DocumentTypeList";

const DocumentTypeMaster = () => {
    const { token } = theme.useToken();
    const [documentForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uniqueID, setUniqueID] = useState("-1");

    const addDocumentType = async (values: any) => {
        const params = {
            "uniqueID": uniqueID,
            "uniqueName": values.uniqueName,
            "uniqueCode": values.uniqueCode || values.uniqueName,
            "isActive": values.isActive ? 1 : 0,
            "type": 1
        };
        setLoading(true);
        // You'll need to create this API function
        const res = await requestAddUniqueID(params);
        if (res.isSuccess == true) {
            message.success(res?.result?.[0]?.msg || "Document Type added successfully");
            resetForm();
            documentForm.resetFields();
        }
        setLoading(false);
    };

    const resetForm = () => {
        documentForm.resetFields();
        setUniqueID("-1");
        documentForm.setFieldsValue({
            isActive: true
        });
    };

    const validateCharacters = (rule: any, value: string, callback: any) => {
        if (!value) {
            callback();
            return;
        }
        const regex = /^[A-Za-z\s]+$/;
        if (!regex.test(value)) {
            callback('Only characters are allowed');
        } else {
            callback();
        }
    };

    const setEditField = (data: any) => {
        documentForm.setFieldsValue({
            uniqueName: data?.uniqueName,
            uniqueCode: data?.uniqueCode,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setUniqueID(data?.uniqueID);
    };

    const addForm = () => {
        return (
            <Form layout="vertical" form={documentForm} onFinish={addDocumentType}>
                <Col span={24}>
                    <Form.Item
                        name="uniqueName"
                        label="Document Type Name"
                        rules={[
                            { required: true, message: "Please Enter Document Type Name" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter Document Type Name (e.g., Aadhaar, Pan Card)" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="uniqueCode"
                        label="Document Type Code"
                    >
                        <Input placeholder="Please Enter Document Type Code (Optional)" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="isActive"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Checkbox>Is Active</Checkbox>
                    </Form.Item>
                </Col>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button onClick={resetForm} type="default">
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        );
    };

    return (
        <PageContainer title=" ">
            <Space direction="horizontal" size="middle" style={{ display: "flex", width: '100%' }}>
                <Row gutter={16} style={{ width: '100%' }}>
                    <Col xs={24} xl={10}>
                        <Card
                            title={
                                <Typography style={{
                                    margin: 0,
                                    color: '#0050b3',
                                    fontWeight: 600,
                                    fontSize: '18px'
                                }}>
                                    Add Document Type
                                </Typography>
                            }
                            headStyle={{
                                backgroundColor: '#e6f7ff',
                                borderBottom: '1px solid #91d5ff',
                                padding: '12px 16px',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px',
                            }}
                            bodyStyle={{ padding: '16px 20px' }}
                            style={{
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 3px 12px rgba(72, 116, 220, 0.18)',
                                marginBottom: 24,
                            }}
                        >
                            <Spin tip="Please wait..." spinning={loading}>
                                {addForm()}
                            </Spin>
                        </Card>
                    </Col>
                    <Col xs={24} xl={14}>
                        <DocumentTypeList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default DocumentTypeMaster;