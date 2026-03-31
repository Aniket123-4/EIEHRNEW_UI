import React, { useState } from 'react';
import { Input, Button, Spin, message, Space, Modal, Table, Tag, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const GlobalSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'https://symantic_searchapi.mssplonline.in';

  const handleSearch = async () => {
    const trimmedQuery = searchText.trim();
    if (!trimmedQuery) {
      message.info('Please enter something to search');
      return;
    }

    setLoading(true);
    setResults([]);
    setIsModalOpen(false);

    try {
      const url = `${API_BASE_URL}/search?query=${encodeURIComponent(trimmedQuery)}`;

      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`API error: ${response.status} - ${errorText || 'No details'}`);
      }

      const data = await response.json();
      const searchResults = Array.isArray(data?.results) ? data.results : [];

      setResults(searchResults);

      if (searchResults.length > 0) {
        setIsModalOpen(true);
        message.success(`Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`);
      } else {
        message.warning('No results found');
      }
    } catch (err: any) {
      console.error('Search failed:', err);

      let errorMsg = 'Something went wrong. Please check console.';
      
      if (err.message?.includes('CORS') || err.message?.includes('Access-Control-Allow-Origin')) {
        errorMsg = 'CORS issue detected. Ask backend team to add proper CORS headers.';
      } else if (err.message?.includes('Failed to fetch')) {
        errorMsg = 'Cannot reach the server. Check your internet or API URL.';
      }

      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Serial No',
      dataIndex: 'id',           // assuming 'id' still comes from API
      key: 'serialNo',
      width: 140,
      render: (_: any, __: any, index: number) => index + 1, // if you want 1,2,3... instead of raw id
      // If backend already sends 'serialNo', change dataIndex: 'serialNo'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 160,
    },
    {
      title: 'DOB',
      dataIndex: 'dob',
      key: 'dob',
      width: 140,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 240,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 110,
      render: (text?: string) => (
        <Tag
          color={
            text?.toLowerCase() === 'active' ? 'success' :
            text?.toLowerCase() === 'inactive' ? 'error' :
            'default'
          }
        >
          {text || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 140,
    },
    {
      title: 'Sections',
      dataIndex: 'sections',
      key: 'sections',
      width: 220,
      render: (sections?: string[]) => {
        if (!Array.isArray(sections) || sections.length === 0) return <span>N/A</span>;
        return (
          <Space size={[0, 6]} wrap>
            {sections.map((sec, i) => (
              <Tag color="geekblue" key={i}>
                {sec}
              </Tag>
            ))}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Space.Compact style={{ width: '100%',   marginLeft:'40%' }}>
        <Input
          placeholder="Search by Patient No, Name, Case No..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          allowClear
          prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
          style={{
            width: '100%',
            maxWidth: 360,
            borderRadius: '20px 0 0 20px',
            height: 40,
          }}
        />
        <Button
          type="primary"
          icon={loading ? <Spin size="small" /> : <SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
          disabled={loading}
          style={{
            borderRadius: '0 20px 20px 0',
            height: 40,
            minWidth: 100,
            fontWeight: 500,
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Space.Compact>

      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Search Results for "{searchText}"</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1200}
        centered
        bodyStyle={{ padding: '16px 24px' }}
        style={{ borderRadius: 12, overflow: 'hidden' }}
      >
        {results.length > 0 ? (
          <Table
            dataSource={results}
            columns={columns}
            rowKey="id"
            pagination={results.length > 10 ? { pageSize: 10, showSizeChanger: false } : false}
            scroll={{ x: 'max-content', y: 460 }}
            size="middle"
            rowClassName={(_record, index) => (index % 2 === 0 ? 'table-row-even' : 'table-row-odd')}
            style={{
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          />
        ) : (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <Empty
              description={
                <span style={{ color: '#595959', fontSize: 16 }}>
                  No results found for "{searchText}"
                </span>
              }
              imageStyle={{ height: 120 }}
            />
          </div>
        )}
      </Modal>

      {/* Optional: Add this to your global CSS or component style */}
      <style>{`
        .table-row-even { background: #fafafa; }
        .table-row-odd  { background: #ffffff; }
        .ant-table-thead > tr > th {
          background: #f5f5f5 !important;
          color: #1f1f1f;
          font-weight: 600;
        }
        .ant-table-tbody > tr:hover > td {
          background: #e6f7ff !important;
        }
      `}</style>
    </>
  );
};

export default GlobalSearch;


// import React, { useState } from 'react';
// import { Input, Button, Spin, message, Space, Modal, Table, Tag } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';

// const GlobalSearch = () => {
//   const [searchText, setSearchText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState<any[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const API_BASE_URL = 'https://symantic_searchapi.mssplonline.in'; // static base URL

//   const handleSearch = async () => {
//     const trimmedQuery = searchText.trim();
//     if (!trimmedQuery) {
//       message.info('Search ke liye kuch toh likhiye!');
//       return;
//     }

//     setLoading(true);
//     setResults([]);
//     setIsModalOpen(false);

//     try {
//       const url = `${API_BASE_URL}/search?query=${encodeURIComponent(trimmedQuery)}`;

//       const response = await fetch(url, {
//         method: 'GET',
//         mode: 'cors',
//         credentials: 'omit', // important: don't send cookies/credentials unless needed
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text().catch(() => '');
//         throw new Error(`API error: ${response.status} - ${errorText || 'No details'}`);
//       }

//       const data = await response.json();

//       const searchResults = Array.isArray(data?.results) ? data.results : [];
//       setResults(searchResults);

//       if (searchResults.length > 0) {
//         setIsModalOpen(true);
//         message.success(`${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} mil gaye`);
//       } else {
//         message.warning('Koi result nahi mila');
//       }
//     } catch (err: any) {
//       console.error('Search failed:', err);
      
//       let errorMsg = 'Kuch gadbad ho gayi – please console check karein';
      
//       if (err.message?.includes('CORS') || err.message?.includes('Access-Control-Allow-Origin')) {
//         errorMsg = 'CORS block ho raha hai! Backend team se kaho ki CORS headers add karein (Access-Control-Allow-Origin: * ya aapke domain ko allow karein)';
//       } else if (err.message?.includes('Failed to fetch')) {
//         errorMsg = 'Network/API unreachable – URL check karein ya internet dekhein';
//       }

//       message.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: 'ID',
//       dataIndex: 'id',
//       key: 'id',
//       width: 160,
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       width: 220,
//       ellipsis: true,
//     },
//     {
//       title: 'Mobile',
//       dataIndex: 'mobile',
//       key: 'mobile',
//       width: 160,
//     },
//     {
//       title: 'DOB',
//       dataIndex: 'dob',
//       key: 'dob',
//       width: 140,
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//       width: 240,
//       ellipsis: true,
//     },
//     {
//       title: 'Active',
//       dataIndex: 'active',
//       key: 'active',
//       width: 100,
//       render: (text?: string) => (
//         <Tag color={text?.toLowerCase() === 'active' ? 'green' : text ? 'red' : 'default'}>
//           {text || 'N/A'}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Role',
//       dataIndex: 'role',
//       key: 'role',
//       width: 140,
//     },
//     {
//       title: 'Sections',
//       dataIndex: 'sections',
//       key: 'sections',
//       width: 220,
//       render: (sections?: string[]) => {
//         if (!Array.isArray(sections) || sections.length === 0) return <span>N/A</span>;
//         return (
//           <Space size={[0, 4]} wrap>
//             {sections.map((sec, i) => (
//               <Tag color="blue" key={i}>
//                 {sec}
//               </Tag>
//             ))}
//           </Space>
//         );
//       },
//     },
//   ];

//   return (
//     <>
//       <Space.Compact style={{ width: 440, marginLeft: 400 }}>
//         <Input
//           placeholder="Patient No, Name ya Case search karein..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           onPressEnter={(e) => {
//             e.preventDefault();
//             handleSearch();
//           }}
//           allowClear
//           prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
//           style={{ width: 340, borderRadius: '20px 0 0 20px' }}
//         />
//         <Button
//           type="primary"
//           icon={loading ? <Spin size="small" /> : <SearchOutlined />}
//           onClick={handleSearch}
//           loading={loading}
//           disabled={loading}
//           style={{ borderRadius: '0 20px 20px 0', minWidth: 100 }}
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </Button>
//       </Space.Compact>

//       <Modal
//         title={`"${searchText}" के रिजल्ट्स`}
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={1300}
//         centered
//       >
//         {results.length > 0 ? (
//           <Table
//             dataSource={results}
//             columns={columns}
//             rowKey="id"
//             pagination={results.length > 10 ? { pageSize: 10 } : false}
//             scroll={{ x: 'max-content', y: 420 }}
//             size="middle"
//           />
//         ) : (
//           <div style={{ textAlign: 'center', padding: '100px 0', color: '#888' }}>
//             "{searchText}" के लिए कोई रिजल्ट नहीं मिला
//           </div>
//         )}
//       </Modal>
//     </>
//   );
// };

// export default GlobalSearch;