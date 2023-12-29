import React, { useEffect, useRef, useState } from 'react';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Modal, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Tabs } from 'antd';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history, type IRoute } from 'umi';
import { activeStatus, dateFormat } from '@/utils/constant';
import { convertDate } from '@/utils/helper';
import dayjs from 'dayjs';
import moment from 'moment';
import type { TabsProps } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Complaint',
        children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: 'Dental',
        children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: 'Vital Sign',
        children: 'Content of Tab Pane 3',
    },
    {
        key: '4',
        label: 'Patient History',
        children: 'Content of Tab Pane 3',
    },
    {
        key: '5',
        label: 'Original Finding',
        children: 'Content of Tab Pane 31',
    },
    {
        key: '6',
        label: 'Investigation',
        children: 'Content of Tab Pane 32',
    },
    {
        key: '7',
        label: 'Medication',
        children: 'Content of Tab Pane 33',
    },
    {
        key: '8',
        label: 'Checkout Summary',
        children: 'Content of Tab Pane 34',
    },
    {
        key: '9',
        label: 'Referal Doctor',
        children: 'Content of Tab Pane 35',
    },
];

const DoctorPatientDetails = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [formFilter] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);



    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    const onChange = (key: string) => {
        console.log(key);
    };

    const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
        <div  style={{ zIndex: 1 }}>
          <label {...props} style={{ background: 'red' }} />
        </div>
      );

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card
                title=""
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        <Tabs defaultActiveKey="1"
                            tabPosition={'left'}
                            tabBarGutter={12}
                            style={{
                            }}
                            tabBarStyle={{
                                margin:10,
                                padding:5

                            }}
                            items={items} onChange={onChange} />
                    </div>
                </Spin>
            </Card>

        </Space>

    );
});

export default DoctorPatientDetails;