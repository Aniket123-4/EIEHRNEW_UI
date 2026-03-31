// import type { ProFormInstance } from '@ant-design/pro-components';
// import {
//   StepsForm,
// } from '@ant-design/pro-components';
// import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Layout } from 'antd';

// import { useEffect, useRef, useState } from 'react';
// import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
// const moment = require('moment');
// import dayjs from 'dayjs';
// import { requestGetArea, requestGetBranch, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';
// import { useEmotionCss } from '@ant-design/use-emotion-css';
// import './addCandidate.css'
// import { requestAddCandidate } from '@/pages/Candidate/services/api';

// const { Header, Footer, Content } = Layout;

// const dateFormat = 'YYYY/MM/DD';

// const headerStyle: React.CSSProperties = {
//   textAlign: 'center',
//   color: '#000000',
//   height: 64,
//   paddingInline: 50,
//   lineHeight: '64px',
//   backgroundColor: '#ffffff',
// };

// const contentStyle: React.CSSProperties = {
//   textAlign: 'center',
//   minHeight: 120,
//   lineHeight: '120px',
//   color: '#fff',
//   backgroundColor: '#ffffff',
//   paddingTop: 70
// };

// const footerStyle: React.CSSProperties = {
//   textAlign: 'center',
//   color: '#fff',
//   backgroundColor: '#ffffff',
// };

// const formDefaultValue = {
//   "onlinePatientID": "0",
//   "eMail": "",
//   "password": "",
//   "curMobileNoCC": "",
//   "curMobileNo": "",
//   "fName": "",
//   "mName": "",
//   "lName": "",
//   "genderID": 0,
//   "fNameML": "",
//   "dob": "2023-11-28T12:49:16.420Z",
//   "nationalityID": 0,
//   "uniqueID": 0,
//   "uniqueName": "",
//   "curAddress": "",
//   "otp": "",
//   "userID": "-1",
//   "formID": -1,
//   "type": "4"
// }

// const CandidateActivation = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
//   const formRef = useRef<ProFormInstance>();
//   const { token } = theme.useToken();
//   const intl = useIntl();
//   const [loading, setLoading] = useState(false);
//   const [isOtpVisible, setOTPVisible] = useState(false);
//   const [candidateData, setCandidateData] = useState(formDefaultValue);

//   const contentStyle: React.CSSProperties = {
//     lineHeight: '260px',
//     textAlign: 'center',
//     color: token.colorTextTertiary,
//     paddingTop: 60,
//     backgroundColor: '#ffffff',
//   };


//   const convertDate = (inputDateString: string) => {
//     // Parse the input date string using Moment.js
//     const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
//     // Format the parsed date in the desired format
//     const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
//     console.log(formattedDate);
//     return formattedDate
//   }


//   const addCandidate = async (values: any) => {
//     try {
//       setLoading(true)
//       const msg = await requestAddCandidate({ ...candidateData, ...values });
//       setLoading(false)
//       if (msg.isSuccess === true) {
//         formRef.current?.resetFields();
//         message.success(msg.msg);
//         setOTPVisible(true);
//         setCandidateData({ ...candidateData, ...values })
//         // requestForOTP({ ...candidateData, ...values })
//         return;
//       } else {
//         message.error(msg.msg);
//       }

//     } catch (error) {
//       setLoading(false)
//       const defaultLoginFailureMessage = "failed, please try again!";
//       console.log({ error });
//       message.error(defaultLoginFailureMessage);
//     }
//   };

//   const requestForOTP = async (params: any) => {
//     try {
//       setLoading(true)
//       params['type'] = 4;
//       const msg = await requestAddCandidate(params);
//       setLoading(false)
//       if (msg.isSuccess === "True") {
//         // message.success(msg.msg);
//         return;
//       } else {
//         message.error(msg.msg);
//       }

//     } catch (error) {
//       setLoading(false)
//       const defaultLoginFailureMessage = "Please try again!";
//       message.error(defaultLoginFailureMessage);
//     }
//   }

