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
    return <p className="text-muted-foreground p-4">Aucune donnée de tâche à afficher pour {viewType}.</p>;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Résumé des données {viewType}</CardTitle>
        <CardDescription>
          Informations détaillées pour chaque tâche, y compris les heures de début/fin et les marges.
          {viewType === 'PERT' && " Le PERT se concentre généralement sur les durées probabilistes, mais ici nous affichons des résultats déterministes pour la cohérence."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Début au plus tôt</TableHead>
                <TableHead>Fin au plus tôt</TableHead>
                <TableHead>Début au plus tard</TableHead>
                <TableHead>Fin au plus tard</TableHead>
                <TableHead>Marge totale</TableHead>
                <TableHead>Marge libre</TableHead>
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
                      <Badge variant="destructive" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Oui</Badge>
                    ) : (
                      <Badge variant="secondary">Non</Badge>
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
