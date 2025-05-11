// "use client";

import type React from 'react';
import type { CalculatedTask } from '@/types/taskflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkGraphViewProps {
  tasks: CalculatedTask[];
  viewType: 'MPM' | 'PERT';
}

const NODE_WIDTH_PERT = 150;
const NODE_HEIGHT_PERT = 75;
const NODE_WIDTH_MPM = 140;
const NODE_HEIGHT_MPM = 90;

const HORIZONTAL_SPACING = 70;
const VERTICAL_SPACING = 50;
const TEXT_PADDING = 5;
const LINE_HEIGHT = 18;

const NetworkGraphView: React.FC<NetworkGraphViewProps> = ({ tasks, viewType }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{viewType} Network Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No task data to display for {viewType} graph.</p>
        </CardContent>
      </Card>
    );
  }

  const nodeWidth = viewType === 'PERT' ? NODE_WIDTH_PERT : NODE_WIDTH_MPM;
  const nodeHeight = viewType === 'PERT' ? NODE_HEIGHT_PERT : NODE_HEIGHT_MPM;

  // Calculate levels and positions
  const levels = new Map<string, number>();
  const taskMap = new Map(tasks.map(task => [task.id, task]));
  
  const calculateLevels = () => {
    const inDegrees = new Map<string, number>();
    const adj = new Map<string, string[]>();

    tasks.forEach(task => {
      inDegrees.set(task.id, task.dependencies.length);
      adj.set(task.id, []); // Initialize adjacency list for successors
      task.dependencies.forEach(depId => {
        if (!adj.has(depId)) adj.set(depId, []);
        adj.get(depId)!.push(task.id);
      });
    });
    
    const queue: string[] = [];
    tasks.forEach(task => {
      if (inDegrees.get(task.id) === 0) {
        queue.push(task.id);
        levels.set(task.id, 0);
      }
    });

    let head = 0;
    while(head < queue.length) {
      const u = queue[head++];
      (adj.get(u) || []).forEach(v => {
        levels.set(v, (levels.get(u) || 0) + 1);
        inDegrees.set(v, (inDegrees.get(v) || 0) - 1);
        if (inDegrees.get(v) === 0) {
          queue.push(v);
        }
      });
    }
    // Fallback for tasks not reached (e.g. in a cycle or disconnected)
     tasks.forEach(task => {
        if(!levels.has(task.id)) {
            levels.set(task.id, tasks.length); // Put them at a high level
        }
    });
  };

  calculateLevels();

  const tasksByLevel: Array<CalculatedTask[]> = [];
  levels.forEach((level, taskId) => {
    if (!tasksByLevel[level]) {
      tasksByLevel[level] = [];
    }
    const task = taskMap.get(taskId);
    if (task) tasksByLevel[level].push(task);
  });

  const nodePositions = new Map<string, { x: number; y: number }>();
  let maxYPosition = 0;

  tasksByLevel.forEach((levelTasks, levelIndex) => {
    const y = levelIndex * (nodeHeight + VERTICAL_SPACING) + VERTICAL_SPACING / 2;
    levelTasks.forEach((task, taskIndexInLevel) => {
      const x = taskIndexInLevel * (nodeWidth + HORIZONTAL_SPACING) + HORIZONTAL_SPACING / 2;
      nodePositions.set(task.id, { x, y });
      if (y > maxYPosition) maxYPosition = y;
    });
  });
  
  const canvasWidth = Math.max(...tasksByLevel.map(level => level.length)) * (nodeWidth + HORIZONTAL_SPACING);
  const canvasHeight = maxYPosition + nodeHeight + VERTICAL_SPACING / 2;


  const renderPertNode = (task: CalculatedTask, pos: { x: number; y: number }) => (
    <g key={task.id} transform={`translate(${pos.x}, ${pos.y})`}>
      <rect width={nodeWidth} height={nodeHeight} fill="hsl(var(--card))" stroke="hsl(var(--border))" rx="var(--radius)" ry="var(--radius)" className={task.isCritical ? 'stroke-2 stroke-accent' : ''} />
      {/* Row 1 */}
      <text x={TEXT_PADDING} y={LINE_HEIGHT} fontSize="10" fill="hsl(var(--card-foreground))">{`ES: ${task.es}`}</text>
      <text x={nodeWidth / 2} y={LINE_HEIGHT} fontSize="12" textAnchor="middle" fontWeight="bold" fill="hsl(var(--card-foreground))">{task.name}</text>
      <text x={nodeWidth - TEXT_PADDING} y={LINE_HEIGHT} fontSize="10" textAnchor="end" fill="hsl(var(--card-foreground))">{`LF: ${task.lf}`}</text>
      <line x1="0" y1={LINE_HEIGHT + TEXT_PADDING/2} x2={nodeWidth} y2={LINE_HEIGHT + TEXT_PADDING/2} stroke="hsl(var(--border))" />
      {/* Row 2 */}
      <text x={nodeWidth / 2} y={LINE_HEIGHT * 2} fontSize="10" textAnchor="middle" fill="hsl(var(--card-foreground))">{`Dur: ${task.duration}`}</text>
      <line x1="0" y1={LINE_HEIGHT * 2 + TEXT_PADDING} x2={nodeWidth} y2={LINE_HEIGHT * 2 + TEXT_PADDING} stroke="hsl(var(--border))" />
      {/* Row 3 */}
      <text x={TEXT_PADDING} y={LINE_HEIGHT * 3 + TEXT_PADDING/2} fontSize="10" fill="hsl(var(--card-foreground))">{`LS: ${task.ls}`}</text>
      <text x={nodeWidth / 2} y={LINE_HEIGHT * 3 + TEXT_PADDING/2} fontSize="10" textAnchor="middle" fill="hsl(var(--card-foreground))">{`Sl: ${task.totalSlack.toFixed(1)}`}</text>
      <text x={nodeWidth - TEXT_PADDING} y={LINE_HEIGHT * 3 + TEXT_PADDING/2} fontSize="10" textAnchor="end" fill="hsl(var(--card-foreground))">{`EF: ${task.ef}`}</text>
    </g>
  );

  const renderMpmNode = (task: CalculatedTask, pos: { x: number; y: number }) => (
    <g key={task.id} transform={`translate(${pos.x}, ${pos.y})`}>
      <rect width={nodeWidth} height={nodeHeight} fill="hsl(var(--card))" stroke="hsl(var(--border))"  rx="var(--radius)" ry="var(--radius)" className={task.isCritical ? 'stroke-2 stroke-accent' : ''} />
      {/* Top section */}
      <text x={nodeWidth / 2} y={LINE_HEIGHT} fontSize="12" textAnchor="middle" fontWeight="bold" fill="hsl(var(--card-foreground))">{task.name}</text>
      <text x={nodeWidth / 2} y={LINE_HEIGHT * 1.8} fontSize="10" textAnchor="middle" fill="hsl(var(--card-foreground))">{`Duration: ${task.duration}`}</text>
      <line x1="0" y1={LINE_HEIGHT * 2.2} x2={nodeWidth} y2={LINE_HEIGHT * 2.2} stroke="hsl(var(--border))" />
      {/* Bottom section */}
      <text x={TEXT_PADDING} y={LINE_HEIGHT * 3} fontSize="10" fill="hsl(var(--card-foreground))">{`ES: ${task.es}`}</text>
      <text x={nodeWidth - TEXT_PADDING} y={LINE_HEIGHT * 3} fontSize="10" textAnchor="end" fill="hsl(var(--card-foreground))">{`EF: ${task.ef}`}</text>
      <text x={TEXT_PADDING} y={LINE_HEIGHT * 4} fontSize="10" fill="hsl(var(--card-foreground))">{`LS: ${task.ls}`}</text>
      <text x={nodeWidth - TEXT_PADDING} y={LINE_HEIGHT * 4} fontSize="10" textAnchor="end" fill="hsl(var(--card-foreground))">{`LF: ${task.lf}`}</text>
    </g>
  );
  
  return (
    <Card className="mt-4 overflow-x-auto">
      <CardHeader>
        <CardTitle>{viewType} Network Graph</CardTitle>
        <CardDescription>Visual representation of tasks and dependencies. Critical tasks have an accent border.</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <svg width={Math.max(canvasWidth, 600)} height={canvasHeight} style={{ minWidth: '100%' }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--foreground))" />
            </marker>
          </defs>
          {tasks.map(task => {
            const taskPos = nodePositions.get(task.id);
            if (!taskPos) return null;
            return task.dependencies.map(depId => {
              const depTask = taskMap.get(depId);
              const depPos = nodePositions.get(depId);
              if (!depTask || !depPos) return null;

              // Calculate edge start/end points (center of nodes for simplicity)
              // More precise: connect to edge of node box pointing towards target
              const x1 = depPos.x + nodeWidth / 2;
              const y1 = depPos.y + nodeHeight / 2;
              const x2 = taskPos.x + nodeWidth / 2;
              const y2 = taskPos.y + nodeHeight / 2;
              
              // Simple adjustment to avoid arrowhead inside node
              const angle = Math.atan2(y2 - y1, x2 - x1);
              const endX = taskPos.x + nodeWidth / 2 - (nodeWidth / 2 + 5) * Math.cos(angle); // 5 for arrowhead length approx
              const endY = taskPos.y + nodeHeight / 2 - (nodeHeight / 2 + 5) * Math.sin(angle);

              return (
                <line
                  key={`${depId}-${task.id}`}
                  x1={depPos.x + nodeWidth/2}
                  y1={depPos.y + nodeHeight/2}
                  x2={taskPos.x + nodeWidth/2} // Arrowhead will make it shorter
                  y2={taskPos.y + nodeHeight/2}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="1"
                  markerEnd="url(#arrowhead)"
                />
              );
            });
          })}
          {tasks.map(task => {
            const pos = nodePositions.get(task.id);
            if (!pos) return null;
            return viewType === 'PERT' ? renderPertNode(task, pos) : renderMpmNode(task, pos);
          })}
        </svg>
      </CardContent>
    </Card>
  );
};

export default NetworkGraphView;
