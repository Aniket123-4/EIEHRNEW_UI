// // import React, { useEffect, useState } from 'react';
// // import Footer from '@/components/Footer';
// // import { login } from '@/services/apiRequest/api';
// // import {
// //   AlipayCircleOutlined,
// //   LockOutlined,
// //   MobileOutlined,
// //   TaobaoCircleOutlined,
// //   UserOutlined,
// //   WeiboCircleOutlined,
// //   AlipayOutlined,
// //   TaobaoOutlined,
// //   WeiboOutlined,
// // } from '@ant-design/icons';
// // import {
// //   LoginForm,
// //   ProFormCaptcha,
// //   ProFormCheckbox,
// //   ProFormText,
// //   LoginFormPage
// // } from '@ant-design/pro-components';
// // import { useEmotionCss } from '@ant-design/use-emotion-css';
// // import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
// // import { Alert, message, Tabs, Button, Divider, Space } from 'antd';
// // import { flushSync } from 'react-dom';
// // import { setPackageId } from '@/utils/common';
// // import { requestGetDocuments } from '@/pages/Candidate/services/api';

// // type LoginType = 'phone' | 'account';

// // const iconStyles: CSSProperties = {
// //   color: 'rgba(0, 0, 0, 0.2)',
// //   fontSize: '18px',
// //   verticalAlign: 'middle',
// //   cursor: 'pointer',
// // };

// // const Lang = () => {
// //   const langClassName = useEmotionCss(({ token }) => {
// //     return {
// //       width: 42,
// //       height: 42,
// //       lineHeight: '42px',
// //       position: 'fixed',
// //       right: 16,
// //       borderRadius: token.borderRadius,
// //       ':hover': {
// //         backgroundColor: token.colorBgTextHover,
// //       },
// //     };
// //   });

// //   return (
// //     <div className={langClassName} data-lang>
// //       {SelectLang && <SelectLang />}
// //     </div>
// //   );
// // };

// // const LoginMessage: React.FC<{
// //   content: string;
// // }> = ({ content }) => {
// //   return (
// //     <Alert
// //       style={{
// //         marginBottom: 24,
// //       }}
// //       message={content}
// //       type="error"
// //       showIcon
// //     />
// //   );
// // };

// // const Login: React.FC = () => {
// //   const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
// //   const [type, setType] = useState<string>('account');
// //   const { initialState, setInitialState } = useModel('@@initialState');
// //   const intl = useIntl();
// //   const [loginType, setLoginType] = useState<LoginType>('phone');
// //   const [imgBase64, setImageBase64] = useState<string>('');

// //   useEffect(() => {
// //     getImgUrl();
// //   }, [])
// //   const containerClassName = useEmotionCss(() => {
// //     return {
// //       display: 'flex',
// //       flexDirection: 'column',
// //       height: '100vh',
// //       overflow: 'auto',
// //       backgroundImage:
// //         "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
// //       backgroundSize: '100% 100%',
// //     };
// //   });


// //   const handleSubmit = async (values: API.LoginParams) => {
// //     try {

// //       const staticParams = {
// //         orgID: "-1",
// //         packageID: "-1",
// //         token: ""
// //       };

// //       const msg = await login({ ...values, ...staticParams, type });

// //       if (msg.verifiedUser.isVerify) {
// //         localStorage.setItem('user', JSON.stringify(msg));
// //         const defaultLoginSuccessMessage = intl.formatMessage({
// //           id: 'pages.login.success',
// //           defaultMessage: 'login successful!',
// //         });

