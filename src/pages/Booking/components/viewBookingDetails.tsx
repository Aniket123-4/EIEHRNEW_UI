import { Drawer, Divider, Select, Row, Col, Table, Modal, } from 'antd';

import { useEffect, useRef, useState } from 'react';
import '../styles/table.css'

const moment = require('moment');
import { ProFormInstance } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';
import { requestGetBookingReport } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';


const count = 3;
const { Option } = Select;
 const { confirm } = Modal;

const ViewBookingDetails = ({ visible, onClose, selectedRows }: any) => {
    console.log("viewBookingDetails")
    console.log(selectedRows)
    const formRef = useRef<ProFormInstance>();
    const [data, setData] = useState<any[]>([]);
    const [list, setList] = useState<any[]>([]);
    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        marginTop: 60,
        height: 300,
    };


    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }


 
 
 
  const columns = [
    
    {
      title: 'candName',
      dataIndex: 'candName',
      key: 'candName',
      // render: (_, record) => (
      //   <Space size="middle">
      //     <Button type="primary" size={"small"} onClick={() => onView(record)} icon={<EyeOutlined />} />
      //      />
      //   </Space>
  
        //  render: (_, record) => <a onClick={() => onView(record.candidateID)}>{record.candName}</a>,
       
       
    },
    {
      title: 'instituteName',
      dataIndex: 'instituteName',
      key: 'instituteName',
       //render: (_,record) => <a  onClick={() => onViewInstitute(record.instituteID)}>{record.instituteName}</a>,
    },
    {
      title: 'roomName',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'roomTypeName',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
    },
    {
      title: 'rateTypeName',
      dataIndex: 'rateTypeName',
      key: 'rateTypeName',
    },
    {
      title: 'seatID',
      dataIndex: 'seatID',
      key: 'seatID',
    },
    {
      title: 'slotName',
      dataIndex: 'slotName',
      key: 'slotName',
    },
    {
      title: 'receiptNo',
      dataIndex: 'receiptNo',
      key: 'receiptNo',
    },
    {
      title: 'totGrossAmt',
      dataIndex: 'totGrossAmt',
      key: 'totGrossAmt',
    },
    {
      title: 'disCountAmt',
      dataIndex: 'disCountAmt',
      key: 'disCountAmt',
    },
    {
      title: 'cgstPercent',
      dataIndex: 'cgstPercent',
      key: 'cgstPercent',
    },
    {
      title: 'cgstAmt',
      dataIndex: 'cgstAmt',
      key: 'cgstAmt',
    },
    {
      title: 'sgstPercent',
      dataIndex: 'sgstPercent',
      key: 'sgstPercent',
    },
    {
      title: 'sgstAmt',
      dataIndex: 'sgstAmt',
      key: 'sgstAmt',
    },
    {
      title: 'totNetAmt',
      dataIndex: 'totNetAmt',
      key: 'totNetAmt',
    },
    {
      title: 'actualPayAmt',
      dataIndex: 'actualPayAmt',
      key: 'actualPayAmt',
    },
    {
      title: 'balanceAmt',
      dataIndex: 'balanceAmt',
      key: 'balanceAmt',
    },
    ,
  ];
  

return (
    <>
        <Drawer
            title={`Booking-Date : ${moment(selectedRows[0]?.payDate).format("DD-MMM-YYYY")}`}
            width={1000}
            onClose={onClose}
            open={visible}
            bodyStyle={{ paddingBottom: 80 }}

        >
            {/* <Divider orientation="left"><h4>Booking Details</h4></Divider> */}

            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
             
                    {/* <Col className="gutter-row" span={24}>
                        
                    </Col> */}
                    <Table columns={columns} dataSource={selectedRows} style={{overflow:'auto',background:'white'}}/>
                                       
             </Row>
     </Drawer>
    </>
        
         );
}
export default ViewBookingDetails;

function onView(record: any): void {
  throw new Error('Function not implemented.');
}

 
