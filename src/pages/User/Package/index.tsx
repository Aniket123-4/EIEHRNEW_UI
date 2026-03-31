// // import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
// // import { Alert, message, Button, Form, Input, Select, Layout, Space, Col, Row } from 'antd';
// // import React, { useEffect, useState } from 'react';
// // import { flushSync } from 'react-dom';
// // import { useEmotionCss } from '@ant-design/use-emotion-css';
// // import Settings from '../../../../config/defaultSettings';
// // import { login } from '@/services/apiRequest/api';
// // import { setPackageId } from '@/utils/common';

// // const { Header, Footer, Sider, Content } = Layout;

// // const { Option } = Select;

// // const layout = {
// //   labelCol: { span: 8 },
// //   wrapperCol: { span: 16 },
// // };

// // const tailLayout = {
// //   wrapperCol: { offset: 8, span: 16 },
// // };


// // const headerStyle: React.CSSProperties = {
// //   textAlign: 'center',
// //   height: 64,
// //   paddingInline: 50,
// //   lineHeight: '64px',
// //   backgroundColor: '#ffffff',
// // };

// // const contentStyle: React.CSSProperties = {
// //   textAlign: 'center',
// //   minHeight: 120,
// //   lineHeight: '120px',
// //   backgroundColor: '#ffffff',
// //   paddingTop: 110
// // };

// // const footerStyle: React.CSSProperties = {
// //   textAlign: 'center',
// //   backgroundColor: '#ffffff',
// // };


// // const Package: React.FC = () => {

// //   const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
// //   const [type, setType] = useState<string>('account');
// //   const { initialState, setInitialState } = useModel('@@initialState');
// //   const [currentUser, setCurrentUser] = useState<any>();
// //   const [packageList, setPackageList] = useState<any>();
// //   const [form] = Form.useForm();
// //   const intl = useIntl();


// //   const onPackageChange = (value: string) => {
// //     setTimeout(() => {
// //       // this.setState({ success: false });
// //       flushSync(() => {
// //         setInitialState((s: any) => {
// //           s.currentUser['selectedPackageId'] = value
// //           return { ...s }
// //         });
// //       });
// //       setPackageId(value);
// //       const urlParams = new URL(window.location.href).searchParams;
// //       history.push(urlParams.get('redirect') || '/');
// //     }, 100);
// //   };

 
// //   useEffect(() => {
// //     setCurrentUser(initialState?.currentUser);
// //     setPackageList(initialState?.currentUser?.listPackages);
// //   }, [])

// //   const onFinish = (values: any) => {
// //     console.log(values);
// //   };


// //   const DemoBox: React.FC<{ children: React.ReactNode; value: number }> = (props) => (
// //     <p className={`height-${props.value}`}>{props.children}</p>
// //   );

// //   return (
// //     <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
// //       <Layout>
// //         <Header style={headerStyle}><h1>Select you Package</h1></Header>
// //         <Content style={contentStyle}>
// //           <Row justify="space-around" align="middle">

// //             <Col span={8}>
// //               <Form
// //                 form={form}
// //                 name="control-hooks"
// //                 onFinish={onFinish}
// //                 layout="vertical"
// //               >
// //                 <Form.Item name="package" label="Package" rules={[{ required: true }]}>
// //                   <Select
// //                     placeholder="Select Package"
// //                     onChange={onPackageChange}
// //                     allowClear
// //                   >
// //                     {packageList && packageList.map((item: any) => {
// //                       return <Option value={item.packagE_ID}>{item.packagE_NAME}</Option>
// //                     })}
// //                   </Select>
// //                 </Form.Item>

// //               </Form>
// //             </Col>

// //           </Row>
// //         </Content>
// //         <Footer style={footerStyle}>Vaidhyaraj Madan Mohan Singh Portal</Footer>
// //       </Layout>
// //     </Space>
// //   )