// //         setTimeout(() => {
// //           // this.setState({ success: false });
// //           const urlParams = new URL(window.location.href).searchParams;
// //           if (msg?.listPackages.length > 1) {
// //             flushSync(() => {
// //               setInitialState((s) => ({
// //                 ...s,
// //                 currentUser: msg,
// //               }));
// //             });
// //             history.push(urlParams.get('redirect') || 'package');
// //             msg['selectedPackageId'] = msg?.listPackages[0]?.packagE_ID
// //             setPackageId(msg?.listPackages[0]?.packagE_ID);
// //           } else {
// //             msg['selectedPackageId'] = msg?.listPackages[0]?.packagE_ID
// //             setPackageId(msg?.listPackages[0]?.packagE_ID);
// //             flushSync(() => {
// //               setInitialState((s) => ({
// //                 ...s,
// //                 currentUser: msg,
// //               }));
// //             });

// //             if (msg?.verifiedUser.userTypeID === "11") {
// //               history.push('/candidate-dashboard');
// //             } else {
// //               history.push('/welcome');
// //             }
// //           }
// //         }, 100);
// //         message.success(defaultLoginSuccessMessage);
// //         return;
// //       } else {
// //         const defaultLoginFailureMessage = intl.formatMessage({
// //           id: 'pages.login.failure',
// //           defaultMessage: 'Login failed, please try again!',
// //         });
// //         message.error(defaultLoginFailureMessage);
// //       }

// //       setUserLoginState(msg);

// //     } catch (error) {
// //       const defaultLoginFailureMessage = intl.formatMessage({
// //         id: 'pages.login.failure',
// //         defaultMessage: 'Login failed, please try again!',
// //       });
// //       console.log(error);
// //       message.error(defaultLoginFailureMessage);
// //     }
// //   };
// //   const getImgUrl = async () => {
// //     const params = {
// //       fileName: "Ayuroma_wellness.jpeg",
// //       filePath: ""
// //     }
// //     const res = await requestGetDocuments(params);
// //     setImageBase64(res.result)
// //     console.log(imgBase64)
// //   }

// //   return (
// //     <div
// //     >
// //       <LoginFormPage
// //       // style={{height:window.innerHeight, justifyContent:'initial',backgroundRepeat:'no-repeat'}}
// //         backgroundImageUrl={`data:image/png;base64,${imgBase64}`}
// //         // backgroundImageUrl="https://www.shutterstock.com/shutterstock/photos/1401561251/display_1500/stock-photo-modern-microscope-for-operations-in-surgery-room-at-the-hospital-background-1401561251.jpg"
// //         title="वैद्यराज मदन मोहन सिंह's"
// //         subTitle={<><h1 style={{color:'black'}}>Ayuroma Wellness Center</h1>
// //         <h3 style={{color:'red',textAlign:'end',paddingRight:100}}>(Since 1991)</h3></>}
// //         actions={
// //           <div
// //             style={{
// //               display: 'flex',
// //               justifyContent: 'center',
// //               alignItems: 'center',
// //               flexDirection: 'column',
// //             }}
// //           >
// //             <Divider plain>
// //               <span
// //                 style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}
// //               >
// //                 Others
// //               </span>
// //             </Divider>
// //             <Space direction="vertical" size="small" style={{ display: 'flex' }}>
// //               <Button
// //                 size='middle'
// //                 style={{ width: 300 }}
// //                 type="default"
// //                 onClick={() => {
// //                   const urlParams = new URL(window.location.href).searchParams;
// //                   history.push(urlParams.get('redirect') || '/user/candidate/add');
// //                 }}>
// //                 Register Patient
// //               </Button>
// //               <Button
// //                 size='middle'
// //                 style={{ width: 300 }}
// //                 type="default"
// //                 onClick={() => {
// //                   const urlParams = new URL(window.location.href).searchParams;
// //                   history.push(urlParams.get('redirect') || '/user/candidateActivation');
// //                 }}>
// //                 Patient Activation
// //               </Button>

// //               <Button
// //                 disabled
// //                 size='middle'
// //                 style={{ width: 300 }}
// //                 type="default"
// //                 onClick={() => {
// //                   const urlParams = new URL(window.location.href).searchParams;
// //                   history.push(urlParams.get('redirect') || '/InstituteUser/candidate/add');
// //                 }}>
// //                 Add Hospital/Doctor
// //               </Button>

