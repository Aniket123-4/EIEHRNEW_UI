import {
    requestAddItem,
    requestGetItemCat,
    requestGetSupplier,
    requestGetUnit,
} from "@/services/apiRequest/dropdowns";
import { MinusOutlined, PlusCircleOutlined, PlusOutlined, ScanOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { history } from "@umijs/max";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    CollapseProps,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    InputRef,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    theme,
    Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { requestAddDirectItemReceipt, requestGetDirectItem, requestGetItem } from "../services/api";
import { dateFormat } from "@/utils/constant";
import dayjs from 'dayjs';
import { ColumnsType } from "antd/es/table";
import DirectItemList from "./DirectItemList";
import { convertDate } from "@/utils/helper";
import moment from "moment";

const { Option } = Select;

const DirectItemReceipt = ({
    visible,
    onClose,
    onSaveSuccess,
    selectedRows,
    instituteId,
}: any) => {
    const formRef = useRef<any>();
    const inputRef = useRef<InputRef>(null);
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [itemForm] = Form.useForm();
    const [supplierForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [supplierList, setSupplierList] = useState([]);
    const [unitList, setUnitList] = useState([]);
    const [itemCatList, setItemCatList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemIssueID, setItemIssueID] = useState("-1");
    const [type_Pats, setType_Pats] = useState<any>([]);
    const [itemList, setItemList] = useState<any>([])


    const [scanDisable, setScanDisable] = useState(true);

    const contentStyle: React.CSSProperties = {
        lineHeight: "260px",
        textAlign: "center",
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };

    useEffect(() => {
        getSupplierList();
        getUnit();
        getItemCat();
        getItemList();
    }, []);


    let timer: any;

    const waitTime = 500;

    function doneTyping(value: any) {
        addOneItem();
        console.log(`The user is done typing: ${value}`);
    }
    const onChange = (value: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            doneTyping(value.target.value);
        }, waitTime);
    }

    const getSupplierList = async (suplierSearch: any = "") => {
        const staticParams = {
            supplierID: -1,
            suplierSearch: suplierSearch,
            userID: -1,
            formID: -1,
            type: 1,
        };
        const res = await requestGetSupplier(staticParams);
        // console.log(res.result);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.supplierID, label: item.supplierName };
            });
            setSupplierList(dataMaskForDropdown);
        }
    };
    const getUnit = async () => {
        const staticParams = {
            unitID: -1,
            isActive: 1,
            type: 1,
        };
        const res = await requestGetUnit(staticParams);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.unitID, label: item.unitName };
            });
            setUnitList(dataMaskForDropdown);
        }
    };
    const getItemCat = async () => {
        const staticParams = {
            itemCatID: -1,
            sectionID: -1,
            fundID: 1,
            userID: -1,
            formID: -1,
            mainType: 2,
            type: 1,
        };
        const res = await requestGetItemCat(staticParams);
        if (res?.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.itemCatID, label: item.itemCatName };
            });
            setItemCatList(dataMaskForDropdown);
        }
    };

    const addItem = async (values: any) => {
        const staticParams = {
            "itemIssueID": itemIssueID,
            // "issueVoucherNo": "string",
            // "issueDate": "string",
            // "supplierID": 0,
            "type_Pats": type_Pats,    // UnitID,ItemID,ItemQuantity,ItemRate,ServiceTillDate,SortOrder,ItemInID,'','','','','','','',''
            "userID": -1,
            "formID": -1,
            "type": itemIssueID == "-1" ? 1 : 2
        };
        setLoading(true);
        console.log({ ...staticParams, ...values })
        const res = await requestAddDirectItemReceipt({ ...values, ...staticParams });
        setLoading(false)
        if (res?.result[0]?.isSuccess == true) {
            message.success(res?.result[0]?.msg);
            form.resetFields();
            setItemIssueID("-1")
            setType_Pats([])
        }
        else {
            setLoading(false)
            message.error(res?.result[0]?.msg);
        }
    };
    const goBack = () => {
        history.push("/");
    };
    const setEditField = async (data: any) => {
        const staticParams = {
            "itemIssueID": data?.itemIssueID,
            "issueVoucherNo": "",
            "fromDate": '19000101',
            "toDate": convertDate(dayjs()),
            "isFinalApproved": 0,
            "supplierID": -1,

            "userID": -1,
            "formID": -1,
            "type": 2
        }
        setLoadingEdit(true)
        const res = await requestGetDirectItem(staticParams);
        if (res.isSuccess == true) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: any) => {
                return {
                    col: index + 1,
                    col1: item.unitID,
                    col2: item.itemID,
                    col3: item.itemQuantity,
                    col4: item.itemRate,
                    col5: item.serviceTillDate,
                    col6: item.sortOrder,
                    col7: item.itemInID,
                    "col8": "",
                    "col9": "",
                    "col10": "",
                    "col11": "",
                    "col12": "",
                    "col13": "",
                    "col14": "",
                    "col15": ""
                };
            });
            setType_Pats(dataMaskForDropdown)
        }
        console.log(res);
        setLoadingEdit(false);
        form.setFieldsValue({
            issueVoucherNo: data?.issueVoucherNo,
            issueDate: moment(data?.issueDate),
            supplierID: data?.supplierID,
        })
        window.scrollTo(0, 0)
        setItemIssueID(data?.itemIssueID)
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getItemList = async (itemSearch: any = "") => {
        const staticParams = {
            "itemID": -1,
            "itemCatID": -1,
            "itemSearch": itemSearch,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        setLoading(true)
        const res = await requestGetItem(staticParams);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.itemID, label: item.itemName };
            });
            setItemList(dataMaskForDropdown)
            setLoading(false)
        }
        else {
            setLoading(true)
        }
    }

    const filterOption = (input: string, itemList?: { label: string; value: string }) =>
        (itemList?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleDelete = (key: any, type: number) => {
        const newData = type_Pats.filter((item: any) => item.col2 !== key);
        const dataMask = newData.map((item: any, index: any) => {
            return {
                ...item,
                col: index + 1,
            };
        });
        console.log(dataMask);
        setType_Pats(dataMask);
    };
    const column: ColumnsType<any> = [
        {
            title: 'SrNo.',
            dataIndex: 'col',
            key: 'col',
            width: 12,
            render: (text) => <a>{text}</a>,
            fixed: 'left',
        },
        {
            title: 'Item ID',
            dataIndex: 'col2',
            key: 'col2',
            width: 25,
            render: (v) => <Select
                style={{ backgroundColor: 'white' }}
                size='small'
                disabled={true}
                defaultValue={v}
                options={itemList}
            />,
        },
        {
            title: 'Unit',
            dataIndex: 'col1',
            key: 'col1',
            width: 18,
            render: (v) =>
                <Select
                    size='small'
                    disabled={true}
                    defaultValue={v}
                    options={unitList}
                />,
        },
        {
            title: 'Quantity',
            key: 'col3',
            dataIndex: 'col3',
            width: 15,
        },
        {
            title: 'Item Rate',
            key: 'col4',
            dataIndex: 'col4',
            width: 20,
        },
        {
            title: 'ExpiryDate',
            key: 'col5',
            dataIndex: 'col5',
            width: 20,
            render: (text) => <Typography>{moment(text).format('DD MMM YYYY')}</Typography>,
        },
        {
            title: 'Action',
            key: 'action',
            width: 15,
            fixed: 'right',
            render: (_, record: any) =>
                type_Pats.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.col2, 2)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const addOneItem = () => {
        let flag = 0;
        const values = itemForm.getFieldsValue()
        let newArray = Array.from({ length: type_Pats.length + 2 }, (value, index) => index);
        const addItem = {
            "col": newArray.pop(),
            "col1": values.col1 ? values.col1 : "",  //UnitID
            "col2": values.col2 ? values.col2 : "",  //ItemID
            "col3": values.col3 ? values.col3.toString() : "1",  //ItemQuantity
            "col4": values.col4 ? values.col4.toString() : "",  //ItemRate
            "col5": values.col5 ? values.col5 : "", //ServiceTillDate
            "col6": "1",//sortOrder
            "col7": "-1",  //ItemInID
            "col8": "",
            "col9": "",
            "col10": "",
            "col11": "",
            "col12": "",
            "col13": "",
            "col14": "",
            "col15": ""
        }
        const dd = type_Pats.map((item: any) => {
            return (item.col2)
        })
        const check = dd.includes(values.col2);

        if (check) message.error(`This Item Already Added`)
        else {
            if (addItem.col1 == "" || addItem.col3 == "" || addItem.col4 == "" || addItem.col4 <= "0" || addItem.col5 == "") {
                flag = 1
                message.error(`Please Check Mandatory Field`);
            }
            else {
                setType_Pats([...type_Pats, addItem])
                itemForm.resetFields()
            }
        }
    }
    const updateQuantity = (status: any) => {
        var it: number = itemForm.getFieldValue("col3")
        console.log(it)
        if (status == 'incQty') {
            itemForm.setFieldValue("col3", ++it)
        }
        if (status == 'decQty' && it >= 2) {
            itemForm.setFieldValue("col3", --it)
        }
    }
    const formList = () => {
        return (
            <Form
                form={itemForm}
            >
                <Row>
                    {/* <Col span={10}>
                        <Typography>
                            Item
                        </Typography>
                    </Col> */}
                <Col span={24}>
                        <Form.Item
                            name={'col2'}
                            label="Add Item"
                            rules={[{ required: true, message: 'Please Enter ItemID' }]}
                        >
                            <Select showSearch
                                // onSearch={(v:any)=>getItemList(v)}
                                filterOption={filterOption}
                                optionFilterProp="children"
                                placeholder="Please Select The Item"
                                options={itemList}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }} gutter={4}>
                    
                    <Col span={5}>
                        <Form.Item
                            name={'col1'}
                            label="Unit"
                            rules={[{ required: true, message: 'Please Select The Unit' }]}
                        >
                            <Select
                                placeholder="Please Select The Unit"
                                options={unitList}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Space.Compact style={{ justifyContent: 'space-between', width: '60%' }}>
                            <Button style={{ marginTop: 30 }} onClick={() => updateQuantity('decQty')} icon={<MinusOutlined />} ></Button>
                            <Form.Item style={{ width: '85%' }}
                                initialValue={1}
                                name={'col3'}
                                label="ItemQty"
                                rules={[{ required: false, message: 'Please Enter Quantity' }]}
                            >
                                <Input min={1} style={{ textAlign: 'center' }} type='number'
                                    placeholder="Quantity" />
                            </Form.Item>
                            <Button style={{ marginTop: 30 }} onClick={() => updateQuantity('incQty')} icon={<PlusOutlined />}></Button>
                        </Space.Compact>
                        {/* <Input type='number'
                                addonAfter={<PlusOutlined onClick={() => updateQuantity('incQty')} />}
                                addonBefore={<MinusOutlined onClick={() => updateQuantity('decQty')} />}
                                maxLength={3} placeholder="Quantity" /> */}
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name={'col4'}
                            label="ItemRate"
                            rules={[
                                { required: true, message: 'Please Enter Item Rate' },
                            ]}
                        >
                            <Input min={1} type='number' style={{ width: '100%' }} maxLength={10} placeholder="Please Enter Item Rate" />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            name={'col5'}
                            label="Expiry Date"
                            rules={[{ required: true, message: 'Please Choose The Expiry Date' }]}
                        >
                            <DatePicker
                                style={{ width: '90%' }}
                                format={'DD-MMM-YYYY'}
                                getPopupContainer={(trigger) => trigger.parentElement!}
                            />
                        </Form.Item>
                    </Col>
                    <Col style={{ marginTop: 30 }} span={4}>
                        <Button onClick={addOneItem} type="primary">
                            Add
                        </Button>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }} gutter={0}>

                    
                    {/* <Col span={6}>
                        <Form.Item
                            name={'col6'}
                            label="SortOrder"
                            rules={[
                                { required: false, type: 'string', message: 'Please Enter Phone No' },
                            ]}
                        >
                            <Input maxLength={10} size={'middle'} placeholder="Please Enter Phone No" />
                        </Form.Item>
                    </Col> */}
                    {/* <Col span={6}>
                        <Form.Item
                            name={'col7'}
                            rules={[{ required: false, message: 'Please Select ' }]}
                        >
                            <Select
                                placeholder="Please choose the BloodGroup"
                                options={unitList}
                            />
                        </Form.Item>
                    </Col> */}
                </Row>
            </Form>
        )
    }
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'This is panel header with arrow icon',
            children: <>{formList()}</>,
        },
    ];


    const addForm = () => {
        return (
            <Form
                ref={formRef}
                scrollToFirstError={true}
                layout="vertical"
                form={form}
                onFinish={addItem}
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={8}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="issueVoucherNo"
                                    label="Issue VoucherNo"
                                    rules={[
                                        { required: true, message: "Please Enter VoucherNo" },
                                    ]}
                                >
                                    <Input placeholder="Please Enter VoucherNo" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    initialValue={dayjs()}
                                    name="issueDate"
                                    label="Issue Date"
                                    rules={[
                                        { required: true, message: "Please Choose Issue Date" },
                                    ]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format={'DD MMM YYYY'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="supplierID"
                                    label="Supplier"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Select Supplier",
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        filterOption={filterOption}
                                        optionFilterProp="children"
                                        options={supplierList}
                                        placeholder="Select"

                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* <Collapse defaultActiveKey={['1']} items={items} /> */}
                        <Space title={<Space direction='horizontal'>
                            <Typography style={{ fontSize: 16 }}>
                                {"Add Items"}</Typography>
                        </Space>
                        }
                            style={{ boxShadow: '1px 1px 1px 1px #4874dc',borderRadius:2}}
                            >
                                <Row style={{ margin: 6 }}>
                            {formList()}
                            </Row>
                        </Space>
                        <Row style={{ marginTop: 6 }}>
                            <Table size="small" pagination={false} columns={column} dataSource={type_Pats} scroll={{ x: '100%', y: 100 }} />

                        </Row>
                        <Row gutter={8}>
                            <Col style={{ justifyContent: "flex-end" }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={goBack}
                                    style={{ marginLeft: 10, }}
                                    type="default"
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>

                    </div>
                </>
            </Form>
        );
    };

    return (
        <PageContainer title=" " style={{}}>
            <Space direction="horizontal" size="middle" style={{ display: "flex" }}>
                <Row gutter={8}>
                    <Col span={13}>
                        <Card
                            headStyle={{ backgroundColor: '#004080', border: 0 }}
                            style={{ height: 650, boxShadow: "2px 2px 2px #4874dc" }}
                            title={<Space direction='horizontal'>
                                <Typography style={{ color: 'white', fontSize: 18 }}>
                                    {"New Item"}</Typography>
                            </Space>}//"New Item"
                        >
                            <Spin tip="Please wait..." spinning={loading || loadingEdit}>
                                <div>{addForm()}</div>
                            </Spin>
                        </Card>

                    </Col>
                    <Col span={11}>
                        <DirectItemList
                            refresh={loading}
                            editRecord={(data: any) => setEditField(data)}
                        /></Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default DirectItemReceipt;
