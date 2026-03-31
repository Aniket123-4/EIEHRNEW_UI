import React, { useEffect, useRef, useState } from 'react';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Modal, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Input, Typography, Radio } from 'antd';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history, type IRoute } from 'umi';
import { activeStatus, dateFormat } from '@/utils/constant';
import { convertDate } from '@/utils/helper';
import dayjs from 'dayjs';
import moment from 'moment';
import { requestGetPatientForDoctorOPIP } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const DoctorPatientList = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [formFilter] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const [seenPatients, setSeenPatients] = useState('1');
    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };
    const { verifiedUser } = getUserInLocalStorage();


    const columns: ColumnsType<any> = [
        // {
        //     title: 'Vital Sign Entered',
        //     dataIndex: 'docUserName',
        //     key: 'docUserName',
        //     render: (text) => <a>{text}</a>,
        // },
        // {
        //     title: 'Insurance Approved Status',
        //     dataIndex: 'noOfSlotPerHrs',
        //     key: 'noOfSlotPerHrs',
        // },
        {
            title: 'Visit Date',
            dataIndex: 'admissionDate',
            key: 'admissionDate',
            fixed: 'left',
            width:120
        },
        {
            title: 'Name',
            key: 'patientName',
            dataIndex: 'patientName',
            fixed: 'left',
        },
        {
            title: 'Patient No',
            key: 'patientNo',
            dataIndex: 'patientNo',
            width:100

        },
        {
            title: 'Case No',
            key: 'patientCaseNo',
            dataIndex: 'patientCaseNo',
            width:90
        },
        {
            title: 'Visit No',
            key: 'admNo',
            dataIndex: 'admNo',
            width:90
        }, {
            title: 'Token No',
            key: 'tokenNo',
            dataIndex: 'tokenNo',
            width:80,
        }, {
            title: 'Age',
            key: 'age',
            dataIndex: 'age',
            width:60
        }, {
            title: 'Gender',
            key: 'genderName',
            dataIndex: 'genderName',
            width:80
        }, {
            title: 'Mobile Number',
            key: 'curMobileNo',
            dataIndex: 'curMobileNo',

        }, 
        {
            title: 'Payment Mode',
            key: 'insAppStatus',
            dataIndex: 'insAppStatus',

        },
        {
            title: 'Doctor Seen',
            key: 'isDocSeen',
            dataIndex: 'isDocSeen',
            fixed: 'right',
            width: 100,
            render:(text)=><Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Yes' : 'No'}</Tag>,
        },
        {
            title: 'Paid Amount',
            key: 'isPaid',
            dataIndex: 'isPaid',
            width: 100,
            fixed: 'right',
            render:(text)=><Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Yes' : 'No'}</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} onClick={() => {
                        history.push(`/doctor/patient-details/${record?.patientID}/${record?.patientNo}/${record?.patientCaseID}/${record?.patientCaseNo}/${record?.admNo}`)
                    }}>View</Button>

                </Space>
            ),
        },
    ];

    useEffect(() => {
        getList();
    }, [])

    const getList = async () => {
        try {

            const { dateRange, isActive, patientName } = formFilter.getFieldsValue()
            let slotFromDate = convertDate(dateRange[0]);
            let slotToDate = convertDate(dateRange[1]);



            const staticParams = {
                patientCaseID: -1,
                patientCaseNo: '',
                patientID: -1,
                patientNo: '',
                caseTypeID: 1,
                patientName: patientName ? patientName :'',
                fromDate: slotFromDate,
                toDate: slotToDate,
                userID: verifiedUser?.userID,
                formID: 1,
                type: 1
            }

            setLoading(true)
            const response = await requestGetPatientForDoctorOPIP({ ...staticParams });
            setLoading(false)
            setList(response?.result)
            const seenList:any=response?.result.filter((l:any)=>l.isDocSeen==false)
            setTempList(seenList)
            setSeenPatients('1')

            if (!response?.isSuccess) {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const filterSubmit = () => {
        getList();
    }

    const filterForm = () => {
        return (
            <Form
                layout="vertical"
                form={formFilter}
                onFinish={filterSubmit}
                preserve={true}
                scrollToFirstError={true}
                initialValues={
                    {
                        dateRange: [dayjs(), dayjs()],
                        isActive: -1
                    }
                }
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="dateRange"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <RangePicker
                                        format={dateFormat}
                                        style={{ width: "100%" }}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="patientName"
                                    rules={[{ required: false, message: 'Please select' }]}
                                >
                                    <Input
                                    onChange={(e:any) =>getList()}
                                        placeholder='Patient Name'
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>

                            {/* <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="isActive"
                                    label="Status"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Status"
                                        optionFilterProp="children"
                                        options={activeStatus}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col> */}
                            <Col className="gutter-row" span={8}>
                                <Button style={{ padding: 5, width: 100, height: 38, marginTop: 0 }} type="primary" htmlType="submit">
                                    Filter
                                </Button>
                            </Col>
                        </Row>



                        <Row gutter={16}>

                        </Row>
                    </div>
                </>
            </Form>
        )
    }

    const seenDoctorList=(value:any) => {
        if(value==0)
        {
            let tempList=list;
            const seenList:any=tempList.filter((l:any)=>l.isDocSeen==true)
            setTempList(seenList)
        }
        if(value==1)
        {
            let tempList=list;
            const seenList:any=tempList.filter((l:any)=>l.isDocSeen==false)
            setTempList(seenList)
        }
    }
    const setPatients=(value:any)=>{
        setSeenPatients(value)
        seenDoctorList(value)
    }

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card
                title={
    <Space
      style={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,                    // कोई extra margin न आए
      }}
    >
      <Typography.Title level={4} style={{ margin: 0, color: '#0050b3' }}>
       From - To Date
      </Typography.Title>

       
    </Space>
  }
  headStyle={{
    backgroundColor: '#e6f7ff',       // पूरा header background यहीं से set होता है
    borderBottom: '1px solid #91d5ff', // नीचे border (optional लेकिन अच्छा लगता है)
    padding: '12px 16px',             // header padding adjust
    borderTopLeftRadius: '8px',       // optional: rounded corners
    borderTopRightRadius: '8px',
  }}
  bodyStyle={{
    padding: '16px',                  // body का padding
  }}
  style={{
    borderRadius: '8px',
    overflow: 'hidden',               // rounded corners सही दिखें
    boxShadow: '0 2px 8px rgba(72, 116, 220, 0.15)', // soft shadow
  }} 
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {filterForm()}
                    </div>
                </Spin>
            </Card>
            <Card
                title={
    <Space
      style={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,                    // कोई extra margin न आए
      }}
    >
      <Typography.Title level={4} style={{ margin: 0, color: '#0050b3' }}>
        Patient List (Total ${list?.length}) 
      </Typography.Title>

       
    </Space>
  }
  headStyle={{
    backgroundColor: '#e6f7ff',       // पूरा header background यहीं से set होता है
    borderBottom: '1px solid #91d5ff', // नीचे border (optional लेकिन अच्छा लगता है)
    padding: '12px 16px',             // header padding adjust
    borderTopLeftRadius: '8px',       // optional: rounded corners
    borderTopRightRadius: '8px',
  }}
  bodyStyle={{
    padding: '16px',                  // body का padding
  }}
  style={{
    borderRadius: '8px',
    overflow: 'hidden',               // rounded corners सही दिखें
    boxShadow: '0 2px 8px rgba(72, 116, 220, 0.15)', // soft shadow
  }}
   
                extra={<Radio.Group options={[{ label: 'Seen Patient', value: '0' }, { label: 'Not Seen Patient', value: '1' },]}
                onChange={(value) => setPatients(value.target.value)} 
                value={seenPatients}
                defaultValue={'1'}
                buttonStyle="solid"
                optionType="button" />}
            >

                <div style={contentStyle}>
                    <Table
                        // scroll={x:'90%'}
                        scroll={{ x: 1500 }}
                        columns={columns}
                        dataSource={tempList}
                        pagination={false}
                    />
                </div>
            </Card>
        </Space>

    );
});

export default DoctorPatientList;