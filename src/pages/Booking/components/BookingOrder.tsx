import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton, Card, Select, Space, Form, Input, Row, Col, Typography } from 'antd';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { requestGetBookingOrderHistory } from '../services/api';
import moment from 'moment';
import { getUserInLocalStorage } from '@/utils/common';

const count = 3;
const { Option } = Select;
const { Title } = Typography;

const BookingOrder: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useModel('@@initialState');


  useEffect(() => {
    getBookingHistory();
  }, []);


  const getBookingHistory = async () => {
    const { verifiedUser }: any = getUserInLocalStorage();
    const params = {
      "candidateID": verifiedUser?.userID,
      "bookingBillID": "-1",
      "roomID": "-1",
      "seatID": 0,
      "slotID": 0,
      "rateTypeID": 0,
      "fromDate": moment(),
      "toDate": moment(),
      "userID": "-1",
      "formID": 0,
      "type": 1
    };
    const res = await requestGetBookingOrderHistory(params);
    console.log(res);
    setInitLoading(false);
    if (res.isSuccess) {
      setData(res.result);
      setList(res.result);
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
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        setData(newData);
        setList(newData);
        setLoading(false);
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;



  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };


  const filter = () => {
    return (
      <>
        <Card style={{ marginBottom: 20 }}>
          <Form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            layout="vertical"
            style={{}}
          >
            <Space size={'middle'}>
              <Form.Item name="gender" label="Booking" rules={[{ required: false }]}>
                <Select
                  placeholder="Select Booking Status"
                  onChange={onGenderChange}
                  allowClear
                >
                  <Option value="male">Upcoming</Option>
                  <Option value="female">Cancalled</Option>
                  <Option value="other">Previous</Option>
                </Select>
              </Form.Item>
              <Form.Item name="note" label="Booking Id" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
            </Space>
          </Form>
        </Card>
      </>
    )
  }

  return (
    <PageContainer
    header={{
      title: ``,
    }}
      // header={{
      //   title: 'Booking History',
      //   breadcrumb: {
      //     items: [

      //     ],
      //   },
      // }}
      // content="You can see all the booking history here"
      // extra={[
      //   <Button key="3">Operation</Button>,
      //   <Button key="2">Operation</Button>,
      // ]}
     
    >
      {/* {filter()} */}
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <Card 
          style={{ marginBottom: 15 }}
          hoverable
          onClick={() => {
            history.push("/booking/booking-order-details/"+item?.bookingBillID);
          }}
          >
            <List.Item
              actions={[
                <Link to="/booking/booking-order-details">  <Title level={5}>{item?.totNetAmt} Rs.</Title></Link>
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<Title level={5}>{item?.instituteName}</Title>}
                  description={
                    <>
                      <label>{`Room: ${item?.roomName} Seat: ${item?.seatID} [${item?.roomTypeName}]`}</label>
                      <br />
                      <label>Booking:{moment(item?.entryDate).format("DD-MMM-YYYY")}</label>
                      <br />
                      <label>From: {moment(item?.fromDate).format("DD-MMM-YYYY")} To: {moment(item?.toDate).format("DD-MMM-YYYY")}</label>
                    </>
                  }
                />
              </Skeleton>
            </List.Item>
          </Card>
        )}
      />
    </PageContainer>
  );
};

export default BookingOrder;