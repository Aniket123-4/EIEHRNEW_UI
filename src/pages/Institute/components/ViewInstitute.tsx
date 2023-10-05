import { Drawer, Divider, Select, } from 'antd';

import { useEffect, useRef, useState } from 'react';
import '../styles/viewInstitute.css'

const moment = require('moment');
import dayjs from 'dayjs';
import { ProFormInstance } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';

const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const ViewInstitute = ({ visible, onClose, selectedRows }: any) => {
    console.log(selectedRows)
    const formRef = useRef<ProFormInstance>();

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        marginTop: 60,
        height: 300,
    };


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
            <Drawer
                title={`Institute #${selectedRows?.instituteID}`}
                width={1000}
                onClose={onClose}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}

            >
                <Divider orientation="left"><h4>Basic Information</h4></Divider>
                <ProDescriptions
                    dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    columns={[
                        {
                            title: '#ID',
                            dataIndex: 'instituteID',
                            span: 3
                        },
                        {
                            title: 'Institute Name',
                            dataIndex: 'instituteName',
                            span: 3
                        },
                        
                        {
                            title: 'latitude',
                            dataIndex: 'latitude',
                            span: 3
                        },
                        {
                            title: 'Mobile No',
                            dataIndex: 'mobileNo',
                            span: 2
                        },
                        {
                            title: 'Email ID',
                            dataIndex: 'emailID',
                            span: 2
                        },
                        {
                            title: 'Website',
                            dataIndex: 'website',
                            span: 2
                        },
                        {
                            title: 'Established Date',
                            key: 'date',
                            dataIndex: 'estdDate',
                            valueType: 'date',
                            fieldProps: {
                                format: 'DD-MM-YYYY',
                            },
                        },
                    ]}
                />

                

                <Divider orientation="left"><h4>Facilities</h4></Divider>
                <ProDescriptions
                    dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    columns={[
                        {
                            title: 'No of Student',
                            dataIndex: 'noOfStudent',
                            span: 2
                        },
                        {
                            title: 'No of Faculty',
                            dataIndex: 'noOfFaculty',
                            span: 2
                        },

                        {
                            title: 'OverAllRanking',
                            dataIndex: 'overAllRanking',
                            span: 2
                        },

                    ]}
                />


                <Divider orientation="left"><h4>Address Information</h4></Divider>
                <ProDescriptions
                    dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    columns={[

                        {
                            title: 'State',
                            dataIndex: 'stateName',
                            span: 3
                        },

                        {
                            title: 'District',
                            dataIndex: 'districtName',
                            span: 3
                        },
                        {
                            title: 'City',
                            dataIndex: 'cityName',
                            span: 3
                        },
                        {
                            title: 'Area',
                            dataIndex: 'areaID',
                            span: 3
                        },
                        {
                            title: 'Landmark',
                            dataIndex: 'campusArea',
                            span: 3
                        },
                        {
                            title: 'Candidate Address',
                            dataIndex: 'instituteAddress',
                            span: 3
                        }

                    ]}
                />

            </Drawer>
        </>
    );
};

export default ViewInstitute;