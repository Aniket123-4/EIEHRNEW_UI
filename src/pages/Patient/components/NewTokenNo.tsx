import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Image, Select, Space, message, theme, Card, Descriptions, Row, Col, List, Typography, Table, Tag } from 'antd';

import { requestAddOnlinePatDoc, requestAddUpdatePatientDoc, requestFileUpload, requestGetPatientDoc, requestGetPatientHeader } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import { requestGetCandidateList, requestGetDocuments } from '@/pages/Candidate/services/api';
import { FileAddOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Upload, { RcFile } from 'antd/es/upload';
import { requestGetDocType, requestGetUniqueID } from '@/services/apiRequest/dropdowns';
import { convertDate, convertDateInSSSZFormat } from '@/utils/helper';
import dayjs from 'dayjs';
import PatientDetailsCommon from './PatientDetailsCommon';
import { requestGetInvGroup } from '@/pages/Investigation/services/api';
import { requestGetInvParameterMasterList } from '@/pages/Complaint/services/api';
import { ColumnsType } from 'antd/es/table';


const { Option } = Select;



const NewTokenNo = React.forwardRef(() => {
    const [form] = Form.useForm();
    const [addDocform] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [patientData, setPatientData] = useState<any>();
    const [caseChoice, setCaseChoice] = useState([]);
    const [docList, setDocList] = useState<any>([])
    const [imageUrl, setImageUrl] = useState<string>();
    const [docName, setDocName] = useState<any>("")
    const [docType, setDocType] = useState<any>("-1")
    const [groupList, setGroupList] = useState([]);
    const [invParameter, setInvParameter] = useState([]);

    const [lstType_PatientDoc, setlstType_PatientDoc] = useState<any>([])
    const { verifiedUser } = getUserInLocalStorage();




    
interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }
    useEffect(() => {
    }, [])

    const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };


    const columns: ColumnsType<DataType> = [
        {
          title: 'Location Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Token Number',
          dataIndex: 'age',
          key: 'age',
          width:150
        },
      ];
      
      const data: DataType[] = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser'],
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sydney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
        },
      ];


    

    return (
        <Card>
            <PatientDetailsCommon
                patData={patientData}
                onChange={(value: any) => setPatientData(value)} />
            <>
                {patientData &&
                    <div>
                        {/* <Row style={{ backgroundColor: 'lightgreen', padding: 5 }}>
                            <Col span={5}>Name</Col>
                            <Col span={5}>Date of Birth</Col>
                            <Col span={4}>Blood Group</Col>
                            <Col span={5}>Mobile No</Col>
                            <Col span={5}>Phone No</Col>
                        </Row>
                        <Row style={{ padding: 5 }}>
                            <Col span={5}>{patientData.candName}</Col>
                            <Col span={5}>{patientData.dob}</Col>
                            <Col span={4}>{patientData.bloodGroup}</Col>
                            <Col span={5}>{patientData.curMobileNo}</Col>
                            <Col span={5}>{patientData.curPhoneNo}</Col>
                        </Row>
                        <Row style={{ backgroundColor: 'lightgreen', padding: 5 }}>
                            <Col span={5}>EmergencyContact</Col>
                            <Col span={5}>Date of Birth</Col>
                            <Col span={14}>Address</Col>
                        </Row>
                        <Row style={{ padding: 5 }}>
                            <Col span={5}>{patientData.emerGencyName}</Col>
                            <Col span={5}>{patientData.dob}</Col>
                            <Col span={14}>{patientData.curAddress}</Col>
                        </Row> */}
                        <Card>
                            <Row>
                                <Col span={12}>
                                    <Card
                                        title={
                                            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography>
                                                    {'Patient Details'}
                                                </Typography>
                                            </Row>
                                        }>

                                        
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card
                                        style={{
                                            height: 400,
                                            overflow: 'auto',
                                            padding: '0 16px',
                                            border: '1px solid rgba(140, 140, 140, 0.35)',
                                        }}
                                        title={'Token Status'}>
                                        {docList && 
                                        <Table columns={columns} dataSource={data} />}
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                }
            </>
        </Card>
    );
});

export default NewTokenNo;