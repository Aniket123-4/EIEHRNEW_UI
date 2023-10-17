import React, { useEffect, useRef, useState } from 'react';
import { AppstoreAddOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Modal, Avatar, List, Skeleton, Card } from 'antd';
import {
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProColumns,
    ProDescriptions,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { requestGetInstituteList, requestRoomList } from '../services/api';
import SeatDesign from '@/pages/Room/components/SeatDesign';
const { Option } = Select;
const { confirm } = Modal;
const InstituteList: React.FC = ({state}:any) => {
    const [openEditInstitute, setOpenEditInstitute] = useState(false);
    const [openAddInstitute, setOpenAddInstitute] = useState(false);
    const [openViewInstitute, setOpenViewInstitute] = useState(false);
    const [openAddRoom, setOpenAddRoom] = useState(false);
    const actionRef = useRef<any>();
    const [selectedRows, setSelectedRows] = useState<Object>({});
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [instituteDetail, setInstituteDetail] = useState<any>([]);
    interface DataType {
        gender?: string;
        name: {
            title?: string;
            first?: string;
            last?: string;
        };
        email?: string;
        picture: {
            large?: string;
            medium?: string;
            thumbnail?: string;
        };
        nat?: string;
        loading: boolean;
    }
    const count = 10;
    const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
    const [data, setData] = useState<any[]>([]);
    const [list, setList] = useState<any[]>([]);
    const getInstituteRooms = async () => {
        const staticParams = {
            instituteID: "3618141207886116404",
            roomID: "-1",
            userID: "-1",
            formID: -1,
            type: 1
        }
        const res = await requestRoomList(staticParams);
        console.log(res.data.instituteRoomLink)
        setInstituteDetail(res.data)
        setList(res.data.instituteRoomLink)
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.stateID, label: item.stateName }
            })
        }
    };
    useEffect(() => {
        getInstituteRooms()
        console.log(state)
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                setInitLoading(false);
                setData(res.results);
                // setList(res.results);
            });
    }, []);
    const reloadTable = () => {
        actionRef.current.reload();
    }
    const onLoadMore = () => {
        setLoading(true);
        setList(
            data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
        );
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                const newData = data.concat(res.results);
                setData(newData);
                // setList(newData);
                setLoading(false);
                window.dispatchEvent(new Event('resize'));
            });
    };
    const loadMore =
        !initLoading && !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;
    return (
        <PageContainer>
            <Card bordered={false} style={{ width: "100%" }}>
                {/* {item.roomID} */}
                {/* <p>{item.roomTypeName}</p>
                                <p>{item.roomName}</p>
                                <p>{item.isActive}</p> */}
                <SeatDesign props={instituteDetail} />
            </Card>
            {/* <List
                className="demo-loadmore-list"
                loading={initLoading}
                itemLayout="horizontal"
                // loadMore={loadMore}
                dataSource={list}
                renderItem={(item: any) => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                        </Skeleton>
                    </List.Item>
                )}
            /> */}
        </PageContainer>
    );
    
};
export default InstituteList;