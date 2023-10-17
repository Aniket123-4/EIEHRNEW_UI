import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, DatePicker, Dropdown, Form, Input, List, Affix, Row, Select, Slider, Space, Radio, Typography, message } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useRequest } from 'umi';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from '@umijs/max';
import type { ListItemDataType } from './data';
import { queryFakeList } from './service';
import { requestGetCity, requestGetDistrict, requestGetRoomType, requestGetState } from '@/services/apiRequest/dropdowns';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { getAvailableRoomDate, getUserInLocalStorage, setAvailableRoomDate } from '@/utils/common';
import { PageContainer, ProSkeleton } from '@ant-design/pro-components';
import { SliderMarks } from 'antd/es/slider';
import FormDateAndSlotFilter from '@/components/FormDateAndSlotFilter';
import { convertDate } from '@/utils/helper';
import moment from 'moment';

// import styles from './style.less';

const { Option } = Select;
const { Text, Link } = Typography;

export function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const CardInfo: React.FC<{
  activeUser: React.ReactNode;
  newUser: React.ReactNode;
  contact: React.ReactNode;
}> = ({ activeUser, newUser, contact }) => (
  <div className='cardInfo'>
    <div>
      <p>{activeUser}</p>
    </div>
    <div>
      <p>{contact}</p>
      <p>{newUser}</p>
    </div>
  </div>
);

