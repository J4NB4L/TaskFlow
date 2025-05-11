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
          <CardTitle>Aperçu des Tâches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune tâche ajoutée pour le moment. Utilisez le formulaire ci-dessus pour ajouter des tâches.</p>
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
        <CardTitle>Aperçu des Tâches ({tasks.length})</CardTitle>
        <CardDescription>Récapitulatif des tâches saisies : Nom, Durée et Antécédents.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la Tâche</TableHead>
                <TableHead className="text-center">Durée</TableHead>
                <TableHead>Tâches antérieures</TableHead>
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
                    <Button variant="ghost" size="icon" onClick={() => onRemoveTask(task.id)} title="Supprimer la Tâche" className="text-destructive hover:text-destructive/90">
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
