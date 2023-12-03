import React, { useState } from 'react';
import { Button, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker, List, Avatar, Tag, Drawer, DatePicker } from 'antd';


const selectValue = [
    { value: 'option 1', label: 'option 1' },
    { value: 'option2', label: 'option 2' },
    { value: 'option 3', label: 'option 3' },
  
]

const PatientFilter: React.FC = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {

    const [slotForm] = Form.useForm();


    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

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
        console.log(values);
        // const { verifiedUser } = getUserInLocalStorage();
        // const params = {
        //     ...values,
        //     userWeekSlotID: selectedSlot?.userWeekSlotID,
        //     patientId: getUserType() === "Candidate" ? verifiedUser?.userID : -1,
        //     remarkId: -1,
        //     userID: -1,
        //     formID: -1,
        //     type: 1
        // }
        // const response = await requestAddPatRequest(params);
        // setLoading(false)
        // console.log(response?.result);
        // message.success(response?.msg);

        // if (!response?.isSuccess) {
        //     message.error(response?.msg);
        // } else {
        //     reset();
        // }
    };

    const handleChangeFilter = () => {

    }

    return (
        <>
            <Drawer title="Patient Filter" placement="right" onClose={onClose} open={visible}>
                <Form
                    onFinish={onFinishPatForm}
                    form={slotForm}
                    validateMessages={validateMessages}
                    layout="vertical"
                >
                    <Form.Item name="PatientNo" label="PatientNo" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="patientName1" label="Patient Name" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="PatientUIDNo" label="PatientUIDNo" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="AgeGreater" label="AgeGreater" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="GenderID" label="GenderID" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={selectValue}
                        />
                    </Form.Item>

                    <Form.Item name="otpNCivilStatusIDo13" label="CivilStatusID" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={selectValue}
                        />
                    </Form.Item>

                    <Form.Item name="BloodGroupID" label="BloodGroupID" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={selectValue}
                        />
                    </Form.Item>
                    <Form.Item name="NationalityID" label="NationalityID" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={selectValue}
                        />
                    </Form.Item>
                    <Form.Item name="ot23ServiceTypeIDpNo" label="ServiceTypeID" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={selectValue}
                        />
                    </Form.Item>
                    <Form.Item name="PatientMobileNo" label="PatientMobileNo" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="otPatientPhoneNop2No" label="PatientPhoneNo" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="PatientDOB" label="PatientDOB" rules={[{ required: false }]}>
                        <DatePicker
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name="fromToDate" label="From/To Date" rules={[{ required: false }]}>
                        <DatePicker.RangePicker
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Filter
                        </Button>
                    </Form.Item>
                </Form >
            </Drawer>
        </>
    );
};

export default PatientFilter;
