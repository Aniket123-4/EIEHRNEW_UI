import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestFnGetItem, requestGetItemCat, requestGetProduct, requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import { getUserInLocalStorage } from '@/utils/common';
import { requestAddDelPatientForDoctorOPIP, requestGetItemBalance } from '../services/api';
import { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

const Medication = ({ patientDetails = {}, patientCaseID, onSaveSuccess ,admNo}: any) => {
    const { result1 } = patientDetails;

    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [drugList, setDiseaseList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [balance, setBalance] = useState([]);
    const [itemCat, setItemCat] = useState([]);

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'patNameTitle',
            dataIndex: 'patNameTitle',

        }, {
            title: 'Patient Number',
            key: 'patientNo',
            dataIndex: 'patientNo',

        },
        {
            title: 'Case Number',
            key: 'patientCaseNo',
            dataIndex: 'patientCaseNo',
        },
        {
            title: 'Age',
            key: 'age',
            dataIndex: 'age',

        }, {
            title: 'Section',
            key: 'sectionName',
            dataIndex: 'sectionName',

        }, {
            title: 'Doctor Name',
            key: 'doctorName',
            dataIndex: 'doctorName',

        }, {
            title: 'Insurance Comp',
            key: 'insuranceComp',
            dataIndex: 'insuranceComp',

        }

    ];


    useEffect(() => {
        getItemCat();
        getProductList()
    }, [])


    const getItemList = async (item: any) => {
        console.log(item)
        const params = {
            "itemID": -1,
            "itemCatID": -1,
            "sectionID": -1,
            "fundID": -1,
            "ledgerNo": "",
            "itemSearch": "",
            "userID": -1,
            "formID": 1,
            "type": 1
        }
        const res = await requestFnGetItem(params);

        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.itemID, label: item.itemName }
            })
            setDiseaseList(dataMaskForDropdown)
            setBalance(null)
        }
    }


    const getItemCat = async () => {

        const params = {
            "itemCatID": -1,
            "sectionID": -1,
            "fundID": -1,
            "userID": -1,
            "formID": -1,
            "mainType": 2,
            "type": 1
        }
        const res = await requestGetItemCat(params);

        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result.map((item: any) => {
                return { value: item.itemCatID, label: `${item.itemCatName}` }
            })
            console.log({ dataMaskForDropdown })
            setItemCat(dataMaskForDropdown)
        }
    }

    const getItemBalance = async (item: any) => {
        console.log({ item })
        const params = {
            "itemID": item,
            "itemCatID": 1,
            "sectionID": 0,
            "fundID": 0,
            "productID": 0,
            "unitID": 0,
            "curDate": "",
            "userID": -1,
            "formID": 1,
            "type": 1
        }
        const res = await requestGetItemBalance(params);

        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result.map((item: any) => {
                return { value: item.itemID, label: `${item.itemName} ${item.balanceQuantity}` }
            })
            console.log({ dataMaskForDropdown })
            setBalance(dataMaskForDropdown)
        }
    }
    const getProductList = async () => {
        const params = {
            "productID": -1,
            "sectionID": -1,
            "itemCatID": 1,
            "itemID": 1,
            "productSearch": "",
            "userID": -1,
            "formID": -1,
            "mainType": 2,
            "type": 1
        }
        const res = await requestGetProduct(params);

        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.itemID, label: item.itemName }
            })
            setDiseaseList(dataMaskForDropdown)
        }
    }



    const formView = () => {

        const onFinishPatForm = async (values: any) => {
            const params = {
                "patientCaseID": patientCaseID,
                "admNo":admNo,
                "col1": values?.DrugID,
                "col2": "" + values?.NoOfDays,
                "col3": "" + values?.QuantityPerDay,
                "col4": values?.Instruction,
                "col5": values?.Advice,
                "col6": values?.Diet,
                "col7": "" + values?.ProductID,
                "col8": "",
                "col9": "" + values?.Qty,
                "col10": "" + values?.QtyTimesPerDay,
                "col11": "" + values?.UnitIDForDoc,
                "col12": "",
                "col13": "",
                "col14": "",
                "col15": "",
                "col16": "",
                "col17": "",
                "col18": "",
                "col19": "",
                "col20": "",
                "col21": "",
                "col22": "",
                "isForDelete": false,
                "lstType_DocPatient": [
                    {
                        "col1": "",
                        "col2": "",
                        "col3": "",
                        "col4": "",
                        "col5": "",
                        "col6": "",
                        "col7": "",
                        "col8": "",
                        "col9": "",
                        "col10": "",
                        "col11": "",
                        "col12": "",
                        "col13": "",
                        "col14": "",
                        "col15": ""
                    }
                ],
                "lstType_Patient": [
                    {
                        "col1": "",
                        "col2": "",
                        "col3": "",
                        "col4": "",
                        "col5": "",
                        "col6": "",
                        "col7": "",
                        "col8": "",
                        "col9": "",
                        "col10": "",
                        "col11": "",
                        "col12": "",
                        "col13": "",
                        "col14": "",
                        "col15": ""
                    }
                ],
                "userID": verifiedUser?.userID,
                "formID": -1,
                "type": 4
            }
            try {
                setLoading(true)
                const response = await requestAddDelPatientForDoctorOPIP({ ...params });
                setLoading(false)

                if (response?.isSuccess) {
                    tabForm.resetFields();
                }
                onSaveSuccess({
                    tab: "MEDICATION",
                    response
                })
            } catch (e) {
                setLoading(false)
            }
        };




        return (
            <Form
                form={tabForm}
                onFinish={onFinishPatForm}
                layout="vertical"
                size={'small'}
            >

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="ItemCategory" label="Item Category" rules={[{ required: true }]}>
                            <Select
                                options={itemCat}
                                placeholder="Select"
                                showSearch
                                onChange={(item) => getItemList(item)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="Drug" label="Drug" rules={[{ required: true }]}>
                            <Select
                                options={drugList}
                                placeholder="Select"
                                showSearch
                                onChange={getItemBalance}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="DrugID" label="Item" rules={[{ required: true }]}>
                            <Select
                                options={balance}
                                placeholder="Select"
                                showSearch
                            />
                        </Form.Item>
                    </Col>





                </Row>



                <Row gutter={16}>

                    {/* <Col span={8}>
                        <Form.Item name="ProductID" label="Product" rules={[{ required: false }]}>
                            <Select
                                options={productList}
                                placeholder="Select"
                            />
                        </Form.Item>
                    </Col> */}

                    <Col span={8}>
                        <Form.Item name="NoOfDays" label="No Of Days" rules={[{ required: true }]}>
                            <InputNumber placeholder="Please Enter" style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="QuantityPerDay" label="Quantity Per Day" rules={[{ required: true }]}>
                            <InputNumber placeholder="Please Enter" style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Qty" label="Qty" rules={[{ required: true }]}>
                            <InputNumber placeholder="Please Enter" style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="QtyTimesPerDay" label="Qty Times Per Day" rules={[{ required: true }]}>
                            <InputNumber placeholder="Please Enter" style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="UnitIDForDoc" label="Unit For Doc" rules={[{ required: true }]}>
                            <InputNumber placeholder="Please Enter" style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Instruction" label="Instruction" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Advice" label="Advice" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Diet" label="Diet" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>


                </Row>


                <Form.Item>
                    <Button type="primary" loading={loading} htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        )
    }


    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card>
                {formView()}
            </Card>

            <Table
                columns={columns}
                size="small"
                dataSource={result1}
                pagination={false}
            />
        </Space>
    );
};

export default Medication;