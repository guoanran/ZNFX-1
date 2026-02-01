
export type ModuleType = 'satellite' | 'uav' | 'tasks';

export interface Imagery {
  id: string;
  name: string;
  date: string;
  thumbnail: string;
  type: 'hot' | 'personal' | 'result';
}

export interface Task {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  type: string;
}

export interface ToolCategory {
  title: string;
  icon: string;
  items: string[];
}
