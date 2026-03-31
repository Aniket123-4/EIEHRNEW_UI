import { requestGetDistrict, requestGetState, requestAddUpdateDistrict } from "@/services/apiRequest/dropdowns";
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
import DistrictList from "./DistrictList";

const { Option } = Select;

const DistrictMaster = () => {
    const { token } = theme.useToken();
    const [districtForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [districtID, setDistrictID] = useState("-1");

    useEffect(() => {
        getStates();
    }, []);

    const getStates = async () => {
        try {
            const params = {
                CountryID: 1,
                StateID: -1,
                Type: 1
            };
            const res = await requestGetState(params);
            
            if (Array.isArray(res) && res.length > 0) {
                setStates(res);
                if (res.length > 0) {
                    districtForm.setFieldsValue({ stateID: res[0].stateID });
                }
            } else if (res?.result && Array.isArray(res.result)) {
                setStates(res.result);
                if (res.result.length > 0) {
                    districtForm.setFieldsValue({ stateID: res.result[0].stateID });
                }
            }
        } catch (error) {
            console.error('Error fetching states:', error);
            message.error('Failed to fetch states');
        }
    };

    const addUpdateDistrict = async (values: any) => {
        // For Delete operation (Type=2)
        if (values.type === 2) {
            const params = {
                "districtID": districtID,
                "districtName": "",
                "districtCode": "",
                 "m09_StateID": values.stateID || "1",  // ✅ FIX: m09_StateID
                "isActive": true,
                "userID": -1,
                "formID": -1,
                "type": 2  // Delete
            };
            setLoading(true);
            const res = await requestAddUpdateDistrict(params);
            if (res?.isSuccess == true) {
                message.success(res?.result?.[0]?.msg || "District deleted successfully");
                resetForm();
            }
            setLoading(false);
            return;
        }

        // For Add/Update operation (Type=1)
        if (!values.stateID || values.stateID === '-1' || values.stateID === 'undefined') {
            message.error('Please select a valid state');
            return;
        }

        const params = {
            "districtID": districtID,
            "districtName": values.districtName,
            "districtCode": values.districtCode || "",
             "m09_StateID": values.stateID,  // ✅ FIX: m09_StateID
            "isActive": values.isActive,  // Send as boolean, not 1/0
            "userID": -1,
            "formID": -1,
            "type": 1  // Add/Update
        };
        
        setLoading(true);
        try {
            const res = await requestAddUpdateDistrict(params);
            if (res?.isSuccess == true) {
                message.success(res?.result?.[0]?.msg || "District added successfully");
                resetForm();
            }
        } catch (error) {
            console.error('Error adding district:', error);
            message.error('Failed to add district');
        }
        setLoading(false);
    };

    const resetForm = () => {
        districtForm.resetFields();
        setDistrictID("-1");
        if (states.length > 0) {
            districtForm.setFieldsValue({ 
                isActive: true,
                stateID: states[0].stateID
            });
        } else {
            districtForm.setFieldsValue({ isActive: true });
        }
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
        districtForm.setFieldsValue({
            stateID: data?.m09_StateID,  // ✅ Database se m09_StateID aayega
            districtName: data?.districtName,
            districtCode: data?.districtCode,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setDistrictID(data?.districtID);
    };

    const handleDelete = async () => {
        if (districtID === "-1") {
            message.warning("Please select a district to delete");
            return;
        }
        await addUpdateDistrict({ type: 2, stateID: districtForm.getFieldValue('stateID') });
    };

    const addForm = () => {
        return (
            <Form 
                layout="vertical" 
                form={districtForm} 
                onFinish={addUpdateDistrict}
                initialValues={{ isActive: true }}
            >
                <Col span={24}>
                    <Form.Item
                        name="stateID"
                        label="State"
                        rules={[{ required: true, message: "Please Select State" }]}
                    >
                        <Select 
                            placeholder="Select State" 
                            showSearch 
                            optionFilterProp="children"
                            loading={states.length === 0}
                            notFoundContent={states.length === 0 ? "Loading states..." : "No states found"}
                        >
                            {states.map((state: any) => (
                                <Option key={state.stateID} value={state.stateID}>
                                    {state.stateName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="districtName"
                        label="District Name"
                        rules={[
                            { required: true, message: "Please Enter District Name" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter District Name" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="districtCode"
                        label="District Code"
                    >
                        <Input placeholder="Please Enter District Code (Optional)" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Checkbox>Is Active</Checkbox>
                    </Form.Item>
                </Col>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                        <Button onClick={resetForm} type="default">
                            Cancel
                        </Button>
                        <Popconfirm
                            title="Are you sure you want to delete this district?"
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
                                    Add District
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
                        <DistrictList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default DistrictMaster;