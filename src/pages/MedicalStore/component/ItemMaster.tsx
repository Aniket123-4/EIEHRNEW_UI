import {
  requestGetComplaintType,
  requestGetRateType,
} from "@/services/apiRequest/dropdowns";
import { PageContainer } from "@ant-design/pro-components";
import { history } from "@umijs/max";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  theme,
} from "antd";
import React, { useEffect, useRef, useState } from "react";

const { Option } = Select;

const ItemMaster = ({
  visible,
  onClose,
  onSaveSuccess,
  selectedRows,
  instituteId,
}: any) => {
  const formRef = useRef<any>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [capacity, setCapacity] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [complaintType, setComplaintType] = useState<any>([
    { value: "1", label: "Type 1" },
  ]);
  const [complaintTypeID, setComplaintTypeID] = useState<any>("-1");
  const [rateType, setRateType] = useState<any>([]);
  const [vatApplicable, setVatApplicable] = useState(false);
  const [institute, setInstitute] = useState<any>([]);
  const [isActive, setIsActive] = useState(true);

  const contentStyle: React.CSSProperties = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    // marginTop: 20,
    // height: 350
  };

  useEffect(() => {
    getComplaintType();
    // getRateType();
  }, []);

  const getComplaintType = async () => {
    const staticParams = {
      complaintTypeID: "-1",
      isActive: "1",
      type: "1",
    };
    const res = await requestGetComplaintType(staticParams);
    // console.log(res.result);
    if (res.result.length > 0) {
      const dataMaskForDropdown = res?.result?.map((item: any) => {
        return { value: item.complaintTypeID, label: item.complaintTypeName };
      });
      setComplaintType(dataMaskForDropdown);
      // console.log(dataMaskForDropdown)
    }
  };

  const getRateType = async () => {
    const res = await requestGetRateType({});
    if (res.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return { label: item.rateTypeName, value: item.rateTypeID };
      });
      setRateType(dataMaskForDropdown);
    }
  };
  const goBack = () => {
    history.push("/");
  };

  const addForm = () => {
    return (
      <Form
        ref={formRef}
        layout="vertical"
        form={form}
        //onFinish={addComplaint}
        initialValues={{}}
      >
        <>
          <div className="gutter-example">
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  // required={true}
                  name="itemName"
                  label="Item Name"
                  rules={[
                    { required: true, message: "Please Enter Item Name" },
                  ]}
                >
                  <Input placeholder="Please Enter Item Name" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="Item Code"
                  label="Item Code"
                  rules={[
                    { required: true, message: "Please Enter Item Code" },
                  ]}
                >
                  <Input placeholder="Please Enter Item Code" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="itemCatID"
                  label="Item Category"
                  rules={[
                    { required: true, message: "Please Select Item Category" },
                  ]}
                >
                  <Select
                    //options={invParameter}
                    placeholder="Select"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="itemNameML"
                  label="Item Name In Other Language"
                  rules={[
                    { required: true, message: "Item Name In Other Language" },
                  ]}
                >
                  <Input
                    size={"large"}
                    placeholder="Please Enter Item Name In Other Language"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="unitID"
                  label="Unit"
                  rules={[{ required: true, message: "Please Select Unit" }]}
                >
                  <Input size={"large"} placeholder="Please Select Unit" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="chemicalName"
                  label="Chemical Name"
                  rules={[
                    { required: true, message: "Please Enter Chemical Name" },
                  ]}
                >
                  <Input
                    size={"large"}
                    placeholder="Please Enter Chemical Name"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="supplierID"
                  label="Supplier"
                  rules={[
                    { required: true, message: "Please Select Supplier Name" },
                  ]}
                >
                  <Select
                    //options={invParameter}
                    placeholder="Select"
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="isVATApplicable"
                  label=""
                  rules={[{ required: false, message: "Please select" }]}
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox
                    onChange={(e) => {
                      setVatApplicable(e.target.checked);
                    }}
                  >
                    VAT Applicable
                  </Checkbox>
                </Form.Item>
              </Col>
              {vatApplicable && (
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="vatPercent"
                    label="VAT Percent"
                    rules={[
                      {
                        required: vatApplicable ? true : false,
                        message: "Please enter",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder="Please enter"
                      formatter={(value) => `${value}%`}
                      parser={(value) => value!.replace("%", "")}
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                </Col>
              )}

              {vatApplicable && (
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="cgstPercent"
                    label="CGST Percent"
                    rules={[
                      {
                        required: vatApplicable ? true : false,
                        message: "Please enter",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder="Please enter"
                      formatter={(value) => `${value}%`}
                      parser={(value) => value!.replace("%", "")}
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                </Col>
              )}

              {vatApplicable && (
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="sgstPercent"
                    label="SGST Percent"
                    rules={[
                      {
                        required: vatApplicable ? true : false,
                        message: "Please enter",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder="Please enter"
                      formatter={(value) => `${value}%`}
                      parser={(value) => value!.replace("%", "")}
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Col className="gutter-row" span={2}>
              <Form.Item
                name="isActive"
                // label="Is this a service"
                rules={[{ required: true, message: "Please check" }]}
                valuePropName="checked"
                initialValue={true}
              >
                <Checkbox>IsActive</Checkbox>
              </Form.Item>
            </Col>
            <Col style={{ justifyContent: "flex-end" }}>
              <Button
                style={{ padding: 5, width: 100, height: 40 }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
              <Button
                onClick={goBack}
                style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }}
                type="default"
              >
                Cancel
              </Button>
            </Col>
          </div>
        </>
      </Form>
    );
  };

  return (
    <PageContainer title=" " style={{}}>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Card
          style={{ height: "100%", boxShadow: "2px 2px 2px #4874dc" }}
          title="New Item"
          // extra={[
          //     <Button key="rest" onClick={() => {
          //         history.push("/complaints/list")
          //     }}
          //     >List</Button>,
          // ]}
        >
          <Spin tip="Please wait..." spinning={loading}>
            <div style={contentStyle}>{addForm()}</div>
          </Spin>
        </Card>
      </Space>
    </PageContainer>
  );
};

export default ItemMaster;
