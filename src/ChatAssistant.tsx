// import React, { useState, useRef, useEffect } from 'react';
// import { Modal, Input, Button, Avatar, List, Typography, Space, Spin } from 'antd';
// import { MessageOutlined, SendOutlined, AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';

// import robotIcon from '@/assets/robot-assistant.png';  // Adjust path if needed

// const { Text } = Typography;

// interface Message {
//   id: number;
//   text: string;
//   isUser: boolean;
// }

// const ChatAssistant: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     { id: 1, text: 'Namaste! Main aapka Hospital AI Assistant hoon. Kya madad kar sakta hoon?', isUser: false }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const recognitionRef = useRef<any>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const API_BASE_URL = 'https://hospital_ai_assistant.mssplonline.in';

//   // Speech Recognition setup (Hindi)
//   useEffect(() => {
//     const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (SpeechRecognitionAPI) {
//       recognitionRef.current = new SpeechRecognitionAPI();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = 'hi-IN';

//       recognitionRef.current.onresult = (event: any) => {
//         const transcript = event.results[0][0].transcript.trim();
//         setInput(transcript);
//         handleSend(transcript); // Auto-send after voice input
//       };

//       recognitionRef.current.onerror = () => {
//         setIsListening(false);
//       };
//     }
//   }, []);

//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Main API call with proper response handling
//   const callPythonAI = async (userMessage: string): Promise<string> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/ask`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question: userMessage }),
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const result = await response.json();

//       if (!result.success) {
//         return 'Sorry, assistant ne yeh process nahi kar paya. Thodi der baad try karein.';
//       }

//       // ── Handle different response types ────────────────────────────────

//       // Case 1: Simple string response
//       if (typeof result.data === 'string') {
//         return result.data.trim();
//       }

//       // Case 2: Patient list (array with FName, LName)
//       if (Array.isArray(result.data) && result.data.length > 0) {
//         const first = result.data[0];
//         if ('FName' in first && 'LName' in first) {
//           const nameList = result.data
//             .map((p: any, i: number) => {
//               const fname = (p.FName || '').trim();
//               const lname = (p.LName || '').trim();
//               return fname || lname ? `${i + 1}. ${fname} ${lname}`.trim() : null;
//             })
//             .filter(Boolean)
//             .join('\n');

//           return `Yahan top ${result.data.length} patients ke naam hain:\n\n${nameList}\n\nKisi patient ki details chahiye ya koi aur sawal?`;
//         }

//         // Generic array fallback
//         return `Data mila hai:\n${JSON.stringify(result.data, null, 2)}`;
//       }

//       // Case 3: Other common keys
//       if (result.answer || result.reply || result.message) {
//         return result.answer || result.reply || result.message;
//       }

//       // Fallback with context
//       return `Aapka sawal: "${result.question || userMessage}"\nJawab mil gaya hai lekin format thoda alag hai. Dobara try karein?`;

//     } catch (err: any) {
//       console.error('API Error:', err);
//       return `Connection issue: ${err.message || 'Backend se connect nahi ho paya'}. Thodi der baad try karein.`;
//     }
//   };

//   const handleSend = async (msg?: string) => {
//     const messageText = msg || input.trim();
//     if (!messageText || loading) return;

//     setLoading(true);

//     const userMsg: Message = { id: Date.now(), text: messageText, isUser: true };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');

//     const aiReply = await callPythonAI(messageText);

//     const aiMsg: Message = { id: Date.now() + 1, text: aiReply, isUser: false };
//     setMessages(prev => [...prev, aiMsg]);

//     speak(aiReply);
//     setLoading(false);
//   };