// //   // return (
// //   //   <Row>
// //   //     <Col span={8}></Col>
// //   //     <Col span={8}>
// //   //       <Space align="center" style={{ marginTop: "20%" }}>
// //   //         <Form
// //   //           form={form}
// //   //           name="control-hooks"
// //   //           onFinish={onFinish}
// //   //           layout="vertical"
// //   //         >
// //   //           <Form.Item name="package" label="Package" rules={[{ required: true }]}>
// //   //             <Select
// //   //               placeholder="Select Package"
// //   //               onChange={onPackageChange}
// //   //               allowClear
// //   //             >
// //   //               {packageList && packageList.map((item: any) => {
// //   //                 return <Option value={item.packagE_ID}>{item.packagE_NAME}</Option>
// //   //               })}
// //   //             </Select>
// //   //           </Form.Item>
// //   //         </Form>
// //   //       </Space>

// //   //     </Col>
// //   //     <Col span={8}></Col>
// //   //   </Row>
// //   // );
// // };

// // export default Package;






// import { history, useModel } from '@umijs/max';
// import { message, Button, Layout, Space, Col, Row, Card, Typography, Divider, Tag, Avatar } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { flushSync } from 'react-dom';
// import { setPackageId } from '@/utils/common';
// import {
//   UserOutlined,
//   TeamOutlined,
//   SafetyOutlined,
//   CheckCircleOutlined,
//   StarOutlined,
//   ArrowRightOutlined,
//   CrownOutlined,
//   BankOutlined,
//   MedicineBoxOutlined,
//   ExperimentOutlined,
//   HeartOutlined,
// } from '@ant-design/icons';
// import Footer from '@/components/Footer';
// import { Header } from 'antd/es/layout/layout';

// const { Title, Text } = Typography;
// const { Content } = Layout;

// const Package: React.FC = () => {
//   const { initialState, setInitialState } = useModel('@@initialState');
//   const [currentUser, setCurrentUser] = useState<any>();
//   const [packageList, setPackageList] = useState<any>([]);
//   const [selectedPackage, setSelectedPackage] = useState<string>('');
//   const [hoveredPackage, setHoveredPackage] = useState<string>('');

//   // Page style
//   const pageStyle: React.CSSProperties = {
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     position: 'relative',
//     overflow: 'hidden',
//   };

//   // Animation styles
//   const animationStyle = `
//     @keyframes float {
//       0% { transform: translateY(0px); opacity: 0.1; }
//       50% { transform: translateY(-20px); opacity: 0.15; }
//       100% { transform: translateY(0px); opacity: 0.1; }
//     }
//     @keyframes fadeIn {
//       from { opacity: 0; transform: translateY(20px); }
//       to { opacity: 1; transform: translateY(0); }
//     }
//     .package-card {
//       animation: fadeIn 0.5s ease-out;
//       transition: all 0.3s ease;
//       cursor: pointer;
//     }
//     .package-card:hover {
//       transform: translateY(-8px);
//       box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
//     }
//     .floating-icon {
//       position: absolute;
//       color: rgba(255, 255, 255, 0.1);
//       font-size: 60px;
//       animation: float 6s ease-in-out infinite;
//       pointer-events: none;
//     }
//   `;

//   // Floating icons
//   const floatingIcons = [
//     { Icon: MedicineBoxOutlined, top: '10%', left: '5%' },
//     { Icon: HeartOutlined, top: '20%', right: '10%' },
//     { Icon: ExperimentOutlined, bottom: '15%', left: '15%' },
//     { Icon: SafetyOutlined, bottom: '25%', right: '20%' },
//     { Icon: BankOutlined, top: '40%', left: '25%' },
//     { Icon: TeamOutlined, top: '60%', right: '30%' },
//   ];

//   const headerStyle: React.CSSProperties = {
//     textAlign: 'center',
//     padding: '40px 20px 20px',
//     background: 'transparent',
//     height: 'auto',
//   };

