import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker, List, Avatar, Tag } from 'antd';
import { PageContainer, EditableProTable, ProDescriptions } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import WeekCalendar from '../../../components/WeekCalendar';
import { requestAddPatRequest, requestGetPatDocAppointment } from '../services/api';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { dateFormat } from '@/utils/constant';

const { Option } = Select;

const gridStyle: React.CSSProperties = {
    textAlign: 'center',
};


const AppointmentBooking = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [sections, setSections] = useState<any>([])
    const [selectedSectionId, setSelectedSectionId] = useState<number>(-1);
    const [docList, setDocList] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [availableSlots, setAvailableSlots] = useState<any>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>({});

    const [slotForm] = Form.useForm();


    useEffect(() => {
        setSelectedDate(dayjs(new Date()).format(dateFormat));
        getSectionList();
    }, [])

    useEffect(() => {

        const data = {
            fromDate: dayjs(new Date()).format(dateFormat),
        };

        getDoctorList(data);

    }, [selectedSectionId]);

    const showDetailsHandle = (dayStr: any) => {
        console.log({ dayStr })
        setSelectedDate(dayStr);
        setShowDetails(true);

        const data = {
            fromDate: dayStr,
        };

        getDoctorList(data);
    };

    const getSectionList = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetSection(params);

        if (res.result.length > 0) {

            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.sectionID, label: item.sectionName }
            });
            dataMaskForDropdown.unshift({ value: -1, label: "All" });
            setSections(dataMaskForDropdown)
        }
    }

    const getDoctorList = async ({ fromDate }: any) => {
        try {
            const staticParams = {
                userSlotID: -1,
                docUserID: -1,
                slotFromDate: fromDate,
                slotToDate: "",
                isActive: -1,
                sectionID: selectedSectionId,
                fromHrs: '',
                toHrs: '',
                showAll: 0,
                userID: -1,
                formID: -1,
                mainType: 1,
                type: 4
            };

            setLoading(true)
            const response = await requestGetPatDocAppointment({ ...staticParams });
            setLoading(false)
            const data = response?.result.map((item: any, index: number) => {
                let time = [];
                let i = 1;
                for (var key in item) {
                    console.log(`fHrs${i}` + " :" + item[`fHrs${i}`]);
                    if (item[`fHrs${i}`] !== 'X') {
                        time.push({
                            fromHr: `fHrs${i}`,
                            fromHrValue: item[`fHrs${i}`],
                            toHr: `tHrs${i}`,
                            toHrValue: item[`tHrs${i}`]
                        });
                    }
                    i++;
                    if (i === 25) break;

                }
                return { key: index + 1, ...item, time }
            });
            console.log(data);
            setDocList(data);
            if (!response?.isSuccess) {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const getDoctorSlotForBooking = async ({ doctorID, userSlotID }: any, slot: any) => {
        slotForm.resetFields();
        try {
            const staticParams = {
                userSlotID: userSlotID,
                docUserID: doctorID,
                slotFromDate: selectedDate,
                slotToDate: selectedDate,
                isActive: -1,
                sectionID: selectedSectionId,
                fromHrs: slot.fromHrValue,
                toHrs: slot.toHrValue,
                showAll: 0,
                userID: -1,
                formID: -1,
                mainType: 1,
                type: 5
            };


            setLoading(true)
            const response = await requestGetPatDocAppointment({ ...staticParams });
            setLoading(false)
            console.log(response?.result);
            setAvailableSlots(response?.result);
            if (!response?.isSuccess) {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }



    const bookingForm = () => {


        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        /* eslint-disable no-template-curly-in-string */
        const validateMessages = {
            required: '${label} is required!',
            types: {
                email: '${label} is not a valid email!',
                number: '${label} is not a valid number!',
            },
            number: {
                range: '${label} must be between ${min} and ${max}',
            },
        };
        /* eslint-enable no-template-curly-in-string */

        const onFinishPatForm = async (values: any) => {
            console.log(values);
            const params = {
                ...values,
                userWeekSlotID: selectedSlot?.userWeekSlotID,
                patientId: -1,
                remarkId: -1,
                userID: -1,
                formID: -1,
                type: 1
            }
            const response = await requestAddPatRequest(params);
            setLoading(false)
            console.log(response?.result);
            message.success(response?.msg);

            if (!response?.isSuccess) {
                message.error(response?.msg);
            } else {
                slotForm.resetFields();
                setAvailableSlots([])
            }
        };
        return (
            <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinishPatForm}
                form={slotForm}
                style={{ maxWidth: 600 }}
                validateMessages={validateMessages}

            >
                <Form.Item name="slot" label="Slot Timing" rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item name="patientName" label="Patient Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phoneNo" label="Mobile No" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="otpNo" label="OTP" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="remark" label="Remark">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        )
    }

    const onSelectSlot = (item: any) => {
        setSelectedSlot(item);
        slotForm.setFieldsValue({
            slot: item?.pTime,
            otpNo: item?.otpNo
        })
    }

    const bookingSlotView = () => {
        return (
            <>
                <Card
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Row>
                        <Col span={8}>
                            <List
                                itemLayout="vertical"
                                dataSource={availableSlots}
                                renderItem={(item, index) => (
                                    // <Card hoverable={true} bodyStyle={{ padding: 5, width: 40, marginTop: 5, marginBottom: 5 }}>
                                    <List.Item
                                    >
                                        <List.Item.Meta
                                            title={<h2>{item?.pTime}</h2>}
                                            description={<>
                                                {!item?.isFree ?
                                                    <Tag color={item?.isFree ? "green" : "magenta"}>{item?.isFree ? "Free" : "Booked"}</Tag>
                                                    :
                                                    <Button
                                                        type="primary" size='small'
                                                        onClick={() => onSelectSlot(item)}
                                                    >
                                                        Book
                                                    </Button>}
                                            </>}
                                        />
                                    </List.Item>
                                    // </Card>
                                )}
                            />
                        </Col>
                        <Col span={16}>
                            {bookingForm()}
                        </Col>
                    </Row>

                </Card>
            </>
        )
    }


    return (
        <PageContainer>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title="Appointment Booking"
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                >

                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="sectionId"
                                label="Section"
                                rules={[{ required: true, message: 'Please select' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Section"
                                    optionFilterProp="children"
                                    options={sections}
                                    size={'large'}
                                    defaultValue={selectedSectionId}
                                    onChange={(value, item) => {
                                        setSelectedSectionId(value)
                                        setAvailableSlots([])
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <WeekCalendar showDetailsHandle={showDetailsHandle} />
                    {/* <br /> */}
                    {/* {showDetails && <>{selectedDate}</>} */}
                    <br />

                    <List
                        itemLayout="horizontal"
                        dataSource={docList}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar size={46} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                                    title={<h2>{item?.doctorName}</h2>}
                                    description={<>

                                        <Space>
                                            {item?.time.map(slot => {
                                                return (
                                                    <div onClick={() => { getDoctorSlotForBooking(item, slot) }}>
                                                        <Card bodyStyle={{ padding: 5 }}
                                                            hoverable={true}
                                                        >
                                                            <label>{`From :${slot?.fromHrValue}`}</label><br />
                                                            <label>{`To :${slot?.toHrValue}`}</label>
                                                        </Card>
                                                    </div>
                                                )
                                            })}
                                        </Space>
                                    </>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>

                {availableSlots && availableSlots.length > 0 ? bookingSlotView() : null}

            </Space>
        </PageContainer>
    );
};

export default AppointmentBooking;