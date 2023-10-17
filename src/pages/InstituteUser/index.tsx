import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import { FileOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Modal, Typography, Card } from 'antd';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProFormInstance,
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
import ViewUserBooking from './components/ViewUserBooking';
import { requestGetBookingOrderHistory } from '../Booking/services/api';
import moment from 'moment';
import { requestGetArea, requestGetCity, requestGetDistrict, requestGetGender, requestGetState } from '@/services/apiRequest/dropdowns';

const { Option } = Select;
const { confirm } = Modal;

const InstituteUser: React.FC = () => {
  const [openEditCandidate, setOpenEditCandidate] = useState(false);
  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [openViewCandidate, setOpenViewCandidate] = useState(false);
  const [openViewOrders, setOpenViewOrders] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { Title } = Typography;
  const [state, setState] = useState<string[]>([])
  const [district, setDistrict] = useState<any>([])
  const [city, setCity] = useState<any>([])
  const [area, setArea] = useState<any>([])
  const [gender, setGender] = useState<any>([])

  useEffect(() => {
    getState();
    getGender();
}, [])

const getGender = async () => {
  const res = await requestGetGender();
  if (res.data.length > 0) {
      const dataMaskForDropdown = res?.data?.map((item: any) => {
          return { value: item.genderID, label: item.genderName }
      })
      setGender(dataMaskForDropdown)
  }
}
  const getState = async () => {
    const res = await requestGetState();
    if (res.length > 0) {
        const dataMaskForDropdown = res?.map((item: any) => {
            return { value: item.stateID, label: item.stateName }
        })
        console.log({ dataMaskForDropdown })
        setState(dataMaskForDropdown)
    }
}

const getDistrict = async (value: any, item: any) => {
    const res = await requestGetDistrict(item);
    if (res.length > 0) {
        const dataMaskForDropdown = res?.map((item: any) => {
            return { value: item.districtID, label: item.districtName }
        })
        setDistrict(dataMaskForDropdown)
    }
}

const getCity = async (value: any, item: any) => {
    const res = await requestGetCity(item);
    if (res.length > 0) {
        const dataMaskForDropdown = res?.map((item: any) => {
            return { value: item.cityID, label: item.cityName }
        });
        setCity(dataMaskForDropdown);
    }
}

const getArea = async (value: any, item: any) => {
    const res = await requestGetArea(item);
    if (res.length > 0) {
        const dataMaskForDropdown = res?.map((item: any) => {
            return { value: item.areaID, label: item.areaName }
        })
        setArea(dataMaskForDropdown)
    }
}




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
          <Button type="primary" size={"small"} onClick={() => onViewOrders(record)} icon={<FileOutlined />} />
          
          {/* <Button type="primary" size={"small"} onClick={() => onEdit(record)} icon={<EditOutlined />} />
          <Button type="primary" danger size={"small"} onClick={() => onDelete(record)} icon={<DeleteOutlined />} /> */}
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
  const onViewOrders = async (record: any) => {
    console.log(record)
    const params = {
      "candidateID": record?.candidateID,
      "bookingBillID": "-1",
      "roomID": "-1",
      "seatID": 0,
      "slotID": 0,
      "rateTypeID": 0,
      "fromDate": moment().format('YYYY-MM-DDTHH:MM'),
      "toDate": moment().format('YYYY-MM-DDTHH:MM'),
      "userID": "-1",
      "formID": 0,
      "type": 1
    };
    const res = await requestGetBookingOrderHistory(params);
    console.log(res);
    // setInitLoading(false);
    if (res.isSuccess) {
     
      setSelectedRows(res.result)
      setOpenViewOrders(true);
    }
   
  };

  const getCandidateFilter = async (values: any) => {
    console.log(values)
    console.log(values.candidateID)
    const params = {
      "candidateID":values.candidateID+""!="undefined"? values.candidateID: "-1",
      "uniqueNo": values.uniqueNo+""!="undefined"? values.uniqueNo:"",
      "emailID":values.emailID+""!="undefined"? values.emailID: "",
      "mobileNo": values.mobileNo+""!="undefined"? values.mobileNo:"",
      "dob": values.dob+""!="undefined"? values.dob:"",
      "panNo": values.panNo+""!="undefined"? values.panNo:"",
      "aadhaarNo": values.aadhaarNo+""!="undefined"? values.aadhaarNo:"",
      "genderID": values.genderID+""!="undefined"? values.genderID:"-1",
      "stateID": values.stateID+""!="undefined"? values.stateID:"-1",
      "districtID": values.districtID+""!="undefined"? values.districtID:"-1",
      "cityID": values.cityID+""!="undefined"? values.cityID:"-1",
      "areaID": values.areaID+""!="undefined"? values.areaID:"-1",
      "searchText": values.searchText+""!="undefined"? values.searchText:"",
      "userID": "-1",
      "formID": "-1",
      "type": "1"
    };
    const res = await requestGetCandidateList( params );
    console.log(res);
    // setInitLoading(false);
    if (res.isSuccess) {
     
      // setSelectedRows(res.result)
      // setOpenViewOrders(true);
    }
   
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
  const onCloseViewOrders = () => {
    setOpenViewOrders(false);
    
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
    <PageContainer
    
    //style={{backgroundColor:'red'}}
    
    >
            <div >
        <Card>
          <Form
            onFinish={async (values) => {
              getCandidateFilter(values)
            }}
          >
            <Row gutter={16}>


              {/* <Col span={8}>
            <Form.Item
              name="FinancialYear :"
              label="Financial Year"
              rules={[{ required: true, message: 'Search By finantial Year' }]}
            >
              <Input placeholder="Please enter finantial Year" style={{ width: '90%' }} />
            </Form.Item>
          </Col> */}
          
          <Col span={6}>
              <Form.Item
                                labelCol={{ span: 24 }}
                                    name="candidateID"
                                    label=" Candidate ID"
                                    rules={[{ required: false, message: ' Serach By Candidate ID' }]}
                                >
                                    <Input placeholder=" Serach By Candidate ID" />
                                </Form.Item>
              </Col>
              <Col span={6}>
              <Form.Item
                                labelCol={{ span: 24 }}
                                    name="searchText"
                                    label=" Name"
                                    rules={[{ required: false, message: ' Serach By Name' }]}
                                >
                                    <Input placeholder=" Serach By Name" />
                                </Form.Item>
              </Col>
              <Col span={6}>
              <Form.Item
                                labelCol={{ span: 24 }}
                                    name="emailID"
                                    label=" Email"
                                    rules={[{ required: false, message: ' Serach By Email' }]}
                                >
                                    <Input type='email' placeholder=" Serach By Email" />
                                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                 labelCol={{ span: 24 }}
                  name="dob"
                  label="DOB"
                  rules={[{ required: false, message: 'Filter By DOB' }]}
                >
                  <DatePicker format={'DD-MMM-YYYY'}
                    getPopupContainer={(trigger) => trigger.parentElement!} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
             
              <Col span={6}>
              <Form.Item
                                labelCol={{ span: 24 }}
                                    name="mobileNo"
                                    label=" Mobile No"
                                    rules={[{ required: false, message: ' Serach By Mobile No' }]}
                                >
                                    <Input type='number' placeholder=" Serach By Mobile No" />
                                </Form.Item>
              </Col>
              <Col span={6}>
              <Form.Item
                                labelCol={{ span: 24 }}
                                    name="panNo"
                                    label=" Pan No"
                                    rules={[{ required: false, message: ' Serach By Pan No' }]}
                                >
                                    <Input type='text' placeholder=" Serach By Pan No" />
                                </Form.Item>
              </Col>
              <Col span={6}>
              <Form.Item
                                labelCol={{ span: 24 }}
                                    name="aadhaarNo"
                                    label=" Aadhaar No"
                                    rules={[{ required: false, message: ' Serach By Aadhaar No' }]}
                                >
                                    <Input type='number' placeholder=" Serach By Aadhaar No" />
                                </Form.Item>
              </Col>
              <Col span={6}>
              <Form.Item
                                labelCol={{ span: 24 }}
                                    name="uniqueNo"
                                    label=" Code"
                                    rules={[{ required: false, message: ' Serach Code No' }]}
                                >
                                    <Input type='text' placeholder=" Serach Code No" />
                                </Form.Item>
              </Col>
              <Col span={4}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="genderID"
                                    label="Gender"
                                    rules={[{ required: false, message: 'Please choose the Gender' }]}
                                >
                                    <Select
                                        placeholder="Please choose the Gender"
                                        style= {{ width: '100%',textAlign:'start' }}
                                        options={gender}
                                    />
                                </Form.Item>
                            </Col>
              <Col span={5}>
                <Form.Item
                 labelCol={{ span: 24 }}
                  name="stateID"
                  label="State"
                  rules={[{ message: ' Select State' }]}
                >
                   <Select style={{ width: '100%' }}
                    showSearch
                    placeholder=" Select State"
                    optionFilterProp="children"
                    options={state}
                    onChange={(value, item) => {
                        getDistrict(value, item)
                        formRef.current?.resetFields(["districtID", "cityID", "areaID"]);
                    }}
                  /> 
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                 labelCol={{ span: 24 }}
                  name="districtID"
                  label="District"
                  rules={[{ message: ' Select District' }]}
                >
                   <Select style={{ width: '100%' }}
                    showSearch
                    placeholder=" Select District"
                    optionFilterProp="children"
                    options={district}
                    onChange={(value, item) => {
                        getCity(value, item)
                        formRef.current?.resetFields(["cityID", "areaID"]);
                    }}
                  /> 
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                 labelCol={{ span: 24 }}
                  name="cityID"
                  label="City"
                  rules={[{ message: ' Select City' }]}
                >
                   <Select style={{ width: '100%' }}
                    showSearch
                    placeholder=" Select City"
                    optionFilterProp="children"
                    options={city}
                    onChange={(value, item) => {
                        getArea(value, item)
                        formRef.current?.resetFields(["areaID"]);
                    }}
                  /> 
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                 labelCol={{ span: 24 }}
                  name="areaID"
                  label="Area"
                  rules={[{ message: ' Select Area' }]}
                >
                   <Select style={{ width: '100%' }}
                    showSearch
                    placeholder=" Select Area"
                    optionFilterProp="children"
                    options={area}
                  /> 
                </Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: 'center', width: '100%' }}>

                <Button type="primary" htmlType="submit" style={{ margin: '5px' }}>
                  Search
                </Button>
                <Button type="primary" htmlType="reset" style={{ margin: '5px' }}>
                  Reset
                </Button>
                <Button type="primary" htmlType="button" style={{ margin: '5px' }}>
                  Print
                </Button>
              </Col>

            </Row>
          </Form>
        </Card>

     


      </div>
      
      <ProTable<API.RuleListItem, API.PageParams>
          headerTitle={<Space align="baseline">{'Institute Candidate List'}
          {/* <Button type="primary" onClick={addCandidate} icon={<PlusOutlined />}>
            {'New Institute User'}
          </Button> */}
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
      {/* <EditInstituteUser
        visible={openEditCandidate}
        onClose={onCloseEditCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
        onSaveSuccess={reloadTable}
      /> */}
      <ViewInstituteUser
        visible={openViewCandidate}
        onClose={onCloseViewCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
      />
      <ViewUserBooking 
      visible={openViewOrders}
        onClose={onCloseViewOrders}
        isEditable={isEditable}
        selectedRows={selectedRows}
      />
    </PageContainer>
  );
};

export default InstituteUser;