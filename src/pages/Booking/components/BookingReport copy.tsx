import React, { useEffect, useRef, useState } from 'react';
 
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Modal, DatePickerProps,AutoComplete, theme, Card, List, Skeleton , Table, Tag } from 'antd';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import {Link, useModel,history } from '@umijs/max';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { getUserInLocalStorage } from '@/utils/common';
import moment from 'moment';
import { requestGetBookingReport } from '../services/api';
import Title from 'antd/es/skeleton/Title';
import '../styles/table.css';
import { requestGetCandidateList } from '@/pages/Candidate/services/api';
import ViewCandidate from '@/pages/Candidate/components/ViewCandidate';
import EditInstitute from '@/pages/Institute/components/EditInstitute';
import ViewInstitute from '@/pages/Institute/components/ViewInstitute';
import ViewBookingDetails from './viewBookingDetails';


const count = 3;
const { Option } = Select;
const { confirm } = Modal;

const BookingReport: React.FC = () => {
  // const [openEditCandidate, setOpenEditCandidate] = useState(false);
  // const [openEditInstitute, setOpenEditInstitute] = useState(false);
  const [openViewRoom, setOpenViewRoom] = useState(false);
  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [openViewCandidate, setOpenViewCandidate] = useState(false);
  const [openViewInstitute, setOpenViewInstitute] = useState(false);
  const actionRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [InstituteId, setInstituteId] = useState<any>([])
  const [roomType, setRoomType] = useState<any>([])
  const [rateType, setRateType] = useState<any>([])

  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [list_bookDate, setList_bookDate] = useState<any[]>([]);
  const [list_totBookDate, setList_totBookDate] = useState<any[]>([]);
  const [form] = Form.useForm();
  //const {  Space, Table, Tag  } = antd;
  const { initialState, setInitialState } = useModel('@@initialState');
  const [OpenViewBooking, setOpenViewBooking] = useState(false);
  const { token } = theme.useToken();
   


  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  useEffect(() => {
     getRoomType();
        getRateType();
    institutelist();
}, [])
  const reloadTable = () => {
    actionRef.current.reload();
  }
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
  });

  const getRoomType = async () => {
    const res = await requestGetRoomType({});
    if (res.length > 0) {
        const dataMaskForDropdown = res?.map((item: any) => {
            return { value: item.roomTypeID, label: item.roomTypeName }
        })
        setRoomType(dataMaskForDropdown)
    }
}
const getRateType = async () => {
    const res = await requestGetRateType({});
    if (res.length > 0) {
        const dataMaskForDropdown = res?.map((item: any) => {
            return { value: item.rateTypeID, label: item.rateTypeName }
        })
        setRateType(dataMaskForDropdown)
    }
}


  const institutelist=async ()=>{
    const params = {
        instituteID: "-1",
        searchText: "",
        mobileNo: "",
        emailID: "",
        phoneNo: "",
        stateID: "-1",
        districtID: "-1",
        cityID: "-1",
        areaID: "-1",
        smallerESTDDate: new Date(),
        smallerThanRank: "0",
        greatorThanFaculty: "0",
        greatorThanStudent: "0",
        roomTypeID: "-1",
        roomCapacityfrom: "0",
        roomCapacityTo: "0",
        roomRateFrom: "0",
        roomRateTo: "0",
        userID: "-1",
        formID: "-1",
        type:"1",
        
      }
      const msg = await requestGetInstituteList(params);
      console.log(msg.data.institutelist2s)
      if (msg?.data.institutelist2s.length > 0) {
        const dataMaskForDropdown = msg?.data.institutelist2s.map((item: any) => {
            console.log(item.instituteID)
            return { value: item.instituteID, label: item.instituteName }
        })
         setInstituteId(dataMaskForDropdown)
    }
      
}
const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    marginTop: 60,
    height: 300,
};
const getBookingDetail = async () => {
  const { verifiedUser }: any = getUserInLocalStorage();
  const params = {
   // "candidateID": verifiedUser?.userID,
    "fromDate": "2022-09-15T10:32:13.436Z",
      "toDate": "2023-09-15T10:32:13.436Z",
      "instituteID": "-1",
      "finYearID": "-1",
      "roomTypeID": "-1",
      "rateTypeID": "-1",
      "userID": "-1",
      "formID": "-1",
      "type": "1",
      
  };
  const res = await requestGetBookingReport(params);
  console.log(res);
  // console.log(res.data.bookBill);
  // console.log(res.data.totBookDate);
  // console.log(res.data.bookDate);
  setInitLoading(false);
  if (res.isSuccess) {
    setData(res.result);
    setList(res.data.bookBill);
    setList_bookDate(res.data.bookDate);
    setList_totBookDate(res.data.totBookDate);
    
  }

}
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onLoadMore = () => {
  setLoading(true);
  setList(
    data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
  );
  // setList1(
  //   data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
  // );
  // setList2(
  //   data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
  // );
  fetch(fakeDataUrl)
    .then((res) => res.json())
    .then((res) => {
      const newData = data.concat(res.results);
      // setData(newData);
      // setList(newData);
      // setList1(newData);
      // setList2(newData);
      setLoading(false);
      // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
      // In real scene, you can using public method of react-virtualized:
      // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
      window.dispatchEvent(new Event('resize'));
    });
};

