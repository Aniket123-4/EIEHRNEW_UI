import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Popconfirm, Typography } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestDiseaseList } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    diseaseID: string;
    diseaseName: string;
    isActive: boolean;
    diseaseTypeName: string;
    specialTypeName: string;
    //   "diseaseCodeICD": "",
    //   "diseaseTypeID": "1",
    //   "sortOrder": "1",
    //   "specialTypeID": "2",
}


interface Item {
    key: string;
    name: string;
    age: number;
    address: string;
  }
const DiseaseList = ({ visible }: any) => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseList, setDiseaseList] = useState<any>([])
    const { token } = theme.useToken();

    const [data, setData] = useState();
    const [editingKey, setEditingKey] = useState('');


    useEffect(() => {
        getDiseaseList();
    }, [])
    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    const columns: ColumnsType<EditableCellProps> = [
        {
            title: 'Name',
            dataIndex: 'diseaseName',
            // key: 'name',
            render: (text) => <a>{text}</a>,
            editable: true
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            editable: true
        },
        {
            title: 'Disease Type',
            dataIndex: 'diseaseTypeName',
            key: 'diseaseTypeName',
            editable: true
        },
        {
            title: 'DiseaseTypeName',
            key: 'specialTypeName',
            dataIndex: 'specialTypeName',
            editable: true
        },
        {
            title: 'Action',
            key: 'action',
            // render: (_, record) => (
            //     <Space size="middle">
            //         <a onClick={(i)=>console.log(i)}>View</a>
            //         <a>Edit</a>
            //     </Space>
            // ),
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Item;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const formSubmit = async (values: any) => {
        console.log(values);
    }
    const getDiseaseList = async () => {
        const params = {
            "diseaseID": "-1",
            "diseaseTypeID": "-1",
            "specialTypeID": "2",
            "isActive": "1",
            "type": 1
        }
        const res = await requestDiseaseList(params);
        // console.log(res.result);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.roomTypeID, label: item.roomTypeName }
            })
            console.log(res.result);

        }
        setDiseaseList(res.result)
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
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

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
        <PageContainer
            style={{  }}
        >
            <Card
                title="Disease List"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <div style={contentStyle}>
                    {diseaseList && 
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        rowClassName="editable-row"
                        columns={columns} dataSource={diseaseList} />}
                </div>
            </Card>
        </PageContainer>
    );
};

export default DiseaseList;