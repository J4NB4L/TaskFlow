"use client";

import type React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import type { CalculatedTask } from '@/types/taskflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GanttChartViewProps {
  tasks: CalculatedTask[];
  projectDuration: number;
}

const GanttChartView: React.FC<GanttChartViewProps> = ({ tasks, projectDuration }) => {
  if (tasks.length === 0) {
    return <p className="text-muted-foreground p-4">No tasks to display in Gantt chart.</p>;
  }

  const chartData = tasks.map(task => ({
    name: task.name,
    time: [task.es, task.ef], // For stacked bar: [start, duration]
    es: task.es,
    duration: task.duration,
    isCritical: task.isCritical,
    fill: task.isCritical ? 'hsl(var(--accent))' : 'hsl(var(--primary))', // Green for critical, Blue for non-critical
  }));
  
  // Ensure Y-axis domain covers all task names uniquely
  const yAxisDomain = tasks.map(task => task.name);

  return (
    <Card className="mt-4 overflow-hidden">
      <CardHeader>
        <CardTitle>Gantt Chart</CardTitle>
        <CardDescription>Visual representation of task schedule. Critical tasks are in green.</CardDescription>
      </CardHeader>
      <CardContent className="h-[500px] p-2 pr-6 pb-6"> {/* Increased height and padding for labels */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }} // Increased left margin for task names
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, projectDuration]} label={{ value: "Time", position: "insideBottom", offset: -5 }} />
            <YAxis type="category" dataKey="name" width={120} interval={0} domain={yAxisDomain} style={{ fontSize: '12px' }}/>
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
              labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              formatter={(value: any, name: string, props: any) => {
                if (name === 'time') {
                  return [`ES: ${props.payload.es}, EF: ${props.payload.es + props.payload.duration}`, null];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="es" stackId="a" fill="transparent" barSize={20} name="Start Offset">
                {/* No LabelList for transparent bar */}
            </Bar>
            <Bar dataKey="duration" stackId="a" barSize={20} name="Duration">
              {chartData.map((entry, index) => (
                <LabelList 
                  key={`label-${index}`} 
                  dataKey="name" 
                  position="insideLeft" 
                  offset={-115} // Adjust offset to be outside the bar, on the left
                  formatter={() => entry.name}
                  style={{ fill: 'hsl(var(--foreground))', fontSize: '12px', pointerEvents: 'none' }} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GanttChartView;