//   const speak = (text: string) => {
//     if ('speechSynthesis' in window) {
//       setIsSpeaking(true);
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = 'hi-IN';
//       utterance.onend = () => setIsSpeaking(false);
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const toggleVoiceInput = () => {
//     if (!recognitionRef.current) {
//       alert('Aapka browser voice input support nahi karta. Chrome try karein.');
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   return (
//     <>
//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         style={{
//           position: 'fixed',
//           bottom: '40px',
//           right: '40px',
//           width: '80px',
//           height: '80px',
//           zIndex: 9999,
//           border: 'none',
//           borderRadius: '50%',
//           background: 'transparent',
//           boxShadow: '0 8px 32px rgba(24, 144, 255, 0.35)',
//           cursor: 'pointer',
//           transition: 'all 0.3s ease',
//         }}
//         onMouseEnter={e => {
//           e.currentTarget.style.transform = 'scale(1.12)';
//           e.currentTarget.style.boxShadow = '0 12px 40px rgba(24, 144, 255, 0.5)';
//         }}
//         onMouseLeave={e => {
//           e.currentTarget.style.transform = 'scale(1)';
//           e.currentTarget.style.boxShadow = '0 8px 32px rgba(24, 144, 255, 0.35)';
//         }}
//       >
//         <img src={robotIcon} alt="AI Assistant" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//       </button>

//       {/* Chat Modal */}
//       <Modal
//         title={
//           <Space>
//             <Avatar icon={<MessageOutlined />} style={{ backgroundColor: '#1890ff' }} />
//             <Text strong>Hospital AI Assistant</Text>
//           </Space>
//         }
//         open={isOpen}
//         onCancel={() => setIsOpen(false)}
//         footer={null}
//         width={440}
//         centered
//       >
//         <div style={{ height: '400px', overflowY: 'auto', padding: '0 8px' }}>
//           <List
//             dataSource={messages}
//             renderItem={(msg) => (
//               <List.Item style={{ padding: '8px 0', border: 'none' }}>
//                 <div
//                   style={{
//                     display: 'flex',
//                     width: '100%',
//                     justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
//                   }}
//                 >
//                   {!msg.isUser && (
//                     <Avatar
//                       icon={<MessageOutlined />}
//                       style={{ backgroundColor: '#1890ff', marginRight: 8 }}
//                     />
//                   )}

//                   <div
//                     style={{
//                       maxWidth: '80%',
//                       padding: '10px 14px',
//                       borderRadius: msg.isUser
//                         ? '18px 18px 4px 18px'
//                         : '18px 18px 18px 4px',
//                       background: msg.isUser ? '#1890ff' : '#f0f2f5',
//                       color: msg.isUser ? 'white' : 'black',
//                       wordBreak: 'break-word',
//                     }}
//                   >
//                     {msg.text.split('\n').map((line, i) => (
//                       <div key={i}>{line}</div>
//                     ))}
//                   </div>

//                   {msg.isUser && (
//                     <Avatar
//                       style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
//                       icon={<MessageOutlined />}
//                     />
//                   )}
//                 </div>
//               </List.Item>
//             )}
//           />
//           <div ref={messagesEndRef} />
//         </div>

//         <Space.Compact style={{ width: '100%', marginTop: '16px' }}>
//           <Input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onPressEnter={() => handleSend()}
//             placeholder={loading ? 'Processing...' : 'Type ya mic se bolo...'}
//             disabled={loading}
//             style={{ borderRadius: '20px 0 0 20px', flex: 1 }}
//           />
//           <Button
//             type="primary"
//             icon={<SendOutlined />}
//             onClick={() => handleSend()}
//             loading={loading}
//             disabled={loading || !input.trim()}
//           />
//           <Button
//             type="default"
//             danger={isListening}
//             icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
//             onClick={toggleVoiceInput}
//             disabled={loading}
//             style={{ borderRadius: '0 20px 20px 0' }}
//           />
//         </Space.Compact>

//         {loading && (
//           <div style={{ textAlign: 'center', marginTop: 12 }}>
//             <Spin tip="Assistant soch raha hai..." />
//           </div>
//         )}
//       </Modal>
//     </>
//   );
// };

// export default ChatAssistant;


import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, Button, Avatar, List, Typography, Space, Spin, Tooltip } from 'antd';
import { MessageOutlined, SendOutlined, AudioOutlined, AudioMutedOutlined, ReloadOutlined } from '@ant-design/icons';

import robotIcon from '@/assets/robot-assistant.png';  // Adjust path if needed

const { Text } = Typography;

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Namaste! Main aapka Hospital AI Assistant hoon. Kya madad kar sakta hoon?', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'https://hospital_ai_assistant.mssplonline.in';

  // Speech Recognition setup (Hindi)
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechSynthesis;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        setInput(transcript);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const resetChat = () => {
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();  // ← yeh line voice ko turant band karti hai
      setIsSpeaking(false);
    }

    // Stop voice listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Reset messages to welcome
    setMessages([
      { id: Date.now(), text: 'Chat refresh ho gaya!\nNamaste! Fir se kya madad kar sakta hoon?', isUser: false }
    ]);
  };

