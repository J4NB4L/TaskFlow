// "use client";

import type React from 'react';
import type { Task } from '@/types/taskflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TaskListProps {
  tasks: Task[];
  onRemoveTask: (taskId: string) => void;
  // onEditTask: (task: Task) => void; // For future editing
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onRemoveTask }) => {
  if (tasks.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Task Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tasks added yet. Use the form above to add tasks.</p>
          <p className="text-muted-foreground text-sm mt-2">Tasks you add will appear here similar to the image provided: Tâche, Durée, Tâches antérieures.</p>
        </CardContent>
      </Card>
    );
  }

  const getDependencyNames = (dependencyIds: string[]): string => {
    if (!dependencyIds || dependencyIds.length === 0) return '—';
    return dependencyIds
      .map(depId => {
        const dependentTask = tasks.find(t => t.id === depId);
        return dependentTask ? dependentTask.name : depId; // Show name if found, else ID
      })
      .join(', ');
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Task Overview ({tasks.length})</CardTitle>
        <CardDescription>Summary of entered tasks: Name, Duration, and Predecessors.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tâche (Name)</TableHead>
                <TableHead className="text-center">Durée (Duration)</TableHead>
                <TableHead>Tâches antérieures (Predecessors)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell className="text-center">{task.duration}</TableCell>
                  <TableCell>{getDependencyNames(task.dependencies)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onRemoveTask(task.id)} title="Remove Task" className="text-destructive hover:text-destructive/90">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default TaskList;
