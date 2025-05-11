"use client";

import type React from 'react';
import type { SchedulingResult } from '@/types/taskflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CriticalPathInfoProps {
  schedulingResult: SchedulingResult | null;
}

const CriticalPathInfo: React.FC<CriticalPathInfoProps> = ({ schedulingResult }) => {
  if (!schedulingResult) {
    return null;
  }

  const { criticalPath, projectDuration, tasks } = schedulingResult;
  const criticalPathTasks = tasks.filter(task => criticalPath.includes(task.id)).map(task => task.name);

  return (
    <Card className="mb-4 bg-secondary/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Résumé du Projet</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>
          <strong>Durée Totale du Projet:</strong>{' '}
          <Badge variant="default">{projectDuration.toFixed(1)} unités</Badge>
        </p>
        <div>
          <strong>Chemin Critique:</strong>
          {criticalPathTasks.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {criticalPathTasks.map((taskName, index) => (
                <Badge key={index} variant="outline" style={{borderColor: 'hsl(var(--accent))', color: 'hsl(var(--accent))'}}>
                   <CheckCircle2 className="mr-1 h-3 w-3 text-accent" /> {taskName}
                </Badge>
              ))}
            </div>
          ) : (
             <Badge variant="outline" className="mt-1">
                <AlertTriangle className="mr-1 h-3 w-3 text-destructive" /> Aucun chemin critique identifié (ou aucune tâche).
             </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalPathInfo;
