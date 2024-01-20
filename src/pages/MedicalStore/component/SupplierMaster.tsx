import {
    requestAddItem,
    requestAddSupplier,
    requestGetItemCat,
    requestGetSupplier,
    requestGetUnit,
} from "@/services/apiRequest/dropdowns";
import { PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { history } from "@umijs/max";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    theme,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import ItemList from "./ItemList";
import SupplierList from "./SupplierList";

const { Option } = Select;

const SupplierMaster = ({
    visible,
    onClose,
    onSaveSuccess,
    selectedRows,
    instituteId,
}: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [supplierForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [supplierID, setSupplierID] = useState("-1");

    const [isActive, setIsActive] = useState(true);

    const contentStyle: React.CSSProperties = {
        lineHeight: "260px",
        textAlign: "center",
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };

    const addSupplier = async (values: any) => {
        const staticParams = {
            "supplierID":supplierID,
            "userID": -1,
            "formID": -1,
            "type": 1
        };
        setLoading(true)
        const res = await requestAddSupplier({ ...values, ...staticParams });
        if (res.isSuccess == true) {
            message.success(res?.result[0]?.msg);
            supplierForm.resetFields();
            setLoading(false);
        }
    };
    const goBack = () => {
        history.push("/");  
    };
    const setEditField = (data: any) => {
        console.log(data)
        supplierForm.setFieldsValue({
            supplierName: data?.supplierName,
            supplierCode: data?.supplierCode,
            supplierAddress: data?.supplierAddress,
        })
        window.scrollTo(0, 0)
        setSupplierID(data?.supplierID)
    };

    const addForm = () => {
        return (
            <Form
                layout="vertical"
                form={supplierForm}
                onFinish={addSupplier}
            >
                {/* <Row> */}


                    <Col className="gutter-row" span={16}>
                        <Form.Item
                            name="supplierName"
                            label="Supplier Name"
                            rules={[{ required: true, message: "Please Enter Supplier Name" }]}
                        >
                            <Input placeholder="Please Enter Supplier Name" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={16}>
                        <Form.Item
                            name="supplierCode"
                            label="Supplier Code"
                            rules={[{ required: true, message: "Please Enter Supplier Code" }]}
                        >
                            <Input  placeholder="Please Enter Supplier Code" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={16}>
                        <Form.Item
                            name="supplierAddress"
                            label="Supplier Address"
                            rules={[{ required: true, message: "Please Enter Supplier Address" }]}
                        >
                            <Input  placeholder="Please Enter Supplier Address" />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            name="isActive"
                            rules={[{ required: true, message: "Please check" }]}
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Checkbox>IsActive</Checkbox>
                        </Form.Item>
                    </Col>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button
                        style={{ marginLeft: 10 }}
                        //onClick={handleCancel}
                        type="default"
                    >
                        Cancel
                    </Button>
                {/* </Row> */}
            </Form>
        );
    };

    return (
        <PageContainer title=" " style={{}}>
            <Space direction="horizontal" size="middle" style={{ display: "flex" }}>
                <Row gutter={8}>
                    <Col span={11}>
                        <Card
                            style={{ height: 480, boxShadow: "2px 2px 2px #4874dc" }}
                            title="New Item"
                        >
                            <Spin tip="Please wait..." spinning={loading}>
                                <div>{addForm()}</div>
                            </Spin>
                        </Card>

                    </Col>
                    <Col span={13}>
                        <SupplierList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        /></Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default SupplierMaster;
