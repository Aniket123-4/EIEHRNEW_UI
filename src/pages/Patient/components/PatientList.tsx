import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Typography, InputRef } from 'antd';
import { requestGetGender, requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestGetPatientSearch } from '../services/api';

import { Table, Tag } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';
import { history, type IRoute } from 'umi';
import { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { convertDate } from '@/utils/helper';
import dayjs from 'dayjs';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}

const PatientList = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const [openPatientFilter, setOpenPatientFilter] = useState(false);
    const [gender, setGender] = useState<any>([])
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);




    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };
    useEffect(() => {
        getGender();

    }, [])

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : 'gray', fontSize:17 }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    const getGender = async () => {
        const res = await requestGetGender();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setGender(dataMaskForDropdown)
        }
    }
    const getGenderName = (gen:any) => {
        const nm =gender.find((txt:any) => txt.value===gen)
        if(nm?.value=="-1")return <Typography>{'NA'}</Typography>
        else return <Typography>{nm?.label}</Typography>
    }
    const columns: ColumnsType<DataType> = [
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            key: 'patientNo',
            render: (text) => <a>{text}</a>,
            sorter: (a:any, b:any):any => a.patientNo< b.patientNo,
            sortOrder:'descend'
        },
        {
            title: 'Name',
            dataIndex: 'candName',
            key: 'candName',
            ...getColumnSearchProps('candName'),
        },
        // {
        //     title: 'candNameML',
        //     dataIndex: 'candNameML',
        //     key: 'candNameML',
        // },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'genderName',
            key: 'genderName',
            render: (text) => getGenderName(text)
        },
        // {
        //     title: 'civilStatusName',
        //     dataIndex: 'civilStatusName',
        //     key: 'civilStatusName',
        // },
        {
            title: 'Blood Group',
            dataIndex: 'bloodGroup',
            key: 'bloodGroup',
        },
        {
            title: 'Mobile No',
            dataIndex: 'curMobileNo',
            key: 'curMobileNo',
        },
        // {
        //     title: 'curPhoneNo',
        //     dataIndex: 'curPhoneNo',
        //     key: 'curPhoneNo',
        // },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} type='link' onClick={() => 
                        history.push({
                            pathname: `/patient/EditPatient/${record.patientID}`,
                            search: "true"
                        })
                    }>
                        <InfoCircleOutlined />
                    </Button>
                    <Button size={'small'} type='link' onClick={() => { history.push(`/patient/EditPatient/${record.patientID}`) }}>
                        <EditOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getList();
    }, [])

    const getList = async () => {

        const params = {
            patientNo: '',
            patientUIDNo: '',
            ageGreater: 0,
            genderID: -1,
            civilStatusID: -1,
            bloodGroupID: -1,
            nationalityID: -1,
            serviceTypeID: -1,
            patientName: '',
            patientMobileNo: '',
            patientPhoneNo: '',
            patientDOB: '1900-01-01',
            fromDate: '1900-01-21',
            toDate: convertDate(dayjs()),
        }
        searchPatient(params)
    }

    const searchPatient = async (params: any) => {
        try {
            setLoading(true)
            const staticParams = {
                isDeleted: false,
                userID: -1,
                formID: -1,
                type: 1,
                patientID: -1,
            }
            const response = await requestGetPatientSearch({ ...params, ...staticParams });
            setLoading(false)
            setList(response?.result)

            if (response?.isSuccess) {
                form.resetFields();
            } else {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const onFilter = async (value: any) => {
        console.log('onFilter', value);
        await searchPatient(value)
        setOpenPatientFilter(false);
    }

    const onClosePatientFilter = () => {
        setOpenPatientFilter(false);
    };


    return (
        <Card
            title="Patient"
            style={{ boxShadow: '2px 2px 2px #4874dc' }}
            extra={
                [
                    <Button type="primary" onClick={() => { setOpenPatientFilter(true); }}>
                        <FilterOutlined />
                        Filter
                    </Button>,

                ]
            }
        >
            <div style={contentStyle}>
                <Table columns={columns} dataSource={list} />
                <PatientFilter
                    visible={openPatientFilter}
                    onClose={onClosePatientFilter}
                    onFilter={onFilter}
                    loading={loading}
                />
            </div>
        </Card>
    );
});

export default PatientList;