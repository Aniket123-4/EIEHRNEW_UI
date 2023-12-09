import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestGetInvGroup, requestGetInvestigation, requestGetPatientSearch } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';

const { Option } = Select;


interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    rate: string;
}

const PatientDetailsCommon = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);


    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    return (
        <Card
        >
           
        </Card>
    );
});

export default PatientDetailsCommon;