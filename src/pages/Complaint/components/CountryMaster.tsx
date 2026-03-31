import { requestGetCountry, requestAddUpdateCountry } from "@/services/apiRequest/dropdowns";
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
import CountryList from "./CountryList";

const CountryMaster = () => {
    const { token } = theme.useToken();
    const [countryForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [countryID, setCountryID] = useState("-1");

    const addUpdateCountry = async (values: any) => {
        // For Delete operation (Type=2)
        if (values.type === 2) {
            const params = {
                "countryID": countryID,
                "countryName": "",
                "countryCode": "",
                "nationality": "",
                "isActive": true,
                "userID": -1,
                "formID": -1,
                "type": 2  // Delete
            };
            setLoading(true);
            const res = await requestAddUpdateCountry(params);
            if (res.isSuccess == true) {
                message.success(res?.result?.[0]?.msg || "Country deleted successfully");
                resetForm();
                countryForm.resetFields();
            }
            setLoading(false);
            return;
        }

        // For Add/Update operation (Type=1)
        const params = {
            "countryID": countryID,
            "countryName": values.countryName,
            "countryCode": values.countryCode,
            "nationality": values.nationality,
            "isActive": values.isActive,  // Send as boolean, not 1/0
            "userID": -1,
            "formID": -1,
            "type": 1  // Add/Update
        };
        setLoading(true);
        const res = await requestAddUpdateCountry(params);
        if (res.isSuccess == true) {
            message.success(res?.result?.[0]?.msg || "Country added successfully");
            resetForm();
            countryForm.resetFields();
        }
        setLoading(false);
    };

    const resetForm = () => {
        countryForm.resetFields();
        setCountryID("-1");
        countryForm.setFieldsValue({
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
        countryForm.setFieldsValue({
            countryName: data?.countryName,
            countryCode: data?.countryCode,
            nationality: data?.nationality,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setCountryID(data?.countryID);
    };

    const handleDelete = async () => {
        if (countryID === "-1") {
            message.warning("Please select a country to delete");
            return;
        }
        await addUpdateCountry({ type: 2 });
    };

    const addForm = () => {
        return (
            <Form layout="vertical" form={countryForm} onFinish={addUpdateCountry}>
                <Col span={24}>
                    <Form.Item
                        name="countryName"
                        label="Country Name"
                        rules={[
                            { required: true, message: "Please Enter Country Name" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter Country Name (e.g., INDIA)" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="countryCode"
                        label="Country Code"
                        rules={[{ required: true, message: "Please Enter Country Code" }]}
                    >
                        <Input placeholder="Please Enter Country Code (e.g., IND)" maxLength={3} style={{ textTransform: 'uppercase' }} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="nationality"
                        label="Nationality"
                        rules={[
                            { required: true, message: "Please Enter Nationality" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter Nationality (e.g., INDIAN)" />
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
                        {/* <Button type="primary" htmlType="submit">
                            Submit
                        </Button> */}
                        <Button onClick={resetForm} type="default">
                            Cancel
                        </Button>
                        <Popconfirm
                            title="Are you sure you want to delete this country?"
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
                                    Add Country
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
                        <CountryList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default CountryMaster;