//   const requestForValidateOTP = async (params: any) => {
//     try {
//       setLoading(true)
//       const data: any = { ...candidateData };
//       data['type'] = 5;
//       data['otp'] = params.otp;
//       const msg = await requestAddCandidate(data);
//       setLoading(false)
//       if (msg.isSuccess === "True") {
//         message.success(msg.msg);
//         const urlParams = new URL(window.location.href).searchParams;
//         setTimeout(() => {
//           history.push(urlParams.get('redirect') || '/user/login');
//         }, 1000)
//         return;
//       } else {
//         message.error(msg.msg);
//       }

//     } catch (error) {
//       setLoading(false)
//       const defaultLoginFailureMessage = "Please try again!";
//       message.error(defaultLoginFailureMessage);
//     }
//   }

//   const onFinish = (values: any) => {
//     console.log('Received values of form: ', values);
//     requestForValidateOTP(values);
//   };
//   const goBack = () => {
//     history.push("/")
//   }

//   const activateCandidateActivation = () => {
//     return (
//       <Form
//         name="basic"
//         initialValues={{ remember: true }}
//         onFinish={async (values) => {
//           addCandidate(values)
//         }}
//         autoComplete="off"
//         layout="vertical"
//       >
//         <Form.Item
//           name="curMobileNo"
//           label="Mobile No"
//           rules={[
//             { required: true, type: 'string', message: 'Please enter mobile number' },
//             {
//               pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
//               message: 'Please enter a valid mobile number',
//             }
//           ]}
//         >
//           <Input
//             maxLength={10}
//             placeholder="Please enter mobileNo" />
//         </Form.Item>

//         <Form.Item
//           name="eMail"
//           label="Email"
//           rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
//         >
//           <Input maxLength={80} placeholder="Please enter Email" />
//         </Form.Item>

//         <div style={{ alignContent: 'center', display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//           <Form.Item>
//             <Button onClick={goBack} type="primary" htmlType="submit" className="login-form-button">
//               Cancel
//             </Button>
//           </Form.Item>
//         </div>

//       </Form>
//     )
//   }

//   const addOtpForm = () => {
//     return (
//       <>
//         <Form
//           name="normal_login"
//           className="login-form"
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//         >
//           <h2>{'OTP Verification'}</h2>
//           <Form.Item
//             name="otp"
//             rules={[{ required: true, message: 'Please input your valid otp!' }]}
//           >
//             <Input placeholder="Enter the otp here" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" className="login-form-button">
//               Verify
//             </Button>
//           </Form.Item>
//           <Form.Item>
//             <Button type="link" htmlType="submit" className="login-form-button">
//               Resend the OTP
//             </Button>
//           </Form.Item>
//         </Form>
//       </>
//     )
//   }

//   return (
//     <>

//       <>
//         <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
//           <Layout>
//             <Header style={headerStyle}>
//               <h2>Activate Patient</h2>
//             </Header>
//             <Content style={contentStyle}>
//               <Spin tip="Please wait..." spinning={loading}>
//                 <Row justify="space-around" align="middle">
//                   {!isOtpVisible ? activateCandidateActivation() : addOtpForm()}
//                 </Row>
//               </Spin>
//             </Content>
//             <Footer style={footerStyle}></Footer>
//           </Layout>
//         </Space>
//       </>
//     </>
//   );
// };



// export default CandidateActivation;


import type { ProFormInstance } from '@ant-design/pro-components';
import {
  StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Layout, Card, Typography, Divider } from 'antd';
import { 
  MobileOutlined, 
  MailOutlined, 
  LockOutlined, 
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetBranch, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import './addCandidate.css'
import { requestAddCandidate } from '@/pages/Candidate/services/api';

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

const dateFormat = 'YYYY/MM/DD';

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#000000',
  height: 80,
  paddingInline: 50,
  lineHeight: '80px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #f0f0f0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 'calc(100vh - 160px)',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#f5f7fa',
  padding: '40px 20px'
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#999',
  backgroundColor: '#ffffff',
  borderTop: '1px solid #f0f0f0',
  padding: '20px 50px'
};

