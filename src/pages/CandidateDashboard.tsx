import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col, Progress } from 'antd';
import { getUserInLocalStorage } from '@/utils/common';
import { requestGetCandidateList } from './Candidate/services/api';
import { UserOutlined } from '@ant-design/icons';
const { Title, Text, Link } = Typography;

const CandidateDashboard: React.FC = () => {

  const [selectedRows, setSelectedRows] = useState<Object>({});

  useEffect(() => {
    getUserDetails();
  }, [])

  const getUserDetails = async () => {
    const { verifiedUser } = getUserInLocalStorage();

    const params = {
      "onlinePatientID": verifiedUser?.userID,
      "userID": -1,
      "formID": -1,
      "type": 1
    }
    const msg = await requestGetCandidateList(params);
    
    setSelectedRows(msg.result[0])
  }

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

        <Divider orientation="left"><h4>Address Information</h4></Divider>
        <ProDescriptions
          dataSource={selectedRows}
          bordered={true}
          size={'small'}
          columns={[
            {
              title: 'Address',
              dataIndex: 'curAddress',
              span: 1
            },

          ]}
        />
        <Divider orientation="left"><h4>APPOINTMENT DATA</h4></Divider>
        <ProDescriptions
          dataSource={selectedRows}
          bordered={true}
          size={'small'}
          columns={[
            {
              title: 'Address',
              dataIndex: 'curAddress',
              span: 1
            },

          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default CandidateDashboard;
