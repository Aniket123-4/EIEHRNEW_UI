import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet, useSearchParams, useParams } from '@umijs/max';
import '../styles/addRoom.css';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Result, Card } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { requestAddBooking, requestGetBookingOrderHistory } from '../services/api';
import moment from 'moment';
import { getUserInLocalStorage } from '@/utils/common';

const { Option } = Select;


const BookingOrderDetails = () => {
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(true)
  const [roomBooking, setRoomBooking] = useState<any>();
  const [isBookingDone, setIsBookingDone] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
    getBookingHistory();
  }, [])


  const getBookingHistory = async () => {
    const { verifiedUser }: any = getUserInLocalStorage();
    const params = {
      "candidateID": verifiedUser?.userID,
      "bookingBillID": id,
      "roomID": "-1",
      "seatID": 0,
      "slotID": 0,
      "rateTypeID": 0,
      "fromDate": moment(),
      "toDate": moment(),
      "userID": "-1",
      "formID": 0,
      "type": 2
    };
    const res = await requestGetBookingOrderHistory(params);
    console.log(res);
    setLoading(false);
    if (res.isSuccess) {
      setRoomBooking(res.result);
    }

  }

  const booingDetails = () => {
    return (
      <>
        {
          roomBooking &&
          <ProDescriptions
            dataSource={roomBooking}
            bordered={true}
            size={'small'}
            title="Order Details"
            columns={[
              {
                title: 'Institute Name',
                dataIndex: 'instituteName',
                span: 3
              },
              {
                title: 'Room Name',
                dataIndex: 'roomName',
                span: 3
              },
              {
                title: 'Room Type',
                dataIndex: 'roomTypeName',
                span: 3
              },
              {
                title: 'Slot Name',
                dataIndex: 'slotName',
                span: 3
              },
              {
                title: 'From Date',
                key: 'fromDate',
                dataIndex: 'fromDate',
                valueType: 'date',
                span: 3,
                fieldProps: {
                  format: 'DD-MM-YYYY',
                },
              },
              {
                title: 'To Date',
                key: 'toDate',
                span: 3,
                dataIndex: 'toDate',
                valueType: 'date',
                fieldProps: {
                  format: 'DD-MM-YYYY',
                },
              }
            ]}
          />
        }
      </>
    )
  }


  const booingOrderDetails = () => {
    return (
      <>
        {
          roomBooking &&
          <ProDescriptions
            dataSource={roomBooking}
            bordered={true}
            size={'small'}
            title="Order Summary"
            columns={[
              {
                title: 'Rate Type Name',
                dataIndex: 'rateTypeName',
                span: 3
              },
              {
                title: 'Gross Amount',
                dataIndex: 'totGrossAmt',
                span: 3
              }, {
                title: 'Discount',
                dataIndex: 'disCountAmt',
                span: 3
              },
              {
                title: 'SGST',
                dataIndex: 'sgstAmt',
                span: 3
              },
              {
                title: 'CGST',
                dataIndex: 'cgstAmt',
                span: 3
              }, {
                title: 'Net Amount',
                dataIndex: 'totNetAmt',
                span: 3
              },
            ]}
          />
        }
      </>
    )
  }

  const bookingSuccessView = () => {
    return (
      <>
        <Result
          status="success"
          title="Successfully Seat Booked"
          subTitle={`Order Number: ${bookingSuccess?.bookingBillID} ${bookingSuccess?.msg}`}
          extra={[
            <Button type="primary" key="console" onClick={() => {
              history.push('/');
            }}>
              Go to Home
            </Button>,
          ]}
        />
      </>
    )
  }

  return (
    <>
      <Row justify="space-around">
        <Col span={12}>
          <Card>
            {booingDetails()}
          </Card>
        </Col>
        <Col span={11}>
          <Card>
            {booingOrderDetails()}
          </Card>

        </Col>
      </Row>
    </>
  );
};

export default BookingOrderDetails;