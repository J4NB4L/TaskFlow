"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Task, CalculatedTask, SchedulingResult, DEMO_TASKS as DemoTasksType } from '@/types/taskflow';
import { DEMO_TASKS } from '@/types/taskflow';
import { calculateSchedule } from '@/lib/task-scheduling';
import { v4 as uuidv4 } from 'uuid';

import Header from './Header';
import TaskInputForm from './TaskInputForm';
import TaskList from './TaskList';
import ViewTabs from './ViewTabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TaskFlowShell: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedulingResult, setSchedulingResult] = useState<SchedulingResult | null>(null);
  const { toast } = useToast();

  const handleAddTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: uuidv4() };
    
    // Basic cycle check: a task cannot depend on itself directly. More complex cycle checks are in task-scheduling.ts.
    if (taskData.dependencies.includes(newTask.id)) {
        toast({
            title: "Invalid Dependency",
            description: "A task cannot depend on itself.",
            variant: "destructive",
        });
        return;
    }

    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
        title: "Task Added",
        description: `Task "${newTask.name}" has been successfully added.`,
    });
  }, [toast]);

  const handleRemoveTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.filter(task => task.id !== taskId);
      // Also remove this task ID from other tasks' dependencies
      return newTasks.map(task => ({
        ...task,
        dependencies: task.dependencies.filter(depId => depId !== taskId),
      }));
    });
    toast({
        title: "Task Removed",
        description: `Task has been removed.`,
        variant: "default"
    });
  }, [toast]);

  const loadDemoData = useCallback(() => {
    // Give demo tasks unique IDs if they don't have them or to avoid conflicts
    const demoTasksWithIds: Task[] = DEMO_TASKS.map(task => ({ ...task, id: task.id || uuidv4() }));
    setTasks(demoTasksWithIds);
    toast({
        title: "Demo Data Loaded",
        description: "Sample tasks have been loaded into the application.",
    });
  }, [toast]);
  
  const handleCalculateSchedule = useCallback(() => {
    if (tasks.length === 0) {
      toast({
        title: "No Tasks",
        description: "Please add some tasks before calculating the schedule.",
        variant: "destructive",
      });
      setSchedulingResult(null);
      return;
    }
    const result = calculateSchedule(tasks);
    setSchedulingResult(result);

    if (result.tasks.some(t => t.name.includes("(Error: Cycle/Dependency Issue)"))) {
         toast({
            title: "Calculation Warning",
            description: "A cycle or invalid dependency was detected. Some tasks may not be calculated correctly.",
            variant: "destructive",
            duration: 7000,
        });
    } else {
        toast({
            title: "Schedule Calculated",
            description: "The project schedule and critical path have been updated.",
        });
    }
  }, [tasks, toast]);

  // Auto-calculate when tasks change, could be triggered by a button instead.
  // For now, let's use a manual button.
  // useEffect(() => {
  //   if (tasks.length > 0) {
  //     const result = calculateSchedule(tasks);
  //     setSchedulingResult(result);
  //   } else {
  //     setSchedulingResult(null);
  //   }
  // }, [tasks]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLoadDemoData={loadDemoData} />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <TaskInputForm onAddTask={handleAddTask} existingTasks={tasks} />
            <TaskList tasks={tasks} onRemoveTask={handleRemoveTask} />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Controls</h3>
                <Button onClick={handleCalculateSchedule} className="w-full" disabled={tasks.length === 0}>
                  Calculate Schedule & Critical Path
                </Button>
                 {tasks.length === 0 && (
                    <Alert variant="default" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Info</AlertTitle>
                      <AlertDescription>
                        Add tasks or load demo data to enable calculation.
                      </AlertDescription>
                    </Alert>
                )}
            </div>
            
            <Separator />

            <ViewTabs tasks={schedulingResult?.tasks || []} schedulingResult={schedulingResult} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        TaskFlow - Educational Scheduling Visualizer
      </footer>
    </div>
  );
};

export default TaskFlowShell;
