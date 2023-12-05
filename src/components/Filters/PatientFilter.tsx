import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker, List, Avatar, Tag, Drawer, DatePicker } from 'antd';
import { requestGetGender, requestGetSection } from '@/services/apiRequest/dropdowns';
import moment from 'moment';
import { dateFormat } from '@/utils/constant';


const selectValue = [
    { value: 'option 1', label: 'option 1' },
    { value: 'option2', label: 'option 2' },
    { value: 'option 3', label: 'option 3' },

]

const PatientFilter: React.FC = ({ visible, onClose, selectedRows, loading, onFilter }: any) => {

    const [filterForm] = Form.useForm();
    const [genderChoices, setGenderChoices] = useState<any>([]);
    const [civilStatusChoices, setCivilStatusChoices] = useState<any>([]);
    const [bloodGroupChoices, setBloodGroupChoices] = useState<any>([]);
    const [nationalityChoices, setNationalityChoices] = useState<any>([]);
    const [serviceTypeChoices, setServiceTypeChoices] = useState<any>([]);

    useEffect(() => {
        getChoices();
    }, []);

    const getChoices = async () => {
        await getGenderData();
        await getCivilStatusData();
        await getBloodGroupData();
        await getNationalityData();
        await getServiceTypeData();
        console.log("form")
        filterForm.setFieldsValue({
            patientID: -1,
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
            // patientDOB: '1900-01-01',
            fromDate: '1900-11-21T12:47:26.406Z',
            toDate: '2023-12-21T12:47:26.406Z',
        })
    }


    const getGenderData = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetGender(params);
        let dataMaskForDropdown = [];
        if (res.data.length > 0) {
            dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            });
        }
        dataMaskForDropdown.unshift({ value: -1, label: "All" });
        setGenderChoices(dataMaskForDropdown)
    }

    const getBloodGroupData = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        // const res = await requestGetGender(params);
        let dataMaskForDropdown = [];
        // if (res.data.length > 0) {
        //     dataMaskForDropdown = res?.data?.map((item: any) => {
        //         return { value: item.genderID, label: item.genderName }
        //     });
        // }
        dataMaskForDropdown.unshift({ value: -1, label: "All" });
        setBloodGroupChoices(dataMaskForDropdown)
    }


    const getNationalityData = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        // const res = await requestGetGender(params);
        let dataMaskForDropdown = [];
        // if (res.data.length > 0) {
        //     dataMaskForDropdown = res?.data?.map((item: any) => {
        //         return { value: item.genderID, label: item.genderName }
        //     });
        // }
        dataMaskForDropdown.unshift({ value: -1, label: "All" });
        setNationalityChoices(dataMaskForDropdown)
    }

    const getServiceTypeData = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        // const res = await requestGetGender(params);
        let dataMaskForDropdown = [];
        // if (res.data.length > 0) {
        //     dataMaskForDropdown = res?.data?.map((item: any) => {
        //         return { value: item.genderID, label: item.genderName }
        //     });
        // }
        dataMaskForDropdown.unshift({ value: -1, label: "All" });
        setServiceTypeChoices(dataMaskForDropdown)
    }



    const getCivilStatusData = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        // const res = await requestGetGender(params);
        let dataMaskForDropdown = [];
        // if (res.data.length > 0) {
        //     dataMaskForDropdown = res?.data?.map((item: any) => {
        //         return { value: item.genderID, label: item.genderName }
        //     });
        // }
        dataMaskForDropdown.unshift({ value: -1, label: "All" });
        setCivilStatusChoices(dataMaskForDropdown)
    }

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    /* eslint-enable no-template-curly-in-string */

    const onFinishPatForm = async (values: any) => {

        if (!values.patientDOB) {
            values['patientDOB'] = '1900-01-01';
        } else {
            values['patientDOB'] = moment(values.patientDOB).format('YYYY-MM-DD');
        }
        if (!values.fromToDate) {
            values['fromDate'] = '1900-01-21';
            values['toDate'] = moment(new Date()).format('YYYY-MM-DD');
        } else {
            values['fromDate'] = moment(values.fromToDate[0]).format('YYYY-MM-DD');
            values['toDate'] = moment(values.fromToDate[1]).format('YYYY-MM-DD');
        }
        console.log(values);
        onFilter(values);

    };



    const handleResetFilter = async () => {
        await filterForm.resetFields();
        await filterForm.setFieldsValue({
            patientID: -1,
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
            patientDOB: undefined,
            fromToDate:undefined
            // fromDate: '1900-01-21',
            // toDate: moment(new Date()).format('YYYY-MM-DD')
        });
        console.log(filterForm.getFieldValue())
        onFinishPatForm(filterForm.getFieldValue())
        // onFilter(filterForm.getFieldValue());
    }

    const handleChangeFilter = (value: any) => { }

    return (
        <>
            <Drawer title="Patient Filter" placement="right" onClose={onClose} open={visible}
                extra={<>
                    {/* <Button type="primary" danger loading={loading} htmlType="submit" onClick={handleResetFilter}>
                        Reset
                    </Button> */}
                </>}
            >
                <Form
                    onFinish={onFinishPatForm}
                    form={filterForm}
                    validateMessages={validateMessages}
                    layout="vertical"
                >

                    <Form.Item name="fromToDate" label="From/To Date" rules={[{ required: false }]}>
                        <DatePicker.RangePicker
                            format={dateFormat}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item name="patientNo" label="PatientNo" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="patientName" label="Patient Name" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="patientUIDNo" label="Patient UID No" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="ageGreater" label="Age Greater" rules={[{ required: false }]}>
                        <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                    <Form.Item name="genderID" label="Gender" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={genderChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>

                    <Form.Item name="civilStatusID" label="Civil Status" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={civilStatusChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>

                    <Form.Item name="bloodGroupID" label="Blood Group" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={bloodGroupChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item name="nationalityID" label="Nationality" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={nationalityChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item name="serviceTypeID" label="Service Type" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={serviceTypeChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item name="patientMobileNo" label="Patient Mobile No" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="patientPhoneNo" label="Patient Phone No" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="patientDOB" label="Patient DOB" rules={[{ required: false }]}>
                        <DatePicker
                            style={{ width: "100%" }}
                            format={dateFormat}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit">
                            Filter
                        </Button>

                    </Form.Item>
                </Form >
            </Drawer>
        </>
    );
};

export default PatientFilter;