// //               {/* <Button
// //                 disabled
// //                 size='middle'
// //                 style={{ width: 300 }}
// //                 type="default"
// //                 onClick={() => {
// //                   const urlParams = new URL(window.location.href).searchParams;
// //                   history.push(urlParams.get('redirect') || '/user/InstitututeUserActivation');
// //                 }}>
// //                 Hospital/Doctor Activation
// //               </Button> */}
// //             </Space>
// //           </div>
// //         }
// //         onFinish={async (values) => {
// //           await handleSubmit(values as API.LoginParams);
// //         }}
// //         submitter={{ searchConfig: { submitText: 'Log in', restText: 'Log in' } }}
// //       >
// //         <Tabs
// //           centered
// //           activeKey={loginType}
// //           style={{ marginTop: -40 }}
// //           onChange={(activeKey) => setLoginType(activeKey as LoginType)}
// //         >
// //           <Tabs.TabPane key={'account'} tab={'Account Login'} />
// //         </Tabs>
// //         {type === 'account' && (
// //           <>
// //             <ProFormText
// //               name="loginName"
// //               fieldProps={{
// //                 size: 'large',
// //                 prefix: <UserOutlined />,
// //               }}

// //               placeholder={'Username'}
// //               rules={[
// //                 {
// //                   required: true,
// //                   message: (
// //                     <FormattedMessage
// //                       id="pages.login.username.required"
// //                       defaultMessage="please enter user name!"
// //                     />
// //                   ),
// //                 },
// //               ]}
// //             />
// //             <ProFormText.Password
// //               name="password"
// //               fieldProps={{
// //                 size: 'large',
// //                 prefix: <LockOutlined />,
// //               }}
// //               placeholder={'Password'}
// //               rules={[
// //                 {
// //                   required: true,
// //                   message: (
// //                     <FormattedMessage
// //                       id="pages.login.password.required"
// //                       defaultMessage="Please enter your password!"
// //                     />
// //                   ),
// //                 },
// //               ]}
// //             />
// //           </>
// //         )}
// //         <div
// //           style={{
// //             marginBlockEnd: 24,
// //           }}
// //         >
// //           <a
// //             style={{
// //               float: 'right',
// //               marginTop: 10,
// //               marginBottom: 20
// //             }}
// //           >
// //             Forgot password?
// //           </a>
// //         </div>
// //       </LoginFormPage>
// //     </div>
// //   );


// // };

// // export default Login;








// import React, { useEffect, useState } from 'react';
// import { login } from '@/services/apiRequest/api';
// import {
//   LockOutlined,
//   UserOutlined,
//   ArrowRightOutlined,
//   SafetyOutlined,
//   MedicineBoxOutlined,
// } from '@ant-design/icons';
// import { history, useModel, SelectLang } from '@umijs/max';
// import { message, Tabs, Button, Divider, Space, Typography } from 'antd';
// import { flushSync } from 'react-dom';
// import { setPackageId } from '@/utils/common';
// import { requestGetDocuments } from '@/pages/Candidate/services/api';
// import { ProForm, ProFormText } from '@ant-design/pro-components';

// const { Title, Text } = Typography;

// const Login: React.FC = () => {
//   const { setInitialState } = useModel('@@initialState');
//   const [loginType, setLoginType] = useState<'account'>('account');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     getImgUrl();
//   }, []);

//   const getImgUrl = async () => {
//     try {
//       await requestGetDocuments({
//         fileName: 'Ayuroma_wellness.jpeg',
//         filePath: '',
//       });
//     } catch (error) {
//       console.error('Failed to load background image');
//     }
//   };

//   const handleSubmit = async (values: API.LoginParams) => {
//     setLoading(true);
//     try {
//       const staticParams = { orgID: '-1', packageID: '-1', token: '' };
//       const msg = await login({ ...values, ...staticParams, type: 'account' });

