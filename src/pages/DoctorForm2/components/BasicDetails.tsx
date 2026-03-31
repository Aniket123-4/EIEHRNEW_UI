import React, { useEffect, useRef, useState } from 'react';
import { Button, Space,Descriptions, Avatar, QRCode, Typography } from 'antd';
import { history } from '@umijs/max';
import { DatePicker, Radio } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;



const BasicDetails = ({ patientBasicDetails = {}, patientDetails, admNo }: any) => {


    const result1 = patientBasicDetails?.result1[0];
    const { result4 } = patientDetails;//disease
    const { result5 } = patientDetails;//medicines
    console.log(patientBasicDetails,result4,result5);
    const qrData = `PatientNo: ${result1.patientNo}
Candidate Name: ${result1.candName}
Email: ${result1.email}

Last Prescription: 

Disease Name: ${result4[0].diseaseName}

Medicines: 
${result5.map((item:any)=>{return(`${item.drugName}  ${item.quantityPerDay}/Day ${item.qtyTimesPerDay}Times/Day\n`)})}`

    const basicDetails = [
        {
            key: '1',
            label: 'Patient No',
            children: result1?.patientNo
        },
        {
            key: '2',
            label: 'Name',
            children: result1?.candName
        },
        {
            key: '3',
            label: 'DOB',
            children: result1?.dob
        },
        {
            key: '4',
            label: 'Age',
            children: result1?.age
        },
        {
            key: '5',
            label: 'Address',
            children: result1?.curAddress
        },
        {
            key: '6',
            label: 'Mobile No',
            children: result1?.curMobileNo
        },
        {
            key: '7',
            label: 'Phone No',
            children: result1?.curPhoneNo
        },
        {
            key: '8',
            label: 'Marital Status',
            children: result1?.civilStatusName
        },
        {
            key: '9',
            label: 'Blood Group',
            children: result1?.bloodGroup
        },
        {
            key: '10',
            label: 'Email',
            children: result1?.email
        },
        {
            key: '11',
            label: 'Emergency Name',
            children: result1?.emerGencyName
        },
        {
            key: '12',
            label: 'Emergency Contact',
            children: result1?.emerGencyContact
        },
        {
            key: '13',
            label: 'Gender',
            children: result1?.genderName
        }
        // {
        //     key: '14',
        //     label: 'Insurance Company',
        //     children: result1?.insuranceComp
        // }
    ];

    const downloadQRCode = () => {
        const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
        if (canvas) {
            const url = canvas.toDataURL();
            const a = document.createElement('a');
            a.download = 'QRCode.png';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };
    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                <Space align="center" size={24}>
                    <Avatar size={164} icon={<UserOutlined />} />
                    <div id="myqrcode"><QRCode type="canvas" value={qrData} /></div>
                    <Button type="primary" onClick={downloadQRCode}>
                        Download
                    </Button>
                </Space>

            </div>

            {patientBasicDetails && <Descriptions
                bordered
                size={'small'}
                items={basicDetails}
            />}
        </Space>
    );
};

export default BasicDetails;