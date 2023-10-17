import { Drawer, Divider, Select, List, Card, Skeleton, } from 'antd';

import { useEffect, useRef, useState } from 'react';
import '../styles/viewCandidate.css'

const moment = require('moment');
import dayjs from 'dayjs';
import { ProFormInstance } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';
import { Link,history } from '@umijs/max';
import Title from 'antd/es/typography/Title';

const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const ViewUserBooking = ({ visible, onClose, selectedRows }: any) => {
    const formRef = useRef<ProFormInstance>();
    const [initLoading, setInitLoading] = useState(false);

    const [list, setList] = useState<any[]>([{}]);
    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        marginTop: 60,
        height: 300,
    };

// const setgetdata=()=>{
// console.log("hallo");
// console.log(selectedRows);
//   //  setTimeout(() => {
//         setList(selectedRows);
//         setInitLoading(false);
//    // }, 1000)
// }
// setgetdata();
        
    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }


    return (
        <>
            {selectedRows.length>0&&<Drawer
                title={`Candidate #${selectedRows[0]?.candidateID}`}
                width={1000}
                onClose={onClose}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}

            >
                <Divider orientation="left"><h4>Basic Information</h4></Divider>
                <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={selectedRows}
        renderItem={(item) => (
          <Card 
          style={{ marginBottom: 15 }}
          hoverable
          onClick={() => {
            history.push("/booking/booking-order-details/"+item?.bookingBillID);
          }}
          >
            <List.Item
              actions={[
                <Link to="/booking/booking-order-details">  <Title level={5}>{item?.totNetAmt} Rs.</Title></Link>
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<Title level={5}>{item?.instituteName}</Title>}
                  description={
                    <>
                      <label>{`Room: ${item?.roomName} Seat: ${item?.seatID} [${item?.roomTypeName}]`}</label>
                      <br />
                      <label>Booking:{moment(item?.entryDate).format("DD-MMM-YYYY")}</label>
                      <br />
                      <label>From: {moment(item?.fromDate).format("DD-MMM-YYYY")} To: {moment(item?.toDate).format("DD-MMM-YYYY")}</label>
                    </>
                  }
                />
              </Skeleton>
            </List.Item>
          </Card>
        )}
      />

            </Drawer>}
        </>
    );
};

export default ViewUserBooking;