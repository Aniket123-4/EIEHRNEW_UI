import React, { useEffect, useRef, useState } from 'react';
import './styles/AddComplaint.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetComplaintType, requestGetRateType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';



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
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getComplaintType();
        // getRateType();
    }, [])

    const getComplaintType = async () => {
        const staticParams = {
            "complaintTypeID": "-1",
            "isActive": "1",
            "type": "1"
        }
        const res = await requestGetComplaintType(staticParams);
        // console.log(res.result);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.complaintTypeID, label: item.complaintTypeName }
            })
            setComplaintType(dataMaskForDropdown)
            // console.log(dataMaskForDropdown)
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
    const goBack = () => {
        history.push("/")
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
                form={form}
                onFinish={addComplaint}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}  >
                                <Form.Item
                                    // required={true}
                                    name="complaintTypeName"
                                    label="Complaint Name"
                                    rules={[{ required: true, message: 'Please enter complaint name' }]}
                                // initialValue={institute}
                                >
                                    <Input size={'large'}  placeholder="Please enter complaint name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    // initialValue={institute}
                                    name="complaintTypeID"
                                    label="Complaint Type"
                                    rules={[{ required: true, message: 'Please select complaint type' }]}
                                >
                                    <Select
                                        size={'large'}
                                        placeholder="Complaint type"
                                        optionFilterProp="children"
                                        options={complaintType}
                                        
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="complaintTypeCode"
                                    label="Complaint Code"
                                    rules={[{ required: true, message: 'Please enter complaint code' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter complaint code" />
                                </Form.Item>
                            </Col>
                            
                        </Row>
                        <Col style={{justifyContent:'flex-end'}}>
                            <Button style={{padding:5,width:100,height:40}}  type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button  onClick={goBack} style={{marginLeft:10, padding:5,width:100,height:40}} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>

                </>
            </Form>
        )
    }

    return (
        <PageContainer style={{}}>
            <Card
                style={{ height: '100%', width: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                title="Create a new complaint master"
                extra={[
                    <Button key="rest" onClick={() => {
                        history.push("/complaints/list")
                    }}
                    >List</Button>,
                ]}
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