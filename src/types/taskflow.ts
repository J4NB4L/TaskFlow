export interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[]; // IDs of tasks this task depends on

  // Calculated properties by scheduling algorithms
  es?: number; // Earliest Start
  ef?: number; // Earliest Finish
  ls?: number; // Latest Start
  lf?: number; // Latest Finish
  totalSlack?: number; // Total Slack (Float)
  freeSlack?: number; // Free Slack
  isCritical?: boolean;
}

export interface CalculatedTask extends Task {
  es: number;
  ef: number;
  ls: number;
  lf: number;
  totalSlack: number;
  freeSlack: number;
  isCritical: boolean;
}

export interface SchedulingResult {
  tasks: CalculatedTask[];
  criticalPath: string[]; // IDs of tasks in the critical path
  projectDuration: number;
}

export const DEMO_TASKS: Task[] = [
  { id: 'A', name: 'A - Design UI', duration: 2, dependencies: [] },
  { id: 'B', name: 'B - Develop API', duration: 4, dependencies: ['A'] },
  { id: 'C', name: 'C - Frontend Logic', duration: 3, dependencies: ['A'] },
  { id: 'D', name: 'D - Integrate API', duration: 5, dependencies: ['B', 'C'] },
  { id: 'E', name: 'E - Testing', duration: 2, dependencies: ['D'] },
  { id: 'F', name: 'F - Documentation', duration: 1, dependencies: [] }, // Independent task
];
