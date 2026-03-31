import React, { useEffect, useRef, useState } from 'react';
import { CloseOutlined, EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Modal, Descriptions, Typography, Badge } from 'antd';
import { requestGetRateType, requestGetRoomType, requestGetUnit } from '@/services/apiRequest/dropdowns';

import { Table, Tag } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';
import { history, type IRoute } from 'umi';
import { dateFormat } from '@/utils/constant';
import dayjs from 'dayjs';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-components';
import { requestGetCheckOutPatient, requestUpdateCaseCheckIn, requestUpdateCaseCheckOut } from '@/pages/Patient/services/api';
import { requestGetItem, requestGetItemBalance } from '../services/api';

const { Option } = Select;
const { Search } = Input;



const ItemStatus = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setItemList] = useState([]);
    const [listFilter, setItemFilter] = useState([]);
    const [unitList, setUnitList] = useState([]);
    const [unitFilter, setUnitFilter] = useState([]);


    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    useEffect(() => {
        getUnit();
        getItemList();
    }, []);

    const getUnit = async () => {
        const staticParams = {
            unitID: -1,
            isActive: 1,
            type: 1,
        };
        const res = await requestGetUnit(staticParams);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.unitID, label: item.unitName };
            });
            const dataMaskFilter = res?.result?.map((item: any) => {
                return { value: item.unitID, text: item.unitName };
            });
            setUnitList(dataMaskForDropdown);
            setUnitFilter(dataMaskFilter);
        }
    };

    const getItemList = async () => {
        const staticParams = {
            "itemID": -1,
            "itemCatID": -1,
            "itemSearch": "",
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        setLoading(true)
        const res = await requestGetItem(staticParams);
        if (res.result.length > 0) {
            setLoading(false)
            const dataMaskFilter = res?.result?.map((item: any) => {
                return { value: item.itemID, text: item.itemName };
            });
            setItemFilter(dataMaskFilter)
            // console.log(dataMaskForDropdown)
        }
        else {
            setLoading(true)
        }
    }



    const columns: ColumnsType<any> = [
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            key: 'itemName',
            width:'200px',
            render: (text) => <a>{text}</a>,
            filters: listFilter,
            // sorter: (a, b) => a.itemName.length - b.itemName.length,
            onFilter: (value: any, record:any) => record.itemID=== value,
        },
        {
            title: 'Voucher No',
            dataIndex: 'voucherNo',
            key: 'voucherNo',
            width:'100px'
        },
        {
            title: 'Unit',
            dataIndex: 'unitName',
            key: 'unitName',
            width:'100px',
            filters: unitFilter,
            onFilter: (value: any, record:any) => record.unitID.indexOf(value) === 0,
        },
        {
            title: 'BalanceQuantity',
            dataIndex: 'balanceQuantity',
            key: 'balanceQuantity',
            width:'100px',
            filters: [{ text: '<100', value: 100 },
            { text: '<200', value: 200 },{ text: 'All', value: 1000000 }],
            onFilter: (value: number, record:any) => record.balanceQuantity<= value,
            // defaultSortOrder: 'ascend',
            sorter: (a, b) => a.balanceQuantity - b.balanceQuantity,
            render: (text) => <Badge status={text>=100 ? "success" : text<100&&text>=50 ?"warning" :"error"} text={text}  />,
        },
        {
            title: 'BalQtySum',
            dataIndex: 'balQuantitySum',
            key: 'balQuantitySum',
            width:'100px',
            filters: [{ text: '<100', value: 100 },
            { text: '<200', value: 200 },{ text: 'All', value: 1000000 }],
            onFilter: (value: number, record:any) => record.balanceQuantity<= value,
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.balQuantitySum - b.balQuantitySum,
            render: (text) => <Tag color={text>=200 ? "success" : text<200&&text>=150 ?"warning" :"error"}>{text}</Tag>,
        },
        {
            title: 'Expiry Date',
            dataIndex: 'eslDate',
            key: 'eslDate',
            width:'100px',
            render: (text) => <label>{moment(text).format('DD-MMM-YYYY')}</label>,
            // render: (text) => <Typography>{dayjs().format('DD-MMM-YYYY')}</Typography>,
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <Button onClick={() => {
        //                 record?.patientStatusID == 1 && getPatientCheckOutInfo(record)
        //                 record?.patientStatusID == 3 && updatePatientStatusToCheckIn(record)
        //             }}
        //                 size={'small'} type='primary' >
        //                 {record?.patientStatusID == 1 ? "Checkout" : "CheckIn"}
        //             </Button>
        //         </Space>
        //     ),
        // },
    ];

    useEffect(() => {
        getItemBalance();
    }, [])

    const getItemBalance = async () => {
        const params = {
            "itemID": -1,
            "itemCatID": -1,
            "sectionID": -1,
            "fundID": -1,
            "productID": -1,
            "unitID": -1,
            "curDate": "19000101",
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        
        try {
            setLoading(true)
            const response = await requestGetItemBalance(params);
            setLoading(false)
            if (response.isSuccess = true) {
                const data=response?.result.map((item) =>{
                    return{...item,balQuantitySum:parseFloat(item.balQuantitySum)}
                })
                setItemList(data)
            } else {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }
    
    return (
        // <PageContainer
        // title=" "
        // style={{padding:0}}>
            <Card
            title={
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: 0,
                  }}
                >
                  <Typography 
                  
                    style={{
                      margin: 0,
                      color: '#0050b3',           // dark blue text for good contrast
                      fontWeight: 600,
                      fontSize: '18px'
                    }}
                  >
                     Item Status
                  </Typography>
             
                </div>
              }
              headStyle={{
                backgroundColor: '#e6f7ff',         // पूरा header background
                borderBottom: '1px solid #91d5ff',  // नीचे हल्की border (consistent look)
                padding: '12px 16px',               // header padding
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }}
              bodyStyle={{
                padding: '16px 20px',               // body में थोड़ा बेहतर spacing
              }}
              style={{
                borderRadius: '8px',
                overflow: 'hidden',                 // rounded corners clip न हो
                boxShadow: '0 3px 12px rgba(72, 116, 220, 0.18)',  // soft, modern shadow
                marginBottom: 24,                   // अगर multiple cards हैं तो नीचे space
              }}  
        >
            <Spin tip="Please wait..." spinning={loading} style={contentStyle}>
                <Table pagination={{ pageSize: 15 }} 
                size='small' columns={columns}
                // onChange={(v)=>console.log(v)}
                dataSource={list} scroll={{x:600, y: 600 }}/>
            </Spin>
        </Card>
        // </PageContainer>
        
    );
});

export default ItemStatus;