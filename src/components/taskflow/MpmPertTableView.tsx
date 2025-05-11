"use client";

import type React from 'react';
import type { CalculatedTask } from '@/types/taskflow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MpmPertTableViewProps {
  tasks: CalculatedTask[];
  viewType: 'MPM' | 'PERT';
}

const MpmPertTableView: React.FC<MpmPertTableViewProps> = ({ tasks, viewType }) => {
  if (tasks.length === 0) {
    return <p className="text-muted-foreground p-4">No task data to display for {viewType}.</p>;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{viewType} Data Summary</CardTitle>
        <CardDescription>
          Detailed information for each task including start/finish times and slacks.
          {viewType === 'PERT' && " PERT typically focuses on probabilistic durations, but here we show deterministic results for consistency."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>ES</TableHead>
                <TableHead>EF</TableHead>
                <TableHead>LS</TableHead>
                <TableHead>LF</TableHead>
                <TableHead>Total Slack</TableHead>
                <TableHead>Free Slack</TableHead>
                <TableHead>Critical</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className={task.isCritical ? 'bg-accent/10' : ''}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>{task.duration}</TableCell>
                  <TableCell>{task.es}</TableCell>
                  <TableCell>{task.ef}</TableCell>
                  <TableCell>{task.ls}</TableCell>
                  <TableCell>{task.lf}</TableCell>
                  <TableCell>{task.totalSlack.toFixed(1)}</TableCell>
                  <TableCell>{task.freeSlack.toFixed(1)}</TableCell>
                  <TableCell>
                    {task.isCritical ? (
                      <Badge variant="destructive" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MpmPertTableView;
