import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestDiseaseList } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import DiseaseList from './DiseaseList';
import { CheckboxChangeEvent } from 'antd/es/checkbox';


const { Option } = Select;


const AddDisease = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [row, setRow] = useState(1);
    const [col, setCol] = useState(1);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([{ value: "1", label: "Type 1" }])
    const [isActive, setIsActive] = useState(true);
    const [specialList, setSpecialist] = useState([]);



    const contentStyle: React.CSSProperties = {
        // lineHeight: '260px',
        // textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getSpecialType();
    }, [])

    const getSpecialType = async () => {
        const params = {
            "diseaseID": "-1",
            "diseaseTypeID": "-1",
            "specialTypeID": "2",
            "isActive": "1",
            "type": 1
        }
        const res = await requestDiseaseList(params);
        console.log(res);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.specialTypeID, label: item.specialTypeName }
            })
            setSpecialist(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }

    const addDisease = async (values: any) => {
        console.log(values);
        try {
            const staticParams = {
                "diseaseTypeID": "-1",
                // "diseaseTypeName": "string",
                // "diseaseTypeCode": "string",
                // "specialTypeID": "string",
                "isActive": isActive.toString(),
                "sortOrder": 1,
                "diseasesID": "-1",
                "formID": -1,
                "type": 1

            };

            setLoading(true)
            const msg = await requestAddDisease({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                message.success(msg.msg);
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
    const onChange = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isActive: e.target.checked
        })
        setIsActive(e.target.checked)
    };


    const addForm = () => {
        return (
            <Form
                layout="vertical"
                // hideRequiredMark
                form={form}
                onFinish={addDisease}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="diseaseTypeName"
                                    label="Disease name"
                                    rules={[{ required: true, message: 'Please enter disease name' }]}
                                // initialValue={institute}
                                >
                                    <Input size={'large'} placeholder="Please enter disease type name" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="diseaseTypeCode"
                                    label="Disease code"
                                    rules={[{ required: true, message: 'Please enter disease code' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter disease code" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="specialTypeID"
                                    label="Special type"
                                    rules={[{ required: true,  message: 'Please enter special type' }]}
                                >
                                    <Select
                                        size={'large'}
                                        placeholder="Select Special Type"
                                        optionFilterProp="children"
                                        options={specialList}
                                    />
                                    {/* <Input size={'large'} placeholder="Please enter special type" /> */}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="isActive"
                                // label="isActive"
                                rules={[{ message: 'Please select disease type' }]}
                            >
                                <Checkbox checked={isActive} onChange={onChange}>isActive</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button onClick={goBack}
                                style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>
                </>
            </Form>
        )
    }

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                    title="Create a new disease master"
                // extra={[
                //     <Button key="rest" onClick={() => {
                //         history.push("/complaints/DiseaseList")
                //     }}
                //     >List</Button>,
                // ]}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {addForm()}
                        </div>
                    </Spin>
                </Card>
                <DiseaseList />
            </Space>
        </PageContainer>
    );
};

export default AddDisease;