//   const contentStyle: React.CSSProperties = {
//     padding: '20px 20px 40px',
//     maxWidth: 1200,
//     margin: '0 auto',
//     width: '100%',
//   };

//   const cardStyle = (index: number): React.CSSProperties => ({
//     borderRadius: 20,
//     padding: 28,
//     background: '#ffffff',
//     boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
//     position: 'relative',
//     overflow: 'hidden',
//     border: selectedPackage === packageList?.[index]?.packagE_ID ? '2px solid #52c41a' : 'none',
//   });

//   const iconWrapperStyle = (color: string): React.CSSProperties => ({
//     width: 80,
//     height: 80,
//     borderRadius: '50%',
//     background: `linear-gradient(135deg, ${color}15, ${color}30)`,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: '0 auto 20px',
//     border: `2px solid ${color}`,
//   });

//   const badgeStyle: React.CSSProperties = {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     padding: '4px 12px',
//     borderRadius: 20,
//     background: 'linear-gradient(135deg, #ffd700, #ffa500)',
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 600,
//   };

//   const buttonStyle = (color: string, isSelected: boolean): React.CSSProperties => ({
//     height: 44,
//     borderRadius: 22,
//     fontSize: 15,
//     fontWeight: 600,
//     background: isSelected ? '#52c41a' : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
//     border: 'none',
//     color: '#fff',
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     marginTop: 20,
//     cursor: 'pointer',
//   });

//   const onPackageChange = (value: string) => {
//     setSelectedPackage(value);
    
//     message.loading({ content: 'Loading...', duration: 1 });
    
//     setTimeout(() => {
//       flushSync(() => {
//         setInitialState((s: any) => {
//           s.currentUser['selectedPackageId'] = value;
//           return { ...s };
//         });
//       });
//       setPackageId(value);
      
//       const packageName = packageList.find((p: any) => p.packagE_ID === value)?.packagE_NAME;
      
//       message.success({
//         content: `${packageName} access granted!`,
//         icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
//         duration: 2,
//       });
      
//       setTimeout(() => {
//         const urlParams = new URL(window.location.href).searchParams;
//         history.push(urlParams.get('redirect') || '/');
//       }, 1000);
//     }, 100);
//   };

//   useEffect(() => {
//     if (initialState?.currentUser) {
//       setCurrentUser(initialState.currentUser);
//       setPackageList(initialState.currentUser?.listPackages || []);
//     }
//   }, []);

//   // Agar packages nahi hain to kuch mat dikhao
//   if (!packageList || packageList.length === 0) {
//     return null;
//   }

//   return (
//     <div style={pageStyle}>
//       <style>{animationStyle}</style>

//       {/* Floating icons */}
//       {floatingIcons.map((item, index) => (
//         <div key={index} className="floating-icon" style={{ top: item.top, left: item.left, right: item.right }}>
//           <item.Icon />
//         </div>
//       ))}

//       <Layout style={{ background: 'transparent', minHeight: '100vh' }}>
//         <Header style={headerStyle}>
//           <Avatar size={64} icon={<CrownOutlined />} style={{ backgroundColor: '#fff', color: '#667eea', marginBottom: 16 }} />
//           <Title level={1} style={{ color: '#fff', marginBottom: 8, fontSize: 32 }}>
//             Welcome, {currentUser?.verifiedUser?.userName || 'Admin'}!
//           </Title>
//           <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
//             Select a portal to continue
//           </Text>
//         </Header>

//         <Content style={contentStyle}>
//           <Row gutter={[24, 24]} justify="center">
//             {/* eIEHR Package - Main Portal */}
//             {packageList.map((item: any, index: number) => {
//               const isEIEHR = item.packagE_NAME.toLowerCase().includes('eiehr') && !item.packagE_NAME.toLowerCase().includes('user');
//               const isEIEHRUser = item.packagE_NAME.toLowerCase().includes('user');
//               const color = isEIEHR ? '#1890ff' : '#52c41a';
//               const isSelected = selectedPackage === item.packagE_ID;
//               const isHovered = hoveredPackage === item.packagE_ID;

