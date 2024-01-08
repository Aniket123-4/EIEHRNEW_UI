import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Divider, Tabs, Card, Table, Typography } from 'antd';

import { useEffect, useRef, useState } from 'react';

const moment = require('moment');
import dayjs from 'dayjs';
import { PageContainer, ProFormInstance, StepsForm } from '@ant-design/pro-components';
import {  history, SelectLang, useIntl } from '@umijs/max';
import { getUserInLocalStorage, getUserType } from '@/utils/common';
import { requestGetAppointmentSearchList, requestGetDoctorList, requestSyncOnlinePatient } from '../services/api';
import { SearchOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { values } from 'lodash';

const { Option } = Select;

const dateFormat = 'DD MMM YYYY';



const UserProfile = () => {
    // console.log(getUserType)
    const formRef = useRef<ProFormInstance>();
    const [visible, setVisible] = useState(false);
    const [visibleAdmin, setVisibleAdmin] = useState(false);
    const [loading, setLoading] = useState(false)
    const [form]=useForm();
    const intl = useIntl();
    const [openViewCandidate, setOpenViewCandidate] = useState(false);
    const [activeTab, setActiveTab] = useState<any>("1");
    const [doctorList, setDoctorList] = useState<any>([{ value: "-1", label: "All" }]);
    const [defDoctor, setDefDoctor] = useState<any>("");
    const [slotDate, setSlotDate] = useState<any>(dayjs());

    const [appointList, setAppointList] = useState([]);
    const { verifiedUser } = getUserInLocalStorage();


    const user = JSON.parse(localStorage.getItem("user") as string);
    const data = user?.verifiedUser;
    const datatype = getUserType()
    // console.log(user?.verifiedUser?.userID)

    const contentStyle: React.CSSProperties = {
        lineHeight: '230px',
        textAlign: 'center',
        marginTop: 60,
        height: 250,
    };

    const initialTabItems = [
        { label: 'Mobile No', children: '', key: '1' },
        { label: 'Today Slot', children: '', key: '2' },
        { label: 'Doctor and SlotDate', children: '', key: '3' },
    ];

    useEffect(() => {
        getDoctorList()
        setVisibility()
        getAppointmentList(activeTab, {  phoneNo: "",docUserID:defDoctor});
    }, [defDoctor])

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        console.log(inputDateString)
        const parsedDate = moment(inputDateString, 'DD-MMM-YYYY');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DD');
        console.log(parsedDate);
        console.log(formattedDate);
        return formattedDate
    }
    const setVisibility = () => {
        if (datatype === 'InstituteUser')
            setVisible(true)
        if (datatype === 'Candidate')
            setOpenViewCandidate(true)
        if (datatype === 'Admin')
            setVisibleAdmin(true)
    }
    const onClose = () => {
        setVisible(false)
        setVisibleAdmin(false)
        history.push("/welcome")
    }
    const onCloseViewCandidate = () => {
        setOpenViewCandidate(false);
    };

    const handleSubmit = (values: any) => {
        console.log(values)
        // if (datatype === 'InstituteUser')
        //     addInstituteUser(values)
        // if (datatype === 'Candidate')
        //     addCandidate(values)
        if (datatype === 'Admin')
            message.error("Please login  by another user");
    }

    const getAppointmentList = async (type: any = activeTab, param: any = "",) => {
        console.log(slotDate,param)
        const slotDt = convertDate(slotDate)=="Invalid Date" ? "1900-01-01" : convertDate(slotDate);
        param['docUserID']=param?.docUserID ? param?.docUserID : "-1";
        param['slotDate']=param?.slotDate ? param?.slotDate : "1900-01-01";

        

        try {
            setLoading(true);
            const staticParams = {
                // "phoneNo": search,
                // "docUserID": "3693567666946061111",
                // "slotDate": type==2 ? "1900-01-01" : slotDt,
                "mainType": 1,
                "userID": -1,
                "formID": -1,
                "type": type,
                ...param
            }
            const msg = await requestGetAppointmentSearchList(staticParams);
            if (msg.isSuccess === true) {
                // console.log(msg);
                setLoading(false)
                setAppointList(msg.result)
                // list = msg?.data.institutelist2s || [];
            }
            setLoading(false)
        } catch (error) {
            console.log({ error });
            message.error('please try again');
            setLoading(false)
        }
    };
    const getDoctorList = async () => {
        try {
            setLoading(true);
            const res = await requestGetDoctorList({});
            console.log(res);
            if (res.isSuccess === true) {
                const dataMaskForDropdown = res?.data?.map((item: any) => {
                    return { value: item.userID, label: item.userName }
                })
                dataMaskForDropdown.unshift({ value: "-1", label: "All" })
                setDoctorList(dataMaskForDropdown)
                setLoading(false)
            }
        } catch (error) {
            console.log({ error });
            message.error('please try again');
            setLoading(false)
        }
    };

    const onTextChange = (value: any) => {
        console.log({ value: value.target.value })
        getAppointmentList(activeTab, { phoneNo: value.target.value })
    };
    const syncPatient = async (v:any) => {
        console.log(v)
        const staticParams = {
            "onlinePatientID": v?.onlinePatientID,
            "patientNo": v?.patientNo,
            "patientCaseNo": "",
            "admNo": 1,
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
    const onDateChange = (date: any) => {
        setSlotDate(moment(date).format('DD-MMM-YYYY'));
        getDoctorList();
    };
    const reloadTable = () => {
        // actionRef.current.reload();
    }
    const columns = [
        {
            title: 'Sync Patient',
            dataIndex: 'sync',
            render: (text:any,record:any) => (record.patientName&&<Button onClick={()=>syncPatient(record)}>{'Sync'}</Button>),
            width:'10%',
        },
        {
            title: 'Doctor Name',
            key: 'userName',
            dataIndex: 'userName',
            width:'10%',
        },
        {
            title: 'Department Name',
            dataIndex: 'sectionName',
            key: 'sectionName',
            width:'25%',
            // render: (text:any ) => <Typography>{text.toString}</Typography>,
        },
        {
            title: 'Slot Date',
            key: 'slotDate',
            dataIndex: 'slotDate',
            render: (_: any,record: any) => <>
            <Typography >{" "+record.slotDate +"  "+record.slotTime}</Typography>
            <Typography >{}</Typography>
            </>,
            width:'15%',
        },
        // {
        //     title: 'Slot Time',
        //     dataIndex: 'slotTime',
        //     key: 'slotTime',
        // },
        {
            title: 'Patient Name',
            dataIndex: 'patientName',
            render: (_: any,record: any) => <>
            <Typography >{" "+record.patientName +"  "+record.phoneNo}</Typography>
            <Typography >{}</Typography>
            </>,
            width:'15%',
        },
        // {
        //     title: 'Mobile No',
        //     key: 'phoneNo',
        //     dataIndex: 'phoneNo',
        // },
        {
            title: 'Patient Case No',
            dataIndex: 'patientNo',
            // render: (text) => <a>{text}</a>,
        },
        {
            title: 'Remark',
            key:'remark',
            dataIndex: 'remark',
            //  render: (text:any,record:any) => (<Button onClick={()=>syncPatient(record)}>{'Sync'}</Button>),
        },
        

    ];
    const appointmentSearch = (type: any) => {
        return (datatype === 'Admin' &&
            <>
                <Card size="small">
                    <Form
                    form={form}
                        // initialValues={{slotDate:dayjs('11-01-2023'),phoneNo:""}}
                        onFinish={(v) => getAppointmentList(activeTab, v)}
                        onValuesChange={(_, values) => {
                            // run(values);
                        }}
                    >
                        <Space.Compact block>
                            {type!=2&&<Form.Item style={{width:type!=2 ?'15%' :'0%'}}
                                initialValue={dayjs()}
                                name="slotDate"
                                >
                                <DatePicker
                                    defaultValue={dayjs(slotDate, dateFormat)}
                                    // onChange={onDateChange} 
                                    size='large'
                                    //defaultValue={dayjs(slotDate)}
                                    format={dateFormat}
                                    />
                            </Form.Item>}
                            <Form.Item
                                style={{width:type!=2 ?'57%':'72%'}}
                                initialValue=""
                                name="phoneNo"
                            >
                                <Input
                                    size='large'
                                    placeholder="Search by Mobile/Email/Patient Name"
                                // onChange={onTextChange}
                                />
                            </Form.Item>
                            <Form.Item
                                style={{width:'18%'}}
                                    name="docUserID"
                                    initialValue={"-1"}
                                    rules={[{ required: true, message: 'Please select Doctor' }]}
                                >
                                    <Select
                                        size='large'
                                        placeholder="Select Doctor"
                                        // optionFilterProp="children"
                                        options={doctorList}
                                        onSelect={(d)=>setDefDoctor(d)}
                                    />
                                </Form.Item>
                            <Button style={{ width: 100 }} size='large' type="primary" htmlType="submit" shape="default" icon={<SearchOutlined />} />
                        </Space.Compact>
                    </Form>
                    <Card
                        title="Appointment List"
                        style={{ boxShadow: '2px 2px 2px #4874dc' }}
                    >
                        <Spin tip="Please wait..." spinning={loading}>
                            <Table
                                dataSource={appointList}
                                columns={columns}
                                rowClassName="editable-row"
                                size='small'
                                // expandable={{
                                //     expandedRowRender: (record:any) => <p style={{ margin: 0 }}>{record.remark}</p>,
                                //     rowExpandable: (record) => record.name !== 'Not Expandable',
                                // }}
                                onRow={(record, rowIndex) => {
                                    return {
                                    //   onClick: (event) => {syncPatient(record)}, // click row
                                    };
                                }}
                            />
                        </Spin>
                    </Card>
                </Card>
            </>
        )
    }

    return (
        <PageContainer
            header={{
                title: `Manage Appointments`,
            }}
        >
            <Card>
                <Tabs
                    tabPosition={'top'}
                    items={initialTabItems}
                    onChange={(activeKey) => { setActiveTab(activeKey); 
                        getAppointmentList(activeKey, { phoneNo: "",docUserID:defDoctor }) }}
                />
                <div style={{ marginTop: 30 }}>
                    {activeTab === "1" && appointmentSearch(1)}
                    {activeTab === "2" && appointmentSearch(2)}
                    {activeTab === "3" && appointmentSearch(3)}
                </div>
            </Card>

        </PageContainer>
    );
};

export default UserProfile;