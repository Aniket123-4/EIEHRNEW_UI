import { requestGetState, requestGetCountry, requestAddUpdateState } from "@/services/apiRequest/dropdowns";
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
import React, { useState, useEffect } from "react";
import StateList from "./StateList";

const { Option } = Select;

const StateMaster = () => {
    const { token } = theme.useToken();
    const [stateForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [stateID, setStateID] = useState("-1");

    useEffect(() => {
        getCountries();
    }, []);

    const getCountries = async () => {
        const params = {
            CountryID: -1,
            Type: 1
        };
        const res = await requestGetCountry(params);
        if (Array.isArray(res) && res.length > 0) {
            setCountries(res);
        } else if (res?.result && Array.isArray(res.result)) {
            setCountries(res.result);
        }
    };

    const addUpdateState = async (values: any) => {
        // For Delete operation (Type=2)
        if (values.type === 2) {
            const params = {
                "stateID": stateID,
                "stateName": "",
                "stateCode": "",
              "m08_CountryID": values.countryID || "1",  // ✅ FIX: m08_CountryID use karo
                "isActive": true,
                "userID": -1,
                "formID": -1,
                "type": 2  // Delete
            };
            setLoading(true);
            const res = await requestAddUpdateState(params);
            if (res.isSuccess == true) {
                message.success(res?.result?.[0]?.msg || "State deleted successfully");
                resetForm();
                stateForm.resetFields();
            }
            setLoading(false);
            return;
        }

        // For Add/Update operation (Type=1)
        const params = {
            "stateID": stateID,
            "stateName": values.stateName,
            "stateCode": values.stateCode,
              "m08_CountryID": values.countryID,  // ✅ FIX: yahan bhi m08_CountryID
            "isActive": values.isActive,  // Send as boolean, not 1/0
            "userID": -1,
            "formID": -1,
            "type": 1  // Add/Update
        };
        setLoading(true);
        const res = await requestAddUpdateState(params);
        if (res.isSuccess == true) {
            message.success(res?.result?.[0]?.msg || "State added successfully");
            resetForm();
            stateForm.resetFields();
        }
        setLoading(false);
    };

    const resetForm = () => {
        stateForm.resetFields();
        setStateID("-1");
        stateForm.setFieldsValue({
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
        stateForm.setFieldsValue({
             countryID: data?.m08_CountryID,
            stateName: data?.stateName,
            stateCode: data?.stateCode,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setStateID(data?.stateID);
    };

    const handleDelete = async () => {
        if (stateID === "-1") {
            message.warning("Please select a state to delete");
            return;
        }
        await addUpdateState({ type: 2, countryID: stateForm.getFieldValue('countryID') });
    };

    const addForm = () => {
        return (
            <Form layout="vertical" form={stateForm} onFinish={addUpdateState}>
                <Col span={24}>
                    <Form.Item
                        name="countryID"
                        label="Country"
                        rules={[{ required: true, message: "Please Select Country" }]}
                    >
                        <Select placeholder="Select Country" showSearch optionFilterProp="children">
                            {countries.map((country: any) => (
                                <Option key={country.countryID} value={country.countryID}>
                                    {country.countryName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="stateName"
                        label="State Name"
                        rules={[
                            { required: true, message: "Please Enter State Name" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter State Name" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="stateCode"
                        label="State Code"
                        rules={[{ required: true, message: "Please Enter State Code" }]}
                    >
                        <Input placeholder="Please Enter State Code" maxLength={5} style={{ textTransform: 'uppercase' }} />
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
                            title="Are you sure you want to delete this state?"
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
                                    Add State
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
                        <StateList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default StateMaster;