//       if (msg.verifiedUser.isVerify) {
//         localStorage.setItem('user', JSON.stringify(msg));
//         message.success({ content: 'Login successful!', duration: 3 });

//         setTimeout(() => {
//           const urlParams = new URL(window.location.href).searchParams;
//           const selectedPackage = msg?.listPackages[0]?.packagE_ID;
//           msg.selectedPackageId = selectedPackage;
//           setPackageId(selectedPackage);

//           flushSync(() => {
//             setInitialState((s) => ({ ...s, currentUser: msg }));
//           });

//           if (msg?.listPackages.length > 1) {
//             history.push(urlParams.get('redirect') || 'package');
//           } else if (msg?.verifiedUser.userTypeID === '11') {
//             history.push('/candidate-dashboard');
//           } else {
//             history.push('/welcome');
//           }
//         }, 100);
//       } else {
//         message.error(msg.msg || 'Invalid credentials');
//       }
//     } catch (error) {
//       message.error('Login failed, please try again!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pageStyle: React.CSSProperties = {
//     minHeight: '100vh',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     padding: 12,
//   };

//   const cardStyle: React.CSSProperties = {
//     maxWidth: 400,
//     width: '100%',
//     background: '#ffffff',
//     borderRadius: 18,
//     boxShadow: '0 18px 38px rgba(0,0,0,0.18)',
//     padding: 22,
//     animation: 'fadeInScale 0.5s ease-out',
//   };

//   const logoStyle: React.CSSProperties = {
//     width: 54,
//     height: 54,
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     borderRadius: 14,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: '0 auto 12px',
//   };

//   const inputStyle: React.CSSProperties = {
//     borderRadius: 8,
//     height: 38,
//   };

//   const buttonStyle: React.CSSProperties = {
//     height: 38,
//     borderRadius: 8,
//     fontSize: 14,
//     fontWeight: 600,
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     color: '#fff',
//     width: '100%',
//   };

//   const actionButtonStyle: React.CSSProperties = {
//     height: 34,
//     borderRadius: 17,
//     fontSize: 13,
//     border: '1px solid #d9d9d9',
//     background: '#fff',
//     width: '100%',
//   };

//   const animationStyles = `
//     @keyframes fadeInScale {
//       0% { opacity: 0; transform: scale(0.96); }
//       100% { opacity: 1; transform: scale(1); }
//     }
//     .ant-form-item { margin-bottom: 12px !important; }
//     .ant-tabs { margin-bottom: 10px !important; }
//   `;

//   return (
//     <div style={pageStyle}>
//       <style>{animationStyles}</style>

//       <div style={{ position: 'fixed', top: 14, right: 14 }}>
//         <SelectLang />
//       </div>

//       <div style={cardStyle}>
//         <div style={logoStyle}>
//           <MedicineBoxOutlined style={{ fontSize: 26, color: '#fff' }} />
//         </div>

//         <div style={{ textAlign: 'center', marginBottom: 14 }}>
//           <Title level={4} style={{ marginBottom: 2 }}>
//             वैद्यराज मदन मोहन सिंह's
//           </Title>
//           <Text strong style={{ fontSize: 14 }}>
//             Ayuroma Wellness Center
//           </Text>
//           <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
//             (Since 1991)
//           </Text>
//         </div>

//         <Tabs
//           activeKey={loginType}
//           onChange={(key) => setLoginType(key as 'account')}
//           centered
//           items={[
//             {
//               key: 'account',
//               label: <span style={{ fontSize: 14 }}>Account Login</span>,
//             },
//           ]}
//         />

//         <ProForm
//           onFinish={handleSubmit}
//           submitter={{
//             render: () => (
//               <Button htmlType="submit" style={buttonStyle} loading={loading}>
//                 Login to Account <ArrowRightOutlined />
//               </Button>
//             ),
//           }}
//         >
//           <ProFormText
//             name="loginName"
//             fieldProps={{
//               size: 'middle',
//               prefix: <UserOutlined />,
//               style: inputStyle,
//               placeholder: 'Username',
//             }}
//             rules={[{ required: true, message: 'Please enter username' }]}
//           />
//           <ProFormText.Password
//             name="password"
//             fieldProps={{
//               size: 'middle',
//               prefix: <LockOutlined />,
//               style: inputStyle,
//               placeholder: 'Password',
//             }}
//             rules={[{ required: true, message: 'Please enter password' }]}
//           />

