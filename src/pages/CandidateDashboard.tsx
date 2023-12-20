import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col, Progress, Spin, Table, Button, message, Tag } from 'antd';
import { getUserInLocalStorage } from '@/utils/common';
import { requestGetCandidateList } from './Candidate/services/api';
import { UserOutlined } from '@ant-design/icons';
import Chart from 'react-google-charts';
import { requestSyncOnlinePatient } from './Online/services/api';
const { Title, Text, Link } = Typography;

const CandidateDashboard: React.FC = () => {

  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [patientVisits, setPatientVisits] = useState<any>([]);
  const [analysis, setAnalysis] = useState<any>([]);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    getOnlinePatient(1);
    getOnlinePatient(2);
  }, [])

  const getOnlinePatient = async (type: any = 1) => {
    const { verifiedUser } = getUserInLocalStorage();

    const params = {
      "onlinePatientID": verifiedUser?.userID,
      "userID": -1,
      "formID": -1,
      "type": type
    }
    const res = await requestGetCandidateList(params);


    type == 1 ? setSelectedRows(res.result[0]) :
      setAppointmentHistory(res.result)
    setPatientVisits(res?.result1)
    if (type == 2) {
      const dataMaskForDropdown = res?.result2?.map((item: any) => {
        analysis.push([item.yearData, item.visitCount])
      })
    }
    console.log(analysis)
  }
  const columns = [
    {
      title: 'Doctor Name',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Patient No',
      key: 'patientNo',
      dataIndex: 'patientNo',
    },
    {
      title: 'Slot Date',
      dataIndex: 'slotDateVar',
      key: 'slotDateVar',
    },
    {
      title: 'Slot Time',
      dataIndex: 'slotTimeVar',
      key: 'slotTimeVar',
    },
    {
      title: 'Week',
      key: 'weekName',
      dataIndex: 'weekName',
    },
    {
      width: '12%',
      title: 'Slot Expired',
      key: 'isExpired',
      dataIndex: 'isExpired',
      render: (text: any) => 
      <Tag color={text == true ?"error": "success"}>{text == true ? "Yes" : "No"}</Tag>
    },
  ];
  const columns1 = [
    {
      title: 'Doctor Name',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Patient CaseNo',
      dataIndex: 'patientCaseNo',
      key: 'patientCaseNo',
    },
    {
      title: 'Admission No',
      dataIndex: 'admNo',
      key: 'admNo',
    },
    {
      title: 'Visit Date',
      key: 'actualVisitDateVar',
      dataIndex: 'actualVisitDateVar',
    },
    {
      title: 'Type Name',
      key: 'vPreEmpTypeName',
      dataIndex: 'vPreEmpTypeName',
    },
    {
      width: '12%',
      title: 'ConsultancyPaid',
      key: 'isConsultencyPaid',
      dataIndex: 'isConsultencyPaid',
      render: (text: any) => 
      <Tag color={text == false ?"error": "success"}>{text == true ? "Yes" : "No"}</Tag>
      // <Typography style={{
      //   textAlign: 'center', borderRadius: 10,
      //   backgroundColor: text == false ? '#00FF00' : '#EBEBE4',
      // }}>{text == true ? "Yes" : "No"}</Typography>,
    },
  ];
  const data = [
    ["Pizza", "Popularity"],
    ["Visits", 33],
    ["Appointments", 26],
    ["Year", 22],
    ["Sausage", 10], // Below limit.
    ["Anchovies", 9], // Below limit.
  ];

  const { verifiedUser } = getUserInLocalStorage();
  const syncPatient = async (v: any) => {
    // console.log(v)
    const staticParams = {
      "onlinePatientID": verifiedUser?.userID,
      "patientNo": v?.patientNo,
      "patientCaseNo": "",
      "admNo": -1,
      "userID": -1,
      "formID": -1,
      "type": 1
    }
    const res = await requestSyncOnlinePatient(staticParams);
    if (res.isSuccess === true) {
      message.success(res.msg);
      return;
  } else {
      message.error(res.msg);
  }

  };
  const options = {
    title: "Analysis of visits",
    sliceVisibilityThreshold: 0.2, // 20%
  };
  return (
    <PageContainer
      header={{
        title: ``,
        breadcrumb: {
          items: [],
        },
      }}
    >
      <Card>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>

          <Space align="center" size={24}>
            {/* <Avatar size={160} 
              src={selectedRows?.profileImage ?
                            `data:image/png;base64,${selectedRows?.profileImage}`
                        : "https://bootdey.com/img/Content/avatar/avatar6.png"}
            /> */}
            <Progress size={160} type="circle" percent={selectedRows?.profilePercentage}
              format={() => <Avatar size={145}
                //icon={
                // <Image
                //   src={`data:image/png;base64,${selectedRows?.profileImage}`}
                //   width={200}
                // />}
                src={selectedRows?.profileImage ?
                  `data:image/png;base64,${selectedRows?.profileImage}`
                  : "https://bootdey.com/img/Content/avatar/avatar6.png"}
              />} >

            </Progress>
          </Space>
          <Space align="center" size={24}>
            <Title>{`${selectedRows?.fName ? selectedRows?.fName : ""} ${selectedRows?.mName ? selectedRows?.mName : ""} ${selectedRows?.lName ? selectedRows?.lName : ""}`}</Title>
          </Space>
        </div>

        <Divider orientation="left"><h4>Basic Information</h4></Divider>
        <ProDescriptions
          dataSource={selectedRows}
          bordered={true}
          size={'small'}
          columns={[
            {
              title: 'First Name',
              dataIndex: 'fName',
              span: 3
            },
            {
              title: 'Middle Name',
              dataIndex: 'mName',
              span: 3
            },
            {
              title: 'Last Name',
              dataIndex: 'lName',
              span: 3
            },
            {
              title: 'Mobile No',
              dataIndex: 'curMobileNo',
              span: 2
            },
            // {
            //   title: 'Email ID',
            //   dataIndex: 'emailID',
            //   span: 2
            // },
            {
              title: 'DOB',
              key: 'date',
              dataIndex: 'dob',
              valueType: 'date',
              fieldProps: {
                format: 'DD-MMM-YYYY',
              },
            },
          ]}
        />
        <Divider orientation="left"><h4></h4></Divider>
        <Card
          title="Appointment Data"
          style={{ boxShadow: '2px 2px 2px #4874dc' }}
        >
          <Spin tip="Please wait..." spinning={loading}>
            <Table
              dataSource={appointmentHistory}
              columns={columns}
              rowClassName="editable-row"
              pagination={{
                // onChange: cancel,
              }}
            />
          </Spin>
        </Card>
        <Divider orientation="left"><h4></h4></Divider>
        <Card
          title="Patient Visits"
          style={{ boxShadow: '2px 2px 2px #4874dc' }}
        >
          <Spin tip="Please wait..." spinning={loading}>
            <Table
              dataSource={patientVisits}
              columns={columns1}
              rowClassName="editable-row"
            // pagination={{
            // onChange: cancel,
            // }}
            />
          </Spin>
        </Card>
        {<Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"100%"}
          height={"400px"}
        />}
      </Card>
    </PageContainer>
  );
};

export default CandidateDashboard;
