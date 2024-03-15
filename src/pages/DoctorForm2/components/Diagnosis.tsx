import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Image, Checkbox, Divider, InputRef, Table, message, TimePicker, Layout, Menu, Typography, Collapse } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import { requestAddDelPatientForDoctorOPIP, requestGetItemBalance } from '../services/api';
import { getUserInLocalStorage } from '@/utils/common';
import { requestDiseaseList, requestGetDiseaseLink } from '@/pages/Complaint/services/api';
import { ColumnsType } from 'antd/es/table';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { requestGetInvestigation } from '@/pages/Investigation/services/api';
import { TableRowSelection } from 'antd/es/table/interface';
import Investigation from './Investigation';
import Medication from './Medication';
import { requestGetItem } from '@/pages/MedicalStore/services/api';
import TextArea from 'antd/es/input/TextArea';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: any;
    index: number;
    children: React.ReactNode;
}


const Diagnosis = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
    const result4 = patientDetails?.result4 && admNo ? patientDetails?.result4.filter((p: any) => p.admNo == admNo)
        : patientDetails?.result4
    // const { result4 } = patientDetails;
    const result5 = patientDetails;
    const result6 = patientDetails;
    const [tabForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [diseaseList, setDiseaseList] = useState([]);
    const [invParameterID, setInvParameterID] = useState([]);
    const [diseaseID, setDiseaseID] = useState<any>("-1");
    const [checkedTest, setCheckedTest] = useState<any>([]);
    const [checkedList, setCheckedList] = useState<any>([]);
    const [checkedMedicine, setCheckedMedicine] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [itemList, setItemList] = useState<any>([]);






    const columns: ColumnsType<any> = [
        // {
        //     title: 'admNo',
        //     key: 'admNo',
        //     dataIndex: 'admNo',

        // },
        // {
        //     title: 'enterDate',
        //     key: 'enterDateVar',
        //     dataIndex: 'enterDateVar',
        // },
        {
            title: 'Disease Name',
            key: 'diseaseName',
            dataIndex: 'diseaseName',

        },
        // {
        //     title: 'Comment',
        //     key: 'diagnosisComment',
        //     dataIndex: 'diagnosisComment',

        // },
        {
            title: 'Disease Type',
            key: 'diseaseTypeName',
            dataIndex: 'diseaseTypeName',

        },
        {
            width: '18%',
            title: 'Delete',
            key: 'delete',
            render: (_, record) => <CloseOutlined style={{ alignItems: 'center', color: 'red' }} onClick={() => onFinishPatForm(record, true)} />
        }

    ];
    const medColumns = [
        {
            title: 'Medicine',
            dataIndex: 'commonName',
            key: 'commonName',
            width: '15%',
        },
        {
            title: 'No of Days',
            dataIndex: 'noOfDays',
            key: 'noOfDays',
            width: '11%',
            // editable: true,
            render: (_: any, record: any) => <Input
                onInputCapture={() => console.log("onInputCapture")}
                onBlur={(e: any) => console.log("onBlur", e.target.value)}
                min={1}
                type='number'
                onChange={(e: any) => onChangeEdit({ "noOfDays": e.target.value }, record,)}
                size='small' disabled={record.isSuccess === false} defaultValue={record.noOfDays}></Input>,
        },
        {
            title: 'No of Times/Day',
            dataIndex: 'noOfTimesPerDay',
            key: 'noOfTimesPerDay',
            width: '11%',
            editable: true,
            render: (_: any, record: any) => <Input min={1} size='small' type='number'
                onChange={(e: any) => onChangeEdit({ "noOfTimesPerDay": e.target.value }, record,)}
                disabled={record.isSuccess === false}
                defaultValue={record.noOfTimesPerDay}></Input>,
        },
        {
            title: 'Qty PerTimes',
            dataIndex: 'qtyPerTimes',
            key: 'qtyPerTimes',
            editable: true,
            width: '11%',
            render: (_: any, record: any) => <Input min={1} size='small' type='number'
                onChange={(e: any) => onChangeEdit({ "qtyPerTimes": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.qtyPerTimes}></Input>,
        },
        {
            title: 'Instruction',
            dataIndex: 'instruction',
            key: 'instruction',
            width: '19%',
            editable: true,
            render: (_: any, record: any) => <TextArea size='small' autoSize
                onChange={(e: any) => onChangeEdit({ "instruction": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.instruction}></TextArea>,
        },
        {
            title: 'Advice',
            dataIndex: 'advice',
            key: 'advice',
            width: '17%',
            editable: true,
            render: (_: any, record: any) => <TextArea size='small' autoSize
                onChange={(e: any) => onChangeEdit({ "advice": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.advice}></TextArea>,
        },
        {
            title: 'Diet',
            dataIndex: 'diet',
            key: 'diet',
            width: '16%',
            editable: true,
            render: (_: any, record: any) => <TextArea size='small' autoSize
                onChange={(e: any) => onChangeEdit({ "diet": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.diet}></TextArea>,
        },
    ];

    useEffect(() => {
        getDiseaseList();
        getInvParameter();
        getItemList();
    }, [])

    const onEditingRecord = async (value: any, record: any) => {
        console.log(value)
        const i = checkedMedicine.findIndex(x => x.key === record.key)
        checkedMedicine[i] = { ...checkedMedicine[i], ...value }
        await setCheckedMedicine([...checkedMedicine])
        console.log(checkedMedicine, i)
    }
    let timer: any;

    const waitTime = 1000;

    function doneTyping(value: any, record: any) {
        onEditingRecord(value, record);
        console.log(`The user is done typing: ${value}`);
    }
    const onChangeEdit = (value: any, record: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            doneTyping(value, record);
        }, waitTime);
    }


    const getDiseaseList = async () => {
        const params = {
            "diseaseID": "-1",
            "diseaseTypeID": "-1",
            "specialTypeID": "-1",
            "isActive": "-1",
            "type": 1
        }
        const res = await requestDiseaseList(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: string) => {
                return { value: item.diseaseID, label: item.diseaseName, title: item.diseasesImage }
            })
            setDiseaseList(dataMaskForDropdown)
            // getDiseaseLinkedList(dataMaskForDropdown[0].value)
        }
    }
    const filterOption = (input: string, patientList?: { label: string; value: string }) =>
        (patientList?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onFinishPatForm = async (values: any, isDelete: any = false) => {
        console.log(values)
        const params = {
            "patientCaseID": patientCaseID,
            "admNo": admNo,
            "col1": values?.diseasesID ? values.diseasesID :"",    
            "col2": values?.DiagnosisComment ? values?.DiagnosisComment : "",
            "col3": values?.admNo ? values?.admNo :"",
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
            "col15": "",
            "col16": "",
            "col17": "",
            "col18": "",
            "col19": "",
            "col20": "",
            "col21": "",
            "col22": "",
            "isForDelete": isDelete,
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
            "type": 3
        }
        try {
            setLoading(true)
            const response = await requestAddDelPatientForDoctorOPIP({ ...params });
            setLoading(false)


            if (response?.isSuccess) {
                tabForm.resetFields();
            }
            onSaveSuccess({
                tab: "DIAGNOSIS",
                response
            })
        } catch (e) {
            setLoading(false)
        }
    };
    const formView = () => {

        const handleChangeFilter = (value: any) => { }

        return (
            <Form
                form={tabForm}
                onFinish={onFinishPatForm}
                layout="vertical"
                size={'small'}
            >

                <Row gutter={16}>

                    <Col span={12}>
                        <Form.Item name="DiseasesID" label="Disease" rules={[{ required: true }]}>
                            <Select
                                showSearch
                                options={diseaseList}
                                placeholder="Select"
                                filterOption={filterOption}
                                mode="multiple"
                            />
                        </Form.Item>
                    </Col>

                    {/* <Col span={12}>
                        <Form.Item name="DiagnosisComment" label="Comment" rules={[{ required: false }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col> */}
                </Row>

                <Form.Item>
                    <Button type="primary" loading={loading} htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        )
    }
    const saveAllData = async () => {
        const med = checkedMedicine.filter(function (value: any) {
            if (selectedRowKeys.find((element: any) => element == value?.key)) {
                return true; // skip
            }
            return false;
        }).map(function (item: any) {
            return (item)
        });
        const params = {
            "patientCaseID": patientCaseID,
            "admNo": admNo,
            "col1": diseaseID.value,
            "col2": "",//values?.DiagnosisComment ? values?.DiagnosisComment : "",
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
            "type": 3
        }
        for (let i = 0; i < med.length; i++) {
            let medParams = {
                "patientCaseID": patientCaseID,
                "admNo": admNo,
                "col1": med[i]?.key ? med[i]?.key : "",
                "col2": med[i]?.noOfDays ? "" + parseInt(med[i]?.noOfDays, 10) : "",
                "col3": med[i]?.qtyPerTimes ? "" +
                    parseInt(med[i]?.qtyPerTimes, 10) * parseInt(med[i]?.noOfTimesPerDay, 10) : "",//QuantityPerDay
                "col4": med[i]?.instruction ? med[i]?.instruction : "",
                "col5": med[i]?.advice ? med[i]?.advice : "",
                "col6": med[i]?.diet ? med[i]?.diet : "",
                "col7": "",
                "col8": "",
                "col9": med[i]?.qtyPerTimes ? "" + parseInt(med[i]?.qtyPerTimes, 10)
                    * parseInt(med[i]?.noOfTimesPerDay, 10) * parseInt(med[i]?.noOfDays, 10) : "",
                "col10": med[i]?.noOfTimesPerDay ? "" + parseInt(med[i]?.noOfTimesPerDay, 10) : "",
                "col11": "",//checkedMedicine[i]?.UnitIDForDoc ? "" + checkedMedicine[i]?.UnitIDForDoc : 
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
            setLoading(true)
            const response = await requestAddDelPatientForDoctorOPIP({ ...medParams });
            setLoading(false)
            if (response?.isSuccess) {
                tabForm.resetFields();
            }
            onSaveSuccess({
                tab: "MEDICATION",
                response
            })
            // saveMedParams.push(medParams)//callapi
        }
        const invParams = {
            "patientCaseID": patientCaseID,
            "admNo": admNo,
            "col1": "",
            "col2": "",//values?.InvParameterResult ? values?.InvParameterResult :
            "col3": "",//values?.InvRemark ? values?.InvRemark :
            "col4": "",
            "col5": "",
            "col6": "",// values?.NoOfInjection ? "" + values?.NoOfInjection :
            "col7": checkedTest.toString(),
            "col8": "",
            "col9": "",
            "col10": "",
            "col11": "",
            "col12": "",
            "col13": "",
            "col14": "",
            "col15": "",
            "col16": "",
            "col17": "",
            "col18": "",
            "col19": "",
            "col20": "",
            "col21": moment().format(dateFormat),
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
            "type": 5
        }
        try {
            setLoading(true)
            const response = await requestAddDelPatientForDoctorOPIP({ ...params });
            const response1 = await requestAddDelPatientForDoctorOPIP({ ...invParams });
            setLoading(false)

            if (response?.isSuccess) {
                tabForm.resetFields();
            }
            if (response?.isSuccess) {
                onSaveSuccess({
                    tab: "DIAGNOSIS",
                    response
                })
            }
            if (response1?.isSuccess) {
                onSaveSuccess({
                    tab: "INVESTIGATION",
                    response:response1
                })
            }
        } catch (e) {
            setLoading(false)
        }
    }

    const { Header, Content, Footer } = Layout;
    const contentStyle: React.CSSProperties = {
        textAlign: 'center',
        minHeight: 120,
        lineHeight: '120px',
        color: '#fff',
        backgroundColor: '#fff',
    };

    const siderStyle: React.CSSProperties = {
        textAlign: 'center',
        lineHeight: '120px',
        color: '#fff',
        backgroundColor: '#fff',
    };

    const footerStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#4096ff',
    };

    const layoutStyle = {
        borderRadius: 8,
        overflow: 'hidden',
        width: 'calc(100% - px)',
        maxWidth: 'calc(100% - 0px)',
    };
    const headerStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#fff',
        height: 64,
        paddingInline: 48,
        lineHeight: '64px',
        backgroundColor: '#4096ff',
    };

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
    const getDiseaseLinkedList = async (diseaseId: any, type: any = 2) => {
        console.log(diseaseId.title)
        setDiseaseID(diseaseId)
        const staticParams = {
            "diseaseID": diseaseId.value,
            "userID": -1,
            "formID": -1,
            "type": type
        }
        setLoading(true)
        const res = await requestGetDiseaseLink(staticParams);
        if (res?.isSuccess === true && type === 2) {
            let check: any = [];
            const dataDrop = await Promise.all(res?.result.map(async (item: any) => {
                const balQuantitySum = await getItemBalance(item.itemID)
                // if (balQuantitySum > 0)
                check.push(item.itemID);
                return {
                    ...item,
                    key: item.itemID,
                    commonName: `${item.commonName} [${balQuantitySum}]`,
                    balQuantitySum: balQuantitySum,
                }
            }))
            console.log(dataDrop)
            setCheckedMedicine(dataDrop)
            setSelectedRowKeys(check)
            getDiseaseLinkedList(diseaseId, 1)
        }
        if (res?.isSuccess === true && type === 1) {
            const list = res?.result.map((item: any) => {
                return { value: item.invParameterID, label: item.commonName };
            })
            const list1 = res?.result.map((item: any) => {
                return (item.invParameterID);
            })
            setCheckedList(list)
            setCheckedTest(list1)
        }
        else {
            setLoading(true)
        }
        setLoading(false)
    }
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
                    label: item?.itemName,
                    value: item?.itemID,
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
    const getItemBalance = async (item: any) => {
        const params = {
            "itemID": item,
            "itemCatID": -1,
            "sectionID": -1,
            "fundID": -1,
            "productID": -1,
            "unitID": -1,
            "curDate": "",
            "userID": -1,
            "formID": 1,
            "type": 1
        }
        const res = await requestGetItemBalance(params);
        if (res?.result?.length == 0) {
            return 0
        }
        else if (res?.isSuccess == true) {
            return (res?.result[0].balQuantitySum)
            // const dataMaskForDropdown = res?.result.map((item: any) => {
            //     return { value: item.itemID, label: `${item.itemName} ${sum}` }
            // })
        }
    }
    const onChangeCheck: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any) => {
        setCheckedTest(checkedValues);
        console.log(checkedValues, checkedTest)
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys, selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            onSelectChange(selectedRowKeys)
        },
        // getCheckboxProps: (record: any) => ({
        //     disabled: record?.balQuantitySum === 0, // Column configuration not to be checked
        // }),
        onSelect: (record, selected, selectedRows) => {
            const i = itemList.findIndex(x => x.key === record.key)
            itemList[i] = { ...record, isSuccess: selected }
            setItemList([...itemList])

            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
        },
    };
    const addInvItem = (value: any, option: any) => {
        if (option === 'remove') {
            console.log(checkedList)
            const selected = checkedList.filter((item: any) => item.value != value.value);
            const selectedChk = checkedTest.filter((item: any) => item != value.value);
            setCheckedList(selected)
            setCheckedTest(selectedChk)
        }
        if (option === 'add') {
            const found = checkedList.find((item: any) => item.value === value.value);
            if (!found) {
                setCheckedList([...checkedList, value])
                setCheckedTest([...checkedTest, value.value])
            }
            else message.error("This Test Already Added")
        }
    }
    const addMedicine = async (value: any) => {
        console.log(itemList, checkedMedicine, value)
        const found = checkedMedicine.find((item: any) => item.key === value.key);
        if (!found) {
            const balQuantitySum = await getItemBalance(value.key)
            const item: any = {
                medicine: value?.label,
                commonName: `${value?.label} [${balQuantitySum}]`,
                noOfDays: "1",
                noOfTimesPerDay: "1",
                qtyPerTimes: "1",
                instruction: "",
                advice: "",
                diet: "",
                isSuccess: true,
                balQuantitySum: balQuantitySum,
                ...value
            }
            setCheckedMedicine([...checkedMedicine, item])
            // if (item.balQuantitySum > 0)
            setSelectedRowKeys([...selectedRowKeys, value.key])
        }
        else message.error("This Medicine Already Added")
    }

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
    return (
        // <Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
        //     <Card>
        //         {formView()}
        //     </Card>
        //     <Table
        //         columns={columns}
        //         size="small"
        //         dataSource={result4}
        //         pagination={false}
        //     />
        // </Space>

        <Layout style={layoutStyle}>
            <Layout>
                <Sider width="50%" style={siderStyle}>
                    <Card hoverable style={{ overflow: 'auto', }}>
                        <Row style={{ justifyContent: 'space-between' }}>

                            <Col span={18}>
                                <Typography style={{ color: 'blue', fontSize: 22, }}>{"Select Disease"}</Typography>
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch
                                    // defaultValue={"1"}
                                    labelInValue
                                    options={diseaseList}
                                    placeholder="Select"
                                    onChange={(t: any) => getDiseaseLinkedList(t)}
                                    filterOption={filterOption}
                                />
                            </Col>
                            <Col span={6}>
                                <Image width={100}
                                    src={`data:image/png;base64,${diseaseID?.title}`}
                                /></Col>
                        </Row>

                    </Card>
                    <Card
                        title={
                            <Row style={{ justifyContent: 'space-between' }}><Typography>{"Medicine List"}</Typography>
                                <Select
                                    labelInValue
                                    style={{ width: '70%' }}
                                    showSearch
                                    options={itemList}
                                    placeholder="Search Medicine..."
                                    filterOption={filterOption}
                                    onSelect={(item: any) => addMedicine(item)}
                                /></Row>}
                        hoverable
                        style={{ width: '100%' }}
                        cover={
                            <Table
                                rowSelection={rowSelection}
                                scroll={{ y: 180 }}
                                columns={medColumns}
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                size="small"
                                dataSource={checkedMedicine}
                                pagination={false}
                            />
                        }
                    >

                    </Card>
                    <Row style={{ overflow: 'auto' }}>

                    </Row>
                    <Collapse items={[{
                        key: '1',
                        label: 'Test List',
                        children: <Card
                            // title="Investigation List"
                            hoverable
                            style={{ width: '100%' }}
                            cover={
                                <Table
                                    scroll={{ y: 200 }}
                                    // style={{ width: '100%', height: 250 }}
                                    columns={[{
                                        title: 'Test',
                                        key: 'label',
                                        dataIndex: 'label',
                                        render: (_, record) => <Row style={{ justifyContent: 'space-between' }}><Typography>{record.label}</Typography>
                                            <CloseOutlined onClick={() => addInvItem(record, 'remove')} style={{ color: 'red' }} /></Row>
                                    }]}
                                    size="small"
                                    dataSource={checkedList}
                                    pagination={false}
                                />
                            }
                        >
                            <Select
                                labelInValue
                                value={"Search Test"}
                                style={{ width: '100%' }}
                                showSearch
                                options={invParameterID}
                                placeholder="Search Investigation"
                                filterOption={filterOption}
                                onSelect={(item: any) => addInvItem(item, 'add')}
                            // mode="multiple"
                            />
                        </Card>,
                    },]} />

                    <Col style={{ justifyContent: 'flex-end' }}>
                        <Button onClick={() => saveAllData()} style={{ width: 100 }} size='middle' type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Col>
                </Sider>
                <Content style={contentStyle}>
                    <Table
                        scroll={{ y: 200 }}
                        columns={columns}
                        size="small"
                        dataSource={result4}
                        pagination={false}
                    />
                    <Medication
                        patientCaseID={patientCaseID}
                        admNo={admNo}
                        showForm={true}
                        showTable='visible'
                        patientDetails={result5}
                        onSaveSuccess={onSaveSuccess} />
                    <Investigation
                        patientCaseID={patientCaseID}
                        admNo={admNo}
                        patientDetails={result6}
                        onSaveSuccess={onSaveSuccess}
                    />
                </Content>
            </Layout >
            {/* <Footer style={footerStyle}>Footer</Footer> */}
        </Layout >
    );

};

export default Diagnosis;