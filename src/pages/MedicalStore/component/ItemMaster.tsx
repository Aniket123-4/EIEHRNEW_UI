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
  const [form] = Form.useForm();
  const [supplierForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rateType, setRateType] = useState<any>([]);
  const [vatApplicable, setVatApplicable] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [itemCatList, setItemCatList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemID, setItemID] = useState("-1");

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
    getSupplierList();
    getUnit();
    getItemCat();
  }, []);

  const getSupplierList = async (suplierSearch: any = "") => {
    const staticParams = {
      supplierID: -1,
      suplierSearch: suplierSearch,
      userID: -1,
      formID: -1,
      type: 1,
    };
    const res = await requestGetSupplier(staticParams);
    // console.log(res.result);
    if (res.result.length > 0) {
      const dataMaskForDropdown = res?.result?.map((item: any) => {
        return { value: item.supplierID, label: item.supplierName };
      });
      setSupplierList(dataMaskForDropdown);
    }
  };
  const getUnit = async () => {
    const staticParams = {
      unitID: -1,
      isActive: 1,
      type: 1,
    };
    const res = await requestGetUnit(staticParams);
    if (res.result.length > 0) {
      const dataMaskForDropdown = res?.result?.map((item: any) => {
        return { value: item.unitID, label: item.unitName };
      });
      setUnitList(dataMaskForDropdown);
    }
  };
  const getItemCat = async () => {
    const staticParams = {
      itemCatID: -1,
      sectionID: -1,
      fundID: 1,
      userID: -1,
      formID: -1,
      mainType: 2,
      type: 1,
    };
    const res = await requestGetItemCat(staticParams);
    if (res.result.length > 0) {
      const dataMaskForDropdown = res?.result?.map((item: any) => {
        return { value: item.itemCatID, label: item.itemCatName };
      });
      setItemCatList(dataMaskForDropdown);
    }
  };

  const addItem = async (values: any) => {
    values["vatPercent"] = values.vatPercent
      ? values.vatPercent.toString()
      : "";
    values["cgstPercent"] = values.cgstPercent
      ? values.cgstPercent.toString()
      : "";
    values["sgstPercent"] = values.sgstPercent
      ? values.sgstPercent.toString()
      : "";
    setLoading(true);
    const staticParams = {
      itemID: itemID,
      userID: -1,
      formID: -1,
      type: 1,
    };
    const res = await requestAddItem({ ...values, ...staticParams });
    if (res.isSuccess == true) {
      message.success(res?.result[0]?.msg);
      form.resetFields();
      setVatApplicable(false)
      setLoading(false)
    }
    setLoading(false)
  };
  const addSupplier = async (values: any) => {
    const staticParams = {
      "supplierID": -1,
      "userID": -1,
      "formID": -1,
      "type": 1
    };
    setLoading(true)
    const res = await requestAddSupplier({ ...values, ...staticParams });
    if (res.isSuccess == true) {
      message.success(res?.result[0]?.msg);
      supplierForm.resetFields();
      handleCancel();
      getSupplierList();
      setLoading(false);
    }
  };
  
  const goBack = () => {
    history.push("/");
  };
  const validateCharacters = (rule, value, callback) => {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(value)) {
        if (value) {
            callback('Only characters are allowed');
        } else {
            callback();
        }

    } else {
        callback();
    }
};
  const setEditField = (data: any) => {
    console.log(data);
    form.setFieldsValue({
      itemName: data?.itemName,
      unitID: data?.unitID,
      itemCode: data?.itemCode,
      itemNameML: data?.itemNameML,
      supplierID: data?.supplierID,
      itemComment: data?.itemComment,
      itemCatID: data?.itemCatID,
      chemicalName: data?.chemicalName,
      isVATApplicable: data?.isVATApplicable,
      vatPercent: data?.vatPercent,
      cgstPercent: data?.cgstPercent,
      sgstPercent: data?.sgstPercent,
      isActive: data?.isActive,
    })
    setVatApplicable(data?.isVATApplicable)
    window.scrollTo(0, 0)
    setItemID(data?.itemID)
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const filterOption = (input: string, supplierList?: { label: string; value: string }) =>
    (supplierList?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const showaddSuplier = () => {
    return (
      <Modal
        title="Add new Supplier"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          layout="horizontal"
          form={supplierForm}
          onFinish={addSupplier}
        >
          <Form.Item
            name="supplierName"
            label="Supplier Name"
            rules={[{ required: true, message: "Please Enter Supplier Name" }]}
          >
            <Input size={"large"} placeholder="Please Enter Supplier Name" />
          </Form.Item>
          <Form.Item
            name="supplierCode"
            label="Supplier Code"
            rules={[{ required: true, message: "Please Enter Supplier Code" }]}
          >
            <Input size={"large"} placeholder="Please Enter Supplier Code" />
          </Form.Item>
          <Form.Item
            name="supplierAddress"
            label="Supplier Address"
            rules={[{ required: true, message: "Please Enter Supplier Address" }]}
          >
            <Input size={"large"} placeholder="Please Enter Supplier Address" />
          </Form.Item>
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
            onClick={handleCancel}
            type="default"
          >
            Cancel
          </Button>
        </Form>
      </Modal>
    );
  };
  const addForm = () => {
    return (
      <Form
        ref={formRef}
        layout="vertical"
        form={form}
        onFinish={addItem}
        initialValues={{}}
      >
        <>
          {showaddSuplier()}
          <div className="gutter-example">
            {/* <Row gutter={16}> */}
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  // required={true}
                  name="itemName"
                  label="Item Name"
                  rules={[
                    { required: true, message: "Please Enter Item Name" },
                    {validator:validateCharacters}
                  ]}
                >
                  <Input placeholder="Please Enter Item Name" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="itemCode"
                  label="Item Code"
                  rules={[
                    { required: true, message: "Please Enter Item Code" },
                  ]}
                >
                  <Input placeholder="Please Enter Item Code" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="itemCatID"
                  label="Item Category"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Category",
                    },
                  ]}
                >
                  <Select showSearch
                    filterOption={filterOption}
                    optionFilterProp="children" options={itemCatList} placeholder="Select" />
                </Form.Item>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="itemNameML"
                  label="Name In Other Lang"
                  rules={[
                    {
                      required: false,
                      message: "Item Name In Other Language",
                    },
                  ]}
                >
                  <Input
                    // size={"large"}
                    placeholder="Please Enter Item Name In Other Language"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="unitID"
                  label="Unit"
                  rules={[{ required: true, message: "Please Select Unit" }]}
                >
                  <Select showSearch
                    filterOption={filterOption}
                    optionFilterProp="children" options={unitList} placeholder="Select" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="chemicalName"
                  label="Chemical Name"
                  rules={[
                    { required: false, message: "Please Enter Chemical Name" },
                  ]}
                >
                  <Input placeholder="Please Enter Chemical Name" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="supplierID"
                  label="Supplier"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Supplier",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={filterOption}
                    optionFilterProp="children"
                    options={supplierList}
                    placeholder="Select"
                    dropdownRender={(menu) => (
                      <>
                        <Space style={{ padding: 4 }}>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showModal}
                          >
                            Add Supplier
                          </Button>
                        </Space>
                        <Divider style={{ margin: "8px 0" }} />
                        {menu}
                      </>
                    )}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="itemComment"
                  label="Comment"
                  rules={[
                    {
                      required: false,
                      message: "Please Select Supplier Name",
                    },
                  ]}
                >
                  <Input placeholder="Please Enter Comment" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} style={{ alignItems: "end" }}>
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
                      // size={"large"}
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
                      // size={"large"}
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
                      // size={"large"}
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
            <Row>
              <Col span={5}>
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
            </Row>

          </div>
        </>
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
            <ItemList
              refresh={loading}
              editRecord={(data: any) => setEditField(data)}
            /></Col>
        </Row>
      </Space>
    </PageContainer>
  );
};

export default ItemMaster;