const columns = [
  
  {
    title: 'candName',
    dataIndex: 'candName',
    key: 'candName',
      render: (_, record) => <a onClick={() => onView(record.candidateID)}>{record.candName}</a>,
     
     
  },
  {
    title: 'instituteName',
    dataIndex: 'instituteName',
    key: 'instituteName',
     render: (_,record) => <a  onClick={() => onViewInstitute(record.instituteID)}>{record.instituteName}</a>,
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
  


  // {
  //   title: 'Tags',
  //   key: 'tags',
  //   dataIndex: 'tags',
  //   // render: (_, { tags }) => (
  //   //   <>
  //   //     {tags.map((tag) => {
  //   //       let color = tag.length > 5 ? 'geekblue' : 'green';
  //   //       if (tag === 'loser') {
  //   //         color = 'volcano';
  //   //       }
  //   //       return (
  //   //         <Tag color={color} key={tag}>
  //   //           {tag.toUpperCase()}
  //   //         </Tag>
  //   //       );
  //   //     })}
  //   //   </>
  //   // ),
  // },
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <a>Invite {record.name}</a>
  //       <a>Delete</a>
  //     </Space>
  //   ),
  // },
];

const columns1 = [
  {
    title: 'Pay Date',
    dataIndex: 'payDate',
    key: 'payDate',
      render: (_,record) => <a type='date' onClick={() => onViewBooking(record)}>{moment(record.payDate).format("DD-MMM-YYYY")}</a>,
    //render: (text) => <a>{text}</a>,
  },
  {
    title: 'Total Gross Amt',
    dataIndex: 'totGrossAmt',
    key: 'totGrossAmt',
  },
  {
    title: 'Total DisCount Amt',
    dataIndex: 'totDisCountAmt',
    key: 'totDisCountAmt',
  },
  {
    title: 'Total CGST Amt',
    dataIndex: 'totCGSTAmt',
    key: 'totCGSTAmt',
  },
  {
    title: 'Total SGST Amt',
    dataIndex: 'totSGSTAmt',
    key: 'totSGSTAmt',
  },
  {
    title: 'Total NetAmt',
    dataIndex: 'totNetAmt',
    key: 'totNetAmt',
  },
  {
    title: 'Total Actual PayAmt',
    dataIndex: 'totActualPayAmt',
    key: 'totActualPayAmt',
  },

];

const columns2 = [
  {
    title: 'Pay Date',
    dataIndex: 'payDate',
    key: 'payDate',
      render: (_,record) => <a type='date' onClick={() => onViewBooking(record)}>{moment(record.payDate).format("DD-MMM-YYYY")}</a>,
    //render: (text) => <a>{text}</a>,
  },
  {
    title: 'Total Gross Amt',
    dataIndex: 'totGrossAmt',
    key: 'totGrossAmt',
  },
  {
    title: 'Total DisCount Amt',
    dataIndex: 'totDisCountAmt',
    key: 'totDisCountAmt',
  },
  {
    title: 'Total CGST Amt',
    dataIndex: 'totCGSTAmt',
    key: 'totCGSTAmt',
  },
  {
    title: 'Total SGST Amt',
    dataIndex: 'totSGSTAmt',
    key: 'totSGSTAmt',
  },
  {
    title: 'Total NetAmt',
    dataIndex: 'totNetAmt',
    key: 'totNetAmt',
  },
  {
    title: 'Total Actual PayAmt',
    dataIndex: 'totActualPayAmt',
    key: 'totActualPayAmt',
  },

];

const onCloseViewBooking = () => {
  setOpenViewBooking(false);
};
const onOpenViewBooking = () => {
  setOpenViewBooking(true)
}

const onCloseViewCandidate = () => {
  setOpenViewCandidate(false);
};
const onCloseViewInstitute = () => {
  setOpenViewInstitute(false);
};
const onOpenViewCandidate = () => {
  setOpenViewCandidate(true)
}

const onView = async (record: any) => {


  const params = {
    "candidateID": record,
    "uniqueNo": "",
    "emailID": "",
    "mobileNo": "",
    "dob": "",
    "panNo": "",
    "aadhaarNo": "",
    "genderID": "-1",
    "stateID": "-1",
    "districtID": "-1",
    "cityID": "-1",
    "areaID": "-1",
    "searchText": "",
    "userID": "-1",
    "formID": "-1",
    "type": "1"
  }

  const msg = await requestGetCandidateList(params);

console.log(msg.data[0])

  setSelectedRows(msg.data[0])
  setOpenViewCandidate(true);
};


const onViewInstitute = async (record: any) => {
console.log(record);

  const params = {
    instituteID: record,
    searchText: "",
    mobileNo: "",
    emailID: "",
    phoneNo: "",
    stateID: "-1",
    districtID: "-1",
    cityID: "-1",
    areaID: "-1",
    smallerESTDDate: new Date(),
    smallerThanRank: "0",
    greatorThanFaculty: "0",
    greatorThanStudent: "0",
    roomTypeID: "-1",
    roomCapacityfrom: "0",
    roomCapacityTo: "0",
    roomRateFrom: "0",
    roomRateTo: "0",
    userID: "-1",
    formID: "-1",
    type:"1",
    
  }

  const msg = await requestGetInstituteList(params);

console.log(msg.data.institutelist2s[0])


// localStorage.setItem('instituteId', JSON.stringify(msg.data.institutelist2s[0].instituteID));
// setTimeout(() => {
//   history.push("../booking/institute-details", "item");
// }, 100)
    setSelectedRows(msg.data.institutelist2s[0])
    setOpenViewInstitute(true);
};

const onViewBooking = async (record: any) => {
  console.log(record);
  
    const params = {
       
      "fromDate": record.payDate,
      "toDate": record.payDate,
      "instituteID": "-1",
      "finYearID": "-1",
      "roomTypeID": "-1",
      "rateTypeID": "-1",
      "userID": "-1",
      "formID": "-1",
      "type": "1",
      
    }
    const msg = await requestGetBookingReport(params);
    
      console.log(msg.data.bookBill)
  setList(msg.data.bookBill)  
      //setSelectedRows(msg.data.bookBill)
     // setOpenViewBooking(true);
  };
  // localStorage.setItem('instituteId', JSON.stringify(msg.data.institutelist2s[0].instituteID));
  // setTimeout(() => {
  //   history.push("../booking/institute-details", "item");
  // }, 100)
     
// const onCloseEditInstitute = () => {
//   setOpenEditInstitute(false);
// };





  return (
    <PageContainer>
              <div style={contentStyle}>
              <Row gutter={16}>
               
                                        <Col span={8}>
                                        <Form.Item
                                           name="instituteID"
                                           label="Institute"
                                           rules={[{ required: true, message: 'Please enter institute' }]}
                                        >
                                <Select style={{width:'90%'}}
                                    showSearch
                                    placeholder="Institute"
                                    optionFilterProp="children"
                                    options={InstituteId}
                                />
                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="FinancialYear :"
                                                label="Financial Year"
                                                rules={[{ required: true, message: 'Search By finantial Year' }]}
                                            >
                                                <Input placeholder="Please enter finantial Year" style={{width:'90%'}}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="FromDate :"
                                                label="FromDate"
                                                rules={[{ required: true, message: 'Enter from date' }]}
                                                >
                                                 <DatePicker  onChange={onChange} style={{width:'90%'}} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="ToDate :"
                                                label="To Date"
                                                rules={[{ required: true, message: 'Enter To date' }]}
                                                >
                                                 <DatePicker  onChange={onChange} style={{width:'90%'}} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                            <Form.Item
                                name="rateTypeID"
                                label="Rate Type"
                                rules={[{ required: true, message: 'Please enter Rate Type' }]} >
                                <Select style={{width:'90%'}}
                                    placeholder="Rate Type"
                                    optionFilterProp="children"
                                    options={rateType}
                                />
                            </Form.Item>
                        </Col>
                                          <Col span={8}>
                            <Form.Item
                                name="roomTypeID"
                                label="Room Type"
                                rules={[{ required: true, message: 'Please enter Room Type' }]} >
                                <Select style={{width:'90%'}}
                                    placeholder="Room Type"
                                    optionFilterProp="children"
                                    options={roomType}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{textAlign:'center',width:'100%'}}>
                        <Button type="primary" htmlType="button" style={{margin:'5px'}} onClick={getBookingDetail}>
                            Search
                        </Button>
                        <Button type="primary" htmlType="reset" style={{margin:'5px'}}>
                            Reset
                        </Button>
                        <Button type="primary" htmlType="button" style={{margin:'5px'}}>
                            Print
                        </Button>
                        </Col>
                                        
                                        </Row>

                                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                     
                    <Col className="gutter-row" span={24} style={{marginTop:'10px'}}>
                        <Table columns={columns1} dataSource={list_totBookDate} />
                    </Col>
                    
                                   
     </Row>

     <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={24} style={{marginTop:'10px'}}>
                        <Table columns={columns1} dataSource={list_bookDate} />
                    </Col>

                    {list_bookDate && list_bookDate.map((item: any, index: number) => {
            return (
              <>
                <Collapse 
                  size="large"
                  defaultActiveKey={['room_0']}
                 // onChange={ onViewBooking(item.payDate)}
                  items={[{
                    key: `room_${index}`,
                    label: <>
                      <Space.Compact block >
                      {/* <Table columns={columns1}  style={{overflow:'auto',background:'white'}}/> */}
                        {/* <Table>
                        <tr>
                            <th>payDate</th>
                            <th>totDisCountAmt</th>
                            <th>totCGSTAmt</th>
                            <th>totSGSTAmt</th>
                            <th>totNetAmt</th>
                            <th>receiptNo</th>
                            <th>totActualPayAmt</th>
                </tr>

                        </Table> */}
                       
    <table style={{backgroundColor:"white"}}>
                        <tr style={{padding:"10px"}}>
                            <th style={{padding:"10px"}}>payDate</th>
                            <th style={{padding:"10px"}} >totDisCountAmt</th>
                            <th style={{padding:"10px"}}>totCGSTAmt</th>
                            <th style={{padding:"10px"}} >totSGSTAmt</th>
                            <th style={{padding:"10px"}}>totNetAmt</th>
                            <th style={{padding:"10px"}} >receiptNo</th>
                            <th style={{padding:"10px"}}>totActualPayAmt</th>
                </tr>
                <tr>
                            <td>{item.payDate}</td>
                            <td>{item.totGrossAmt}</td>
                            <td>{item.totDisCountAmt}</td>
                            <td>{item.totCGSTAmt}</td>
                            <td>{item.totSGSTAmt}</td>
                            <td>{item.totNetAmt}</td>
                            <td>{item.receiptNo}</td>
                            <td>{item.totActualPayAmt}</td>
                        </tr>
                        </table>
  
   {/* <Row style={{backgroundColor:"white"}}>
      <Col style={{padding:"10"}} span={6}>col-6</Col>
      <Col style={{margin:"10"}} span={6}>col-6</Col>
      <Col span={6}>col-6</Col>
      <Col span={6}>col-6</Col>
    </Row> */}
                        {/* <div style={{ width: '70%' }} >
                          <h3 >    {`${  moment(item?.payDate).format("DD-MMM-YYYY")} Total NetAmt  (${item?.totNetAmt})`} </h3>
                        </div>
                        <div style={{ width: '30%' }} >
                          <h4 style={{ float: 'right' }}>{`Price: ${item?.totActualPayAmt} INR`}</h4>
                        </div> */}
                      </Space.Compact>
                    </>,
                    children:
                     
                        <Table columns={columns} dataSource={item?.lstBookingbillListReport} style={{overflow:'auto',background:'white'}}/>
                        
                     
                  }]}
                />
              </>
            )
          })}

          
                         {/* <table>
                <tr>
                            <th>payDate</th>
                            <th>totDisCountAmt</th>
                            <th>totCGSTAmt</th>
                            <th>totSGSTAmt</th>
                            <th>totNetAmt</th>
                            <th>receiptNo</th>
                            <th>totActualPayAmt</th>
                </tr>
                {list.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{val.payDate}</td>
                            <td>{val.totGrossAmt}</td>
                            <td>{val.totDisCountAmt}</td>
                            <td>{val.totCGSTAmt}</td>
                            <td>{val.totSGSTAmt}</td>
                            <td>{val.totNetAmt}</td>
                            <td>{val.receiptNo}</td>
                            <td>{val.totActualPayAmt}</td>
                        </tr>
                    )
                })}
            </table> */}
            
     </Row>


              <Row >
                    {/* <Col className="gutter-row" span={24}>
                        
                    </Col> */}
                    
                                       
     </Row>

   

 

               </div>

             <ViewBookingDetails
              visible={OpenViewBooking}
              onClose={onCloseViewBooking}
              isEditable={isEditable}
              selectedRows={selectedRows}
            /> 

             <ViewCandidate
        visible={openViewCandidate}
        onClose={onCloseViewCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
      /> 

      <ViewInstitute
        visible={openViewInstitute}
        onClose={onCloseViewInstitute}
        isEditable={isEditable}
        selectedRows={selectedRows}
      />

 
{/* <EditInstitute
        visible={openEditInstitute}
        onClose={onCloseEditInstitute}
        isEditable={isEditable}
        selectedRows={selectedRows}
        onSaveSuccess={reloadTable}
      /> */}
    </PageContainer>
  );
};

export default BookingReport;

function onView(record: any): void {
  throw new Error('Function not implemented.');
}
