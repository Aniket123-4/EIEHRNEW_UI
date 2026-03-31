import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';
import ChatAssistant from '@/ChatAssistant'
const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'Footer',
  });

  const currentYear = new Date().getFullYear();

  return (
    <>
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} MSSPL`}
      links={[
        {
          key: 'eIEHR',
          title: 'Vaidyaraj Madan Mohan Singh Portal',
          href: 'https://google.com/',
          blankTarget: true,
        },
      ]}
    />
     <ChatAssistant />
    
    </>
          
  );
 
};

export default Footer;
