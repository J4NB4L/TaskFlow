// "use client";

import type React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    name: task.name, // Used for Y-axis
    es: task.es,     // Start of the task
    duration: task.duration, // Duration of the task
    // For tooltip or custom bar fill:
    ef: task.ef,
    ls: task.ls,
    lf: task.lf,
    totalSlack: task.totalSlack,
    isCritical: task.isCritical,
    fill: task.isCritical ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
  }));
  
  // Ensure Y-axis domain covers all task names uniquely and sorts them by ES
  const sortedTasksForYAxis = [...tasks].sort((a, b) => a.es - b.es || a.name.localeCompare(b.name));
  const yAxisDomain = sortedTasksForYAxis.map(task => task.name);


  return (
    <Card className="mt-4 overflow-hidden">
      <CardHeader>
        <CardTitle>Gantt Chart</CardTitle>
        <CardDescription>Visual representation of task schedule. Critical tasks are highlighted (typically in green).</CardDescription>
      </CardHeader>
      <CardContent className="h-[500px] p-2 pr-6 pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: Math.max(...yAxisDomain.map(name => name.length)) * 6 + 20, bottom: 20 }} // Dynamic left margin
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              domain={[0, projectDuration]} 
              label={{ value: "Time", position: "insideBottom", offset: -10 }} 
              allowDecimals={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={150} // Fixed width, adjust as needed or make dynamic
              interval={0} 
              domain={yAxisDomain} 
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
              labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              formatter={(value: any, name: string, props: any) => {
                const { payload } = props;
                if (name === 'duration') {
                  return [`ES: ${payload.es}, EF: ${payload.ef}, LS: ${payload.ls}, LF: ${payload.lf}, Slack: ${payload.totalSlack.toFixed(1)}`, name];
                }
                // Hide the 'es' (offset) bar from tooltip
                if (name === 'es') return [null, null] as any;
                return [value, name];
              }}
            />
            <Legend wrapperStyle={{paddingTop: '10px'}}/>
            {/* Transparent bar for offset, representing ES */}
            <Bar dataKey="es" stackId="time" fill="transparent" barSize={20} name="Start Offset" legendType="none" />
            {/* Visible bar for duration */}
            <Bar dataKey="duration" stackId="time" barSize={20} name="Task Duration (Critical in Green)">
              {/* No LabelList here, task names are on Y-axis */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GanttChartView;
