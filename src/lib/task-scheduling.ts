import type { Task, CalculatedTask, SchedulingResult } from '@/types/taskflow';

export function calculateSchedule(tasks: Task[]): SchedulingResult {
  if (tasks.length === 0) {
    return { tasks: [], criticalPath: [], projectDuration: 0 };
  }

  const taskMap = new Map<string, Task>(tasks.map(task => [task.id, { ...task }]));
  const calculatedTasksMap = new Map<string, CalculatedTask>();

  // Initialize calculated tasks with default values
  tasks.forEach(task => {
    calculatedTasksMap.set(task.id, {
      ...task,
      es: 0, ef: 0, ls: 0, lf: 0,
      totalSlack: 0, freeSlack: 0, isCritical: false,
    });
  });
  
  const adj: Record<string, string[]> = {}; // Adjacency list for successors
  const revAdj: Record<string, string[]> = {}; // Adjacency list for predecessors
  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};

  tasks.forEach(task => {
    adj[task.id] = [];
    revAdj[task.id] = [];
    inDegree[task.id] = 0;
    outDegree[task.id] = 0;
  });

  tasks.forEach(task => {
    task.dependencies.forEach(depId => {
      if (taskMap.has(depId)) {
        adj[depId]?.push(task.id); // depId is a predecessor of task.id
        revAdj[task.id]?.push(depId); // task.id has depId as a predecessor
        inDegree[task.id]++;
        outDegree[depId]++;
      }
    });
  });
  
  // Forward Pass (ES, EF)
  const queue: string[] = tasks.filter(task => inDegree[task.id] === 0).map(t => t.id);
  const processingOrder: string[] = [];

  while (queue.length > 0) {
    const u = queue.shift()!;
    processingOrder.push(u);
    const currentTask = calculatedTasksMap.get(u)!;

    let es = 0;
    (revAdj[u] || []).forEach(predId => {
      const predTask = calculatedTasksMap.get(predId)!;
      es = Math.max(es, predTask.ef);
    });
    currentTask.es = es;
    currentTask.ef = es + currentTask.duration;

    (adj[u] || []).forEach(v => {
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    });
  }
  
  // Check for cycles if not all tasks processed
  if (processingOrder.length !== tasks.length) {
    console.error("Cycle detected in task dependencies or invalid dependencies.");
    // Handle error appropriately, e.g., return an error state or partial calculation
    // For now, just mark remaining tasks
    tasks.forEach(task => {
        if (!processingOrder.includes(task.id)) {
            const current = calculatedTasksMap.get(task.id)!;
            current.name = `${current.name} (Error: Cycle/Dependency Issue)`;
        }
    });
  }


  const projectDuration = Math.max(0, ...Array.from(calculatedTasksMap.values()).map(t => t.ef));

  // Backward Pass (LS, LF)
  // Process in reverse topological order
  for (let i = processingOrder.length - 1; i >= 0; i--) {
    const u = processingOrder[i]!;
    const currentTask = calculatedTasksMap.get(u)!;

    let lf = projectDuration;
    if ((adj[u] || []).length > 0) { // If not an end task
      lf = Math.min(...(adj[u] || []).map(succId => calculatedTasksMap.get(succId)!.ls));
    }
    currentTask.lf = lf;
    currentTask.ls = lf - currentTask.duration;
  }

  // Calculate Slacks and Critical Path
  const criticalPath: string[] = [];
  Array.from(calculatedTasksMap.values()).forEach(task => {
    task.totalSlack = task.ls - task.es;
    
    let minSuccessorES = projectDuration;
    if ((adj[task.id] || []).length > 0) {
      minSuccessorES = Math.min(...(adj[task.id] || []).map(succId => calculatedTasksMap.get(succId)!.es));
    }
    task.freeSlack = minSuccessorES - task.ef;
    if (task.freeSlack < 0) task.freeSlack = 0; // Free slack cannot be negative

    // Critical tasks have total slack close to zero (due to potential float precision)
    if (Math.abs(task.totalSlack) < 0.001) { 
      task.isCritical = true;
      criticalPath.push(task.id);
    } else {
      task.isCritical = false;
    }
  });

  return {
    tasks: Array.from(calculatedTasksMap.values()).sort((a,b) => a.es - b.es),
    criticalPath,
    projectDuration,
  };
}
