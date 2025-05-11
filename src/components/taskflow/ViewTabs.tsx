"use client";

import type React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { CalculatedTask, SchedulingResult } from '@/types/taskflow';
import GanttChartView from './GanttChartView';
import MpmPertTableView from './MpmPertTableView';
import CriticalPathInfo from './CriticalPathInfo';
import { BarChartHorizontalBig, Network, Binary } from 'lucide-react';

export type ViewMode = 'gantt' | 'mpm' | 'pert';

interface ViewTabsProps {
  tasks: CalculatedTask[];
  schedulingResult: SchedulingResult | null;
}

const ViewTabs: React.FC<ViewTabsProps> = ({ tasks, schedulingResult }) => {
  if (!schedulingResult || tasks.length === 0) {
    return (
      <div className="mt-6 p-8 border rounded-lg shadow-sm bg-card text-center">
        <p className="text-muted-foreground">Add tasks and calculate the schedule to see visualizations.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="gantt" className="w-full mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="gantt"><BarChartHorizontalBig className="mr-2 h-4 w-4" />Gantt Chart</TabsTrigger>
        <TabsTrigger value="mpm"><Network className="mr-2 h-4 w-4" />MPM Data</TabsTrigger>
        <TabsTrigger value="pert"><Binary className="mr-2 h-4 w-4" />PERT Data</TabsTrigger>
      </TabsList>
      <TabsContent value="gantt" className="mt-4 p-4 border rounded-lg shadow-sm bg-card">
        <CriticalPathInfo schedulingResult={schedulingResult} />
        <GanttChartView tasks={schedulingResult.tasks} projectDuration={schedulingResult.projectDuration} />
      </TabsContent>
      <TabsContent value="mpm" className="mt-4 p-4 border rounded-lg shadow-sm bg-card">
        <CriticalPathInfo schedulingResult={schedulingResult} />
        <MpmPertTableView tasks={schedulingResult.tasks} viewType="MPM" />
      </TabsContent>
      <TabsContent value="pert" className="mt-4 p-4 border rounded-lg shadow-sm bg-card">
        <CriticalPathInfo schedulingResult={schedulingResult} />
        <MpmPertTableView tasks={schedulingResult.tasks} viewType="PERT" />
      </TabsContent>
    </Tabs>
  );
};

export default ViewTabs;
