import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import '../styles/addRoom.css';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Result } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { requestAddBooking } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import useRazorpay from "react-razorpay";
import { requestGetCandidateList } from '@/pages/Candidate/services/api';

const { Option } = Select;


const RoomBooking = () => {
    const { initialState } = useModel('@@initialState');
    const [loading, setLoading] = useState(false)
    const [roomBooking, setRoomBooking] = useState<any>();
    const [isBookingDone, setIsBookingDone] = useState<boolean>(false);
    const [bookingSuccess, setBookingSuccess] = useState<any>();
    const [candidateDetails, setCandidateDetails] = useState<any>({});

    const [Razorpay] = useRazorpay();


    useEffect(() => {
        const data: any = localStorage.getItem('bookingData');
        setRoomBooking(JSON.parse(data));
        getCandidateDetails();
        console.log(JSON.parse(data))
    }, [])

    const getCandidateDetails = async () => {
        const { verifiedUser }: any = getUserInLocalStorage();
        try {
            const params = {
                "candidateID": verifiedUser?.userID,
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
            };

            setLoading(true)
            const msg = await requestGetCandidateList(params);
            setCandidateDetails(msg.data[0])
            setLoading(false)
        } catch (error) {
            setLoading(false)
            message.error("something went wrong");
        }
    };


    const handlePayment = async () => {

        const order = "order_9AXWu170gUtm";//await createOrder(params); //  Create order on your backend

        const options = {
            key: "rzp_test_UmUIzzSAIdrrTV", // Enter the Key ID generated from the Dashboard
            amount: parseInt(roomBooking?.totNetAmt) * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: candidateDetails?.firstName + " " + candidateDetails?.lastName,
            description: `Room name: ${roomBooking?.roomName}. booked in ${roomBooking?.instituteName}`,
            image: "https://example.com/your_logo",
            // order_id: order, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
            handler: function (response: any) {
                // alert(JSON.stringify(response));
                onSubmitBooking()
            },
            prefill: {
                name: candidateDetails?.firstName + " " + candidateDetails?.lastName,
                email: candidateDetails?.emailID,
                contact: candidateDetails?.mobileNo,
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response: any) {
            alert(JSON.stringify(response, null, 1));
        });

        rzp1.open();
        
    };

    const onSubmitBooking = async () => {
        const { verifiedUser }: any = getUserInLocalStorage();
        try {
            const staticParams = {
                type: 1,
                userID: verifiedUser?.userID,
                formID: -1,
                payType: 2,
            };

            setLoading(true);
            const msg = await requestAddBooking({ ...roomBooking, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                setBookingSuccess(msg);
                setIsBookingDone(true)
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };


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
                            history.push('/booking/booking-order');
                        }}>
                            Check your booking
                        </Button>,
                    ]}
                />
            </>
        )
    }

    return (
        <>

            {!isBookingDone ? <>
                <Row justify="space-around">
                    <Col span={12}>
                        {booingDetails()}
                    </Col>
                    <Col span={11}>
                        {booingOrderDetails()}
                    </Col>
                </Row>
                <Button
                    size='large'
                    type="primary"
                    style={{
                        marginTop: 100,
                        marginRight: 350,
                        marginLeft: 350
                    }}
                    onClick={() => {
                        handlePayment("");
                    }}
                >
                    Book Now
                </Button>
            </> :
                bookingSuccessView()
            }
        </>
    );
};

export default RoomBooking;