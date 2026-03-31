import { requestAddUpdateItemCat, requestGetItemCat } from "@/services/apiRequest/dropdowns";
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
import ItemCategoryList from "./ItemCategoryList";

const ItemCategoryMaster = () => {
    const { token } = theme.useToken();
    const [categoryForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categoryID, setCategoryID] = useState("-1");

    const addUpdateCategory = async (values: any) => {
        // For Delete operation (Type=2)
        if (values.type === 2) {
            const params = {
                "itemCatID": categoryID,
                "itemCatName": "",
                "itemCatCode": "",
                "h12_ItemCatID": -1,                    // Parent Category ID
                "isActive": true,
                "h11_ItemCatTypeID": -1,                 // Item Category Type ID
                "isInsuranceApp": false,
                "isAMCApp": false,
                "depthLevel": 0,
                "itemCatIDTree": "",                      // Required field
                "itemCatTree": "",                         // Required field
                "itemCatCodeID": -1,
                "itemCatNameML": "",                       // Required field
                "userID": -1,
                "formID": -1,
                "type": 2  // Delete
            };
            setLoading(true);
            const res = await requestAddUpdateItemCat(params);
            if (res.isSuccess == true) {
                message.success(res?.msg || "Category deleted successfully");
                resetForm();
                categoryForm.resetFields();
            }
            setLoading(false);
            return;
        }

        // For Add/Update operation (Type=1)
        const params = {
            "itemCatID": categoryID,
            "itemCatName": values.itemCatName,
            "itemCatCode": values.itemCatCode || "",
            "h12_ItemCatID": -1,                    // Parent Category ID (default -1 for root)
            "isActive": values.isActive,
            "h11_ItemCatTypeID": -1,                 // Item Category Type ID
            "isInsuranceApp": false,
            "isAMCApp": false,
            "depthLevel": 0,
            "itemCatIDTree": values.itemCatIDTree || categoryID,  // Required - send categoryID or empty
            "itemCatTree": values.itemCatTree || values.itemCatName, // Required - send category name
            "itemCatCodeID": -1,
            "itemCatNameML": values.itemCatNameML || values.itemCatName, // Required - send same as name if not provided
            "userID": -1,
            "formID": -1,
            "type": 1  // Add/Update
        };
        
        console.log("Sending params:", params); // Debugging ke liye
        
        setLoading(true);
        const res = await requestAddUpdateItemCat(params);
        if (res.isSuccess == true) {
            message.success(res?.msg || "Category added successfully");
            resetForm();
            categoryForm.resetFields();
        }
        setLoading(false);
    };

    const resetForm = () => {
        categoryForm.resetFields();
        setCategoryID("-1");
        categoryForm.setFieldsValue({
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
        categoryForm.setFieldsValue({
            itemCatName: data?.itemCatName,
            itemCatCode: data?.itemCatCode,
            isActive: data?.isActive === true || data?.isActive === 1,
        });
        window.scrollTo(0, 0);
        setCategoryID(data?.itemCatID);
    };

    const handleDelete = async () => {
        if (categoryID === "-1") {
            message.warning("Please select a category to delete");
            return;
        }
        await addUpdateCategory({ type: 2 });
    };

    const addForm = () => {
        return (
            <Form layout="vertical" form={categoryForm} onFinish={addUpdateCategory}>
                <Col span={24}>
                    <Form.Item
                        name="itemCatName"
                        label="Category Name"
                        rules={[
                            { required: true, message: "Please Enter Category Name" },
                            { validator: validateCharacters }
                        ]}
                    >
                        <Input placeholder="Please Enter Category Name" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="itemCatCode"
                        label="Category Code"
                    >
                        <Input placeholder="Please Enter Category Code (Optional)" />
                    </Form.Item>
                </Col>
                {/* Hidden fields for required backend DTO fields */}
                <Form.Item name="itemCatIDTree" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="itemCatTree" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="itemCatNameML" hidden>
                    <Input />
                </Form.Item>
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
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                        <Button onClick={resetForm} type="default">
                            Cancel
                        </Button>
                        <Popconfirm
                            title="Are you sure you want to delete this category?"
                            onConfirm={handleDelete}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger loading={loading}>
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
                                    Add Item Category
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
                        <ItemCategoryList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default ItemCategoryMaster;