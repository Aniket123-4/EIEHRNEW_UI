import React, { useEffect, useRef, useState } from 'react';
import '../styles/addRoom.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddRoom } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';

const { Option } = Select;


const AddRoom = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [row, setRow] = useState(1);
    const [col, setCol] = useState(1);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [roomType, setRoomType] = useState<any>([])
    const [rateType, setRateType] = useState<any>([])
    const [institute, setInstitute] = useState<any>([])


    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        marginTop: 20,
        height: 350
    };


    useEffect(() => {
        getRoomType();
        getRateType();
        getInstituteList();
        setInstitute([{ value: selectedRows.instituteID, label: selectedRows.instituteName }])
    }, [])

    const getInstituteList = async () => {
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
        }
        const res = await requestGetInstituteList(params);
        if (res.data.institutelist2s.length > 0) { // && !selectedRows
            const dataMaskForDropdown = res?.data.institutelist2s?.map((item: any) => {
                return { value: item.instituteID, label: item.instituteName }
            })
            setInstitute(dataMaskForDropdown)
            console.log({ instituteId });
            if (instituteId) {
                form.current?.setFieldsValue({
                    instituteID: instituteId
                })
            }
        }
    }
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
                return { label: item.rateTypeName, value: item.rateTypeID }
            })
            setRateType(dataMaskForDropdown)
        }
    }

    const onRowEnter = (e: any) => {
        console.log(e.target.value)
        setRow(e.target.value)
        setCapacity((e.target.value) * col)
        console.log(capacity)
        console.log(institute)
    }


    const addRoom = async (values: any) => {
        try {
            const staticParams = {
                "roomID": "-1",
                "userID": "-1",
                "formID": -1,
                "type": 1,
            };

            setLoading(true)
            const msg = await requestAddRoom({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                form.resetFields();
                onClose();
                message.success(msg.msg);
                onSaveSuccess(msg);
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


    const addForm = () => {
        return (
            <Form
                layout="vertical"
                hideRequiredMark
                form={form}
                onFinish={addRoom}
                initialValues={{
                    instituteID: instituteId
                }}
            >
                {/* Basic Information */}
                <>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="instituteID"
                                label="Institute"
                                rules={[{ required: true, message: 'Please enter institute' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Institute"
                                    optionFilterProp="children"
                                    options={institute}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="roomTypeID"
                                label="Room Type"
                                rules={[{ required: true, message: 'Please enter Room Type' }]}
                            >
                                <Select
                                    placeholder="Room Type"
                                    optionFilterProp="children"
                                    options={roomType}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="roomName"
                                label="Room Name"
                                rules={[{ required: true, message: 'Please enter Room Name' }]}
                            >
                                <Input placeholder="Please enter roomName" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="roomCapacity"
                                label="Room Capacity"
                                rules={[{ required: true, message: 'Please enter Room Capacity' }]}
                            >
                                <Input placeholder="Please enter Room Capacity" />
                            </Form.Item>
                        </Col>


                        <Col span={8}>
                            <Form.Item
                                name="noOfCol"
                                label="No Of Col"
                                rules={[{ required: true, message: 'Please enter No Of Col' }]}
                            >
                                <Input onChange={(e: any) => setCol(e.target.value)} type='number' placeholder="Please enter No Of Col" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="noOfRow"
                                label="No Of Row"
                                rules={[{ required: true, message: 'Please enter No Of Row' }]}
                            >
                                <Input type='number' onChange={onRowEnter} placeholder="Please enter No Of Row" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="roomSize"
                                label="Room Size"
                                rules={[{ required: true, message: 'Please enter Room Size' }]}
                            >
                                <Input placeholder="Please enter Room Size" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="rateTypeID"
                                label="Rate Type"
                                rules={[{ required: true, message: 'Please enter Rate Type' }]}
                            >
                                <Select
                                    placeholder="Rate Type"
                                    optionFilterProp="children"
                                    options={rateType}
                                // defaultValue={{name:"MonthlyRate",value:1}}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="rate"
                                label="Rate"
                                rules={[{ required: true, message: 'Please enter rate' }]}
                            >
                                <Input placeholder="Please enter rate" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="disCountPercent"
                                label="Discount Percent"
                                rules={[{ required: true, message: 'Please enter Discount Percent' }]}
                            >
                                <Input placeholder="Please enter Discount Percent" />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Row>

                </>
            </Form>
        )
    }

    return (
        <>
            <Drawer
                title="Create a new Room"
                width={1000}
                onClose={onClose}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {addForm()}
                    </div>
                </Spin>
            </Drawer>
        </>
    );
};

export default AddRoom;