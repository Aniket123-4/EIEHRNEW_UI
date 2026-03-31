import { requestGetRelation, requestAddUpdateRelation } from "@/services/apiRequest/dropdowns";
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
    Select,
    Space,
    Spin,
    theme,
    Typography,
    Popconfirm,
} from "antd";
import React, { useState } from "react";
import RelationList from "./RelationList";

const { Option } = Select;

const RelationMaster = () => {
    const { token } = theme.useToken();
    const [relationForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [relationID, setRelationID] = useState("-1");

    const addUpdateRelation = async (values: any) => {
        // For Delete operation (Type=2)
        if (values.type === 2) {
            const params = {
                "relationID": relationID,
                "relationName": "",
                "relationCode": "",
                "relationType": "1",
                "isActive": true,
                "userID": -1,
                "formID": -1,
                "type": 2  // Delete
            };
            setLoading(true);
            const res = await requestAddUpdateRelation(params);
            if (res.isSuccess == true) {
                message.success(res?.result?.[0]?.msg || "Relation deleted successfully");
                resetForm();
                relationForm.resetFields();
            }
            setLoading(false);
            return;
        }

        // For Add/Update operation (Type=1)
        const params = {
            "relationID": relationID,
            "relationName": values.relationName,
            "relationCode": values.relationCode || values.relationName,
            "relationType": values.relationType,
            "isActive": values.isActive,  // Send as boolean, not 1/0
            "userID": -1,
            "formID": -1,
            "type": 1  // Add/Update
        };
        setLoading(true);
        const res = await requestAddUpdateRelation(params);
        if (res.isSuccess == true) {
            message.success(res?.result?.[0]?.msg || "Relation added successfully");
            resetForm();
            relationForm.resetFields();
        }
        setLoading(false);
    };

    const resetForm = () => {
        relationForm.resetFields();
        setRelationID("-1");
        relationForm.setFieldsValue({
            isActive: true,
            relationType: "1"
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
        relationForm.setFieldsValue({
            relationName: data?.relationName,
            relationCode: data?.relationCode,
            relationType: data?.relationType,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setRelationID(data?.relationID);
    };

    const handleDelete = async () => {
        if (relationID === "-1") {
            message.warning("Please select a relation to delete");
            return;
        }
        await addUpdateRelation({ type: 2 });
    };

    const addForm = () => {
        return (
            <Form layout="vertical" form={relationForm} onFinish={addUpdateRelation} initialValues={{ relationType: "1" }}>
                <Col span={24}>
                    <Form.Item
                        name="relationName"
                        label="Relation Name"
                        rules={[
                            { required: true, message: "Please Enter Relation Name" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter Relation Name" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="relationCode"
                        label="Relation Code"
                    >
                        <Input placeholder="Please Enter Relation Code (Optional)" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="relationType"
                        label="Relation Type"
                        rules={[{ required: true, message: "Please Select Relation Type" }]}
                    >
                        <Select placeholder="Select Relation Type">
                            <Option value="1">Family</Option>
                            <Option value="2">Relative</Option>
                        </Select>
                    </Form.Item>
                </Col>
                {/* <Col span={24}>
                    <Form.Item
                        name="isActive"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Checkbox>Is Active</Checkbox>
                    </Form.Item>
                </Col> */}
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button onClick={resetForm} type="default">
                            Cancel
                        </Button>
                        <Popconfirm
                            title="Are you sure you want to delete this relation?"
                            onConfirm={handleDelete}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger>
                                Delete
                            </Button>
                        </Popconfirm>
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
                                    Add Relation
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
                        <RelationList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default RelationMaster;