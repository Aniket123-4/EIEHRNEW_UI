import { requestGetReligion, requestAddUpdateReligion } from "@/services/apiRequest/dropdowns";
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
import ReligionList from "./ReligionList";

const ReligionMaster = () => {
    const { token } = theme.useToken();
    const [religionForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [religionID, setReligionID] = useState("-1");

    const addUpdateReligion = async (values: any) => {
        // For Delete operation (Type=2)
        if (values.type === 2) {
            const params = {
                "religionID": religionID,
                "religionName": "",
                "religionCode": "",
                "isActive": true,
                "userID": -1,
                "formID": -1,
                "type": 2  // Delete
            };
            setLoading(true);
            const res = await requestAddUpdateReligion(params);
            if (res.isSuccess == true) {
                message.success(res?.result?.[0]?.msg || "Religion deleted successfully");
                resetForm();
                religionForm.resetFields();
            }
            setLoading(false);
            return;
        }

        // For Add/Update operation (Type=1)
        const params = {
            "religionID": religionID,
            "religionName": values.religionName,
            "religionCode": values.religionCode || values.religionName,
            "isActive": values.isActive,  // Send as boolean, not 1/0
            "userID": -1,
            "formID": -1,
            "type": 1  // Add/Update
        };
        setLoading(true);
        const res = await requestAddUpdateReligion(params);
        if (res.isSuccess == true) {
            message.success(res?.result?.[0]?.msg || "Religion added successfully");
            resetForm();
            religionForm.resetFields();
        }
        setLoading(false);
    };

    const resetForm = () => {
        religionForm.resetFields();
        setReligionID("-1");
        religionForm.setFieldsValue({
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
        religionForm.setFieldsValue({
            religionName: data?.religionName,
            religionCode: data?.religionCode,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setReligionID(data?.religionID);
    };

    const handleDelete = async () => {
        if (religionID === "-1") {
            message.warning("Please select a religion to delete");
            return;
        }
        await addUpdateReligion({ type: 2 });
    };

    const addForm = () => {
        return (
            <Form layout="vertical" form={religionForm} onFinish={addUpdateReligion}>
                <Col span={24}>
                    <Form.Item
                        name="religionName"
                        label="Religion Name"
                        rules={[
                            { required: true, message: "Please Enter Religion Name" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter Religion Name" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="religionCode"
                        label="Religion Code"
                    >
                        <Input placeholder="Please Enter Religion Code (Optional)" />
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
                            title="Are you sure you want to delete this religion?"
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
                                    Add Religion
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
                        <ReligionList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default ReligionMaster;