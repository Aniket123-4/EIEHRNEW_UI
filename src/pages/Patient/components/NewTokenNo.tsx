import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Table,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";

import { requestGetUserList } from "@/services/apiRequest/dropdowns";
import { getUserInLocalStorage } from "@/utils/common";
import { convertDate } from "@/utils/helper";
import { ColumnsType } from "antd/es/table";
import { RcFile } from "antd/es/upload";
import dayjs from "dayjs";
import {
  requestGetPatientByTokenNo,
  requestGetTokenNoQueueJump,
  requestUpdatePatientTokenNo,
} from "../services/api";
import PatientDetailsCommon from "./PatientDetailsCommon";

const { Option } = Select;

const NewTokenNo = React.forwardRef(() => {
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const [patientData, setPatientData] = useState<any>();
  const patentTokenStatic = [
    {
      key: "1",
      label: "Patient No",
      // children: result1?.patientNo
    },
    {
      key: "2",
      label: "Token No",
      // children: result1?.candName
    },
    {
      key: "3",
      label: "Case No",
      // children: result1?.dob
    },
    {
      key: "4",
      label: "Admission No",
      // children: result1?.age
    },
    {
      key: "5",
      label: "Patient Name",
      // children: result1?.curAddress
    },
    {
      key: "6",
      label: "Doctor Name",
      // children: result1?.curMobileNo
    },
  ];
  const [patientTokenData, setPatientTokenData] = useState<any>({
    patentTokenStatic,
  });
  const [doctorList, setDoctorList] = useState<any>([]);
  const [statusData, setStatusData] = useState<any>([]);

  const { verifiedUser } = getUserInLocalStorage();

  interface DataType {
    rowID: string;
    locName: string;
    tokenNo: number;
  }
  useEffect(() => {
    getDoctorList();
  }, []);

  const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Location Name",
      dataIndex: "locName",
      key: "locName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Token Number",
      dataIndex: "tokenNo",
      key: "tokenNo",
      width: 150,
    },
  ];

  const data: DataType[] = [];

  const getDoctorList = async () => {
    const params = {
      CommonID: -1,
      Type: 3,
    };
    const res = await requestGetUserList(params);
    if (res.data.length > 0) {
      const dataMaskForDropdown = res?.data?.map((item: any) => {
        return { value: item.userID, label: item.userName };
      });
      setDoctorList(dataMaskForDropdown);
    }
  };

  const getPatientByTokenNo = async (values: any) => {
    //values['date'] = convertDate(values['date']);

    //values['tokenNo'] = values?.tokenNo ? values['tokenNo'] : "";
    try {
      const staticParams = {
        userID: -1,
        tokenNo: values?.patientNo,
        date: dayjs(),
        formID: -1,
        type: 2,
      };
      setLoading(true);
      const res = await requestGetPatientByTokenNo({ ...staticParams });
      const result = res.result[0];
      setLoading(false);
      if (res.isSuccess === true && res.result.length > 0) {
        const patentTokenDetails = [
          {
            key: "1",
            label: "Patient No",
            children: result?.patientNo,
          },
          {
            key: "2",
            label: "Token No",
            children: result?.tokenNo,
          },
          {
            key: "3",
            label: "Case No",
            children: result.patientCaseNo,
          },
          {
            key: "4",
            label: "Admission No",
            children: result?.admNo,
          },
          {
            key: "5",
            label: "Patient Name",
            children: result?.patientName,
          },
          {
            key: "6",
            label: "Doctor Name",
            children: result?.doctorName,
          },
        ];
        setPatientTokenData({ patentTokenDetails });
        // setPatientData({...patientData,...result})
      } else {
        setPatientTokenData({ patentTokenStatic });
        setStatusData([]);
        if (res.msg == "") message.error("Not Found Any Token");
        //message.error(res.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log({ error });
      message.error("please try again");
    }
  };
  const getTokenNoQueueJump = async (values: any) => {
    console.log(values);
    try {
      const staticParams = {
        userID: -1,
        tokenNo: values?.tokenNo,
        date: dayjs(),
        formID: -1,
        type: 1,
      };
      setLoading(true);
      const res = await requestGetTokenNoQueueJump({ ...staticParams });
      const result = res.result1;
      setLoading(false);
      if (res.isSuccess === true && res.result1.length > 0) {
        console.log(result);
        setStatusData(result);
      } else {
        if (res.msg == "") message.error(res.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log({ error });
      message.error("please try again");
    }
  };
  const updatePatientTokenNo = async (values: any) => {
    values["date"] = convertDate(values["date"]);
    try {
      const staticParams = {
        patientID: patientData.patientID,
        patientCaseID: patientData.patientCaseID,
        admNo: patientData.admNo,

        // "date": "2024-01-01T12:22:15.670Z",
        // "tokenNo": "string",

        userID: -1,
        formID: -1,
        type: 1,
      };
      if (!staticParams.admNo) {
        message.error("Please Select Admission Number");
        return;
      } else {
        setLoading(true);
        const res = await requestUpdatePatientTokenNo({
          ...values,
          ...staticParams,
        });
        console.log(res);
        setLoading(false);
        if (res.isSuccess === true) {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      }
    } catch (error) {
      setLoading(false);
      message.error("please try again");
    }
  };

  return (
    <Card>
      <PatientDetailsCommon
        required={false}
        patData={patientData}
        onChange={(value: any) => {
          setPatientData(value);
          getPatientByTokenNo(value);
        }}
      />
      <>
        {patientData && (
          <div>
            {patientTokenData?.patentTokenDetails && (
              <>
                <Row style={{ backgroundColor: "lightgreen", padding: 5 }}>
                  <Col span={4}>Patient No</Col>
                  <Col span={4}>Token No</Col>
                  <Col span={4}>Case No</Col>
                  <Col span={4}>Admission No</Col>
                  <Col span={4}>Patient Name</Col>
                  <Col span={4}>Doctor Name</Col>
                  {/* <Button onClick={getTokenNoQueueJump}></Button> */}
                </Row>
                <Row style={{ padding: 5 }}>
                  {patientTokenData.patentTokenDetails.map((item: any) => {
                    return item.key == "2" ? (
                      <Col span={4}>
                        <Button
                          onClick={() =>
                            getTokenNoQueueJump({ tokenNo: item.children })
                          }
                        >
                          {item.children}
                        </Button>
                      </Col>
                    ) : (
                      <Col span={4}>{item.children}</Col>
                    );
                  })}
                </Row>
              </>
            )}
            {/* <Row style={{ backgroundColor: 'lightgreen', padding: 5 }}>
                            <Col span={5}>Name</Col>
                            <Col span={5}>Date of Birth</Col>
                            <Col span={4}>Blood Group</Col>
                            <Col span={5}>Mobile No</Col>
                            <Col span={5}>Phone No</Col>
                        </Row>
                        <Row style={{ padding: 5 }}>
                            <Col span={5}>{patientData.candName}</Col>
                            <Col span={5}>{patientData.dob}</Col>
                            <Col span={4}>{patientData.bloodGroup}</Col>
                            <Col span={5}>{patientData.curMobileNo}</Col>
                            <Col span={5}>{patientData.curPhoneNo}</Col>
                        </Row>
                        <Row style={{ backgroundColor: 'lightgreen', padding: 5 }}>
                            <Col span={5}>EmergencyContact</Col>
                            <Col span={5}>Date of Birth</Col>
                            <Col span={14}>Address</Col>
                        </Row>
                        <Row style={{ padding: 5 }}>
                            <Col span={5}>{patientData.emerGencyName}</Col>
                            <Col span={5}>{patientData.dob}</Col>
                            <Col span={14}>{patientData.curAddress}</Col>
                        </Row> */}
            <Card>
              <Row>
                <Col span={12} xs={24} xl={12}>
                  <Card
                    style={{
                      // backgroundColor:'red',
                      height: 400,
                      overflow: "auto",
                      // padding: '0 5px',
                      border: "1px solid rgba(140, 140, 140, 0.35)",
                    }}
                    title={"Patient Details"}
                  >
                    <Descriptions
                      column={1}
                      bordered
                      size={"small"}
                      items={patientTokenData.patentTokenDetails}
                    />
                    {patientTokenData?.patentTokenDetails && (
                      <Form form={formUpdate} onFinish={updatePatientTokenNo}>
                        <Space style={{ paddingTop: 10 }}>
                          <Form.Item
                            name="tokenNo"
                            label="New Token No"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter New Token No",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            name="date"
                            label="Date"
                            rules={[
                              { required: true, message: "Please Select Date" },
                            ]}
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              format={"DD MMM YYYY"}
                              // disabledDate={(current) => {
                              //     let customDate = moment().format("YYYY-MM-DD");
                              //     return current && current > dayjs().subtract(12, 'year');
                              // }}
                              getPopupContainer={(trigger) =>
                                trigger.parentElement!
                              }
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button type="primary" htmlType="submit">
                              Save
                            </Button>
                          </Form.Item>
                        </Space>
                      </Form>
                    )}
                  </Card>
                </Col>
                <Col span={12} xs={24} xl={12}>
                  <Card
                    style={{
                      height: 400,
                      overflow: "auto",
                      padding: "0 16px",
                      border: "1px solid rgba(140, 140, 140, 0.35)",
                    }}
                    title={"Token Status"}
                  >
                    <Table
                      size="small"
                      columns={columns}
                      dataSource={statusData}
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </>
    </Card>
  );
});

export default NewTokenNo;