//           <div style={{ textAlign: 'right', marginBottom: 6 }}>
//             <Button type="link" style={{ padding: 0, fontSize: 12 }}>
//               Forgot password?
//             </Button>
//           </div>
//         </ProForm>

//         <Divider style={{ margin: '12px 0' }}>
//           <Text type="secondary" style={{ fontSize: 12 }}>
//             Others
//           </Text>
//         </Divider>

//         <Space direction="vertical" size={10} style={{ width: '100%' }}>
//           <Button
//             style={actionButtonStyle}
//             onClick={() => history.push('/user/candidate/add')}
//           >
//             Register Patient
//           </Button>
//           <Button
//             style={actionButtonStyle}
//             onClick={() => history.push('/user/candidateActivation')}
//           >
//             Patient Activation
//           </Button>
//           <Button disabled style={{ ...actionButtonStyle, opacity: 0.5 }}>
//             Add Hospital/Doctor
//           </Button>
//         </Space>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useEffect, useState } from 'react';
import { login } from '@/services/apiRequest/api';
import {
  LockOutlined,
  UserOutlined,
  ArrowRightOutlined,
  SafetyOutlined,
  MedicineBoxOutlined,
  PlusCircleOutlined,
  HeartOutlined,
  ExperimentOutlined,
  CarOutlined,
  IdcardOutlined,
  TabletOutlined,
  BankOutlined,
  StarOutlined,
  CrownOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { history, useModel, SelectLang } from '@umijs/max';
import { message, Tabs, Button, Divider, Space, Typography } from 'antd';
import { flushSync } from 'react-dom';
import { setPackageId } from '@/utils/common';
import { requestGetDocuments } from '@/pages/Candidate/services/api';
import { ProForm, ProFormText } from '@ant-design/pro-components';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [loginType, setLoginType] = useState<'account'>('account');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getImgUrl();
  }, []);

  const getImgUrl = async () => {
    try {
      await requestGetDocuments({
        fileName: 'Ayuroma_wellness.jpeg',
        filePath: '',
      });
    } catch (error) {
      console.error('Failed to load background image');
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    setLoading(true);
    try {
      const staticParams = { orgID: '-1', packageID: '-1', token: '' };
      const msg = await login({ ...values, ...staticParams, type: 'account' });

      if (msg.verifiedUser.isVerify) {
        localStorage.setItem('user', JSON.stringify(msg));
        message.success({ content: 'Login successful!', duration: 3 });

        setTimeout(() => {
          const urlParams = new URL(window.location.href).searchParams;
          const selectedPackage = msg?.listPackages[0]?.packagE_ID;
          msg.selectedPackageId = selectedPackage;
          setPackageId(selectedPackage);

          flushSync(() => {
            setInitialState((s) => ({ ...s, currentUser: msg }));
          });

          if (msg?.listPackages.length > 1) {
            history.push(urlParams.get('redirect') || 'package');
          } else if (msg?.verifiedUser.userTypeID === '11') {
            history.push('/candidate-dashboard');
          } else {
            history.push('/welcome');
          }
        }, 100);
      } else {
        message.error(msg.msg || 'Invalid credentials');
      }
    } catch (error) {
      message.error('Login failed, please try again!');
    } finally {
      setLoading(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 400,
    width: '100%',
    background: '#ffffff',
    borderRadius: 18,
    boxShadow: '0 18px 38px rgba(0,0,0,0.18)',
    padding: 22,
    animation: 'fadeInScale 0.5s ease-out',
    position: 'relative',
    zIndex: 10,
  };

  const logoStyle: React.CSSProperties = {
    width: 54,
    height: 54,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    animation: 'pulse 2s ease-in-out infinite',
    position: 'relative',
    zIndex: 10,
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: 8,
    height: 38,
  };

  const buttonStyle: React.CSSProperties = {
    height: 38,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    color: '#fff',
    width: '100%',
    transition: 'all 0.3s ease',
  };

  const actionButtonStyle: React.CSSProperties = {
    height: 34,
    borderRadius: 17,
    fontSize: 13,
    border: '1px solid #d9d9d9',
    background: '#fff',
    width: '100%',
    transition: 'all 0.3s ease',
  };

  const animationStyles = `
    @keyframes fadeInScale {
      0% { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }

    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102,126,234,0.7); }
      50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(102,126,234,0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102,126,234,0); }
    }

    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
      50% { transform: translateY(-20px) rotate(5deg); opacity: 0.25; }
      100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
    }

    @keyframes floatReverse {
      0% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
      50% { transform: translateY(20px) rotate(-5deg); opacity: 0.25; }
      100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes heartbeat {
      0% { transform: scale(1); }
      25% { transform: scale(1.1); }
      35% { transform: scale(1); }
      45% { transform: scale(1.05); }
      55% { transform: scale(1); }
      100% { transform: scale(1); }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    @keyframes glow {
      0% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
      50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
      100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
    }

    .medical-icon-1 { animation: float 8s ease-in-out infinite; }
    .medical-icon-2 { animation: floatReverse 10s ease-in-out infinite; }
    .medical-icon-3 { animation: float 12s ease-in-out infinite; }
    .medical-icon-4 { animation: floatReverse 14s ease-in-out infinite; }
    .medical-icon-5 { animation: rotate 20s linear infinite; }
    .heartbeat { animation: heartbeat 2s ease-in-out infinite; }
    .glow { animation: glow 3s ease-in-out infinite; }
    
    .ant-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102,126,234,0.4);
    }
    
    .ant-btn:active {
      transform: translateY(0);
    }
    
    .ant-form-item { margin-bottom: 12px !important; }
    .ant-tabs { margin-bottom: 10px !important; }
    
    .ant-input-affix-wrapper:hover, .ant-input-affix-wrapper:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 2px rgba(102,126,234,0.1) !important;
    }
  `;

  return (
    <div style={pageStyle}>
      <style>{animationStyles}</style>

      {/* Floating Medical Icons in Background - Using available icons */}
      <div style={{ position: 'absolute', top: '5%', left: '3%', opacity: 0.2, fontSize: 50, color: '#fff' }} className="medical-icon-1">
        <MedicineBoxOutlined />
      </div>
      <div style={{ position: 'absolute', top: '15%', right: '5%', opacity: 0.2, fontSize: 45, color: '#fff' }} className="medical-icon-2">
        <HeartOutlined className="heartbeat" />
      </div>
      <div style={{ position: 'absolute', bottom: '10%', left: '8%', opacity: 0.2, fontSize: 55, color: '#fff' }} className="medical-icon-3">
        <ExperimentOutlined />
      </div>
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', opacity: 0.2, fontSize: 40, color: '#fff' }} className="medical-icon-4">
        <SafetyOutlined />
      </div>
      <div style={{ position: 'absolute', top: '30%', left: '15%', opacity: 0.15, fontSize: 35, color: '#fff' }} className="medical-icon-1">
        <PlusCircleOutlined />
      </div>
      <div style={{ position: 'absolute', top: '70%', right: '15%', opacity: 0.2, fontSize: 48, color: '#fff' }} className="medical-icon-2">
        <CarOutlined />
      </div>
      <div style={{ position: 'absolute', bottom: '30%', left: '20%', opacity: 0.15, fontSize: 42, color: '#fff' }} className="medical-icon-3">
        <TabletOutlined />
      </div>
      <div style={{ position: 'absolute', top: '40%', right: '20%', opacity: 0.2, fontSize: 38, color: '#fff' }} className="medical-icon-4">
        <IdcardOutlined />
      </div>
      <div style={{ position: 'absolute', bottom: '40%', right: '5%', opacity: 0.15, fontSize: 44, color: '#fff' }} className="medical-icon-5">
        <BankOutlined />
      </div>
      <div style={{ position: 'absolute', top: '60%', left: '5%', opacity: 0.2, fontSize: 36, color: '#fff' }} className="medical-icon-1">
        <CrownOutlined />
      </div>

      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '120%',
        height: '120%',
        background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        animation: 'rotate 30s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Floating medical crosses (Plus icons) */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 30 + 20}px`,
            opacity: 0.1,
            color: '#fff',
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `float ${Math.random() * 10 + 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            pointerEvents: 'none',
          }}
        >
          <PlusCircleOutlined />
        </div>
      ))}

      {/* Glowing circles */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 6s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Language selector */}
      {/* <div style={{ position: 'fixed', top: 14, right: 14, zIndex: 20 }}>
        <SelectLang />
      </div> */}

      {/* Login Card */}
      <div style={cardStyle}>
        <div style={logoStyle} className="glow">
          <MedicineBoxOutlined style={{ fontSize: 26, color: '#fff' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <Title level={4} style={{ marginBottom: 2, animation: 'fadeInScale 0.8s' }}>
            वैद्यराज मदन मोहन सिंह's
          </Title>
          <Text strong style={{ fontSize: 14, animation: 'fadeInScale 1s' }}>
            Ayuroma Wellness Center
          </Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 12, animation: 'fadeInScale 1.2s' }}>
            (Since 1991)
          </Text>
        </div>

        <Tabs
          activeKey={loginType}
          onChange={(key) => setLoginType(key as 'account')}
          centered
          items={[
            {
              key: 'account',
              label: <span style={{ fontSize: 14 }}>Account Login</span>,
            },
          ]}
        />

        <ProForm
          onFinish={handleSubmit}
          submitter={{
            render: () => (
              <Button 
                htmlType="submit" 
                style={buttonStyle} 
                loading={loading}
                className="shimmer-effect"
              >
                Login to Account <ArrowRightOutlined />
              </Button>
            ),
          }}
        >
          <ProFormText
            name="loginName"
            fieldProps={{
              size: 'middle',
              prefix: <UserOutlined style={{ color: '#667eea' }} />,
              style: inputStyle,
              placeholder: 'Username',
            }}
            rules={[{ required: true, message: 'Please enter username' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'middle',
              prefix: <LockOutlined style={{ color: '#667eea' }} />,
              style: inputStyle,
              placeholder: 'Password',
            }}
            rules={[{ required: true, message: 'Please enter password' }]}
          />

          {/* <div style={{ textAlign: 'right', marginBottom: 6 }}>
            <Button type="link" style={{ padding: 0, fontSize: 12, color: '#667eea' }}>
              Forgot password?
            </Button>
          </div> */}
        </ProForm>

        <Divider style={{ margin: '12px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Others
          </Text>
        </Divider>

        <Space direction="vertical" size={10} style={{ width: '100%' }}>
          <Button
            style={actionButtonStyle}
            onClick={() => history.push('/user/candidate/add')}
            className="action-btn"
          >
            Register Patient
          </Button>
          <Button
            style={actionButtonStyle}
            onClick={() => history.push('/user/candidateActivation')}
            className="action-btn"
          >
            Patient Activation
          </Button>
          <Button disabled style={{ ...actionButtonStyle, opacity: 0.5 }}>
            Add Hospital/Doctor
          </Button>
        </Space>
      </div>

      {/* Add hover effect style for action buttons */}
      <style>{`
        .action-btn:hover {
          border-color: #667eea !important;
          color: #667eea !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102,126,234,0.2);
        }
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.3) 50%,
            rgba(255,255,255,0) 100%
          );
          transform: rotate(30deg);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Login;