import React from 'react';
import { DashboardMetrics } from '../../core/types';
import { StatePieChart } from './StatePieChart';
import { CategoryBarChart } from './CategoryBarChart';

interface DistributionChartsProps {
  metrics: DashboardMetrics | null;
}

export const DistributionCharts: React.FC<DistributionChartsProps> = ({ metrics }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <StatePieChart
      data={metrics?.distribucion_por_estado || []}
      total={metrics?.total_activos || 0}
    />
    <CategoryBarChart
      data={metrics?.distribucion_por_categoria || []}
    />
  </div>
);
