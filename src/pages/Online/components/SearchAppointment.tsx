import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Divider, Tabs, Card, Table, Typography } from 'antd';

import { useEffect, useRef, useState } from 'react';

const moment = require('moment');
import dayjs from 'dayjs';
import { PageContainer, ProFormInstance, StepsForm } from '@ant-design/pro-components';
import { history, SelectLang, useIntl } from '@umijs/max';
import { getUserInLocalStorage, getUserType } from '@/utils/common';
import { requestGetAppointmentSearchList, requestGetDoctorList, requestSyncOnlinePatient } from '../services/api';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { values } from 'lodash';
import PrintReport from '@/components/Print/PrintReport';

const { Option } = Select;

const dateFormat = 'DD MMM YYYY';



const UserProfile = () => {
    // console.log(getUserType)
    const formRef = useRef<ProFormInstance>();
    const [visible, setVisible] = useState(false);
    const [visibleAdmin, setVisibleAdmin] = useState(false);
    const [loading, setLoading] = useState(false)
    const [form] = useForm();
    const intl = useIntl();
    const [openViewCandidate, setOpenViewCandidate] = useState(false);
    const [activeTab, setActiveTab] = useState<any>("1");
    const [doctorList, setDoctorList] = useState<any>([{ value: "-1", label: "All" }]);
    const [defDoctor, setDefDoctor] = useState<any>("");
    const [slotDate, setSlotDate] = useState<any>(dayjs());
    const [base64Data, setBase64Data] = useState<any>("");
    const [showPdf, setShowPdf] = useState<any>(false);

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
        { label: 'Search', children: '', key: '1' },
        { label: 'Today Slot', children: '', key: '2' },
        { label: 'Doctor and SlotDate', children: '', key: '3' },
    ];

    useEffect(() => {
        getDoctorList()
        setVisibility()
    }, [])

    useEffect(() => {
        setVisibility()
        getAppointmentList(activeTab, { phoneNo: "", docUserID: defDoctor });
    }, [defDoctor])

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'DD-MMM-YYYY');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DD');
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

    const getAppointmentList = async (type: any = activeTab, param: any = "", urlType: any = "Online") => {
        const params = form.getFieldsValue();
        params['slotDate'] = convertDate(params?.slotDate);


        try {
            setLoading(true);
            const staticParams = {
                // "phoneNo": search,
                // "docUserID": "3693567666946061111",
                // "slotDate": type==2 ? "1900-01-01" : slotDt,
                "mainType": type === "3" ? 2 : 1,
                "userID": -1,
                "formID": -1,
                "type": type,
                "urlType": urlType,
                "show": false,
                "exportOption": ".pdf",
                ...params
            }
            const msg = await requestGetAppointmentSearchList(staticParams);
            if (msg.isSuccess === true) {
                // console.log(msg);
                setLoading(false)
                if (urlType === 'Online')
                    setAppointList(msg.result)
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
        getAppointmentList(activeTab, {})
    };
    const syncPatient = async (v: any) => {
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

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase());//.toLowerCase()
    const reloadTable = () => {
        // actionRef.current.reload();
    }

    const printReport = async () => {

        const params = form.getFieldsValue();
        params['slotDate'] = convertDate(params?.slotDate);
        try {
            setLoading(true);
            const staticParams = {
                // "phoneNo": search,
                // "docUserID": "3693567666946061111",
                // "slotDate": type==2 ? "1900-01-01" : slotDt,
                "mainType": activeTab === "3" ? 2 : 1,
                "userID": -1,
                "formID": -1,
                "type": activeTab,
                "urlType": "Reports",
                "show": false,
                "exportOption": ".pdf",
                ...params
            }
            const res = await requestGetAppointmentSearchList(staticParams);
            setBase64Data(res)
            setShowPdf(true)
            if (res.isSuccess === true) {
                // console.log(msg);
                setLoading(false)
            }
            setLoading(false)

            var code = '\
    <html>\
        <head>\
            <title></title>\
            <script>\
    function printFunction() {\
        window.focus();\
        window.print();\
        window.close();\
    }\
    window.addEventListener(\'load\', printFunction);\
            </script>\
        </head>\
        <body><img src="'+ "src" + '" width="100%"></body>\
    </html>';

            // window.open('data:application/pdf;base64,' + res);

            //window.open(`/printPage`);
        } catch (error) {
            console.log({ error });
            message.error('please try again');
            setLoading(false)
        }
    }

    const columns = [
        {
            title: 'Sync Patient',
            dataIndex: 'sync',
            render: (text: any, record: any) => (record.patientName && <Button onClick={() => syncPatient(record)}>{'Sync'}</Button>),
            width: '10%',
        },
        {
            title: 'Doctor Name',
            key: 'userName',
            dataIndex: 'userName',
            width: '10%',
        },
        {
            title: 'Specialization',
            dataIndex: 'sectionName',
            key: 'sectionName',
            width: '25%',
            // render: (text:any ) => <Typography>{text.toString}</Typography>,
        },
        {
            title: 'Slot Date',
            key: 'slotDate',
            dataIndex: 'slotDate',
            render: (_: any, record: any) => <>
                <Typography >{" " + record.slotDate + "  " + record.slotTime}</Typography>
                <Typography >{ }</Typography>
            </>,
            width: '15%',
        },
        // {
        //     title: 'Slot Time',
        //     dataIndex: 'slotTime',
        //     key: 'slotTime',
        // },
        {
            title: 'Patient Name',
            dataIndex: 'patientName',
            render: (_: any, record: any) => <>
                <Typography >{" " + record.patientName + "  " + record.phoneNo}</Typography>
                <Typography >{ }</Typography>
            </>,
            width: '15%',
        },
        // {
        //     title: 'Mobile No',
        //     key: 'phoneNo',
        //     dataIndex: 'phoneNo',
        // },
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            // render: (text) => <a>{text}</a>,
        },
        {
            title: 'Remark',
            key: 'remark',
            dataIndex: 'remark',
            //  render: (text:any,record:any) => (<Button onClick={()=>syncPatient(record)}>{'Sync'}</Button>),
        },


    ];

    const handleCancel = () => {
        setShowPdf(false);
    };
    const appointmentSearch = (type: any) => {
        return (datatype === 'Admin' &&
            <>
                <Card size="small">
                    <Form
                        layout='vertical'
                        form={form}
                        initialValues={{ slotDate: dayjs(slotDate, dateFormat), docUserID: "-1" }}
                        onFinish={(v) => getAppointmentList(activeTab, v)}
                        onValuesChange={(_, values) => {
                            getAppointmentList(activeTab, values)
                        }}
                    >
                        <Space.Compact block>
                            <Form.Item hidden={type == 2} style={{ width: type != 2 ? '15%' : '0%' }}
                                name="slotDate"
                            >
                                <DatePicker
                                    allowClear={false}
                                    //defaultValue={dayjs(slotDate, dateFormat)}
                                    // onChange={onDateChange} 
                                    size='large'
                                    format={dateFormat}
                                />
                            </Form.Item>
                            <Form.Item
                                style={{ width: type != 2 ? '57%' : '72%' }}
                                initialValue=""
                                name="phoneNo"
                            >
                                <Input
                                    allowClear
                                    size='large'
                                    placeholder="Search by Mobile/Email/Patient Name"
                                    onChange={onTextChange}
                                />
                            </Form.Item>
                            <Form.Item
                                //label="Select Doctor"
                                style={{ width: '18%' }}
                                name="docUserID"
                                rules={[{ required: true, message: 'Please select Doctor' }]}
                            >
                                <Select
                                    showSearch
                                    filterOption={filterOption}
                                    size='large'
                                    placeholder="Select Doctor"
                                    // optionFilterProp="children"
                                    options={doctorList}
                                    onSelect={(d) => setDefDoctor(d)}
                                />
                            </Form.Item>
                            <Button style={{ width: 100 }} size='large' type="primary" htmlType="submit" shape="default" icon={<SearchOutlined />} />
                        </Space.Compact>
                    </Form>
                    <Card
                        title={<Space style={{ justifyContent: 'space-between', width: '100%'  }}>
                            <Typography style={{color:'#007f88',fontSize:18}}>Appointment List</Typography>
                            <Button onClick={() => printReport()}><DownloadOutlined /></Button></Space>}
                        headStyle={{
    backgroundColor: '#e6f7ff',       // पूरा header background यहीं से set होता है
    borderBottom: '1px solid #91d5ff', // नीचे border (optional लेकिन अच्छा लगता है)
    padding: '12px 16px',             // header padding adjust
    borderTopLeftRadius: '8px',       // optional: rounded corners
    borderTopRightRadius: '8px' 
    
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
                    onChange={(activeKey) => {
                        setActiveTab(activeKey);
                        getAppointmentList(activeKey, { phoneNo: "", docUserID: defDoctor })
                    }}
                />
                <div style={{ marginTop: 30 }}>
                    {activeTab === "1" && appointmentSearch(1)}
                    {activeTab === "2" && appointmentSearch(2)}
                    {activeTab === "3" && appointmentSearch(3)}
                </div>
            </Card>
            <PrintReport showModal={showPdf} base64Data={base64Data} onCancel={handleCancel}/>
        </PageContainer>
    );
};

export default UserProfile;