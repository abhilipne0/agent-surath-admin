import React, { useEffect, useState } from 'react';
import { Input, Table, Row, Col, Statistic, Spin, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  fetchDragonTigerSessions,
  fetchDragonTigerDailyStats,
  setDragonTigerSessionMode,
  getDragonTigerSessionMode,
} from '../../../../../store/games/dragon-tiger/dragonTigerSlice';

function DragonTiger() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [date, setDate] = useState(dayjs());

  const {
    sessions,
    loading,
    totalSessions,
    dailyStats,
    sessionMode,
  } = useSelector((state) => state.dragonTiger);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // ✅ Fetch sessions + daily stats
  useEffect(() => {
    const formattedDate = date.format('YYYY-MM-DD');
    dispatch(fetchDragonTigerSessions({
      page: pagination.current,
      limit: pagination.pageSize,
      searchText,
    }));
    dispatch(fetchDragonTigerDailyStats(formattedDate));
  }, [dispatch, pagination.current, pagination.pageSize, searchText, date]);

  // ✅ Fetch session mode on mount
  useEffect(() => {
    dispatch(getDragonTigerSessionMode());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value.trim());
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleDateChange = (newDate) => {
    if (dayjs.isDayjs(newDate)) {
      setDate(newDate);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    dispatch(setDragonTigerSessionMode(newMode))
      .unwrap()
      .then((res) => {
        message.success(res.data.message || `Mode set to ${newMode}`);
      })
      .catch((err) => {
        message.error(err || 'Failed to change mode');
      });
  };

  const filteredData = sessions.filter((item) =>
    item.sessionId.toString().includes(searchText)
  );

  const columns = [
    { title: 'Session ID', dataIndex: 'sessionId', key: 'sessionId', fixed: 'left' },
    { title: 'Start Time (IST)', dataIndex: 'startTime', key: 'startTime' },
    { title: 'Total Bet (₹)', dataIndex: 'totalBetAmount', key: 'totalBetAmount' },
    { title: 'Total Win (₹)', dataIndex: 'totalWinningAmount', key: 'totalWinningAmount' },
    { title: 'Users Played', dataIndex: 'uniqueUserCount', key: 'uniqueUserCount' },
    { title: 'Dragon (₹)', dataIndex: 'dragonTotalAmount', key: 'dragonTotalAmount' },
    { title: 'Tiger (₹)', dataIndex: 'tigerTotalAmount', key: 'tigerTotalAmount' },
  ];

  return (
    <div>
      <div className='d-flex justify-content-center align-items-center flex-column'>
        <DatePicker
          value={date}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          allowClear={false}
        />
        {/* ✅ Session Mode Section */}
        <div className='mt-1'>
          {sessionMode.loading && <p>Loading settings...</p>}
          {sessionMode.error && <p className="text-danger">Error: {sessionMode.error}</p>}
          {sessionMode.mode ? (
            <div className='d-flex justify-content-center mt-1'>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sessionMode"
                  id="automaticMode"
                  value="automatic"
                  checked={sessionMode.mode === 'automatic'}
                  onChange={handleModeChange}
                />
                <label className="form-check-label" htmlFor="automaticMode">
                  Automatic
                </label>
              </div>
              <div className="form-check ms-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sessionMode"
                  id="manualMode"
                  value="manual"
                  checked={sessionMode.mode === 'manual'}
                  onChange={handleModeChange}
                />
                <label className="form-check-label" htmlFor="manualMode">
                  Manual
                </label>
              </div>
            </div>
          ) : (
            !sessionMode.loading && <p>No settings available.</p>
          )}
        </div>
        <Spin spinning={dailyStats.loading}>
          <Row gutter={30} className="mb-1 mt-2">
            <Col>
              <Statistic title="Total Bet (₹)" value={dailyStats.totalBetAmount} precision={2} />
            </Col>
            <Col>
              <Statistic title="Total Win (₹)" value={dailyStats.totalWinningAmount} precision={2} />
            </Col>
          </Row>
        </Spin>


      </div>

      <Input
        className='my-2'
        placeholder="Search by Session ID"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 200 }}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record.sessionId}
        className="custom-table"
        size="small"
        scroll={{ x: 'max-content' }}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: totalSessions,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default DragonTiger;
