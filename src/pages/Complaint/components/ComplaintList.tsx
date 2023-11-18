import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Typography, Popconfirm, Checkbox } from 'antd';
import { requestGetComplaintType, requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestDiseaseList } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const { Option } = Select;

interface Item {
    key: string;
    name: string;
    isActive: boolean;
    address: string;
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


const ComplaintList = ({ visible }: any) => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [complaintList, setComplaintList] = useState<any>([])
    const { token } = theme.useToken();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Item) => record.key === editingKey;
    // const [isActive, setisActive] = useState<any>([{ value: "true", label: "True" }, { value: "false", label: "False" }])
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        getComplaintList();
    }, [])

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
        const inputNode = inputType === 'text' ?
            // <Select
            //     // defaultValue={selectedRows?.genderID}
            //     placeholder="Select gender"
            //     optionFilterProp="children"
            //     options={isActive}
            // />
            <Checkbox checked={isActive} onChange={onChangeServiceStatus}>IsActive</Checkbox>
            : <Input style={{ width: '100%' }} size='large' />;
        console.log(inputType)

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ width: '100%' }}
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
    const onChangeServiceStatus = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isService: e.target.checked ? "true" : "false"
        })
        setIsActive(e.target.checked)
        // setVatApplicable(e.target.checked)

    };
    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'complaintTypeName',
            key: 'complaintTypeName',
            // render: (text) => <a>{text}</a>,
            editable: true,
            width: '35%',

        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '15%',
            render: (text: any) =>
                // <Select
                //     // defaultValue={selectedRows?.genderID}
                //     placeholder="Select gender"
                //     optionFilterProp="children"
                //     options={isActive}
                // />,
                <Typography align="center" style={{
                    width: '80%',
                    backgroundColor: text=="true" ?'#00FF00' : '#EBEBE4', justifyContent: 'center', borderRadius: 10,
                }}>
                    {text=="true" ? 'Active' : 'InActive'}</Typography>,
            editable: true
        },
        {
            title: 'Type',
            dataIndex: 'complaintTypeCode',
            key: 'TypeCode',
            editable: true,
            width: '25%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '25%',
            render: (_: any, record: any) => {
                // console.log({record:record});
                const editable = isEditing(record);
                return editable ? (
                    <span style={{ width: 60, }}>
                        <Typography.Link onClick={() => saveComplaint(record?.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link style={{ width: 100 }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        console.log(record)
        form.setFieldsValue({ complaintTypeName: '', complaintTypeCode: '', isActive: '', rowID: '', ...record });
        setEditingKey(record.key);
    };
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'isActive' ? 'text' : 'string',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const saveComplaint = async (key: any) => {
        const editValues = (await form.validateFields()) as Item;
        const index: any = complaintList.find((item: any) => key === item.key);
        try {
            const staticParams = {
                "complaintTypeID": index?.complaintTypeID,
                // "complaintTypeName": index?.complaintTypeName,
                // "complaintTypeCode": index?.complaintTypeCode,
                // "isActive": index?.isActive,
                "sortOrder": "",
                "formID": -1,
                "type": 1,
            };
            console.log(index, editValues);

            setLoading(true)
            const msg = await requestAddComplaint({ ...editValues, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                setEditingKey('');
                message.success(msg.msg);
                return;
            } else {
                message.error(msg.msg);
                setEditingKey('');
            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };
    const cancel = () => {
        setEditingKey('');
    };

    const formSubmit = async (values: any) => {
        console.log(values);
    }

    const getComplaintList = async () => {
        const staticParams = {
            "complaintTypeID": "-1",
            "isActive": "-1",
            "type": "1"
        }
        const res = await requestGetComplaintType(staticParams);
        if (res.result.length > 0) {
            console.log(res.result);
            const dataMaskForDropdown = res?.result?.map((item: any, index: number) => {
                return {
                    key: index,
                    complaintTypeName: item.complaintTypeName,
                    isActive: item.isActive.toString(),
                    complaintTypeCode: item.complaintTypeCode,
                    complaintTypeID: item.complaintTypeID,
                    rowID: item.rowID,
                    sortOrder: item.sortOrder
                }
            })
            setComplaintList(dataMaskForDropdown)
            console.log(dataMaskForDropdown)
        }
    }

    return (
        // <PageContainer
        //     style={{ backgroundColor: '#4874dc', height: 120 }}
        // >
        <Form
            // initialValues={{diseaseTypeID:diseaseList?.diseaseTypeID}}
            form={form}
            component={false}>
            <Card
                title="ComplaintType List"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <div style={contentStyle}>
                    {complaintList &&
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            columns={mergedColumns}
                            dataSource={complaintList}
                            rowClassName="editable-row"
                            pagination={{
                                onChange: cancel,
                            }}
                        />}
                </div>
            </Card>
        </Form>
        // </PageContainer>
    );
};

export default ComplaintList;