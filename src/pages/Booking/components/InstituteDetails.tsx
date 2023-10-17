import React, { FC, useEffect, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel, useParams } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Image, Drawer, Form, Input, Row, Typography, message, Carousel, Card, Skeleton, Collapse, Space, DatePicker, Select } from 'antd';
import { requestGetBookingDetails, requestGetInstituteDetail } from '../services/api';
import { ProDescriptions } from '@ant-design/pro-components';
import moment from 'moment';
import AddRoom from '@/pages/Room/components/AddRoom';
import { ConsoleSqlOutlined, DotChartOutlined, PlusOutlined } from '@ant-design/icons';
import { requestGetSlot } from '@/services/apiRequest/dropdowns';
import { getAvailableRoomDate, getUserInLocalStorage, getUserType, setAvailableRoomDate } from '@/utils/common';
const { Title, Text, Link } = Typography;
import { ReactPhotoCollage } from "react-photo-collage";
import FormDateAndSlotFilter from '@/components/FormDateAndSlotFilter';
import { convertDate } from '@/utils/helper';

const dateFormat = 'YYYY-MM-DD';

const setting = {
  width: '1024px',
  height: ['250px', '170px'],
  layout: [1, 4],
  photos: [],
  showNumOfRemainingPhotos: true
};


const InstituteDetails: FC = (props: any) => {
  const userType = getUserType()
  const [loading, setLoading] = useState(false)
  const [instituteData, setInstituteData] = useState<any>([])

  const [detailsPageComesFrom, setDetailsPageComesFrom] = useState<any>("")

  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [openAddRoom, setOpenAddRoom] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [slots, setSlots] = useState<any>([])
  const [instGallery, setInstGallery] = useState<any>(setting);

  const [bookingFromDate, setBookingFromDate] = useState<any>(moment())
  const [bookingToDate, setBookingToDate] = useState<any>(moment())
  const [selectedSlot, setSelectedSlot] = useState<any>("-1")
  const [dateAndSlotVal, setDateAndSlotVal] = useState<any>({})


  const [form] = Form.useForm();
  const { id } = useParams();

  useEffect(() => {
    const dateFilter = getAvailableRoomDate();
    if (dateFilter === null) {
      const data: any = {
        fromDate: convertDate(bookingFromDate),
        toDate: convertDate(bookingFromDate),
        slotId: selectedSlot
      }
      console.log({data:data})
      setAvailableRoomDate(data);
      getDetails(data?.fromDate, data?.toDate, data?.slotId);
    } else {
      let fromDate = moment(dateFilter?.fromDate)
      setBookingFromDate(fromDate)
      let toDate = moment(dateFilter?.toDate)
      setBookingToDate(toDate)
      setSelectedSlot(dateFilter?.slotId)
      getDetails(fromDate, toDate, dateFilter?.slotId);
    }
  }, [])

  useEffect(() => {
    const detailsPageComesFrom = history.location.pathname.split('/')[1];
    setDetailsPageComesFrom(detailsPageComesFrom)
  }, [])

  const getDetails = async (fromDate: any, toDate: any, slotId: any) => {
    const instituteID: any = localStorage.getItem('instituteId');
    try {
      const values = {
        "instituteID": instituteID ? JSON.parse(instituteID) : id,
        "roomID": "-1",
        "userID": "-1",
        "formID": "-1",
        "type": "1",
        "fromdate": fromDate,
        "todate": toDate,
        "slotID": slotId,
      };

      setLoading(true)
      const response = await requestGetInstituteDetail({ ...values });
      setLoading(false)
      if (response.isSuccess) {
        localStorage.removeItem("bookingData")
        setInstituteData(response.result);
        const img = response.result?.lstInstittueImageRespDTO?.map((item: any, index: number) => {
          return (
            { source: item.instituteImage }
          )
        })
        const photos = { ...instGallery };
        photos['photos'] = img;
        console.log(photos);
        setInstGallery(photos);
        return;
      }
    } catch (error) {
      setLoading(false)
      console.log({ error });
      message.error('Please try again');
    }
  };

  const onSubmitBooking = (roomData: any, seatData: any) => {
    getBookingDetails(roomData, seatData);
  }

  const addRoom = () => {
    setSelectedRows(instituteData);
    setIsEditable(false)
    setOpenAddRoom(true);
  };

  const onCloseAddRoom = () => {
    setOpenAddRoom(false);
  };

  const onCloseEditRoom = () => {
    setOpenEditRoom(false);
  };

  const getBookingDetails = async (roomData: any, seatData: any) => {
    const { verifiedUser }: any = getUserInLocalStorage();
    

    const params = {
      candidateID: verifiedUser?.userID,
      bookingBillID: '-1',
      roomID: roomData?.roomID,
      seatID: seatData?.seatID,
      slotID: seatData?.slotID,
      rateTypeID: roomData?.lstRoomRateLinkRespDTO[0]?.rateTypeID,
      fromDate:  moment(bookingFromDate).format("YYYY-MM-DD"),
      toDate: moment(bookingToDate).format("YYYY-MM-DD"),
      userID: verifiedUser?.userID,
      formID: -1,
      type: 2
    };
    const res = await requestGetBookingDetails(params);
    console.log(res)
    localStorage.setItem('bookingData', JSON.stringify(res?.result));
    setTimeout(() => {
      history.push("/booking/room-booking");
    }, 100)
  }

  const carousel = () => {
    return (
      <>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
          <Space align="center" size={24}>
            <ReactPhotoCollage {...instGallery} />
          </Space>

        </div>
      </>
    )
  }

  const viewRoom = () => {
    const { lstInstituteRoomRespDTO }: any = instituteData;

    return (
      <>
        <>
          {lstInstituteRoomRespDTO && lstInstituteRoomRespDTO.map((room: any, index: number) => {
            return (
              <>
                <Collapse
                  size="large"
                  defaultActiveKey={['room_0']}
                  items={[{
                    key: `room_${index}`,
                    label: <>
                      <Space.Compact block>
                        <div style={{ width: '70%' }} >
                          <h3>{`${room?.roomName} (${room?.roomTypeName})`}</h3>
                        </div>
                        <div style={{ width: '30%' }} >
                          <h4 style={{ float: 'right' }}>{`Price: ${room?.lstRoomRateLinkRespDTO[0]?.rate} INR`}</h4>
                        </div>
                      </Space.Compact>
                    </>,
                    children:
                      <Row gutter={[16, 16]}>
                        {room?.lstRoomSeatRespDTO && room?.lstRoomSeatRespDTO?.map((seat: any, indexSeat: number) => {
                          return (
                            <>
                              <Col span={4} >
                                <Card style={{ background: seat?.isFree ? '#ffffff' : "#d2d2d2" }}>
                                  <h4>{`Seat ${seat?.seatID}`}</h4>
                                  <h5>{`${seat?.commonName}`}</h5>
                                  {(userType!="Admin")&&<Button
                                    size='small'
                                    type="primary"
                                    disabled={seat?.isFree ? false : true}
                                    onClick={() => {
                                      onSubmitBooking(room, seat)
                                    }}
                                  >
                                    {seat?.isFree ? "book" : "booked"}
                                  </Button>}
                                  {(userType==="Admin")&&<Typography  
                                    disabled={seat?.isFree ? false : true}
                                  >
                                    {!seat?.isFree&&"booked"}
                                  </Typography>
                                  }
                                </Card>
                              </Col>
                            </>
                          )
                        })}
                      </Row>
                  }]}
                />
              </>
            )
          })}
        </>
      </>
    )
  }

  const instituteDetails = () => {
    return (
      <>
        <Card style={{ background: '#ffffff' }}>
          <ProDescriptions
            dataSource={instituteData}
            size={'middle'}
            columns={[
              {
                title: 'Email',
                key: 'emailID',
                dataIndex: 'emailID',
              },
              {
                title: 'Phone No',
                key: 'phoneNo',
                dataIndex: 'phoneNo',
              },
              {
                title: 'Mobile No',
                key: 'mobileNo',
                dataIndex: 'mobileNo',
              },
              {
                title: 'Establish Date',
                key: 'estdDate',
                dataIndex: 'estdDate',
                valueType: 'date',
                fieldProps: {
                  format: 'DD.MM.YYYY',
                },
              },
              {
                title: 'website',
                key: 'website',
                dataIndex: 'website',
              },
              {
                title: 'Campus Area',
                key: 'campusArea',
                dataIndex: 'campusArea',
              },
              {
                title: 'No of Faculty',
                key: 'noOfFaculty',
                dataIndex: 'noOfFaculty',
              },
              {
                title: 'No of Student',
                key: 'noOfStudent',
                dataIndex: 'noOfStudent',
              },
              {
                title: 'Ranking',
                key: 'overAllRanking',
                dataIndex: 'overAllRanking',
              },
              {
                title: 'State',
                key: 'stateName',
                dataIndex: 'stateName',
              },
              {
                title: 'District',
                key: 'districtName',
                dataIndex: 'districtName',
              },
              {
                title: 'City',
                key: 'cityName',
                dataIndex: 'cityName',
              },
              {
                title: 'Area Name',
                key: 'areaName',
                dataIndex: 'areaName',
              },
              {
                title: 'Address',
                key: 'instituteAddress',
                dataIndex: 'instituteAddress',
              },

            ]}
          />
        </Card>
      </>
    )
  }

  const loadingView = () => {
    return (
      <>
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </>
    )
  }

  return (
    <PageContainer
      header={{
        title: <Space direction="vertical">
          <Title>{instituteData?.instituteName}</Title>
        </Space>,
        breadcrumb: {
          items: [],
        },
      }}
      extra={detailsPageComesFrom === "institute" ? [
        <Button type="primary" onClick={addRoom} icon={<PlusOutlined />}>
          New Room
        </Button>,
      ] : []}
    >

      {loading ? loadingView() :
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
          {carousel()}
          {instituteDetails()}
          {detailsPageComesFrom !== "institute" &&
            <FormDateAndSlotFilter
              bookingToDate={bookingToDate}
              bookingFromDate={bookingFromDate}
              selectedSlot={selectedSlot}
              onSubmit={(data: any) => {
                setDateAndSlotVal(data)
                getDetails(data?.fromDate, data?.toDate, data?.slotId);
              }}
            />}
          {viewRoom()}

        </Space>
      }

      <AddRoom
        visible={openAddRoom}
        onClose={onCloseAddRoom}
        onSaveSuccess={() => {  }}
        instituteId={id}
        selectedRows={selectedRows}
      />
      <AddRoom
        visible={openEditRoom}
        onClose={onCloseEditRoom}
        isEditable={isEditable}
        selectedRows={selectedRows}
        instituteId={id}
        onSaveSuccess={() => { }}
      />
    </PageContainer>
  );
};

export default InstituteDetails;
