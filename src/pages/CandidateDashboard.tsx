import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col } from 'antd';
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
      "candidateID": verifiedUser?.userID,
      "uniqueNo": "",
      "emailID": "",
      "mobileNo": "",
      "dob": "",
      "panNo": "",
      "aadhaarNo": "",
      "genderID": "-1",
      "stateID": "-1",
      "districtID": "-1",
      "cityID": "-1",
      "areaID": "-1",
      "searchText": "",
      "userID": verifiedUser?.userID,
      "formID": "-1",
      "type": "2"
    }
    const msg = await requestGetCandidateList(params);
    setSelectedRows(msg.data[0])
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
            <Avatar size={160} icon={
              <Image
                src={`data:image/png;base64,${selectedRows?.profileImage}`}
                width={200}
              />
            } />
          </Space>
          <Space align="center" size={24}>
            <Title>{`${selectedRows?.firstName ? selectedRows?.firstName : ""} ${selectedRows?.middleName ? selectedRows?.middleName : ""} ${selectedRows?.lastName ? selectedRows?.lastName : ""}`}</Title>
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
              dataIndex: 'firstName',
              span: 3
            },
            {
              title: 'Middle Name',
              dataIndex: 'middleName',
              span: 3
            },
            {
              title: 'Last Name',
              dataIndex: 'lastName',
              span: 3
            },
            {
              title: 'Mobile No',
              dataIndex: 'mobileNo',
              span: 2
            },
            {
              title: 'Email ID',
              dataIndex: 'emailID',
              span: 2
            },
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

        <Divider orientation="left"><h4>Identity Information</h4></Divider>
        <ProDescriptions
          dataSource={selectedRows}
          bordered={true}
          size={'small'}
          columns={[

            {
              title: 'PAN No',
              dataIndex: 'panNo',
              span: 2
            },
            {
              title: 'Aadhaar No',
              dataIndex: 'aadhaarNo',
              span: 2
            },
            {
              title: 'Marital Status',
              dataIndex: 'maritalStatusName',
              span: 2
            },
            {
              title: 'Gender',
              dataIndex: 'genderName',
              span: 2
            }

          ]}
        />

        <Divider orientation="left"><h4>Address Information</h4></Divider>
        <ProDescriptions
          dataSource={selectedRows}
          bordered={true}
          size={'small'}
          columns={[

            {
              title: 'State',
              dataIndex: 'stateName',
              span: 3
            },

            {
              title: 'District',
              dataIndex: 'districtName',
              span: 3
            },
            {
              title: 'City',
              dataIndex: 'cityName',
              span: 3
            },
            {
              title: 'Area',
              dataIndex: 'areaID',
              span: 3
            },
            {
              title: 'Landmark',
              dataIndex: 'landmark',
              span: 3
            },
            {
              title: 'Candidate Address',
              dataIndex: 'candidateAddress',
              span: 3
            }

          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default CandidateDashboard;
