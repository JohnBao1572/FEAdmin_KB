import { Card, DatePicker, Select, Tooltip, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState, useEffect } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import axios from 'axios';
import handleAPI from '../apis/handleAPI';
import { METHODS } from 'http';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportScreen = () => {
  const [viewMode, setViewMode] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState<Dayjs | [Dayjs, Dayjs] | null>(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (viewMode === "monthly" && selectedDate && !Array.isArray(selectedDate)) {
      fetchMonthlyReport(selectedDate.format('YYYY-MM'));
    } else if (viewMode === "daily" && Array.isArray(selectedDate) && selectedDate.length === 2) {
      fetchDailyReport(selectedDate[0].format('YYYY-MM-DD'), selectedDate[1].format('YYYY-MM-DD'));
    }
  }, [viewMode, selectedDate]);

  const fetchDailyReport = async (startDate: string, endDate: string) => {
    const api = `http://localhost:5000/reports/getBillInThatDay?date=${startDate}`
    setLoading(true);
    try {
      const response = await handleAPI(api);
      setData(response.data);
      message.success('Daily report fetched successfully');
    } catch (error) {
      message.error('Have an error in report date');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyReport = async (month: string) => {
    const api = `http://localhost:5000/reports/getBillInThatMonth?month=${month}`
    setLoading(true);
    try {
      const response = await handleAPI(api);
      setData(response.data);
      message.success('Monthly report fetched successfully');
    } catch (error) {
      message.error('Have an error in report monthly');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Profit & Revenue"
      extra={
        <div style={{ display: "flex", gap: "10px" }}>
          <Select value={viewMode} onChange={setViewMode}>
            <Option value="monthly">Monthly</Option>
            <Option value="daily">Daily</Option>
          </Select>
          {viewMode === "monthly" ? (
            <DatePicker
              picker="month"
              onChange={(date) => {
                if (date) setSelectedDate(date);
              }}
            />
          ) : (
            <RangePicker
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setSelectedDate([dates[0], dates[1]]);
                } else {
                  setSelectedDate(null);
                }
              }}
            />
          )}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey={viewMode === "monthly" ? "month" : "date"} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#1890ff" />
          <Line type="monotone" dataKey="profit" stroke="#f5a623" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ReportScreen;