//               return (
//                 <Col xs={24} sm={12} md={8} key={item.packagE_ID}>
//                   <Card
//                     className="package-card"
//                     style={{
//                       ...cardStyle(index),
//                       transform: isHovered ? 'translateY(-8px)' : 'none',
//                     }}
//                     onMouseEnter={() => setHoveredPackage(item.packagE_ID)}
//                     onMouseLeave={() => setHoveredPackage('')}
//                     onClick={() => onPackageChange(item.packagE_ID)}
//                   >
//                     {index === 0 && (
//                       <div style={badgeStyle}>
//                         <StarOutlined /> PRIMARY
//                       </div>
//                     )}

//                     <div style={iconWrapperStyle(color)}>
//                       {isEIEHR && <BankOutlined style={{ fontSize: 36, color }} />}
//                       {isEIEHRUser && <TeamOutlined style={{ fontSize: 36, color }} />}
//                     </div>

//                     <div style={{ textAlign: 'center', marginBottom: 16 }}>
//                       <Title level={3} style={{ marginBottom: 8, fontSize: 22 }}>
//                         {item.packagE_NAME}
//                       </Title>
//                       <Tag color={color} style={{ padding: '4px 16px', borderRadius: 20 }}>
//                         {isEIEHR ? 'MAIN PORTAL' : 'USER MANAGEMENT'}
//                       </Tag>
//                     </div>

//                     <Divider style={{ margin: '16px 0' }} />

//                     <div style={{ minHeight: 140 }}>
//                       {isEIEHR ? (
//                         // eIEHR Features
//                         <>
//                           <FeatureItem icon={<BankOutlined />} text="Enterprise Portal" color={color} />
//                           <FeatureItem icon={<MedicineBoxOutlined />} text="Health Records" color={color} />
//                           <FeatureItem icon={<SafetyOutlined />} text="Secure Dashboard" color={color} />
//                           <FeatureItem icon={<ExperimentOutlined />} text="Analytics" color={color} />
//                         </>
//                       ) : (
//                         // eIEHRUser Features
//                         <>
//                           <FeatureItem icon={<UserOutlined />} text="User Management" color={color} />
//                           <FeatureItem icon={<TeamOutlined />} text="Role Management" color={color} />
//                           <FeatureItem icon={<SafetyOutlined />} text="Permissions" color={color} />
//                           <FeatureItem icon={<CrownOutlined />} text="Admin Controls" color={color} />
//                         </>
//                       )}
//                     </div>

//                     <Button
//                       style={buttonStyle(color, isSelected)}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onPackageChange(item.packagE_ID);
//                       }}
//                     >
//                       {isSelected ? (
//                         <>
//                           <CheckCircleOutlined />
//                           Current Portal
//                         </>
//                       ) : (
//                         <>
//                           {isEIEHR ? <BankOutlined /> : <TeamOutlined />}
//                           Open {isEIEHR ? 'Portal' : 'User Management'}
//                           <ArrowRightOutlined />
//                         </>
//                       )}
//                     </Button>
//                   </Card>
//                 </Col>
//               );
//             })}
//           </Row>

//           {/* Quick Info */}
//           <Row justify="center" style={{ marginTop: 40 }}>
//             <Col>
//               <Card style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 50, padding: '8px 24px' }} bordered={false}>
//                 <Space size={20}>
//                   <Text><BankOutlined style={{ color: '#1890ff' }} /> Main Portal</Text>
//                   <Divider type="vertical" />
//                   <Text><TeamOutlined style={{ color: '#52c41a' }} /> User Management</Text>
//                   <Divider type="vertical" />
//                   <Text><SafetyOutlined style={{ color: '#722ed1' }} /> Secure Access</Text>
//                 </Space>
//               </Card>
//             </Col>
//           </Row>
//         </Content>

