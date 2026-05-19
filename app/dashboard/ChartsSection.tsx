import React from 'react';
import type { ChartData, PieData, TrendData } from '../types/shared';
import './ChartsSection.css';

interface ChartsSectionProps {
  chartData: ChartData[];
  pieData: PieData[];
  trendData: TrendData[];
}

export function ChartsSection({ chartData, pieData, trendData }: ChartsSectionProps) {
  return (
    <div className="charts-section-container">
      {/* Bar Chart */}
      <div className="chart-box">
        <h3 className="chart-title">Issues by Category</h3>
        <ul>
          {chartData.map((item) => (
            <li key={item.category}>
              {item.category}: {item.count}
            </li>
          ))}
        </ul>
      </div>

      {/* Pie Chart */}
      <div className="chart-box">
        <h3 className="chart-title">Issue Status Distribution</h3>
        <ul>
          {pieData.map((item) => (
            <li key={item.name}>
              {item.name}: {item.value}
            </li>
          ))}
        </ul>
      </div>

      {/* Trend Chart */}
      <div className="chart-box">
        <h3 className="chart-title">Trends Over Time</h3>
        <ul>
          {trendData.map((item) => (
            <li key={item.date}>
              {item.date} - Reported: {item.reported}, Resolved: {item.resolved}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