const callPythonAI = async (userMessage: string): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: userMessage }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const result = await res.json();

    if (!result.success) {
      return '';
    }

    const parts: string[] = [];

    // ── 1. Pehle raw list dikhao (agar data array hai) ──
    if (Array.isArray(result.data) && result.data.length > 0) {
      const first = result.data[0];

      // Patient names wala case detect karo (FName/LName keys se)
      if ('FName' in first || 'LName' in first) {
        const nameList = result.data
          .map((p: any, i: number) => {
            const fname = (p.FName || '').trim();
            const lname = (p.LName || '').trim();
            const full = [fname, lname].filter(Boolean).join(' ');
            return full ? `${i + 1}. ${full}` : null;
          })
          .filter(Boolean);

        if (nameList.length > 0) {
          parts.push(`**${nameList.length} Patient Names Found (Top 50):**`);
          parts.push(...nameList);
          parts.push(''); // separator
        }
      } else {
        // Generic list fallback
        parts.push(`**${result.data.length} records found:**`);
        result.data.slice(0, 15).forEach((item: any, i: number) => {
          parts.push(`${i + 1}. ${JSON.stringify(item)}`);
        });
        if (result.data.length > 15) parts.push('...and more');
        parts.push('');
      }
    }

    // ── 2. Phir report dikhao (agar hai) ──
    if (result.report?.trim()) {
      parts.push('**Summary Report from System:**');
      parts.push(result.report.trim());
      parts.push('');
    }

    // ── 3. Answer (chat mode) agar ho to last mein ──
    if (result.answer?.trim()) {
      parts.push(result.answer.trim());
    }

    const finalText = parts.filter(Boolean).join('\n').trim();

    return finalText || '';

  } catch (err: any) {
    console.error(err);
    return `Connection issue: ${err.message || 'Backend se link nahi ho raha'}`;
  }
};
  const handleSend = async (msg?: string) => {
    const messageText = msg || input.trim();
    if (!messageText || loading) return;

    setLoading(true);

    const userMsg: Message = { id: Date.now(), text: messageText, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const aiReply = await callPythonAI(messageText);

    const aiMsg: Message = { id: Date.now() + 1, text: aiReply, isUser: false };
    setMessages(prev => [...prev, aiMsg]);

    speak(aiReply);
    setLoading(false);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '60px',
          height: '60px',
          zIndex: 9999,
          border: 'none',
          borderRadius: '50%',
          background: 'transparent',
          boxShadow: '0 8px 32px rgba(24, 144, 255, 0.35)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.12)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(24, 144, 255, 0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(24, 144, 255, 0.35)';
        }}
      >
        <img src={robotIcon} alt="AI Assistant" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </button>

      <Modal 
        title={
          <Space align="center"  >
            {/* <Avatar icon={<MessageOutlined />} style={{ backgroundColor: '#1890ff' }} /> */}
            🏥 
            <Text strong style={{ fontSize: 16 }}> Hospital AI Assistant</Text>
          </Space>
        }
        
        open={isOpen}
        closeIcon={
  <span style={{ backgroundColor: '#991b1b',color:'#ffffff' ,fontSize: '28px', fontWeight: 'bold' }}>×</span>
}
        onCancel={() => {
          resetChat();  // X press → chat reset + voice stop
          setIsOpen(false);
           
        }}
        
        footer={null}
        width={740}
        centered
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ height: '380px', overflowY: 'auto', marginBottom: 16 }}>
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item style={{ padding: '8px 0', border: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                    gap: 8,
                  }}
                >
                  {!msg.isUser && (
                    <Avatar
                      icon={<MessageOutlined />}
                      style={{ backgroundColor: '#1890ff', flexShrink: 0 }}
                    />
                  )}

                  <div
                    style={{
                      maxWidth: '78%',
                      padding: '10px 14px',
                      borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.isUser ? '#1890ff' : '#f0f5ff',
                      color: msg.isUser ? 'white' : '#001529',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      lineHeight: 1.4,
                    }}
                  >
                    {msg.text.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>

                  {msg.isUser && (
                    <Avatar
                      style={{ backgroundColor: '#52c41a', flexShrink: 0 }}
                      icon={<MessageOutlined />}
                    />
                  )}
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>

        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={() => handleSend()}
            placeholder={loading ? 'Processing...' : 'Type ya mic se bolo...'}
            disabled={loading}
            style={{ borderRadius: '20px 0 0 20px', height: 44, flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            loading={loading}
            disabled={loading || !input.trim()}
            style={{ height: 44, minWidth: 44 }}
          />
          <Button
            type="default"
            danger={isListening}
            icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
            onClick={toggleVoiceInput}
            disabled={loading}
            style={{ height: 44, minWidth: 44 }}
          />
          <Tooltip title="Refresh / Clear Chat">
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={resetChat}
              disabled={loading}
              style={{ height: 44, minWidth: 44 }}
            />
          </Tooltip>
        </Space.Compact>

        {loading && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Spin size="small" /> <Text type="secondary"> Assistant soch raha hai...</Text>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ChatAssistant;