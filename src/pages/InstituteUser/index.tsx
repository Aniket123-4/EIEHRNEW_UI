import React, { useRef, useState } from 'react';
import './index.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Modal } from 'antd';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import AddInstituteUser from './components/AddInstituteUser';
import { requestGetCandidateList } from './services/api';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import ViewCandidate from './components/ViewInstituteUser';
import EditCandidate from './components/EditInstituteUser';
import ViewInstituteUser from './components/ViewInstituteUser';
import EditInstituteUser from './components/EditInstituteUser';

const { Option } = Select;
const { confirm } = Modal;

const InstituteUser: React.FC = () => {
  const [openEditCandidate, setOpenEditCandidate] = useState(false);
  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [openViewCandidate, setOpenViewCandidate] = useState(false);
  const actionRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '#Institute User Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Email',
      dataIndex: 'emailID',
      valueType: 'textarea',
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobileNo',
      sorter: true,
    },
    {
      title: 'panNo',
      dataIndex: 'panNo',
    },
    {
      title: 'Inst. Name',
      dataIndex: 'instName',
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size={"small"} onClick={() => onView(record)} icon={<EyeOutlined />} />
          <Button type="primary" size={"small"} onClick={() => onEdit(record)} icon={<EditOutlined />} />
          <Button type="primary" danger size={"small"} onClick={() => onDelete(record)} icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const onEdit = (record: any) => {
    setSelectedRows(record)
    setIsEditable(true)
    setOpenEditCandidate(true);
  };

  const onView = (record: any) => {
    console.log(record)
    setSelectedRows(record)
    setOpenViewCandidate(true);
  };

  const onDelete = (record: any) => {
    setSelectedRows(record)
    showDeleteConfirm();
  };

  const addCandidate = () => {
    
    setOpenAddCandidate(true);
    console.log(openAddCandidate)
    setSelectedRows({});
    setIsEditable(false)
    
  };

  const onCloseAddCandidate = () => {
    setOpenAddCandidate(false);
  };

  const onCloseEditCandidate = () => {
    setOpenEditCandidate(false);
  };

  const onCloseViewCandidate = () => {
    setOpenViewCandidate(false);
  };

  const onOpenViewCandidate = () => {
    setOpenViewCandidate(true)
  }

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const reloadTable = () => {
    actionRef.current.reload();
  }

  return (
    <PageContainer >
      {/* <Space align="baseline">
        <Button type="primary" onClick={addCandidate} icon={<PlusOutlined />}>
          New Institute User 
        </Button>
      </Space>
      <br />
      <br /> */}
      
      <ProTable<API.RuleListItem, API.PageParams>
          headerTitle={<Space align="baseline">{'Institute List'}
          <Button type="primary" onClick={addCandidate} icon={<PlusOutlined />}>
            {'New Institute User'}
          </Button>
        </Space>}
       // headerTitle={'Institute User List'}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        request={async (

        ) => {
          // Here you need to return a Promise, and you can transform the data before returning it
          // If you need to transform the parameters you can change them here

          const params = {
            "candidateID": "-1",
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
            "userID": "-1",
            "formID": "-1",
            "type": "1"
          }

          const msg = await requestGetCandidateList(params);
          console.log(msg.data)
          return Promise.resolve({
            data: msg.data,
            success: true,
          });
        }}
        columns={columns}
      />
      <AddInstituteUser
        visible={openAddCandidate}
        onClose={onCloseAddCandidate}
        onSaveSuccess={reloadTable}
        selectedRows={selectedRows}
        isdrawer={true}
      />
      <EditInstituteUser
        visible={openEditCandidate}
        onClose={onCloseEditCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
        onSaveSuccess={reloadTable}
      />
      <ViewInstituteUser
        visible={openViewCandidate}
        onClose={onCloseViewCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
      />
    </PageContainer>
  );
};

export default InstituteUser;