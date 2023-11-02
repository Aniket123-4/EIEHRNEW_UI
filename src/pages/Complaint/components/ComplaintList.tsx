import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { requestGetComplaintType, requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestDiseaseList } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;


interface DataType {
    complaintTypeName: string;
    complaintTypeID: string;
    isActive: string;
    complaintTypeCode: string;
    sortOrder: string;
    rowID:string;
    //   "diseaseCodeICD": "",
    //   "diseaseTypeID": "1",
    //   "sortOrder": "1",
    //   "specialTypeID": "2",

}

const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'complaintTypeName',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Active',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Type',
        dataIndex: 'complaintTypeCode',
        key: 'TypeCode',
    },
    {
        title: 'rowID',
        key: 'rowID',
        dataIndex: 'rowID',
        // render: (_, { tags }) => (
        //     <>
        //         {tags.map((tag) => {
        //             let color = tag.length > 5 ? 'geekblue' : 'green';
        //             if (tag === 'loser') {
        //                 color = 'volcano';
        //             }
        //             return (
        //                 <Tag color={color} key={tag}>
        //                     {tag.toUpperCase()}
        //                 </Tag>
        //             );
        //         })}
        //     </>
        // ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>View</a>
                <a>Edit</a>
            </Space>
        ),
    },
];







const ComplaintList = ({ visible }: any) => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [complaintList, setComplaintList] = useState<any>([])
    const { token } = theme.useToken();

    useEffect(() => {
        getComplaintList();
    }, [])
    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    const formSubmit = async (values: any) => {
        console.log(values);
    }
    
    const getComplaintList = async () => {
        const staticParams = {
            "complaintTypeID": "-1",
            "isActive": "1",
            "type": "1"
        }
        const res = await requestGetComplaintType(staticParams);
        console.log(res.result.length);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.complaintTypeID, label: item.complaintTypeName }
            })
            setComplaintList(res.result)
            // console.log(dataMaskForDropdown)
        }
    }

    return (
        <PageContainer
            style={{ backgroundColor: '#4874dc', height: 120 }}
        >
            <Card
                title="Investigation List"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <div style={contentStyle}>
                    {complaintList&&<Table columns={columns} dataSource={complaintList} />}
                </div>
            </Card>
        </PageContainer>
    );
};

export default ComplaintList;