const formDefaultValue = {
  "onlinePatientID": "0",
  "eMail": "",
  "password": "",
  "curMobileNoCC": "",
  "curMobileNo": "",
  "fName": "",
  "mName": "",
  "lName": "",
  "genderID": 0,
  "fNameML": "",
  "dob": "2023-11-28T12:49:16.420Z",
  "nationalityID": 0,
  "uniqueID": 0,
  "uniqueName": "",
  "curAddress": "",
  "otp": "",
  "userID": "-1",
  "formID": -1,
  "type": "4"
}

const CandidateActivation = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
  const formRef = useRef<ProFormInstance>();
  const { token } = theme.useToken();
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [isOtpVisible, setOTPVisible] = useState(false);
  const [candidateData, setCandidateData] = useState(formDefaultValue);
  const [countdown, setCountdown] = useState(0);

  // Premium styling using emotion-css
  const containerCss = useEmotionCss(() => ({
    maxWidth: '480px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    padding: '40px 32px',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
    }
  }));

  const iconWrapperCss = useEmotionCss(() => ({
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '32px',
    boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
  }));

  const inputCss = useEmotionCss(() => ({
    borderRadius: '8px',
    padding: '12px 16px',
    border: '1px solid #e8e8e8',
    transition: 'all 0.3s',
    '&:hover, &:focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.1)'
    }
  }));

  const buttonCss = useEmotionCss(() => ({
    height: '48px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s',
    '&.ant-btn-primary': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
      }
    }
  }));

  const convertDate = (inputDateString: string) => {
    // Parse the input date string using Moment.js
    const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
    // Format the parsed date in the desired format
    const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    console.log(formattedDate);
    return formattedDate
  }



const requestForOTP = async (params: any) => {
  try {
    setLoading(true)
    params['type'] = 4;
    const msg = await requestAddCandidate(params);
    setLoading(false)
    
    // Check for success properly (handle both string and boolean)
    const isSuccess = msg.isSuccess === true || msg.isSuccess === "true" || msg.isSuccess === "True";
    
    if (isSuccess) {
      // Only show success message, no error
      message.success({
        content: msg.msg || "OTP sent successfully!",
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 3
      });
      return true;
    } else {
      // Show error message only if it's actually an error
      message.error({
        content: msg.msg || "Failed to send OTP",
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        duration: 3
      });
      return false;
    }

  } catch (error) {
    setLoading(false)
    console.log({ error });
    message.error({
      content: "Failed to send OTP. Please try again!",
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      duration: 3
    });
    return false;
  }
}


  const addCandidate = async (values: any) => {
  try {
    setLoading(true)
    const msg = await requestAddCandidate({ ...candidateData, ...values });
    setLoading(false)
    
    // Handle both string "true" and boolean true
    const isSuccess = msg.isSuccess === true || msg.isSuccess === "true";
    
    if (isSuccess) {
      formRef.current?.resetFields();
      message.success({
        content: msg.msg || "USER ACTIVATED SUCCESSFULLY",
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 3
      });
      setOTPVisible(true);
      setCandidateData({ ...candidateData, ...values })
      startCountdown();
      return;
    } else {
      message.error({
        content: msg.msg || "Activation failed",
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        duration: 3
      });
    }

  } catch (error) {
    setLoading(false)
    const defaultLoginFailureMessage = "failed, please try again!";
    console.log({ error });
    message.error(defaultLoginFailureMessage);
  }
};

const requestForValidateOTP = async (params: any) => {
  try {
    setLoading(true)
    const data: any = { ...candidateData };
    data['type'] = 5;
    data['otp'] = params.otp;
    const msg = await requestAddCandidate(data);
    setLoading(false)
    
    // Handle both string "true" and boolean true
    const isSuccess = msg.isSuccess === true || msg.isSuccess === "true";
    
    if (isSuccess) {
      message.success({
        content: msg.msg || "USER ACTIVATED SUCCESSFULLY",
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 3
      });
      const urlParams = new URL(window.location.href).searchParams;
      setTimeout(() => {
        history.push(urlParams.get('redirect') || '/user/login');
      }, 1000)
      return;
    } else {
      message.error({
        content: msg.msg || "Verification failed",
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        duration: 3
      });
    }

  } catch (error) {
    setLoading(false)
    const defaultLoginFailureMessage = "Please try again!";
    message.error(defaultLoginFailureMessage);
  }
}
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    requestForValidateOTP(values);
  };

  const goBack = () => {
    history.push("/");
  }

