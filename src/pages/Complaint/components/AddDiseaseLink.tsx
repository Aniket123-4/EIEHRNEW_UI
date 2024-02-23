import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, Divider, Modal, Table, Tag, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import DiseaseList from './DiseaseList';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { requestDiseaseTypeList, requestGetDiseaseLink, requestGetInvParameterMasterList, requestLinkDisease } from '../services/api';
import { requestGetInvParameter, requestGetInvestigation } from '@/pages/Investigation/services/api';
import { requestGetItem } from '@/pages/MedicalStore/services/api';
import DiseaseLinkedList from './DiseaseLinkedList';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { GetProp } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';


const { Option } = Select;

interface Item {
    key: string;
    medicine: string,
    noOfDays: string,
    noOfTimesPerDay: string,
    qtyPerTimes: string,
    instruction: string,
    advice: string,
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}


const AddDiseaseLink = () => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [linkMedForm] = Form.useForm();
    const [linkTestForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([])
    const [diseaseID, setDiseaseID] = useState("-1");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invParameterID, setInvParameterID] = useState([]);
    const [itemList, setItemList] = useState<any>([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Item) => record.key === editingKey;
    const [checkedTest, setCheckedTest] = useState([]);
    const [checkedList, setCheckedList] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);




    const contentStyle: React.CSSProperties = {
        // lineHeight: '260px',
        // textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getDiseaseType();
        getInvParameter();
        getItemList()
    }, [])

    const getDiseaseLinkedList = async (diseaseId: any, type: any = 2) => {
        setDiseaseID(diseaseId)
        const staticParams = {
            "diseaseID": diseaseId,
            "userID": -1,
            "formID": -1,
            "type": type
        }
        setLoading(true)
        const res = await requestGetDiseaseLink(staticParams);
        if (res?.isSuccess === true && type === 2) {
            let check: any = [];
            res?.result.map(async (item: any) => {
                const i = itemList.findIndex(x => x.key === item.itemID)
                itemList[i] = {
                    advice: item.advice,
                    commonName: item.commonName,
                    diet: item.diet,
                    diseaseID: item.diseaseID,
                    instruction: item.instruction,
                    isSuccess: item.isSuccess,
                    noOfTimesPerDay: item.noOfTimesPerDay,
                    qtyPerTimes: item.qtyPerTimes,
                    noOfDays: item.noOfDays,
                    key: item.itemID, medicine: item.commonName
                };
                setItemList([...itemList])
                check.push(item.itemID);
                // setEditingKey(item?.itemID);
                // linkMedForm.setFieldsValue(item)
            })
            setSelectedRowKeys(check)
            getDiseaseLinkedList(diseaseId, 1)
        }
        if (res?.isSuccess === true && type === 1) {
            const list = res?.result.map((item: any) => {
                return (item.invParameterID);
            })
            setCheckedTest(list)
        }
        else {
            setLoading(true)
        }
        console.log(itemList)
        setLoading(false)
    }
    const handleChangeFilter = (data: any) => {
        console.log(data)
    }
    const edit = (record: Partial<Item> & { key: React.Key }, checked: boolean) => {
        setEditingKey(record.key);
        const index: boolean = checkedList.find((item: any) => record.key === item);
        // const check = dd.includes(values.col2);
        // const index: any = itemList.find((item: any) => record.key === item?.key);
        // itemList[index]=[{isSuccess:true}]
        const i = itemList.findIndex(x => x.key === record.key)
        itemList[i] = { ...record, isSuccess: checked }
        setItemList([...itemList])
        if (checked) {
            if (!index) setCheckedList([record.key, ...checkedList])
            linkMedForm.setFieldsValue({
                noOfDays: record?.noOfDays,
                noOfTimesPerDay: "",
                qtyPerTimes: "",
                instruction: "",
                advice: "",
                diet: "",
                ...record
            });
        }
        if (!checked) {
            const newData = checkedList.filter((item: any) => item !== record?.key);
            setCheckedList(newData)
        }
    };
    const getItemList = async () => {
        const staticParams = {
            "itemID": -1,
            "itemCatID": -1,
            "itemSearch": "",
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        setLoading(true)
        const res = await requestGetItem(staticParams);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return {
                    key: item.itemID,
                    medicine: item?.itemName,
                    noOfDays: "",
                    noOfTimesPerDay: "",
                    qtyPerTimes: "",
                    instruction: "",
                    advice: "",
                    diet: "",
                    isSuccess: false,
                }
            })
            setItemList(dataMaskForDropdown)
            setLoading(false)
        }
        else {
            setLoading(true)
        }
    }
    const getInvParameter = async () => {
        const params1 = {
            "invParameterID": -1,
            "invGroupID": -1,
            "isActive": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetInvestigation(params1);
        const dataMaskForDropdown = res?.result?.map((item: any) => {
            return { value: item.invParameterID, label: item.invName }
        })
        setInvParameterID(dataMaskForDropdown)
        return dataMaskForDropdown;
        // }
    }
    const getDiseaseType = async () => {
        const params = {
            "diseaseTypeID": -1,
            "specialTypeID": -1,
            "isActive": -1,
            "type": 1
        }
        const res = await requestDiseaseTypeList(params);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: number) => {
                return { value: item.diseaseTypeID, label: item.diseaseTypeName }
            })
            setDiseaseType(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }

    const linkDisease = async (values: any, type: any) => {
        // console.log(values, checkedList)
        if (diseaseID == "-1") { message.error("Please select Disease") }
        else {
            try {
                var typePat = []
                if (type === 2) {
                    typePat = values.filter(function (value: any) {
                        if (selectedRowKeys.find((element: any) => element == value?.key)) {
                            return true; // skip
                        }
                        return false;
                    }).map(function (value: any) {
                        return ({
                            "col1": value?.key,
                            "col2": value?.noOfDays,
                            "col3": value?.noOfTimesPerDay,
                            "col4": value?.qtyPerTimes,
                            "col5": value?.instruction,
                            "col6": value?.advice,
                            "col7": value?.diet,
                            "col8": "",
                            "col9": "",
                            "col10": "",
                            "col11": "",
                            "col12": "",
                            "col13": "",
                            "col14": "",
                            "col15": ""
                        })
                    });
                    linkDisease(checkedTest, 1)
                }
                if (type === 1) {
                    typePat = values.map((item: any) => {
                        return {
                            "col1": item,
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
                    })
                }
                const staticParams = {
                    "diseasesID": diseaseID,
                    "lstTypeInv": typePat,
                    "userID": -1,
                    "formID": -1,
                    "type": type
                };
                setLoading(true)
                const msg = await requestLinkDisease({ ...staticParams });
                setLoading(false)
                if (msg?.isSuccess === true) {
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
        }
    };
    const onChange = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isActive: e.target.checked
        })
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const setEditField = (data: any) => {
        form.setFieldsValue({
            diseaseTypeName: data?.diseaseName,
            diseaseTypeCode: data?.diseaseCodeICD,
            diseaseTypeID: data?.diseaseTypeID,
            specialTypeID: data?.specialTypeID,
            isActive: data?.isActive,
        })
        window.scrollTo(0, 0)
        setDiseaseID(data?.diseaseID)
    };
    const onEditingRecord = async (value: any, record: any) => {
        console.log(value)
        const i = itemList.findIndex(x => x.key === record.key)
        itemList[i] = { ...itemList[i], ...value }
        await setItemList([...itemList])
        console.log(itemList, i)
    }

    const saveData = async (record: any) => {
        // setItemList([])
        const newItem = linkMedForm.getFieldsValue()
        const i = itemList.findIndex(x => x.key === record.key)
        itemList[i] = { ...newItem, key: record.key, medicine: record.medicine }
        await setItemList([...itemList])
        setEditingKey('');
    }

    const columns = [
        {
            title: 'Medicine',
            dataIndex: 'medicine',
            key: 'medicine',
            width: '19%',
            // fixed: 'left',
            // render: (text: any) => <Checkbox>{text}</Checkbox>,
            // render: (_: any, record: any) => {
            //     const editable = isEditing(record);
            //     return (
            //         <>
            //             <Checkbox
            //                 checked={checkedList.find((item: any) => record?.key === item)}
            //                 // disabled={editingKey !== ''} 
            //                 // onClick={(t: any) => {
            //                 //     edit(record, t.target.checked)
            //                 // }}
            //                 onChange={(t: any) => {
            //                     edit(record, t.target.checked)
            //                 }}
            //             >{record?.medicine}</Checkbox>

            //         </>
            //     )
            // }
        },
        {
            title: 'No of Days',
            dataIndex: 'noOfDays',
            key: 'noOfDays',
            width: '10%',
            // editable: true,
            render: (_: any, record: any) => <Input
            type='number'
                onChange={(e: any) => onEditingRecord({ "noOfDays": e.target.value }, record,)}
                size='small' disabled={record.isSuccess === false} defaultValue={record.noOfDays}></Input>,
        },
        {
            title: 'No of Times/Day',
            dataIndex: 'noOfTimesPerDay',
            key: 'noOfTimesPerDay',
            width: '10%',
            editable: true,
            render: (_: any, record: any) => <Input size='small' type='number'
                onChange={(e: any) => onEditingRecord({ "noOfTimesPerDay": e.target.value }, record,)}
                disabled={record.isSuccess === false}
                defaultValue={record.noOfTimesPerDay}></Input>,
        },
        {
            title: 'Qty PerTimes',
            dataIndex: 'qtyPerTimes',
            key: 'qtyPerTimes',
            editable: true,
            width: '10%',
            render: (_: any, record: any) => <Input size='small' type='number'
                onChange={(e: any) => onEditingRecord({ "qtyPerTimes": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.qtyPerTimes}></Input>,
        },
        {
            title: 'Instruction',
            dataIndex: 'instruction',
            key: 'instruction',
            width: '19%',
            editable: true,
            render: (_: any, record: any) => <Input size='small'
                onChange={(e: any) => onEditingRecord({ "instruction": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.instruction}></Input>,
        },
        {
            title: 'Advice',
            dataIndex: 'advice',
            key: 'advice',
            width: '17%',
            editable: true,
            render: (_: any, record: any) => <Input size='small'
                onChange={(e: any) => onEditingRecord({ "advice": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.advice}></Input>,
        },
        {
            title: 'Diet',
            dataIndex: 'diet',
            key: 'diet',
            width: '15%',
            editable: true,
            render: (_: any, record: any) => <Input size='small'
            onChange={(e:any)=>onEditingRecord({"diet":e.target.value},record,)} 
                disabled={record.isSuccess === false} defaultValue={record.diet}></Input>,
        },
        {
            title: 'Save',
            dataIndex: 'diseaseID',
            key: 'diseaseID',
            width: '2%',
            // sorter: (a, b) => a.diseaseID - b.diseaseID,
            // sortDirections:'descend',
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Button onClick={() => saveData(record)} size='small'>ok</Button>
                ) : null
                // <Button onClick={() => edit(record,true)} size='small' icon={<EditOutlined />}/>
            }
        },

    ];
    const EditableCell: React.FC<EditableCellProps> = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps

    }) => {
        const inputNode = <Input min={1} type={dataIndex == "noOfDays" ? 'number' : 'text'} size='small' />;

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys, selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: onSelectChange,
    // };
    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            onSelectChange(selectedRowKeys)
        },
        onSelect: (record, selected, selectedRows) => {
            edit(record, selected)
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'medicine' ? 'text' : 'checked',
                dataIndex: col.key,
                title: col.title,
                editing: record.isSuccess == true//isEditing(record),
            }),
        };
    });

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase());//.toLowerCase()

    const onChangeCheck: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any) => {
        setCheckedTest(checkedValues);
        console.log(checkedValues, checkedTest)
    };
    const linkDiseaseMedicineForm = () => {
        return (

            <Row>
                <Card

                    title="Medicine"
                    style={{ width: '70%', boxShadow: '2px 2px 2px #4874dc' }}
                    extra={[]}
                >
                    <Form
                        form={linkMedForm}
                        component={false}>
                        <Table
                            rowSelection={rowSelection}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            rowClassName="editable-row"
                            size='small'
                            dataSource={itemList}
                            columns={columns}
                            pagination={false}
                        />
                    </Form>
                    <Col style={{ justifyContent: 'flex-end' }}>
                        <Button onClick={() => linkDisease(itemList, 2)} style={{ width: 100 }} size='large' type="primary" htmlType="submit">
                            Link
                        </Button>
                        <Button onClick={goBack}
                            style={{ marginLeft: 10, width: 100, }} type="default" >
                            Cancel
                        </Button>
                    </Col>
                </Card>



                <Card
                    title="Test"
                    style={{ width: '30%', boxShadow: '2px 2px 2px #4874dc' }}

                    extra={[]}
                >
                    <Checkbox.Group style={{ width: '100%' }} options={invParameterID}
                        onChange={onChangeCheck}
                        value={checkedTest}
                    />
                </Card>
            </Row>
        )
    }

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                    title={<Space>
                        <Typography>{"Link Disease Test/Medicine"}</Typography>
                        <Select
                            style={{ width: 400 }}
                            showSearch
                            filterOption={filterOption}
                            placeholder="Select Disease"
                            onChange={(t: any) => getDiseaseLinkedList(t)}
                            options={diseaseType}
                        />
                    </Space>}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            <Space direction="horizontal" size="middle" style={{ display: 'flex', }}>
                                {linkDiseaseMedicineForm()}
                            </Space>
                        </div>
                    </Spin>
                </Card>
            </Space>
        </PageContainer>
    );
};

export default AddDiseaseLink;