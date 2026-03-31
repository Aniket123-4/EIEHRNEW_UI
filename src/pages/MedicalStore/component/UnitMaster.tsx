import { requestAddUpdateUnit, requestGetUnit } from "@/services/apiRequest/dropdowns";
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
import React, { useRef, useState } from "react";
import UnitList from "./UnitList";

const UnitMaster = () => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [unitForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [unitID, setUnitID] = useState("-1");

    const addUnit = async (values: any) => {
        // For Delete operation (Type=2)
        if (values.type === 2) {
            const params = {
                "unitID": unitID,
                "unitName": "",
                "isActive": true,
                "type": 2  // Delete
            };
            setLoading(true);
            const res = await requestAddUpdateUnit(params);
            if (res.isSuccess == true) {
                message.success(res?.msg || "Unit deleted successfully");
                resetForm();
                unitForm.resetFields();
            }
            setLoading(false);
            return;
        }

        // For Add/Update operation (Type=1)
        const params = {
            "unitID": unitID,
            "unitName": values.unitName,
            "isActive": values.isActive,  // Send as boolean, not 1/0
            "type": 1  // Add/Update
        };
        setLoading(true);
        const res = await requestAddUpdateUnit(params);
        if (res.isSuccess == true) {
            message.success(res?.msg || "Unit added successfully");
            resetForm();
            unitForm.resetFields();
        }
        setLoading(false);
    };

    const resetForm = () => {
        unitForm.resetFields();
        setUnitID("-1");
        unitForm.setFieldsValue({
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
        unitForm.setFieldsValue({
            unitName: data?.unitName,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setUnitID(data?.unitID);
    };

    const handleDelete = async () => {
        if (unitID === "-1") {
            message.warning("Please select a unit to delete");
            return;
        }
        await addUnit({ type: 2 });
    };

    const addForm = () => {
        return (
            <Form layout="vertical" form={unitForm} onFinish={addUnit}>
                <Col className="gutter-row" span={24}>
                    <Form.Item
                        name="unitName"
                        label="Unit Name"
                        rules={[
                            { required: true, message: "Please Enter Unit Name" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter Unit Name" />
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
                            title="Are you sure you want to delete this unit?"
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
                                    Add Unit
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
                        <UnitList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default UnitMaster;