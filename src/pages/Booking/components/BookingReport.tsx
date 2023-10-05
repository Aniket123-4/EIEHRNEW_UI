import React, { useEffect, useRef, useState, Fragment } from 'react';

import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Modal, DatePickerProps, AutoComplete, theme, Card, List, Skeleton, Table, Tag } from 'antd';
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
import type { CollapseProps, TableProps } from 'antd';
import { Collapse } from 'antd';
import { Link, useModel, history } from '@umijs/max';
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
import "../styles/table.css";
import { ExpandableConfig, TableRowSelection } from 'antd/lib/table/interface';

const count = 3;
const { Option } = Select;
const { confirm } = Modal;

const defaultTitle = () => 'Here is title';
const defaultFooter = () => '';


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

  const [bordered, setBordered] = useState(false);
  //const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>('large');
  const [expandable, setExpandable] = useState<ExpandableConfig<DataType> | undefined>(
   
  );
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showfooter, setShowFooter] = useState(true);
  const [rowSelection, setRowSelection] = useState<TableRowSelection<DataType> | undefined>({});
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState();
  const [top, setTop] = useState<TablePaginationPosition | 'none'>('none');
  const [bottom, setBottom] = useState<TablePaginationPosition>('bottomRight');
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState<string>();

  const defaultExpandable = { expandedRowRender: (record: DataType) => <table style={{overflow:'scrl',background:'white'}}>
    <tr style={{background: '#40a9ff'}}>
                <th>candName</th>
                <th>instituteName</th>
                <th>roomName</th>
                <th>roomTypeName</th>
                <th>slotName</th>
                <th>fromDate</th>
                <th>toDate</th>
  
                <th>totGrossAmt</th>
                <th>cgstAmt</th>
                <th>sgstAmt</th>
                <th>disCountAmt</th>
                <th>totNetAmt</th>
                <th>actualPayAmt</th>
                <th>balanceAmt</th>
                <th>remark</th>
    </tr>
     {record.lstBookingbillListReport.map((val, key) => {
        return (
            <tr key={key} style={{background: '#fff'}}>
                <td> <a onClick={() => onView(val.candidateID)}> {val.candName} </a> </td>
                <td>  <a onClick={() => onViewInstitute(val.instituteID)}>{val.instituteName}</a> </td>
                <td>{val.roomName}</td>
                <td>{val.roomTypeName}</td>
                
                <td>{val.slotName}</td>
                <td>{val.fromDate}</td>
                <td>{val.toDate}</td>
  
                <td style={{textAlign:"end"}}>{val.totGrossAmt}</td>
                <td style={{textAlign:"end"}}>{val.cgstAmt}</td>
                <td style={{textAlign:"end"}}>{val.sgstAmt}</td>
                <td style={{textAlign:"end"}}>{val.disCountAmt}</td>
                
                <td style={{textAlign:"end"}}>{val.totNetAmt}</td>
                <td style={{textAlign:"end"}}>{val.actualPayAmt}</td>
                <td style={{textAlign:"end"}}>{val.balanceAmt}</td>
                <td>{val.remark}</td>
            </tr>
        )
    })} 
  </table>  };

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
    

    setRowSelection(false ? {} : undefined);
    setExpandable(defaultExpandable);
    setXScroll('scroll');
  }, [])
  const reloadTable = () => {
    actionRef.current.reload();
  }
  // const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  //   console.log(date, dateString);
  // };
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


  const institutelist = async () => {
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
      smallerESTDDate: '2023-08-16T09:53:27.751Z',
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
      type: "1",
      'token': initialState?.currentUser?.verifiedUser.token,
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
    height: 300,
  };
  const getBookingDetail = async (values: any) => {
    const { verifiedUser }: any = getUserInLocalStorage();
console.log(values);
    const params = {
      // "candidateID": verifiedUser?.userID,
 "fromDate": convertDate(values.fromDate),
      "toDate": convertDate(values.toDate),
       "instituteID": values.instituteID?values.instituteID:"-1",
       "finYearID": "-1",
       "roomTypeID": values.roomTypeID? values.roomTypeID+"":"-1",
     "rateTypeID":values.rateTypeID ? values.rateTypeID+"":"-1",
      "userID": "-1",
      "formID": "-1",
      "type": "1",
      'token': initialState?.currentUser?.verifiedUser.token,
    };
    console.log(params);
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
  const convertDate = (inputDateString: string) => {
    // Parse the input date string using Moment.js
    const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
    // Format the parsed date in the desired format
    const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    console.log(formattedDate);
    return formattedDate
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

  
  const columns1 = [
    {
      title: 'Pay Date',
      dataIndex: 'payDate',
      key: 'payDate',
      render: (_, record) => <span >{moment(record.payDate).format("DD-MMM-YYYY")}</span>,
      //render: (text) => <a>{text}</a>,
    },
    {
      title: 'Total Gross Amt',
      dataIndex: 'totGrossAmt',
      //key: 'totGrossAmt',
      align: 'right',
    },
    {
      title: 'Total DisCount Amt',
      dataIndex: 'totDisCountAmt',
     // key: 'totDisCountAmt',
      align: 'right',
    },
    {
      title: 'Total CGST Amt',
      dataIndex: 'totCGSTAmt',
     // key: 'totCGSTAmt',
      align: 'right',
    },
    {
      title: 'Total SGST Amt',
      dataIndex: 'totSGSTAmt',
     // key: 'totSGSTAmt',
      align: 'right',
    },
    {
      title: 'Total NetAmt',
      dataIndex: 'totNetAmt',
    //  key: 'totNetAmt',
      align: 'right',
    },
    {
      title: 'Total Actual PayAmt',
      dataIndex: 'totActualPayAmt',
     // key: 'totActualPayAmt',
      align: 'right',
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
      smallerESTDDate: '2023-08-16T09:53:27.751Z',
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
      type: "1",
      'token': initialState?.currentUser?.verifiedUser.token,
    }

    const msg = await requestGetInstituteList(params);

    console.log(msg.data.institutelist2s[0])

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
      'token': initialState?.currentUser?.verifiedUser.token,
    }
    const msg = await requestGetBookingReport(params);

    console.log(msg.data.bookBill)
    setList(msg.data.bookBill)
    //setSelectedRows(msg.data.bookBill)
    // setOpenViewBooking(true);
  };
  
  const handleBorderChange = (enable: boolean) => {
    setBordered(enable);
  };

  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable);
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  const handleTableLayoutChange = (e: RadioChangeEvent) => {
    setTableLayout(e.target.value);
  };

  const handleExpandChange = (enable: boolean) => {
    setExpandable(enable ? defaultExpandable : undefined);
  };

  const handleEllipsisChange = (enable: boolean) => {
    setEllipsis(enable);
  };

  const handleTitleChange = (enable: boolean) => {
    setShowTitle(enable);
  };

  const handleHeaderChange = (enable: boolean) => {
    setShowHeader(enable);
  };

  const handleFooterChange = (enable: boolean) => {
    setShowFooter(enable);
  };

  const handleRowSelectionChange = (enable: boolean) => {
    setRowSelection(enable ? {} : undefined);
  };

  const handleYScrollChange = (enable: boolean) => {
    setYScroll(enable);
  };

  const handleXScrollChange = (e: RadioChangeEvent) => {
    setXScroll(e.target.value);
  };

  const handleDataChange = (newHasData: boolean) => {
    setHasData(newHasData);
  };

  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = '100vw';
  }

  const tableColumns = columns1.map((item) => ({ ...item, ellipsis }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }

  const tableProps: TableProps<DataType> = {
    bordered,
    loading,
    size,
    expandable,
    title: showTitle ? defaultTitle : undefined,
    showHeader,
    footer: showfooter ? defaultFooter : undefined,
    rowSelection,
    scroll,
    tableLayout,
  };

  return (
    <PageContainer>
     
      <div style={contentStyle}>
        <Card>
          <Form 
          onFinish={async (values) => {
            getBookingDetail(values)
        }}
          >
        <Row gutter={16}>

          
          {/* <Col span={8}>
            <Form.Item
              name="FinancialYear :"
              label="Financial Year"
              rules={[{ required: true, message: 'Search By finantial Year' }]}
            >
              <Input placeholder="Please enter finantial Year" style={{ width: '90%' }} />
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item
              name="fromDate"
              label="FromDate"
              rules={[{ required: true, message: 'Enter from date' }]}
            >
              <DatePicker   format={'DD-MMM-YYYY'}
                                                getPopupContainer={(trigger) => trigger.parentElement!} style={{ width: '90%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="toDate"
              label="To Date"
              rules={[{ required: true, message: 'Enter To date' }]}
            >
              <DatePicker   format={'DD-MMM-YYYY'}
                                                getPopupContainer={(trigger) => trigger.parentElement!} style={{ width: '90%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="instituteID"
              label="Institute"
              rules={[{  message: 'Please enter institute' }]}
            >
              <Select style={{ width: '90%' }}
                showSearch
                placeholder="Institute"
                optionFilterProp="children"
                options={InstituteId}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="rateTypeID"
              label="Rate Type"
              rules={[{  message: 'Please enter Rate Type' }]} >
              <Select style={{ width: '90%' }}
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
              rules={[{ message: 'Please enter Room Type' }]} >
              <Select style={{ width: '90%' }}
                placeholder="Room Type"
                optionFilterProp="children"
                options={roomType}
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: 'center', width: '100%' }}>
          
            <Button type="primary" htmlType="submit" style={{ margin: '5px' }}>
              Search
            </Button>
            <Button type="primary" htmlType="reset" style={{ margin: '5px' }}>
              Reset
            </Button>
            <Button type="primary" htmlType="button" style={{ margin: '5px' }}>
              Print
            </Button>
          </Col>

        </Row>
        </Form>
        </Card>
        <Card>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>

          <Col className="gutter-row" span={24} style={{ marginTop: '10px' }}>
            <Table columns={columns1} dataSource={list_totBookDate} pagination={false} />
          </Col>


        </Row>
        </Card>
        {/* <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={24} style={{ marginTop: '10px' }}>
            <Table columns={columns1} dataSource={list_bookDate} />
          </Col>
          </Row> */}



       {list_bookDate.length>0? <Card> <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        
           <Table
        {...tableProps}
        pagination={{ position: [top as TablePaginationPosition, bottom] }}
        columns={columns1}
        dataSource={hasData ? list_bookDate : []}
        //scroll={scroll}
      />

        </Row></Card> : <Row></Row>}





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
