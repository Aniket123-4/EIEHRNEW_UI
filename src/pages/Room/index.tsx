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
import AddRoom from './components/AddRoom';
import { requestGetRoomList } from './services/api';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import ViewRoom from './components/ViewRoom';

const { Option } = Select;
const { confirm } = Modal;

const Room: React.FC = () => {
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [openAddRoom, setOpenAddRoom] = useState(false);
  const [openViewRoom, setOpenViewRoom] = useState(false);
  const actionRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'Institute',
      dataIndex: 'institute',
    },
    {
      title: 'Room Name',
      dataIndex: 'roomName',
      valueType: 'textarea',
    },
    {
      title: 'Room Type',
      dataIndex: 'roomTypeID',
      sorter: true,
    },
    {
      title: 'Room Capacity',
      dataIndex: 'roomCapacity',
    },
    {
      title: 'No Of Row',
      dataIndex: 'noOfRow',
      sorter: true,
    },
    {
      title: 'No Of Col',
      dataIndex: 'noOfCol',
      sorter: true,
    },
    {
      title: 'Room Size',
      dataIndex: 'roomSize',
      sorter: true,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
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
    setOpenEditRoom(true);
  };

  const onView = (record: any) => {
    console.log(record)
    setSelectedRows(record)
    setOpenViewRoom(true);
  };

  const onDelete = (record: any) => {
    setSelectedRows(record)
    showDeleteConfirm();
  };

  const addRoom = () => {
    setSelectedRows({});
    setIsEditable(false)
    setOpenAddRoom(true);
  };

  const onCloseAddRoom = () => {
    setOpenAddRoom(false);
  };

  const onCloseEditRoom = () => {
    setOpenEditRoom(false);
  };

  const onCloseViewRoom = () => {
    setOpenViewRoom(false);
  };

  const onOpenViewRoom = () => {
    setOpenViewRoom(true)
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
    // actionRef.current.reload();
  }

  return (
    <PageContainer>
      <Space align="baseline">
        <Button type="primary" onClick={addRoom} icon={<PlusOutlined />}>
          New Room
        </Button>
      </Space>
      <br />
      <br />
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'Room List'}
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
            "genderID": -1,
            "stateID": -1,
            "districtID": -1,
            "cityID": -1,
            "areaID": -1,
            "searchText": "",
            "userID": "-1",
            "formID": -1,
            "type": 1
          }

          const msg = await requestGetRoomList(params);
          console.log(msg.data)
          return Promise.resolve({
            data: msg.data,
            success: true,
          });
        }}

        columns={columns}
      />
      <AddRoom
        visible={openAddRoom}
        onClose={onCloseAddRoom}
        onSaveSuccess={reloadTable}
        selectedRows={selectedRows}
      />
      <AddRoom
        visible={openEditRoom}
        onClose={onCloseEditRoom}
        isEditable={isEditable}
        selectedRows={selectedRows}
        onSaveSuccess={reloadTable}
      />
      <ViewRoom
        visible={openViewRoom}
        onClose={onCloseViewRoom}
        isEditable={isEditable}
        selectedRows={selectedRows}
      />
    </PageContainer>
  );
};

export default Room;