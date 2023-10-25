import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';

const { Option } = Select;


const AddComplaint = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [row, setRow] = useState(1);
    const [col, setCol] = useState(1);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [complaintType, setComplaintType] = useState<any>([{ value: "1", label: "Type 1" }])
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
        getComplaintType();
        getRateType();
    }, [])

    const getComplaintType = async () => {
        const res = await requestGetRoomType({});
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.roomTypeID, label: item.roomTypeName }
            })
            setComplaintType(dataMaskForDropdown)
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
        setRow(e.target.value)
        setCapacity((e.target.value) * col)
        let roomCapacity1 = (e.target.value) * col
        form.setFieldsValue({
            roomCapacity: roomCapacity1
        })
    }
    const onColumnEnter = (e: any) => {
        setCol(e.target.value)
        setCapacity((e.target.value) * row)
        let roomCapacity1 = (e.target.value) * row
        form.setFieldsValue({
            roomCapacity: roomCapacity1
        })
    }


    const addComplaint = async (values: any) => {
        console.log(values);
        try {
            const staticParams = {
                // "complaintTypeID": "1",
                // "complaintTypeName": "",
                // "complaintTypeCode": "1",
                "sortOrder": "",
                "isActive": "1",
                "formID": -1,
                "type": 1,

            };

            setLoading(true)
            const msg = await requestAddComplaint({ ...values, ...staticParams });
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
                onFinish={addComplaint}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <Col span={100}>
                        <Row gutter={1}>
                            <Form.Item
                                name="complaintTypeName"
                                label="Complaint name"
                                rules={[{ required: true, message: 'Please enter complaint name' }]}
                            // initialValue={institute}
                            >
                                <Input placeholder="Please enter complaint name" />
                            </Form.Item>
                        </Row>
                        <Row gutter={1}>
                            <Form.Item
                                // initialValue={institute}
                                name="complaintTypeID"
                                label="Complaint Type"
                                rules={[{ required: true, message: 'Please select complaint Type' }]}
                            >
                                <Select
                                    placeholder="Complaint Type"
                                    optionFilterProp="children"
                                    options={complaintType}
                                />
                            </Form.Item>
                        </Row>
                        <Row gutter={1}>
                            <Form.Item
                                name="complaintTypeCode"
                                label="Complaint code"
                                rules={[{ required: true, message: 'Please enter complaint code' }]}
                            >
                                <Input placeholder="Please enter complaint code" />
                            </Form.Item>
                        </Row>
                        <Row>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Row>
                    </Col>

                </>
            </Form>
        )
    }

    return (
        <PageContainer>
            <Card
                title="Create a new complaint master"
                width={1000}
                onClose={onClose}
                open={true}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {addForm()}
                    </div>
                </Spin>
            </Card>
        </PageContainer>
    );
};

export default AddComplaint;