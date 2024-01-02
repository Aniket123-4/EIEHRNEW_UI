import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import DoctorSlotBookingList from './DoctorSlotBookingList';

const { RangePicker } = DatePicker;



const DoctorForm = () => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [sections, setSections] = useState<any>([])
    const [doctorList, setDoctorList] = useState<any>([])
  

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };


  
    const addForm = () => {
        return (
            <Form
                ref={formRef}
                layout="vertical"
                form={form}
                onFinish={formSubmit}
                preserve={true}
                scrollToFirstError={true}
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="dateRange"
                                    label="From - To Date"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <RangePicker
                                        format={dateFormat}
                                        style={{ width: "100%" }}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>
                           
                        </Row>

                    
                        <Row gutter={16}>
                            <Col style={{ justifyContent: 'flex-end', marginTop: 20 }}>
                                <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button onClick={goBack} style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </>
            </Form>
        )
    }

    return (
        <PageContainer>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title="Create Doctor Slot"
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {addForm()}
                        </div>
                    </Spin>
                </Card>

                <DoctorSlotBookingList />
            </Space>
        </PageContainer>
    );
};

export default DoctorForm;