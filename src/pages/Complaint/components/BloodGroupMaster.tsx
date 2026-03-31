import { requestGetBloodGroup, requestAddUpdateBloodGroup } from "@/services/apiRequest/dropdowns";
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
    Popconfirm,
} from "antd";
import React, { useState } from "react";
import BloodGroupList from "./BloodGroupList";

const BloodGroupMaster = () => {
    const { token } = theme.useToken();
    const [bloodGroupForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [bGroupID, setBGroupID] = useState("-1");

    const addUpdateBloodGroup = async (values: any) => {
        // For Delete operation (Type=2)
        if (values.type === 2) {
            const params = {
                "bGroupID": bGroupID,
                "bGroupName": "",
                "bGroupCode": "",
                "isActive": true,
                "userID": -1,
                "formID": -1,
                "type": 2  // Delete
            };
            setLoading(true);
            const res = await requestAddUpdateBloodGroup(params);
            if (res.isSuccess == true) {
                message.success(res?.result?.[0]?.msg || "Blood Group deleted successfully");
                resetForm();
                bloodGroupForm.resetFields();
            }
            setLoading(false);
            return;
        }

        // For Add/Update operation (Type=1)
        const params = {
            "bGroupID": bGroupID,
            "bGroupName": values.bGroupName,
            "bGroupCode": values.bGroupCode || values.bGroupName,
            "isActive": values.isActive,  // Send as boolean, not 1/0
            "userID": -1,
            "formID": -1,
            "type": 1  // Add/Update
        };
        setLoading(true);
        const res = await requestAddUpdateBloodGroup(params);
        if (res.isSuccess == true) {
            message.success(res?.result?.[0]?.msg || "Blood Group added successfully");
            resetForm();
            bloodGroupForm.resetFields();
        }
        setLoading(false);
    };

    const resetForm = () => {
        bloodGroupForm.resetFields();
        setBGroupID("-1");
        bloodGroupForm.setFieldsValue({
            isActive: true
        });
    };

    const setEditField = (data: any) => {
        bloodGroupForm.setFieldsValue({
            bGroupName: data?.bGroupName,
            bGroupCode: data?.bGroupCode,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setBGroupID(data?.bGroupID);
    };

    const handleDelete = async () => {
        if (bGroupID === "-1") {
            message.warning("Please select a blood group to delete");
            return;
        }
        await addUpdateBloodGroup({ type: 2 });
    };

    const addForm = () => {
        return (
            <Form layout="vertical" form={bloodGroupForm} onFinish={addUpdateBloodGroup}>
                <Col span={24}>
                    <Form.Item
                        name="bGroupName"
                        label="Blood Group Name"
                        rules={[
                            { required: true, message: "Please Enter Blood Group Name" }
                        ]}
                    >
                        <Input placeholder="Please Enter Blood Group Name (e.g., A+)" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="bGroupCode"
                        label="Blood Group Code"
                    >
                        <Input placeholder="Please Enter Blood Group Code (Optional)" />
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
                        <Popconfirm
                            title="Are you sure you want to delete this blood group?"
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
                                    Add Blood Group
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
                        <BloodGroupList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default BloodGroupMaster;