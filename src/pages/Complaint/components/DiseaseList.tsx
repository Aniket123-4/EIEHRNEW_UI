import React, { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Popconfirm, Table, Typography, message } from 'antd';
import { requestAddDisease, requestDiseaseList } from '../services/api';

interface Item {
    key: string;
    name: string;
    age: number;
    address: string;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
    originData.push({
        key: i.toString(),
        name: `Edward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
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

const DiseaseList: React.FC = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const [diseaseList, setDiseaseList] = useState([]);
    const [loading, setLoading] = useState(false)

    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        console.log(record.key)
        form.setFieldsValue({ diseaseName: '', isActive: '', diseaseTypeName: '', ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };
    useEffect(() => {
        getDiseaseList();
    }, [])

    const getDiseaseList = async () => {
        const params = {
            "diseaseID": "-1",
            "diseaseTypeID": "-1",
            "specialTypeID": "2",
            "isActive": "1",
            "type": 1
        }
        const res = await requestDiseaseList(params);
        if (res.result.length> 0) {
            console.log(res.result);
            const dataMaskForDropdown = res?.result?.map((item: any,index:string) => {
                return { key: index, ...item }
            })
            setDiseaseList(dataMaskForDropdown)
            console.log(dataMaskForDropdown);
        }
    }

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
    const saveDisease = async (key: any) => {
        const editValues = (await form.validateFields()) as Item;
        const index:any = diseaseList.find((item) => key === item.key);
        // console.log(index); 
        // console.log(editValues);
        try {
            const staticParams = {
                "DiseaseTypeCode":index?.diseaseCodeICD,
                "SpecialTypeID":index?.specialTypeID,
                "diseaseTypeID":index?.diseaseTypeID,
                "sortOrder": 1,
                "diseasesID": "-1",
                "isActive": "1",
                "formID": -1,
                "type": 1
            };

            setLoading(true)
            const msg = await requestAddDisease({ ...editValues, ...staticParams });
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


    const columns = [
        {
            title: 'Name',
            dataIndex: 'diseaseName',
            // render: (text) => <a>{text}</a>,
            editable: true
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            editable: true,
            render: (text:any ) => <Typography>{text.toString}</Typography>,

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
            dataIndex: 'operation',
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span style={{width:60,}}>
                        <Typography.Link onClick={() => saveDisease(record?.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link style={{width:100}} disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form 
        // initialValues={{diseaseTypeID:diseaseList?.diseaseTypeID}}
        form={form} 
        component={false}>
            <Card
                title="Investigation List"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                
                dataSource={diseaseList}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{   
                    onChange: cancel,
                }}
            />
            </Card>
        </Form>
    );
};

export default DiseaseList;