// "use client";

import type React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { CalculatedTask, SchedulingResult } from '@/types/taskflow';
import GanttChartView from './GanttChartView';
import MpmPertTableView from './MpmPertTableView';
import CriticalPathInfo from './CriticalPathInfo';
import NetworkGraphView from './NetworkGraphView'; // Import the new graph view
import { BarChartHorizontalBig, Network, Binary, Share2 } from 'lucide-react'; // Share2 as a generic graph icon

export type ViewMode = 'gantt' | 'mpm' | 'pert';

interface ViewTabsProps {
  tasks: CalculatedTask[];
  schedulingResult: SchedulingResult | null;
}

const ViewTabs: React.FC<ViewTabsProps> = ({ tasks, schedulingResult }) => {
  if (!schedulingResult || tasks.length === 0) {
    return (
      <div className="mt-6 p-8 border rounded-lg shadow-sm bg-card text-center">
 <p className="text-muted-foreground">Ajoutez des tâches et calculez le planning pour visualiser.</p>
      </div>
    );
  }

  return (
 <Tabs defaultValue="gantt" className="w-full mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="gantt"><BarChartHorizontalBig className="mr-2 h-4 w-4" />Gantt Chart</TabsTrigger>
        <TabsTrigger value="mpm"><Network className="mr-2 h-4 w-4" />MPM</TabsTrigger>
        <TabsTrigger value="pert"><Binary className="mr-2 h-4 w-4" />PERT</TabsTrigger>
      </TabsList>
      
      <TabsContent value="gantt" className="mt-4 p-4 border rounded-lg shadow-sm bg-card">
        <CriticalPathInfo schedulingResult={schedulingResult} />
        <GanttChartView tasks={schedulingResult.tasks} projectDuration={schedulingResult.projectDuration} />
      </TabsContent>
      
      <TabsContent value="mpm" className="mt-4 p-4 border rounded-lg shadow-sm bg-card space-y-4">
        <CriticalPathInfo schedulingResult={schedulingResult} />
        <MpmPertTableView tasks={schedulingResult.tasks} viewType="MPM" />
        {/* Add MPM Graph View */}
        <NetworkGraphView tasks={schedulingResult.tasks} viewType="MPM" />
      </TabsContent>
      
      <TabsContent value="pert" className="mt-4 p-4 border rounded-lg shadow-sm bg-card space-y-4">
        <CriticalPathInfo schedulingResult={schedulingResult} />
        <MpmPertTableView tasks={schedulingResult.tasks} viewType="PERT" />
        {/* Add PERT Graph View */}
        <NetworkGraphView tasks={schedulingResult.tasks} viewType="PERT" />
      </TabsContent>
    </Tabs>
  );
};

export default ViewTabs;
