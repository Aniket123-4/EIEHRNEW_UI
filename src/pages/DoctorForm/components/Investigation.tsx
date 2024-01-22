import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, Tree, TreeProps } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { getUserInLocalStorage } from '@/utils/common';
import { ColumnsType } from 'antd/es/table';
import { requestGetInvGroup, requestGetInvParameterMasterList, requestServiceList } from '@/pages/Complaint/services/api';
import { DataNode } from 'antd/es/tree';
import { requestAddDelPatientForDoctorOPIP } from '../services/api';
import moment from 'moment';


const Investigation = ({ patientDetails = {}, patientCaseID, onSaveSuccess }: any) => {
    const { result6 } = patientDetails;
    const [tabForm] = Form.useForm();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const { verifiedUser } = getUserInLocalStorage();
    const [diseaseList, setDiseaseList] = useState([]);
    const [defExpandedKeys, setDefExpandedKeys] = useState<any>(["1"]);
    const [groupList, setGroupList] = useState<DataNode[]>();
    const [totalRate, setTotalRate] = useState<any>(0);
    const [defCheckedKeys, setDefCheckedKeys] = useState<any>([]);
    const [invArr, setInvArr] = useState("0");



    const columns: ColumnsType<any> = [
        {
            title: 'Inv Parameter',
            key: 'invParameterName',
            dataIndex: 'invParameterName',
            fixed: 'left',

        }, {
            title: 'Inv Serial No',
            key: 'invSerialNo',
            dataIndex: 'invSerialNo',
            fixed: 'left',
        },
        {
            title: 'Date',
            key: 'invParameterDateVar',
            dataIndex: 'invParameterDateVar',
        },
        {
            title: 'Result',
            key: 'invParameterResult',
            dataIndex: 'invParameterResult',

        }, {
            title: 'Section',
            key: 'sectionName',
            dataIndex: 'sectionName',

        }, {
            title: 'Remark',
            key: 'invRemark',
            dataIndex: 'invRemark',

        }, {
            title: 'Insurance Comp',
            key: 'insuranceComp',
            dataIndex: 'insuranceComp',

        },
        {
            title: 'Entry',
            key: 'entryDate',
            dataIndex: 'entryDate',

        },
        {
            title: 'Unit',
            key: 'unitName',
            dataIndex: 'unitName',

        },
        {
            title: 'Lab Serial No',
            key: 'labSerialNo',
            dataIndex: 'labSerialNo',

        },
        {
            title: 'Enter By',
            key: 'enterBy',
            dataIndex: 'enterBy',

        }, {
            title: 'Sample Receiving',
            key: 'sampleReceivingDate',
            dataIndex: 'sampleReceivingDate',

        }, {
            title: 'Submit Date',
            key: 'submitDate',
            dataIndex: 'submitDate',

        }, {
            title: 'Is Nursing Done',
            key: 'isNursingDone',
            dataIndex: 'isNursingDone',

        }, {
            title: 'Is XRay Exists',
            key: 'isXRayExists',
            dataIndex: 'isXRayExists',

        }, {
            title: 'No Of Injection',
            key: 'noOfInjection',
            dataIndex: 'noOfInjection',

        }, {
            title: 'ML',
            key: 'invParameterNameML',
            dataIndex: 'invParameterNameML',

        }, {
            title: 'Is Normal',
            key: 'isNormal',
            dataIndex: 'isNormal',

        }, {
            title: 'Remark',
            key: 'remarkDoc',
            dataIndex: 'remarkDoc',

        }, {
            title: 'Volume',
            key: 'volume',
            dataIndex: 'volume',

        }, {
            title: 'Group',
            key: 'invGroupName',
            dataIndex: 'invGroupName',
            fixed: 'right',
        },
        {
            title: 'Normal text',
            key: 'normaltext',
            dataIndex: 'normaltext',
            fixed: 'right',
        },

    ];

    useEffect(() => {
        getInvGroup();
    }, [])

    const getInvGroup = async () => {
        const params = {
            "invGroupID": -1,
            "discountParameterID": -1,
            "isActive": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetInvGroup(params);
        // console.log(res);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: any) => {
                return {
                    key: `${item.invGroupID}`, title: item.invGroupName, disableCheckbox: true,
                }
            })
            setGroupList(dataMaskForDropdown)
            console.log(defExpandedKeys)

            // setDefExpandedKeys(groups)
        }
    }

    const onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setDefExpandedKeys(expandedKeysValue);
        // setAutoExpandParent(false);
    };

    const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
        list.map((node) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, []),
                };
            }
            return node;
        });


    const onLoadData = ({ key, children }: any) =>
        new Promise<void>(async (resolve) => {
            const params = {
                "invParameterID": -1,
                invGroupID: parseInt(key, 10) ? parseInt(key, 10) : 1,
                "isActive": -1,
                "formID": -1,
                "type": 1
            }
            // console.log(loadedKeys)
            setTimeout(async () => {
                const res = await requestGetInvParameterMasterList(params);
                if (res?.result?.length > 0) {
                    const dataMaskForDropdown = res?.result?.map((item: any) => {
                        // setDefCheckedKeys(defCheckedKeys.push(item.invParameterID))
                        return {
                            key: `${item.invParameterID} `, title: `${item.invName}    @${item.invRate} ₹/-`,
                            isLeaf: true, invRate: item.invRate
                        }
                    })
                    setTimeout(() => {
                        if (dataMaskForDropdown.length > 0)
                            setGroupList((origin) =>
                                updateTreeData(origin, key, dataMaskForDropdown),
                            );
                        resolve();
                    }, 1000);
                }
                else {
                    setGroupList((origin) => updateTreeData(origin, key, []))
                    resolve();
                    message.error("NO INVESTIGATION PARAMETER FOUND FOR THIS GROUP");
                }
            }, 1000);

        });

    const onCheck: TreeProps['onCheck'] = (checkedKeys, info: any) => {
        const rate = info && info?.checkedNodes?.map((item: any) => {
            return (item?.invRate)
        })

        const totalRate = rate.reduce((a: number, b: number) => parseInt(a) + parseInt(b))
        setTotalRate(totalRate)

        tabForm.setFieldsValue({ serviceCost: totalRate })

        const d = removeDuplicates(checkedKeys)
        setInvArr(d.toString().trim())
        setDefCheckedKeys(checkedKeys);
    };

    function removeDuplicates(arr: any[]) {
        return [...new Set(arr)];
    }

    const getServiceList = async (ServiceID: any = -1, type: any = 1) => {
        const params = {
            ServiceID,
            type
        }
        const res = await requestServiceList(params);
        if (type == 3) {
            const groups = res?.result?.map((item: any) => {
                return item?.groupID.trim()
            })
            const invParams = res?.result?.map((item: any) => {
                return item?.invParameterID + " "
            })
            setDefCheckedKeys(invParams)
            setDefExpandedKeys(groups)
            setInvArr(invParams.toString().trim())
        }
        if (res.result.length > 0) {
            const data = res?.result[0]
            // setIsActive(data?.isActive);
            // setServiceID(data?.serviceID)

            // form?.setFieldsValue({
            //     serviceName: data?.serviceName,
            //     serviceCost: data?.serviceCost,
            //     invGroupID: data?.m39_InvGroupID,
            //     sgstPercent: data?.sgstPercent,
            //     cgstPercent: data?.cgstPercent,
            //     serviceTo: dayjs(data?.serviceTo),
            //     serviceFrom: dayjs(data?.serviceFrom),
            // });
            if (type == 1) getServiceList(params.ServiceID, 3)
        }
    }


    const onFinishPatForm = async (values: any) => {
        const params = {
            "patientCaseID": patientCaseID,
            "admNo": "1",
            "col1": "",
            "col2": values?.InvParameterResult,
            "col3": values?.InvRemark,
            "col4": "",
            "col5": "",
            "col6": values?.NoOfInjection,
            "col7": invArr,
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
            "col21": moment(values?.InvParameterDate).format(dateFormat),
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

                    {/* <Form.Item name="InvParameterID" label="Inv Parameter" rules={[{ required: true }]}>
                            <Select
                                options={[]}
                                placeholder="Select"
                            />
                        </Form.Item> */}
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="InvParameterID"
                            valuePropName="checked"
                            // initialValue={true}
                            label={"Investigation Parameter"}
                            rules={[{ required: false, message: 'Please select' }]}
                        >
                            {defExpandedKeys && <Tree
                                checkable
                                onExpand={onExpand}
                                loadData={onLoadData}
                                height={140}
                                rootStyle={{ width: 400 }}
                                expandedKeys={defExpandedKeys}
                                onCheck={onCheck}
                                checkedKeys={defCheckedKeys}
                                treeData={groupList}
                            />}
                        </Form.Item>
                    </Col>



                </Row>
                <Row gutter={16}>

                    <Col span={8}>
                        <Form.Item name="InvParameterResult" label="Inv Parameter Result" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="InvRemark" label="Inv Remark" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="InvParameterDate" label="Date" rules={[{ required: true }]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="NoOfInjection" label="No Of Injection" rules={[{ required: true }]}>
                            <Input placeholder="Please Enter" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="VolumeML" label="Volume ML" rules={[{ required: true }]}>
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
        <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            <Card>
                {formView()}
            </Card>
            <Table
                columns={columns}
                size="small"
                dataSource={result6}
                pagination={false}
            />
        </Space>
    );
};

export default Investigation;