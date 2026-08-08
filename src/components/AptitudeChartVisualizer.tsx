import React from 'react';
import type { ChartData } from '../types';

interface AptitudeChartVisualizerProps {
  chartData: ChartData;
}

export const AptitudeChartVisualizer: React.FC<AptitudeChartVisualizerProps> = ({ chartData }) => {
  const maxVal = Math.max(...chartData.datasets.flatMap(d => d.data), 100);

  return (
    <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-inner">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            📊 <span className="text-accent-cyan">{chartData.title}</span>
          </h4>
          <p className="text-xs text-slate-400">{chartData.subtitle}</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          {chartData.datasets.map(ds => (
            <div key={ds.label} className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ds.color || '#6366f1' }} />
              <span className="text-slate-300 font-semibold">{ds.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Bar / Trend Chart */}
      <div className="h-48 w-full flex items-end justify-between gap-2 pt-4 px-2">
        {chartData.labels.map((label, idx) => {
          return (
            <div key={label} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full flex items-end justify-center space-x-1.5 h-36">
                {chartData.datasets.map(ds => {
                  const val = ds.data[idx] || 0;
                  const heightPercent = Math.min(100, Math.max(10, Math.round((val / maxVal) * 100)));
                  return (
                    <div
                      key={ds.label}
                      className="w-full max-w-[28px] rounded-t-lg transition-all duration-500 group-hover:brightness-125 relative flex items-center justify-center"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: ds.color || '#6366f1'
                      }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 text-[10px] font-extrabold text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none whitespace-nowrap">
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 truncate max-w-full text-center">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
