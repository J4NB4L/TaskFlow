"use client";

import type React from 'react';
import type { Task } from '@/types/taskflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Edit3 } from 'lucide-react';

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
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tasks added yet. Use the form above to add tasks.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Current Tasks ({tasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <p className="font-semibold text-primary">{task.name}</p>
                  <p className="text-sm text-muted-foreground">Duration: {task.duration}</p>
                  {task.dependencies.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Depends on: {task.dependencies.join(', ')}
                    </p>
                  )}
                </div>
                <div className="space-x-2">
                  {/* <Button variant="ghost" size="icon" onClick={() => onEditTask(task)} title="Edit Task">
                    <Edit3 className="h-4 w-4" />
                  </Button> */}
                  <Button variant="ghost" size="icon" onClick={() => onRemoveTask(task.id)} title="Remove Task" className="text-destructive hover:text-destructive/90">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TaskList;