export const Applications: FC<Record<string, any>> = () => {

  const [state, setState] = useState<any>([])
  const [district, setDistrict] = useState<any>([])
  const [city, setCity] = useState<any>([])

  const [roomType, setRoomType] = useState<any>([])
  const [roomTypeId, setRoomTypeId] = useState<string>("-1")
  const [roomCapacityTo, setRoomCapacityTo] = useState<string>("1000")
  const [roomCapacityfrom, setRoomCapacityFrom] = useState<string>("0")
  const [roomRateFrom, setRoomRateFrom] = useState<string>("0")
  const [roomRateTo, setRoomRateTo] = useState<string>("5000")
  const [searchText, setSearchText] = useState<string>("")
  const [instituteList, setInstituteList] = useState<any>([])
  const data = getUserInLocalStorage();
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState<boolean>(false)
  const [dateAndSlotVal, setDateAndSlotVal] = useState<any>({})
  const [bookingFromDate, setBookingFromDate] = useState<any>(moment())
  const [bookingToDate, setBookingToDate] = useState<any>(moment())
  const [selectedSlot, setSelectedSlot] = useState<any>(-1)


  // const list = data?.list || [];
  var list: ListItemDataType[] | undefined = [];

  useEffect(() => {
    getRoomType();
  }, [])

  useEffect(() => {
    const dateFilter = getAvailableRoomDate();
    if (dateFilter === null) {
      const data: any = {
        fromDate: convertDate(bookingFromDate),
        toDate: convertDate(bookingFromDate),
        slotId: selectedSlot
      }
      setAvailableRoomDate(data);
    } else {
      let fromDate = moment(dateFilter?.fromDate)
      setBookingFromDate(fromDate)
      let toDate = moment(dateFilter?.toDate)
      console.log({ fromDate, toDate })
      setBookingToDate(toDate)
      setSelectedSlot(dateFilter?.slotId)
    }
  }, [])


  useEffect(() => {
    if (dateAndSlotVal) {
      getInstituteList({ searchText: "", roomTypeID: "-1", roomRateTo: "0", roomRateFrom: "0", roomCapacityTo: "0", roomCapacityfrom: "0", dateAndSlotVal });
    }
  }, [dateAndSlotVal])
  const getState = async () => {
    const res = await requestGetState();
    if (res.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return { value: item.stateID, label: item.stateName }
      })
      console.log({ dataMaskForDropdown })
      setState(dataMaskForDropdown)
    }
  }
  const getCity = async (value: any, item: any) => {
    const res = await requestGetCity(item);
    if (res.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return { value: item.cityID, label: item.cityName }
      });
      setCity(dataMaskForDropdown);
    }
  }
  const getDistrict = async (value: any, item: any) => {
    const res = await requestGetDistrict(item);
    if (res.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return { value: item.districtID, label: item.districtName }
      })
      setDistrict(dataMaskForDropdown)
    }
  }

  const { RangePicker } = DatePicker;
  const dateFormat = 'DD/MMM/YYYY';
  const getRoomType = async () => {
    const res = await requestGetRoomType({});
    if (res?.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return ({ label: item.roomTypeName, value: item.roomTypeID })
      })
      setRoomType(dataMaskForDropdown)
    }
  }
  const getInstituteList = async ({ searchText,roomTypeID, roomRateTo, roomRateFrom, roomCapacityTo, roomCapacityfrom, dateAndSlotVal }: any) => {
    try {
      const params = {
        instituteID: "-1",
        searchText: searchText,
        mobileNo: "",
        emailID: "",
        phoneNo: "",
        stateID: "-1",
        districtID: "-1",
        cityID: "-1",
        areaID: "-1",
        smallerESTDDate: '1900-01-01',
        smallerThanRank: "",
        greatorThanFaculty: "",
        greatorThanStudent: "",
        roomTypeID: roomTypeID,
        roomCapacityfrom: roomCapacityfrom,
        roomCapacityTo: roomCapacityTo,
        roomRateFrom: roomRateFrom,
        roomRateTo: roomRateTo,
        userID: data?.verifiedUser?.userID,
        formID: "-1",
        type: "1",
        slotID: selectedSlot,
        fromDate: convertDate(moment()),
        toDate: convertDate(moment()),
        ...dateAndSlotVal
      }
      setLoading(true)
      const msg = await requestGetInstituteList(params);
      if (msg.isSuccess === true) {
        setLoading(false)
        setInstituteList(msg.data.institutelist2s)
        list = msg?.data.institutelist2s || [];
      }
    } catch (error) {
      console.log({ error });
      message.error('please try again');
      setLoading(false)
    }
  };



  const onChange = (value: number | [number, number]) => {
    console.log('onChange: ', value);
  };
  const getInstituteList1 = (value: any) => {
    console.log({ searchText });
    getInstituteList({ roomRateFrom: roomRateFrom, roomRateTo: roomRateFrom, searchText: value, roomTypeID: roomTypeId, roomCapacityTo: roomCapacityTo, roomCapacityfrom: roomCapacityfrom, dateAndSlotVal: dateAndSlotVal });
  };

  const onRoomRateChange = (value: string | [number, number]) => {
    console.log('onAfterChange: ', value[0]);
    setRoomRateFrom(value[0].toString())
    setRoomRateTo(value[1].toString())
    getInstituteList({ roomRateFrom: value[0].toString(), roomRateTo: value[1].toString(), searchText: searchText, roomTypeID: roomTypeId, roomCapacityTo: roomCapacityTo, roomCapacityfrom: roomCapacityfrom, dateAndSlotVal: dateAndSlotVal });
  };
  const onRoomCapacityChange = (value: any | [number, number]) => {
    console.log('onAfterChange: ', value[0]);
    setRoomCapacityFrom(value[0].toString())
    setRoomCapacityTo(value[1].toString())
    getInstituteList({ roomCapacityfrom: value[0].toString(), roomCapacityTo: value[1].toString(), roomRateFrom: roomRateFrom, roomRateTo: roomRateTo, searchText: searchText, roomTypeID: roomTypeId, dateAndSlotVal: dateAndSlotVal });
  };
  const onTextChange = (value: any) => {
    console.log({value:value.target.value})
    setSearchText(value.target.value)
    getInstituteList1(value.target.value)
  };
  const selectRoomType = (value: string) => {
    setRoomTypeId(value.toString())
    getInstituteList({ roomCapacityfrom: roomCapacityfrom, roomCapacityTo: roomCapacityTo, roomRateFrom: roomRateFrom, roomRateTo: roomRateTo, searchText: searchText, roomTypeID: value.toString(), dateAndSlotVal: dateAndSlotVal });

  };
  const getDetails = (item: any) => {
    let path = "";
    if (data?.verifiedUser?.userTypeID === "11") {
      path = "booking";
    } else {
      path = "institute";
    }
    history.push(`/${path}/institute-details/${item.instituteID}`);
  };
  const marks: SliderMarks = {
    10: { label: <strong>{'10'}</strong>, },
    1000: {
      style: {
        color: '#000',
      },
      label: <strong>{'5000'}</strong>,
    },
  };
  const marksRoomRate: SliderMarks = {
    100: { label: <strong>{"100"}</strong>, },
    5000: {
      style: {
        color: '#000',
      },
      label: <strong>{"5000"}</strong>,
    },
  };

  const leftFilter = () => {

    return (
      <Card bordered={true} style={{ marginTop: 15 }}>
        <Form
          onFinish={getInstituteList1}
          onValuesChange={(_, values) => {
            // run(values);
          }}
        >
          <Col >
            <h4>Room Rate</h4>
            <Slider marks={marksRoomRate} onChange={onChange} onAfterChange={onRoomRateChange} min={100} max={5000} range={{ draggableTrack: true }} defaultValue={[100, 350]} />
            <h4>Room Capacity</h4>
            <Slider marks={marks} onAfterChange={onRoomCapacityChange} min={1} max={1000} range={{ draggableTrack: true }} defaultValue={[0, 300]} />
            <h4>Room Type</h4>
            {roomTypeFilter()}
          </Col>
        </Form>
      </Card>
    )
  }


  const onChangeRoomType = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
    selectRoomType(e.target.value);
  };

  const roomTypeFilter = () => {
    return (
      <Radio.Group onChange={onChangeRoomType} value={value}>
        {/* item.roomTypeName, value: item.roomTypeID  */}
        <Space direction="vertical">
          {roomType.map((item: any) => {
            return (
              <Radio value={item?.value}>{item?.label}</Radio>
            )
          })}
        </Space>
      </Radio.Group>
    )
  }

  const instList = () => {
    return (
      <List
        className="demo-loadmore-list"
        size="large"
        dataSource={instituteList}
        itemLayout="horizontal"
        renderItem={(item: any) => (
          <List.Item>
            <Card
              onClick={() => getDetails(item)}
              style={{ width: "100%" }}
              hoverable
              bodyStyle={{ paddingBottom: 10, width: "100%" }}
            >
              <Card.Meta avatar={
                <Avatar size="small" src={"item.avatar"} />} title={item?.instituteName} />
              <div className='cardItemContent'>
                <CardInfo
                  activeUser={`#InstituteID : ${item?.instituteID}`}
                  newUser={`Institute Address : ${item?.instituteAddress}`}
                  contact={`Contact : ${item?.mobileNo}`}
                />
                <Link href={item?.website} target={item?.website}>
                  {item?.website}
                </Link>
              </div>
            </Card>
          </List.Item>
        )}
      />
    )
  }

  const search = () => {
    return (
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginRight: 20 }}>

        <Card size="small">
          <Space.Compact block>
            <Input
              style={{}}
              size='large'
              placeholder="Search your institute here...."
              onChange={onTextChange}
            />
            <Button style={{ width: 100 }} size='large' type="primary" htmlType="submit" shape="default" icon={<SearchOutlined />} />
          </Space.Compact>
        </Card>
        <FormDateAndSlotFilter
          bookingToDate={bookingToDate}
          bookingFromDate={bookingFromDate}
          selectedSlot={selectedSlot}
          onSubmit={(data: any) => {
            setDateAndSlotVal(data)
          }}
        />
      </Space>
    )
  }

  const loadingView = () => {
    return (
      <>
        <div
          style={{
            padding: 24,
          }}
        >
          <ProSkeleton type="list" />
        </div>
      </>
    )
  }

  return (
    <PageContainer
      header={{
        title: ``,
      }}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {search()}

        <Row>
          <Col span={6}>
            <Affix offsetTop={70}>
              {leftFilter()}
            </Affix>
          </Col>
          <Col span={18}>
            {loading ? loadingView() : instList()}
          </Col>
        </Row>
      </Space>
    </PageContainer>
  );
};

export default Applications;
