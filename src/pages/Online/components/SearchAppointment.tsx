import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Divider, Tabs, Card, Table, Typography } from 'antd';

import { useEffect, useRef, useState } from 'react';

const moment = require('moment');
import dayjs from 'dayjs';
import { PageContainer, ProFormInstance, StepsForm } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';
import { requestAddInstitute } from '@/pages/Institute/services/api';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import { getUserType } from '@/utils/common';
import { requestAddInstituteUser, requestUpdateInstituteUser } from '@/pages/InstituteUser/services/api';
import { requestAddCandidate, requestGetCandidateList } from '@/pages/Candidate/services/api';
import ViewCandidate from '@/pages/Candidate/components/ViewCandidate';
import EditCandidate from '@/pages/Candidate/components/EditCandidate';
import EditOnlineLogin from '@/pages/Online/components/EditOnlineLogin';
import { requestGetAppointmentSearchList, requestGetDoctorList } from '../services/api';
import UpdateProfileImage from '@/pages/User/UserProfile/UpdateProfileImage';
import UpdateDocsUpload from '@/pages/User/UserProfile/UpdateDocsUpload';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const dateFormat = 'DD-MMM-YYYY';



const UserProfile = () => {
    // console.log(getUserType)
    const formRef = useRef<ProFormInstance>();
    const [visible, setVisible] = useState(false);
    const [visibleAdmin, setVisibleAdmin] = useState(false);
    const [loading, setLoading] = useState(false)
    const intl = useIntl();
    const [openViewCandidate, setOpenViewCandidate] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Object>({});
    const [isEditable, setIsEditable] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<any>("1");
    const [doctorList, setDoctorList] = useState<any>([]);
    const [slotDate, setSlotDate] = useState<any>(moment().format('YYYY-MM-DD'));

    const [appointList, setAppointList] = useState([]);


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
        { label: 'Mobile No wise', children: '', key: '1' },
        { label: 'Name wise', children: '', key: '2' },
        { label: 'Patient No wise', children: '', key: '3' },
    ];

    useEffect(() => {
        getAppointmentList(activeTab, { slotDate: moment().format('YYYY/MM/DD'), phoneNo: "" });
        getDoctorList()
        setVisibility()
    }, [])

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DD');
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
        console.log(param['slotDate'])
        param['slotDate'] = convertDate(param['slotDate'])=="Invalid Date" ? "1900-01-01" : convertDate(param['slotDate']);
        try {
            setLoading(true);
            const staticParams = {
                // "phoneNo": search,
                // "slotDate": "1900-01-01",
                // "docUserID": "3693567666946061111",
                "mainType": 1,
                "userID": -1,
                "formID": -1,
                "type": type,
                ...param
            }
            const msg = await requestGetAppointmentSearchList(staticParams);
            if (msg.isSuccess === true) {
                console.log(msg);
                setLoading(false)
                setAppointList(msg.result)
                // list = msg?.data.institutelist2s || [];
            }
        } catch (error) {
            console.log({ error });
            message.error('please try again');
            setLoading(false)
        }
    };
    const getDoctorList = async (slotDt:any=slotDate) => {
        try {
            setLoading(true);
            const staticParams = {
                "date": slotDt,
                "userID": -1,
                "formID": -1,
                "type": 1
            }
            const res = await requestGetDoctorList({});
            console.log(res);
            if (res.isSuccess === true) {
                const dataMaskForDropdown = res?.data?.map((item: any) => {
                    return { value: item.userID, label: item.userName }
                })
                console.log({ dataMaskForDropdown })
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
    const onDateChange = (date: any) => {
        setSlotDate(moment(date).format('YYYY-MM-DD'))
        getDoctorList(moment(date).format('YYYY-MM-DD'))
    };
    const reloadTable = () => {
        // actionRef.current.reload();
    }
    const columns = [
        {
            title: 'patientName',
            dataIndex: 'patientName',
            // render: (text) => <a>{text}</a>,
            editable: true
        },
        {
            title: 'SectionName',
            dataIndex: 'sectionName',
            key: 'sectionName',
            editable: true,
            // render: (text:any ) => <Typography>{text.toString}</Typography>,

        },
        {
            title: 'slotTime',
            dataIndex: 'slotTime',
            key: 'slotTime',
            editable: true
        },
        {
            title: 'UserName',
            key: 'userName',
            dataIndex: 'userName',
            editable: true
        },
        {
            title: 'MobileNo',
            key: 'phoneNo',
            dataIndex: 'phoneNo',
            editable: true
        },

    ];
    const appointmentSearch = (type: any) => {
        return (datatype === 'Admin' &&
            <>
                <Card size="small">
                    <Form
                        // initialValues={{slotDate:dayjs('11-01-2023'),phoneNo:""}}
                        onFinish={(v) => getAppointmentList(activeTab, v)}
                        onValuesChange={(_, values) => {
                            // run(values);
                        }}
                    >
                        <Space.Compact block>
                            <Form.Item style={{width:'15%'}}
                                initialValue={dayjs(moment().format('YYYY/MM/DD'))}
                                name="slotDate"
                            >
                                <DatePicker onChange={onDateChange} size='large' format={dateFormat} />
                            </Form.Item>
                            <Form.Item
                                style={{width:'60%'}}
                                initialValue=""
                                name="phoneNo"
                            >
                                <Input
                                    size='large'
                                    placeholder="Search text..."
                                // onChange={onTextChange}
                                />
                            </Form.Item>
                            <Form.Item
                                style={{width:'15%'}}
                                    name="docUserID"
                                    rules={[{ required: false, message: 'Please select Doctor' }]}
                                >
                                    <Select
                                    
                                    size='large'
                                        placeholder="Select Doctor"
                                        optionFilterProp="children"
                                        options={doctorList}
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
                                pagination={{
                                    // onChange: cancel,
                                }}
                            />
                        </Spin>
                    </Card>
                </Card>
            </>
        )
    }

    const updateProfileImage = () => {
        return (
            <>

            </>
        )
    }


    return (
        <PageContainer
            header={{
                title: `Search Patient Appointment`,
            }}
        >
            <Card>
                <Tabs
                    tabPosition={'top'}
                    items={initialTabItems}
                    onChange={(activeKey) => { setActiveTab(activeKey); getAppointmentList(activeKey, { slotDate: moment(), phoneNo: "" }) }}
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