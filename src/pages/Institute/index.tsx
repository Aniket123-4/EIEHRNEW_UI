import React, { useRef, useState } from 'react';
import './index.css';
import { AppstoreAddOutlined, FileAddOutlined, PlusOutlined } from '@ant-design/icons';
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
import AddInstitute from './components/AddInstitute';
import { requestGetInstituteList } from './services/api';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import ViewInstitute from './components/ViewInstitute';
import EditInstitute from './components/EditInstitute';
import AddRoom from '../Room/components/AddRoom';
import { history } from '@umijs/max';
import { getUserInLocalStorage } from '@/utils/common';
import UploadInstituteImage from './components/UploadInstituteImage';

const { Option } = Select;
const { confirm } = Modal;

const Institute: React.FC = () => {
  const [openEditInstitute, setOpenEditInstitute] = useState(false);
  const [openAddInstitute, setOpenAddInstitute] = useState(false);
  const [openViewInstitute, setOpenViewInstitute] = useState(false);
  const [openUploadInstitute, setOpenUploadInstitute] = useState(false);
  const [openAddRoom, setOpenAddRoom] = useState(false);
  const actionRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const data = getUserInLocalStorage();

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'Institute Name',
      dataIndex: 'instituteName',
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
      title: 'Established Date',
      dataIndex: 'estdDate',
      valueType:'date',
    },
    {
      title: 'Website',
      dataIndex: 'website',
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size={"small"} onClick={() => addInstituteImages(record)} icon={<FileAddOutlined />} />
          <Button type="primary" size={"small"} onClick={() => onView(record)} icon={<EyeOutlined />} />
          <Button type="primary" size={"small"} onClick={() => onEdit(record)} icon={<EditOutlined />} />
          <Button type="primary" danger size={"small"} onClick={() => onDelete(record)} icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const addInstituteImages = (record: any) => {
    console.log(record)
    setOpenUploadInstitute(true)
    setSelectedRows(record)
  };
  const getRoom = (record: any) => {
    console.log(record)
    setSelectedRows(record)
    const urlParams = new URL(window.location.href).searchParams;
    history.push('edit');
  };
  const onEdit = (record: any) => {
    setSelectedRows(record)
    setIsEditable(true)
    setOpenEditInstitute(true);
  };

  const onView = (record: any) => {
    console.log(record)
    setSelectedRows(record)
    setOpenViewInstitute(true)
    // history.push("/institute/institute-details/" + record?.instituteID);
  };

  const onDelete = (record: any) => {
    setSelectedRows(record)
    showDeleteConfirm();
  };
  const addRoom = (record: any) => {
    setSelectedRows(record);
    setIsEditable(false)
    setOpenAddRoom(true);
  };

  const addInstitute = () => {
    setSelectedRows({});
    setIsEditable(false)
    setOpenAddInstitute(true);
  };

  const onCloseAddInstitute = () => {
    setOpenAddInstitute(false);
  };

  const onCloseEditInstitute = () => {
    setOpenEditInstitute(false);
  };

  const onCloseViewInstitute = () => {
    setOpenViewInstitute(false);
  };
  const onCloseUploadInstitute = () => {
    setOpenUploadInstitute(false);
  };

  const onOpenViewInstitute = () => {
    setOpenViewInstitute(true)
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
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={<Space align="baseline">{'Institute List'}
          <Button type="primary" onClick={addInstitute} icon={<PlusOutlined />}>
            {'New Institute'}
          </Button>
        </Space>}
        actionRef={actionRef}

        rowKey="key"
        search={false}
        request={async (

        ) => {
          // Here you need to return a Promise, and you can transform the data before returning it
          // If you need to transform the parameters you can change them here

          const params = {
            instituteID: "-1",
            searchText: "",
            mobileNo: "",
            emailID: "",
            phoneNo: "",
            stateID: "-1",
            districtID: "-1",
            cityID: "-1",
            areaID: "-1",
            smallerESTDDate: new Date(),
            smallerThanRank: "",
            greatorThanFaculty: "",
            greatorThanStudent: "",
            roomTypeID: "-1",
            roomCapacityfrom: "",
            roomCapacityTo: "",
            roomRateFrom: "0",
            roomRateTo: "9999",
            userID: data?.verifiedUser?.userID,
            formID: "-1",
            type: "1",
          }
          const msg = await requestGetInstituteList(params);
          console.log(msg.data.institutelist2s)
          return Promise.resolve({
            data: msg.data.institutelist2s,
            success: true,
          });
        }}

        columns={columns}
      />
      <AddInstitute
        visible={openAddInstitute}
        onClose={onCloseAddInstitute}
        onSaveSuccess={reloadTable}
        selectedRows={selectedRows}
      />
      <EditInstitute
        visible={openEditInstitute}
        onClose={onCloseEditInstitute}
        isEditable={isEditable}
        selectedRows={selectedRows}
        onSaveSuccess={reloadTable}
      />
      <ViewInstitute
        visible={openViewInstitute}
        onClose={onCloseViewInstitute}
        isEditable={isEditable}
        selectedRows={selectedRows}
      />
      <UploadInstituteImage
        visible={openUploadInstitute}
        onClose={onCloseUploadInstitute}
        onSaveSuccess={reloadTable}
        selectedRows={selectedRows}
      />

    </PageContainer>
  );
};

export default Institute;