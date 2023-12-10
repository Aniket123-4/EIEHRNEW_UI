import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProColumns, ProDescriptions } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col, Progress, Spin, Table, Button, message } from 'antd';
import { getUserInLocalStorage } from '@/utils/common';
import { UserOutlined } from '@ant-design/icons';
import Chart from 'react-google-charts';
import { requestGetPatientSearch } from '../services/api';
const { Title, Text, Link } = Typography;
import { history, useIntl, } from '@umijs/max';
import dayjs from 'dayjs';



const ViewPatient: React.FC = () => {

    const [selectedRows, setSelectedRows] = useState<Object>({});
    const [loading, setLoading] = useState(false)

    const [patientData, setPatientData] = useState([])
    const [patientData1, setPatientData1] = useState([])
    const [patientDoc, setPatientDoc] = useState([])
    const [familyData, setFamilyData] = useState([])
    const [familyData1, setFamilyData1] = useState([])




    useEffect(() => {

    }, [])

    const columns: any[] = [
        {
            title: 'Patient Name',
            dataIndex: 'fName',
        },
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            valueType: 'textarea',
        },
        {
            title: 'Father Name',
            dataIndex: 'fatherName',
        },
        {
            title: 'Mother Name',
            dataIndex: 'motherName',
        },
        {
            title: 'Birth Place',
            dataIndex: 'motherName',
        },
        // {
        //     title: 'DOB',
        //     dataIndex: 'dob',

        // render: (_: any, record: any) => (
        //     <Space size="middle">
        //         <Button type="primary" size={"small"}  />
        //         <Button type="primary" size={"small"} 
        //         //onClick={() => onEdit(record)} icon={<EditOutlined />} 
        //         />
        //         {/* <Button type="primary" danger size={"small"} onClick={() => onDelete(record)} icon={<DeleteOutlined />} /> */}
        //     </Space>
        // ),
        // },
    ];

    return (
        <PageContainer

        >
            <Card>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>

                    <Space align="center" size={24}>
                        <Progress size={160} type="circle" percent={selectedRows?.profilePercentage}
                            format={() =>
                                <Avatar size={145}
                                    //icon={
                                    // <Image
                                    //   src={`data:image/png;base64,${selectedRows?.profileImage}`}
                                    //   width={200}
                                    // />}
                                    src={patientDoc?.photo ?
                                        `data:image/png;base64,${patientDoc?.photo}`
                                        : "https://bootdey.com/img/Content/avatar/avatar6.png"}
                                />} >

                        </Progress>
                    </Space>
                    <Space align="center" size={24}>
                        <Title>{`${patientData?.fName ? patientData?.fName : ""} ${patientData?.mName ? patientData?.mName : ""} ${patientData?.lName ? patientData?.lName : ""}`}</Title>
                        <Image
                            src={patientDoc?.signature ?
                                `data:image/png;base64,${patientDoc?.signature}`
                                : ""}
                            width={100}
                            height={40}
                        />
                    </Space>
                </div>

                <Divider orientation="left"><h4>Basic Information</h4></Divider>
                <ProDescriptions
                    // dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    column={2}
                    request={async () => {
                        const patientID = history.location.pathname.split('/')[3];
                        const params = {
                            patientNo: '',
                            patientUIDNo: '',
                            ageGreater: 0,
                            genderID: -1,
                            civilStatusID: -1,
                            bloodGroupID: -1,
                            nationalityID: -1,
                            serviceTypeID: -1,
                            patientName: '',
                            patientMobileNo: '',
                            patientPhoneNo: '',
                            patientDOB: '1900-01-01',
                            fromDate: '1900-01-21',
                            toDate: '2023-12-21',
                            isDeleted: false,
                            userID: -1,
                            formID: -1,
                            type: 2,
                            patientID: patientID,
                        }

                        const response = await requestGetPatientSearch({ ...params });
                        setSelectedRows(response)
                        setPatientData(response?.result[0])
                        setPatientData1(response?.result1[0])
                        setPatientDoc(response?.result2[0])
                        setFamilyData(response?.result3[0])
                        setFamilyData1(response?.result4[0])

                        setLoading(false)
                        console.log(response.result[0])
                        return Promise.resolve({
                            data: response.result[0],
                            success: true,
                        });

                    }}
                    columns={columns}
                    emptyText={'--'}
                >
                    <ProDescriptions.Item
                        label="DOB"
                        fieldProps={{
                            format: 'DD-MMM-YYYY',
                        }}
                        valueType="date"
                    >
                        {dayjs(patientData?.dob).valueOf()}
                    </ProDescriptions.Item>
                </ProDescriptions>

                <Divider orientation="left"><h4>Current Address</h4></Divider>
                <ProDescriptions
                    bordered={true}
                    size={'small'}
                    column={2}>
                    <ProDescriptions.Item
                        label="HouseNo"
                    >
                        {patientData1?.curHouseNo}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="Address"
                    >
                        {patientData1?.curAddress}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="PinCode"
                    >
                        {patientData1?.curPinCode}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="MobileNo"
                    >
                        {patientData1?.curMobileNoCC + ' ' + patientData1?.curMobileNo}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="curPhoneNo"
                    >
                        {patientData1?.curPhoneNo}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="Mail"
                    >
                        {patientData1?.eMail}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="Alternate Email"
                    >
                        {patientData1?.alternateEmail}
                    </ProDescriptions.Item>

                </ProDescriptions>

                <Divider orientation="left"><h4>Permanent Address</h4></Divider>
                <ProDescriptions
                    bordered={true}
                    size={'small'}
                    column={2}>
                    <ProDescriptions.Item
                        label="HouseNo"
                    >
                        {patientData1?.perHouseNo}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="Address"
                    >
                        {patientData1?.perAddress}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="PinCode"
                    >
                        {patientData1?.perPinCode}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="MobileNo"
                    >
                        {patientData1?.perMobileNoCC + ' ' + patientData1?.perMobileNo}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="curPhoneNo"
                    >
                        {patientData1?.perPhoneNo}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="Mail"
                    >
                        {patientData1?.eMail}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="Alternate Email"
                    >
                        {patientData1?.alternateEmail}
                    </ProDescriptions.Item>
                </ProDescriptions>

                <Divider orientation="left"><h4>Family Details</h4></Divider>
                <ProDescriptions
                    bordered={true}
                    size={'small'}
                    column={2}>
                    <ProDescriptions.Item
                        label="Contact Name"
                    >
                        {familyData?.contactName}
                    </ProDescriptions.Item>

                    <ProDescriptions.Item
                        label="MobileNo"
                    >
                        {familyData?.contactMobileNo}
                    </ProDescriptions.Item>

                    <ProDescriptions.Item
                        label="curPhoneNo"
                    >
                        {familyData?.perPhoneNo}
                    </ProDescriptions.Item>

                    <ProDescriptions.Item
                        label="IsDependent"
                    >
                        {familyData?.isDependent ? "Yes" : "No"}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="Alternate Email"
                    >
                        {familyData?.alternateEmail}
                    </ProDescriptions.Item>
                </ProDescriptions>

                <Divider orientation="left"><h4>Emergency Contact Details</h4></Divider>
                <ProDescriptions
                    bordered={true}
                    size={'small'}
                    column={2}>
                    <ProDescriptions.Item
                        label="Contact Name"
                    >
                        {familyData?.contactName}
                    </ProDescriptions.Item>

                    <ProDescriptions.Item
                        label="MobileNo"
                    >
                        {familyData?.contactMobileNo}
                    </ProDescriptions.Item>

                    <ProDescriptions.Item
                        label="curPhoneNo"
                    >
                        {familyData?.perPhoneNo}
                    </ProDescriptions.Item>

                    <ProDescriptions.Item
                        label="IsDependent"
                    >
                        {familyData?.isDependent ? "Yes" : "No"}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item
                        label="Alternate Email"
                    >
                        {familyData?.alternateEmail}
                    </ProDescriptions.Item>
                </ProDescriptions>
            </Card>
        </PageContainer>
    );
};

export default ViewPatient;
