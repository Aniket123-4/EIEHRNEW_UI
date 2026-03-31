import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, theme, Spin, Card, Typography, Select, Tag, message } from 'antd';
import { requestGetDistrict, requestGetState } from '@/services/apiRequest/dropdowns';
import { Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import { FilterConfirmProps } from 'antd/es/table/interface';

const { Option } = Select;

interface DistrictDataType {
  districtID: string;
  stateID: string;
  districtName: string;
  districtCode: string;
  stateName?: string;
  key?: string;
  isActive?: boolean;
}

const DistrictList = ({ refresh, editRecord }: any) => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<any>(null);

  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [districtList, setDistrictList] = useState<DistrictDataType[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>('1');
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      getDistrictList();
    }
  }, [refresh, selectedState]);

  const getStates = async () => {
    try {
      const res = await requestGetState();

      if (Array.isArray(res) && res.length > 0) {
        setStates(res);
        setSelectedState(res[0].stateID);
      }
    } catch (error) {
      message.error("Failed to load states");
    }
  };

  const getDistrictList = async () => {

    if (!selectedState) return;

    setLoading(true);

    try {

      const res = await requestGetDistrict({ value: selectedState });

      if (Array.isArray(res)) {

        const state = states.find((s: any) => s.stateID === selectedState);

        const formatted = res.map((item: any, index: number) => ({
          ...item,
          key: item.districtID || index,
          stateName: state?.stateName || '',
          isActive: true
        }));

        setDistrictList(formatted);

      } else {
        setDistrictList([]);
      }

    } catch (error) {
      message.error("Failed to fetch districts");
    }

    setLoading(false);
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof DistrictDataType,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex as string);
  };

  const getColumnSearchProps = (dataIndex: keyof DistrictDataType): ColumnType<DistrictDataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />

        <Space>

          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>

          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>

        </Space>
      </div>
    ),

    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnType<DistrictDataType>[] = [

    {
      title: 'District Name',
      dataIndex: 'districtName',
      key: 'districtName',
      width: '30%',
      ...getColumnSearchProps('districtName'),
      sorter: (a, b) => a.districtName.localeCompare(b.districtName),
    },

    {
      title: 'District Code',
      dataIndex: 'districtCode',
      key: 'districtCode',
      width: '20%',
      render: (text: string) => text || '-',
    },

    {
      title: 'State',
      dataIndex: 'stateName',
      key: 'stateName',
      width: '25%',
    },

    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_: any, record: any) => (
        <Typography.Link
          disabled={editingKey !== ''}
          onClick={() => {
            setEditingKey(record.districtID);
            editRecord(record);
          }}
        >
          Edit
        </Typography.Link>
      ),
    },
  ];

  return (

    <Form form={form} component={false}>

      <Card
        title="District List"
        extra={
          <Space>
            <span>Select State:</span>

            <Select
              value={selectedState}
              style={{ width: 200 }}
              onChange={handleStateChange}
            >
              {states.map((state: any) => (
                <Option key={state.stateID} value={state.stateID}>
                  {state.stateName}
                </Option>
              ))}
            </Select>

          </Space>
        }
      >

        <Spin spinning={loading} tip="Loading districts...">

          <Table
            columns={columns}
            dataSource={districtList}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 500, y: 300 }}
          />

        </Spin>

      </Card>

    </Form>

  );
};

export default DistrictList;