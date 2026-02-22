'use client';

import { ProgressDataPoint, WeeklyData } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import EmptyState from '@/components/ui/EmptyState';

interface ProgressSectionProps {
  data: WeeklyData;
}

function ChangeCell({ change, suffix = '' }: { change: number; suffix?: string }) {
  if (change === 0) return <span className="text-sf-secondary">-</span>;

  const isPositive = change > 0;
  return (
    <span className={`font-medium ${isPositive ? 'text-sf-good' : 'text-sf-focus'}`}>
      {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}{suffix}
    </span>
  );
}

export default function ProgressSection({ data }: ProgressSectionProps) {
  const { progressData, focusAreaName } = data;

  const hasEnoughData = progressData.length >= 2;
  if (!hasEnoughData) {
    return (
      <div>
        <h2 className="section-title mb-5">Progress</h2>
        <EmptyState
          icon="📈"
          title="Not enough data yet"
          description="We need at least two weeks of reviewed calls to show your progress trend. Keep going!"
        />
      </div>
    );
  }

  // Format data for chart
  const chartData = progressData.map((d: ProgressDataPoint) => ({
    name: `Week ${d.week}`,
    Overall: d.overall,
    [focusAreaName]: d.focusArea,
    Close: d.close,
  }));

  // Calculate week-over-week changes
  const lastWeek = progressData[progressData.length - 2];
  const thisWeek = progressData[progressData.length - 1];

  const comparisonData = [
    {
      metric: 'Overall Score',
      lastWeek: lastWeek?.overall || 0,
      thisWeek: thisWeek?.overall || 0,
      change: (thisWeek?.overall || 0) - (lastWeek?.overall || 0),
    },
    {
      metric: focusAreaName,
      lastWeek: lastWeek?.focusArea || 0,
      thisWeek: thisWeek?.focusArea || 0,
      change: (thisWeek?.focusArea || 0) - (lastWeek?.focusArea || 0),
    },
    {
      metric: 'Close',
      lastWeek: lastWeek?.close || 0,
      thisWeek: thisWeek?.close || 0,
      change: (thisWeek?.close || 0) - (lastWeek?.close || 0),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Line Chart */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <h3 className="card-title mb-4">4-Week Progress</h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                formatter={(value: number) => value.toFixed(1)}
              />
              <Legend
                wrapperStyle={{ paddingTop: '16px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="Overall"
                stroke="#2D1B4E"
                strokeWidth={2}
                dot={{ fill: '#2D1B4E', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey={focusAreaName}
                stroke="#5EECD4"
                strokeWidth={2}
                dot={{ fill: '#5EECD4', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Close"
                stroke="#FFB8C0"
                strokeWidth={2}
                dot={{ fill: '#FFB8C0', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <h3 className="card-title mb-4">Week-over-Week</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sf-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-sf-secondary">Metric</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-sf-secondary">Last Week</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-sf-secondary">This Week</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-sf-secondary">Change</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr
                  key={row.metric}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-sf-card/30'}
                >
                  <td className="py-3 px-4 text-sm font-medium text-sf-body">{row.metric}</td>
                  <td className="py-3 px-4 text-sm text-center text-sf-body">{row.lastWeek.toFixed(1)}</td>
                  <td className="py-3 px-4 text-sm text-center text-sf-body">{row.thisWeek.toFixed(1)}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <ChangeCell change={row.change} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
