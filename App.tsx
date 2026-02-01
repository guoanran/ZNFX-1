
import React, { useState } from 'react';
import { 
  Globe, 
  Plane, 
  ClipboardList, 
  Settings, 
  User, 
  Bell 
} from 'lucide-react';
import { ModuleType } from './types';
import SatelliteWorkbench from './components/SatelliteWorkbench';
import UAVWorkbench from './components/UAVWorkbench';
import TaskManagement from './components/TaskManagement';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('satellite');

  const navItems = [
    { id: 'satellite', label: '卫星解译工作台', icon: Globe },
    { id: 'uav', label: '无人机工作台', icon: Plane },
    { id: 'tasks', label: '任务管理', icon: ClipboardList },
  ];

  return (
    <div className="flex flex-col h-screen bg-transparent text-slate-200 overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-purple-900/30 flex items-center justify-between px-6 bg-[#1b1429]/60 backdrop-blur-lg shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Globe className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            智能分析中心
          </h1>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as ModuleType)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeModule === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500 rounded-none' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-500/20">
            <User className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeModule === 'satellite' && <SatelliteWorkbench />}
        {activeModule === 'uav' && <UAVWorkbench />}
        {activeModule === 'tasks' && <TaskManagement />}
      </main>
    </div>
  );
};

export default App;