//         <Footer >
//           <Text style={{ color: '#fff', opacity: 0.8 }}>
//             © 2024 Vaidhyaraj Madan Mohan Singh Portal. All rights reserved.
//           </Text>
//         </Footer>
//       </Layout>
//     </div>
//   );
// };

// // Feature Item Component
// const FeatureItem = ({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) => (
//   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, color: '#555' }}>
//     <CheckCircleOutlined style={{ color }} />
//     <span>{icon}</span>
//     <span>{text}</span>
//   </div>
// );

// export default Package;

import { history, useModel } from '@umijs/max';
import { message, Button, Layout, Space, Col, Row, Card, Typography, Divider, Tag, Avatar, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { setPackageId } from '@/utils/common';
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ArrowRightOutlined,
  CrownOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  HeartOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import Footer from '@/components/Footer';
import { Header } from 'antd/es/layout/layout';

const { Title, Text } = Typography;
const { Content } = Layout;

const Package: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [currentUser, setCurrentUser] = useState<any>();
  const [packageList, setPackageList] = useState<any>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [hoveredPackage, setHoveredPackage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Page style with gradient animation
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(-45deg, #667eea, #764ba2, #6b8cff, #9f7aea)',
    backgroundSize: '400% 400%',
    position: 'relative',
    overflow: 'hidden',
  };

  // Compact animation styles
  const animationStyle = `
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); opacity: 0.1; }
      50% { transform: translateY(-15px); opacity: 0.15; }
      100% { transform: translateY(0px); opacity: 0.1; }
    }

    @keyframes floatReverse {
      0% { transform: translateY(0px); opacity: 0.1; }
      50% { transform: translateY(15px); opacity: 0.15; }
      100% { transform: translateY(0px); opacity: 0.1; }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .gradient-bg {
      animation: gradientBG 15s ease infinite;
    }

    .package-card {
      animation: fadeInUp 0.5s ease-out;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .package-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
    }

    .feature-item {
      transition: all 0.2s ease;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .feature-item:hover {
      background: rgba(102,126,234,0.05);
      transform: translateX(4px);
    }

    .floating-icon {
      position: absolute;
      color: rgba(255, 255, 255, 0.1);
      font-size: 50px;
      pointer-events: none;
    }

    .floating-icon:nth-child(odd) {
      animation: float 7s ease-in-out infinite;
    }

    .floating-icon:nth-child(even) {
      animation: floatReverse 8s ease-in-out infinite;
    }

    .pulse-animation {
      animation: pulse 2s ease-in-out infinite;
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
        rgba(255,255,255,0.2) 50%,
        rgba(255,255,255,0) 100%
      );
      transform: rotate(30deg);
      animation: shimmer 3s infinite;
      pointer-events: none;
    }

    .ant-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102,126,234,0.3);
    }
  `;

  // Compact floating icons
  const floatingIcons = [
    { Icon: MedicineBoxOutlined, top: '5%', left: '2%' },
    { Icon: HeartOutlined, top: '15%', right: '5%' },
    { Icon: ExperimentOutlined, bottom: '10%', left: '8%' },
    { Icon: SafetyOutlined, bottom: '20%', right: '10%' },
    { Icon: BankOutlined, top: '30%', left: '15%' },
    { Icon: TeamOutlined, top: '70%', right: '15%' },
    { Icon: RocketOutlined, bottom: '30%', left: '20%' },
    { Icon: ThunderboltOutlined, bottom: '40%', right: '5%' },
    { Icon: GlobalOutlined, top: '80%', left: '10%' },
    { Icon: CrownOutlined, bottom: '60%', left: '3%' },
    { Icon: StarOutlined, top: '45%', right: '2%' },
    { Icon: PlusCircleOutlined, top: '35%', left: '30%' },
  ];

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '30px 20px 20px',
    background: 'transparent',
    height: 'auto',
    position: 'relative',
    zIndex: 2,
  };

  const contentStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    zIndex: 2,
  };

  // Compact card style
  const cardStyle = (index: number, isSelected: boolean): React.CSSProperties => ({
    borderRadius: 16,
    padding: 20,
    background: '#ffffff',
    boxShadow: isSelected 
      ? '0 10px 20px rgba(82,196,26,0.2), 0 0 0 2px #52c41a'
      : '0 8px 20px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  });

  // Smaller icon wrapper
  const iconWrapperStyle = (color: string): React.CSSProperties => ({
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color}10, ${color}20)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    border: `2px solid ${color}`,
  });

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '4px 10px',
    borderRadius: 20,
    background: 'linear-gradient(135deg, #ffd700, #ffa500)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 600,
    zIndex: 2,
  };

  // Compact button
  const buttonStyle = (color: string, isSelected: boolean): React.CSSProperties => ({
    height: 36,
    borderRadius: 18,
    fontSize: 13,
    fontWeight: 600,
    background: isSelected 
      ? '#52c41a'
      : `linear-gradient(135deg, ${color}, ${color}dd)`,
    border: 'none',
    color: '#fff',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const onPackageChange = (value: string) => {
    setSelectedPackage(value);
    
    message.loading({ content: 'Loading...', duration: 1 });
    
    setTimeout(() => {
      flushSync(() => {
        setInitialState((s: any) => {
          s.currentUser['selectedPackageId'] = value;
          return { ...s };
        });
      });
      setPackageId(value);
      
      const packageName = packageList.find((p: any) => p.packagE_ID === value)?.packagE_NAME;
      
      message.success({
        content: `${packageName} access granted!`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 2,
      });
      
      setTimeout(() => {
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      }, 1000);
    }, 100);
  };

  useEffect(() => {
    setTimeout(() => {
      if (initialState?.currentUser) {
        setCurrentUser(initialState.currentUser);
        setPackageList(initialState.currentUser?.listPackages || []);
      }
      setLoading(false);
    }, 500);
  }, [initialState]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16
      }}>
        <Spin size="large" tip="Loading..." style={{ color: '#fff' }}>
          <div style={{ 
            padding: 30, 
            borderRadius: 12, 
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <RocketOutlined style={{ fontSize: 36, color: '#fff' }} />
          </div>
        </Spin>
        <Text style={{ color: '#fff', fontSize: 16 }}>Preparing your portals...</Text>
      </div>
    );
  }

  if (!packageList || packageList.length === 0) {
    return null;
  }

  return (
    <div style={pageStyle} className="gradient-bg">
      <style>{animationStyle}</style>

      {/* Floating icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className="floating-icon"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
        >
          <item.Icon />
        </div>
      ))}

      <Layout style={{ background: 'transparent', minHeight: '100vh' }}>
<Header style={headerStyle}>
  <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
    <Avatar 
      size={40} 
      icon={<CrownOutlined />} 
      style={{ 
        backgroundColor: '#fff', 
        color: '#667eea', 
        marginBottom: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }} 
    />
    <Title level={3} style={{ color: '#fff', marginBottom: 2, fontSize: 20, fontWeight: 600 }}>
      Welcome Back,
    </Title>
    <Title level={4} style={{ color: '#fff', marginBottom: 6, fontSize: 16, fontWeight: 400, opacity: 0.95 }}>
      {currentUser?.verifiedUser?.userName || 'Admin'}!
    </Title>
    <div style={{ 
      display: 'inline-block',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(5px)',
      padding: '4px 16px',
      borderRadius: 20,
    }}>
      <Text style={{ color: '#fff', fontSize: 16 }}>
        Select a Package to continue
      </Text>
    </div>
  </div>
</Header>
        <Content style={contentStyle}>
          <Row gutter={[20, 20]} justify="center">
            {packageList.map((item: any, index: number) => {
              const isEIEHR = item.packagE_NAME.toLowerCase().includes('eiehr') && !item.packagE_NAME.toLowerCase().includes('user');
              const isEIEHRUser = item.packagE_NAME.toLowerCase().includes('user');
              const color = isEIEHR ? '#1890ff' : '#52c41a';
              const isSelected = selectedPackage === item.packagE_ID;

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={item.packagE_ID}>
                  <Card
                    className="package-card"
                    style={cardStyle(index, isSelected)}
                    onMouseEnter={() => setHoveredPackage(item.packagE_ID)}
                    onMouseLeave={() => setHoveredPackage('')}
                    onClick={() => onPackageChange(item.packagE_ID)}
                  >
                    {index === 0 && (
                      <div style={badgeStyle}>
                        <StarOutlined /> PRIMARY
                      </div>
                    )}

                    <div style={iconWrapperStyle(color)}>
                      {isEIEHR && <BankOutlined style={{ fontSize: 28, color }} />}
                      {isEIEHRUser && <TeamOutlined style={{ fontSize: 28, color }} />}
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                      <Title level={4} style={{ marginBottom: 6, fontSize: 18, fontWeight: 600 }}>
                        {item.packagE_NAME}
                      </Title>
                      <Tag color={color} style={{ padding: '2px 12px', borderRadius: 16, fontSize: 11 }}>
                        {isEIEHR ? 'MAIN' : 'USER MGMT'}
                      </Tag>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    <div style={{ minHeight: 120 }}>
                      {isEIEHR ? (
                        <>
                          <FeatureItem icon={<BankOutlined />} text="Enterprise" color={color} />
                          <FeatureItem icon={<MedicineBoxOutlined />} text="Health Records" color={color} />
                          <FeatureItem icon={<SafetyOutlined />} text="Secure" color={color} />
                        </>
                      ) : (
                        <>
                          <FeatureItem icon={<UserOutlined />} text="User Mgmt" color={color} />
                          <FeatureItem icon={<TeamOutlined />} text="Roles" color={color} />
                          <FeatureItem icon={<SafetyOutlined />} text="Permissions" color={color} />
                        </>
                      )}
                    </div>

                    <Button
                      style={buttonStyle(color, isSelected)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPackageChange(item.packagE_ID);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircleOutlined />
                          Current
                        </>
                      ) : (
                        <>
                          {isEIEHR ? <BankOutlined /> : <TeamOutlined />}
                          Open
                          <ArrowRightOutlined />
                        </>
                      )}
                    </Button>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Simple Footer Badges */}
          <Row justify="center" style={{ marginTop: 30 }}>
            <Col>
              <Space size={16}>
                <div style={{ textAlign: 'center', color: '#fff', opacity: 0.7 }}>
                  <ThunderboltOutlined style={{ fontSize: 18 }} />
                  <div style={{ fontSize: 11 }}>Fast</div>
                </div>
                <div style={{ textAlign: 'center', color: '#fff', opacity: 0.7 }}>
                  <GlobalOutlined style={{ fontSize: 18 }} />
                  <div style={{ fontSize: 11 }}>24/7</div>
                </div>
                <div style={{ textAlign: 'center', color: '#fff', opacity: 0.7 }}>
                  <HeartOutlined style={{ fontSize: 18 }} />
                  <div style={{ fontSize: 11 }}>Care</div>
                </div>
              </Space>
            </Col>
          </Row>
        </Content>

        <Footer >
          <Text style={{ color: '#fff', opacity: 0.6, fontSize: 12 }}>
            © 2024 Vaidhyaraj Madan Mohan Singh Portal
          </Text>
        </Footer>
      </Layout>
    </div>
  );
};

// Compact Feature Item
const FeatureItem = ({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) => (
  <div className="feature-item" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#555', fontSize: 12 }}>
    <CheckCircleOutlined style={{ color, fontSize: 12 }} />
    <span style={{ fontSize: 12 }}>{icon}</span>
    <span style={{ fontSize: 12 }}>{text}</span>
  </div>
);

export default Package;