const handleResendOTP = async () => {
  if (countdown > 0) return;
  
  try {
    setLoading(true);
    const success = await requestForOTP(candidateData);
    
    if (success) {
    //  message.success('OTP resent successfully!'); // This might be duplicate if requestForOTP already shows success
      startCountdown();
    }
  } catch (error) {
    // Error already handled in requestForOTP
  } finally {
    setLoading(false);
  }
};

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const activateCandidateActivation = () => {
    return (
      <div className={containerCss}>
        <div className={iconWrapperCss}>
          <PhoneOutlined />
        </div>
        
        <Title level={2} style={{ textAlign: 'center', marginBottom: 8, color: '#1a1a1a' }}>
          Activate Patient
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
          Please enter your contact details to activate your account
        </Text>

        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={async (values) => {
            addCandidate(values)
          }}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="curMobileNo"
            label={<Text strong>Mobile Number</Text>}
            rules={[
              { required: true, type: 'string', message: 'Please enter mobile number' },
              {
                pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                message: 'Please enter a valid mobile number',
              }
            ]}
          >
            <Input 
              prefix={<MobileOutlined style={{ color: '#bfbfbf' }} />}
              maxLength={10}
              placeholder="Enter your mobile number"
              className={inputCss}
            />
          </Form.Item>

          <Form.Item
            name="eMail"
            label={<Text strong>Email Address</Text>}
            rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              maxLength={80} 
              placeholder="Enter your email address"
              className={inputCss}
            />
          </Form.Item>

          <Divider style={{ margin: '24px 0' }} />

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button 
              onClick={goBack}
              icon={<ArrowLeftOutlined />}
              style={{ flex: 1, borderRadius: '8px' }}
            >
              Back
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className={buttonCss}
              style={{ flex: 2 }}
              loading={loading}
            >
              Send OTP
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  const addOtpForm = () => {
    return (
      <div className={containerCss}>
        <div className={iconWrapperCss}>
          <SafetyCertificateOutlined />
        </div>
        
        <Title level={2} style={{ textAlign: 'center', marginBottom: 8, color: '#1a1a1a' }}>
          OTP Verification
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 8 }}>
          We've sent a verification code to
        </Text>
        <Text strong style={{ display: 'block', textAlign: 'center', marginBottom: 32, fontSize: '16px' }}>
          {candidateData.eMail || 'your EMAIL'}
        </Text>

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="otp"
            label={<Text strong>Enter OTP</Text>}
            rules={[{ required: true, message: 'Please input your valid OTP!' }]}
          >
            <Input 
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Enter the 6-digit OTP"
              className={inputCss}
              maxLength={6}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            {countdown > 0 ? (
              <Text type="secondary">Resend OTP in {countdown}s</Text>
            ) : (
              <Button 
                type="link" 
                onClick={handleResendOTP}
                icon={<ReloadOutlined />}
                style={{ padding: 0 }}
              >
                Resend OTP
              </Button>
            )}
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button 
              onClick={() => setOTPVisible(false)}
              icon={<ArrowLeftOutlined />}
              style={{ flex: 1, borderRadius: '8px' }}
            >
              Back
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className={buttonCss}
              style={{ flex: 2 }}
              loading={loading}
            >
              Verify & Activate
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  return (
    <>
      
        <Layout>
       
          <Content style={contentStyle}>
            <Spin tip="Please wait..." spinning={loading}>
              <Row justify="space-around" align="middle">
                <Col xs={22} sm={20} md={16} lg={12} xl={10}>
                  {!isOtpVisible ? activateCandidateActivation() : addOtpForm()}
                </Col>
              </Row>
            </Spin>
          </Content>
          <Footer style={footerStyle}>
            <Text type="secondary">© 2024 Vaidhyaraj Madan Mohan Singh Portal Portal. All rights reserved.</Text>
          </Footer>
        </Layout>
   
    </>
  );
};

export default CandidateActivation;