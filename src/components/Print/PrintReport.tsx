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
import { dateFormat } from "@/utils/constant";
import { convertDate } from "@/utils/helper";
import moment from "moment";
import { requestGetItem } from "@/pages/MedicalStore/services/api";
import { requestGetDocuments } from "@/pages/Candidate/services/api";

const { Option } = Select;

const PrintReport = ({ base64Data }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [itemList, setItemList] = useState<any>([])


    const contentStyle: React.CSSProperties = {
        lineHeight: "260px",
        textAlign: "center",
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };

    useEffect(() => {
        console.log(base64Data)
        getItemList();
    }, []);

    const previewDoc = async (item: any) => {
        const params = {
            fileName: item.phyName,
            filePath: ""
        }
        const res1 = await requestGetDocuments(params);
        if (res1.isSuccess == true) {
            if (res1.result.startsWith("JVB")) {
                window.open(`data:application/pdf;base64,${res1.result}`);
            }
        }
        else {
            message.error("File Not Found")
        }
    }

    const goBack = () => {
        history.push("/");
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

    return (
        <Card
            headStyle={{ backgroundColor: '#004080', border: 0 }}
            style={{ boxShadow: "2px 2px 2px #4874dc", width: '100%' }}
        >
            <embed type="application/pdf" height="200" width='100%'
                src={`data:application/pdf;base64,${base64Data}`}>
            </embed>
        </Card>
    );
};

export default PrintReport;
