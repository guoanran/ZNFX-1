
import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Eye, 
  Play, 
  Square, 
  FileText, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  LayoutList,
  LayoutGrid,
  Calendar,
  Hash,
  Clock,
  ArrowLeft,
  Ruler,
  Layers,
  Info,
  SkipBack,
  SkipForward,
  Maximize2,
  X,
  Download,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';

interface TaskRecord {
  id: number;
  taskNumber: string;
  name: string;
  type: 'satellite' | 'uav';
  status: 'running' | 'completed' | 'failed' | 'stopped' | 'paused';
  startTime: string;
  endTime: string;
  // Common Detail view mock data
  modelName?: string;
  // Satellite specific
  imageryName?: string;
  areaRange?: string;
  timeCost?: string;
  metrics?: {
    iou: number;
    recall: number;
    precision: number;
  };
  // UAV specific
  videoSource?: string;
  duration?: string;
  resolution?: string;
  inferenceTime?: string;
  uavMetrics?: {
    precision: number;
    recall: number;
    f1: number;
  };
}

const TaskManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'satellite' | 'uav'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [logTask, setLogTask] = useState<TaskRecord | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskRecord | null>(null);

  const tasks: TaskRecord[] = [
    { 
      id: 1, 
      taskNumber: 'TASK-20230615-001', 
      name: '耕地要素分析任务', 
      type: 'satellite', 
      status: 'completed', 
      startTime: '2023-06-15 08:30:00', 
      endTime: '2023-06-15 08:30:13',
      modelName: '2米自然资源全要素模型_250102',
      imageryName: '黄石市2米2023年4季度影像',
      areaRange: '3.8811平方千米',
      timeCost: '13.596秒',
      metrics: { iou: 68.7, recall: 88.2, precision: 75.65 }
    },
    { 
      id: 2, 
      taskNumber: 'DRONE_20231115_8762', 
      name: '工程车辆识别任务 #20231115', 
      type: 'uav', 
      status: 'completed', 
      startTime: '2023-11-15 14:20:00', 
      endTime: '2023-11-15 14:35:12',
      modelName: '工程车辆识别模型 v2.3',
      videoSource: '工地A区_20231115_1430.mp4',
      duration: '00:15:32',
      resolution: '1920 × 1080',
      inferenceTime: '04:28 分钟',
      uavMetrics: { precision: 92.3, recall: 88.7, f1: 90.5 }
    },
    { id: 4, taskNumber: 'TASK-20230615-004', name: '小汽车识别分析任务', type: 'uav', status: 'failed', startTime: '2023-06-15 09:45:00', endTime: '2023-06-15 09:50:22' },
    { id: 5, taskNumber: 'TASK-20230615-005', name: '林地识别分析任务', type: 'satellite', status: 'stopped', startTime: '2023-06-15 11:30:00', endTime: '2023-06-15 11:35:00' },
    { id: 6, taskNumber: 'TASK-20230615-006', name: '城市建筑识别任务', type: 'satellite', status: 'running', startTime: '2023-06-15 13:20:00', endTime: '-' },
    { id: 7, taskNumber: 'TASK-20230615-007', name: '道路要素分析任务', type: 'uav', status: 'completed', startTime: '2023-06-15 11:45:00', endTime: '2023-06-15 12:10:33' },
    { id: 8, taskNumber: 'TASK-20230615-010', name: '耕地要素分析任务', type: 'satellite', status: 'stopped', startTime: '2023-06-15 16:00:00', endTime: '2023-06-15 16:05:15' },
    { id: 9, taskNumber: 'TASK-20230615-011', name: '河道变迁监测任务', type: 'satellite', status: 'completed', startTime: '2023-06-16 10:15:00', endTime: '2023-06-16 11:20:44' },
    { id: 12, taskNumber: 'TASK-20230615-013', name: '非法采矿监测任务', type: 'uav', status: 'running', startTime: '2023-06-17 09:00:00', endTime: '-' },
  ];

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'satellite' && task.type !== 'satellite') return false;
    if (activeTab === 'uav' && task.type !== 'uav') return false;
    return task.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status: TaskRecord['status']) => {
    switch (status) {
      case 'running':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] text-emerald-500 font-medium">进行中</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
            <span className="text-[11px] text-blue-500 font-medium">● 已完成</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
            <span className="text-[11px] text-red-500 font-medium">已失败</span>
          </div>
        );
      case 'stopped':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 w-fit">
            <span className="text-[11px] text-slate-500 font-medium">已终止</span>
          </div>
        );
      case 'paused':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 w-fit">
            <span className="text-[11px] text-pink-500 font-medium">已暂停</span>
          </div>
        );
    }
  };

  const getTypeBadge = (type: TaskRecord['type']) => {
    if (type === 'satellite') {
      return <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">卫星影像</span>;
    }
    return <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">无人机</span>;
  };

  const handleDownloadLog = (task: TaskRecord) => {
    const logText = `[${task.startTime}] 加载任务 ${task.taskNumber}\n日志...\n[${task.startTime}] 任务开始执行\n[${task.startTime}] 数据预处理完成\n[${task.startTime}] 特征提取完成\n[${task.endTime}] 任务执行完成`;
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task_log_${task.taskNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ActionButtons = ({ task }: { task: TaskRecord }) => (
    <div className="flex items-center gap-2.5">
      <button title="重新运行" className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 hover:bg-white/5 rounded"><RotateCcw className="w-3.5 h-3.5" /></button>
      <button 
        onClick={() => setSelectedTask(task)}
        title="查看详情" 
        className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 hover:bg-white/5 rounded"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button title="停止" className="text-yellow-400 hover:text-yellow-300 transition-colors p-1 hover:bg-white/5 rounded"><Square className="w-3.5 h-3.5 fill-current" /></button>
      <button 
        onClick={() => setLogTask(task)}
        title="日志" 
        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
      >
        <FileText className="w-3.5 h-3.5" />
      </button>
      <button 
        onClick={() => setTaskToDelete(task)}
        title="删除" 
        className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-white/5 rounded"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent">
      {/* Background Image Layer with Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393798-38e43269d877?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.08]"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[80px] animate-[pulse_12s_ease-in-out_infinite]"></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b1429]/80 via-[#0d0b14]/90 to-[#0d0b14]"></div>
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1a1429] border border-purple-900/30 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">确认删除任务?</h3>
                <p className="text-sm text-slate-400">
                  您确定要删除任务 <span className="text-indigo-400 font-mono text-xs">{taskToDelete.taskNumber}</span> 吗? 此操作不可撤销。
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <button 
                onClick={() => setTaskToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-white/5 text-slate-400 border border-purple-900/20 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  // In a real app, delete logic would go here
                  setTaskToDelete(null);
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Drawer Overlay */}
      {logTask && (
        <div className="absolute inset-0 z-[100] flex animate-in fade-in duration-300">
          <div className="flex-1 bg-black/40 backdrop-blur-[2px]" onClick={() => setLogTask(null)}></div>
          <div className="w-[450px] bg-[#1a1429] border-l border-purple-900/30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-purple-900/20 flex items-center justify-between bg-[#1b1429]">
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                任务日志 - {logTask.name}
              </h2>
              <button onClick={() => setLogTask(null)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed text-slate-400 bg-[#0d0b14]">
               <div className="space-y-1">
                 <p><span className="text-indigo-500">[2025/12/31 20:22:22]</span> 加载任务</p>
                 <p className="pl-6 text-slate-500 tracking-widest">{logTask.taskNumber}</p>
                 <p className="pl-6 text-slate-500">日志...</p>
                 <p><span className="text-indigo-500">[{logTask.startTime}]</span> 任务开始执行</p>
                 <p><span className="text-indigo-500">[{logTask.startTime}]</span> 数据预处理完成</p>
                 <p><span className="text-indigo-500">[{logTask.startTime}]</span> 特征提取完成 (耗时: 2分30秒)</p>
                 <p><span className="text-indigo-500">[{logTask.startTime}]</span> 模型推理中...</p>
                 <p><span className="text-indigo-500">[{logTask.startTime}]</span> 推理完成, 正在生成结果</p>
                 <p><span className="text-indigo-500">[{logTask.startTime}]</span> 结果保存成功</p>
                 <p><span className="text-indigo-500">[{logTask.endTime}]</span> 任务执行完成 (总耗时: 22分15秒)</p>
               </div>
            </div>

            <div className="p-4 bg-[#1b1429] border-t border-purple-900/20 flex justify-end gap-3">
               <button 
                 onClick={() => handleDownloadLog(logTask)}
                 className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
               >
                 <Download className="w-3.5 h-3.5" /> 下载日志
               </button>
               <button 
                 onClick={() => setLogTask(null)}
                 className="px-5 py-2 bg-white/5 text-slate-400 border border-purple-900/20 rounded-md text-xs hover:text-white hover:bg-white/10 transition-all"
               >
                 关闭
               </button>
            </div>
          </div>
        </div>
      )}

      {selectedTask ? (
        <div className="relative z-10 flex flex-col h-full bg-transparent text-slate-300 animate-in fade-in duration-300 overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">任务结果</h2>
            <button 
              onClick={() => setSelectedTask(null)}
              className="flex items-center gap-2 bg-[#1b1429]/60 hover:bg-white/5 text-slate-300 px-4 py-1.5 rounded border border-purple-900/30 text-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> 返回列表
            </button>
          </div>

          <div className="flex-1 flex gap-6 px-6 pb-6 overflow-hidden">
            {/* Left Panel */}
            <div className="w-80 flex flex-col gap-6 shrink-0 overflow-y-auto">
              {/* Task Info Card */}
              <div className="bg-[#1b1429]/60 border border-purple-900/20 rounded-xl p-6 space-y-5 shadow-lg backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  任务信息
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">任务名称</p>
                    <p className="text-xs text-slate-200">{selectedTask.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">任务ID</p>
                    <p className="text-xs text-slate-200 font-mono">{selectedTask.taskNumber}</p>
                  </div>
                  {selectedTask.type === 'uav' ? (
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">模型版本</p>
                      <p className="text-xs text-slate-200 leading-tight">{selectedTask.modelName || '工程车辆识别模型 v2.3'}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">模型</p>
                      <p className="text-xs text-slate-200 leading-tight">{selectedTask.modelName || '2米自然资源全要素模型_250102'}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">状态</p>
                    {getStatusBadge(selectedTask.status)}
                  </div>
                  <div className="pt-2 border-t border-purple-900/10"></div>
                  {selectedTask.type === 'uav' ? (
                    <>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">视频源</p>
                        <p className="text-xs text-slate-200 truncate">{selectedTask.videoSource || '工地A区_20231115_1430.mp4'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">时长</p>
                        <p className="text-xs text-slate-200">{selectedTask.duration || '00:15:32'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">分辨率</p>
                        <p className="text-xs text-slate-200">{selectedTask.resolution || '1920 × 1080'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">识别耗时</p>
                        <p className="text-xs text-slate-200">{selectedTask.inferenceTime || '04:28 分钟'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">影像</p>
                        <p className="text-xs text-slate-200">{selectedTask.imageryName || '黄石市2米2023年4季度影像'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">范围</p>
                        <p className="text-xs text-slate-200">{selectedTask.areaRange || '3.8811平方千米'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">耗时</p>
                        <p className="text-xs text-slate-200">{selectedTask.timeCost || '13.596秒'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Metrics Card */}
              <div className="bg-[#1b1429]/60 border border-purple-900/20 rounded-xl p-6 space-y-6 shadow-lg backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-slate-100">模型评估指标</h3>
                <div className="space-y-6">
                  {selectedTask.type === 'uav' ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">准确率 (Precision)</span>
                          <span className="text-slate-200 font-medium">{(selectedTask.uavMetrics?.precision || 92.3)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${(selectedTask.uavMetrics?.precision || 92.3)}%` }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">召回率 (Recall)</span>
                          <span className="text-slate-200 font-medium">{(selectedTask.uavMetrics?.recall || 88.7)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedTask.uavMetrics?.recall || 88.7)}%` }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">F1分数</span>
                          <span className="text-slate-200 font-medium">{(selectedTask.uavMetrics?.f1 || 90.5)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(selectedTask.uavMetrics?.f1 || 90.5)}%` }}></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">IOU</span>
                          <span className="text-slate-200 font-medium">{(selectedTask.metrics?.iou || 68.7)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${(selectedTask.metrics?.iou || 68.7)}%` }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Recall</span>
                          <span className="text-slate-200 font-medium">{(selectedTask.metrics?.recall || 88.2)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedTask.metrics?.recall || 88.2)}%` }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Precision</span>
                          <span className="text-slate-200 font-medium">{(selectedTask.metrics?.precision || 75.65)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(selectedTask.metrics?.precision || 75.65)}%` }}></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Result Display Area */}
            <div className="flex-1 bg-black/40 rounded-xl overflow-hidden relative border border-purple-900/10 shadow-2xl flex flex-col backdrop-blur-sm">
              {selectedTask.type === 'uav' ? (
                <>
                  <div className="flex-1 relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=2000" 
                      className="w-full h-full object-cover opacity-80"
                      alt="UAV Task result video interpretation"
                    />
                    <div className="absolute top-1/3 left-1/4 w-32 h-20 border-2 border-yellow-400 bg-yellow-400/10 rounded flex items-start justify-start p-1">
                      <span className="bg-yellow-400 text-black text-[8px] font-bold px-1 rounded-sm">挖掘机 0.98</span>
                    </div>
                    <div className="absolute top-1/2 right-1/3 w-24 h-16 border-2 border-indigo-500 bg-indigo-500/10 rounded flex items-start justify-start p-1">
                      <span className="bg-indigo-500 text-white text-[8px] font-bold px-1 rounded-sm">吊车 0.95</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="flex items-center gap-3 text-[10px] text-white font-mono mb-2">
                         <span>00:02:45</span>
                         <span className="text-white/40">/</span>
                         <span>00:15:32</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[18%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-14 bg-[#1b1429]/80 border-t border-purple-900/20 flex items-center justify-center gap-6 px-6 backdrop-blur-md">
                     <button className="text-slate-400 hover:text-white transition-colors"><SkipBack className="w-4 h-4" /></button>
                     <button className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                     </button>
                     <button className="text-slate-400 hover:text-white transition-colors"><SkipForward className="w-4 h-4" /></button>
                     <button className="absolute right-6 text-slate-400 hover:text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
                  </div>
                </>
              ) : (
                <div className="flex-1 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000" 
                    className="w-full h-full object-cover opacity-90"
                    alt="Task result map visualization"
                  />
                  <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay"></div>
                  <div className="absolute bottom-6 left-6 bg-[#1b1429]/90 backdrop-blur-md border border-purple-900/30 p-4 rounded-xl shadow-2xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">图例</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-yellow-400"></div><span className="text-[11px] text-slate-300">耕地</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div><span className="text-[11px] text-slate-300">植被</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500"></div><span className="text-[11px] text-slate-300">水体</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500"></div><span className="text-[11px] text-slate-300">建筑</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-600"></div><span className="text-[11px] text-slate-300">未分类</span></div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6 bg-[#1b1429]/90 backdrop-blur-md border border-purple-900/30 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                     <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-b border-purple-900/20"><Ruler className="w-4 h-4" /></button>
                     <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-b border-purple-900/20"><Layers className="w-4 h-4" /></button>
                     <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><Info className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 p-10 h-full flex flex-col overflow-hidden text-slate-300 animate-in fade-in duration-300">
          
          {/* Enhanced Header with Background Strip */}
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-900/20 to-transparent rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                    <ClipboardList className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h2 className="text-2xl font-bold text-white tracking-tight">任务管理中心</h2>
              </div>
              <p className="text-sm text-slate-400 max-w-3xl leading-relaxed pl-1">
                集中管控平台所有智能分析任务。您可以在此处实时追踪卫星影像解译与无人机识别的执行进度，
                查阅历史任务的详细分析报告与评估指标，并支持通过多维度筛选快速定位关键任务数据。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            {['all', 'satellite', 'uav'].map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-4 py-2 text-sm font-medium transition-all relative ${
                  activeTab === id 
                    ? 'text-indigo-400 border border-indigo-500/50 bg-indigo-500/5 rounded-md shadow-[0_0_10px_-3px_rgba(99,102,241,0.2)]' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {id === 'all' ? '所有任务' : id === 'satellite' ? '卫星分析任务' : '无人机分析任务'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}><LayoutList className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}><LayoutGrid className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="请输入任务名称" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#1b1429]/60 border border-purple-900/30 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 w-80 text-white placeholder:text-slate-600 backdrop-blur-sm transition-all focus:bg-[#1b1429]/80" />
              </div>
              <select className="bg-[#1b1429]/60 border border-purple-900/30 rounded-md px-4 py-2 text-sm text-slate-400 outline-none focus:border-indigo-500 cursor-pointer backdrop-blur-sm transition-all hover:bg-[#1b1429]/80"><option>类型</option><option>卫星影像</option><option>无人机</option></select>
              <select className="bg-[#1b1429]/60 border border-purple-900/30 rounded-md px-4 py-2 text-sm text-slate-400 outline-none focus:border-indigo-500 cursor-pointer backdrop-blur-sm transition-all hover:bg-[#1b1429]/80"><option>状态</option><option>进行中</option><option>已完成</option><option>已失败</option></select>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-md shadow-lg shadow-indigo-600/20 transition-all transform hover:scale-105"><Search className="w-4 h-4" /></button>
              <button className="bg-white/5 hover:bg-white/10 text-slate-400 p-2.5 rounded-md border border-purple-900/30 transition-colors backdrop-blur-sm"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {viewMode === 'list' ? (
              <div className="bg-[#1b1429]/20 rounded-lg border border-purple-900/10 overflow-hidden shadow-inner backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-purple-900/20 text-slate-500 text-[11px] font-bold uppercase tracking-wider bg-[#1b1429]/40">
                      <th className="px-6 py-4 font-medium">任务编号</th>
                      <th className="px-6 py-4 font-medium">名称</th>
                      <th className="px-6 py-4 font-medium">类型</th>
                      <th className="px-6 py-4 font-medium">状态</th>
                      <th className="px-6 py-4 font-medium">开始时间</th>
                      <th className="px-6 py-4 font-medium">结束时间</th>
                      <th className="px-6 py-4 font-medium text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/10">
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 text-xs font-mono text-slate-400">{task.taskNumber}</td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-200">{task.name}</td>
                        <td className="px-6 py-4">{getTypeBadge(task.type)}</td>
                        <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 tabular-nums">{task.startTime}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 tabular-nums">{task.endTime}</td>
                        <td className="px-6 py-4 text-right"><div className="flex justify-end"><ActionButtons task={task} /></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="bg-[#1b1429]/40 border border-purple-900/20 rounded-xl p-5 hover:border-indigo-500/40 hover:bg-[#1b1429]/60 transition-all group flex flex-col gap-4 shadow-xl backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors leading-tight">{task.name}</h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono"><Hash className="w-3 h-3" />{task.taskNumber}</div>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                    <div className="flex flex-col gap-2 border-l-2 border-purple-900/20 pl-3 py-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400"><Calendar className="w-3.5 h-3.5" /><span className="text-slate-500">开始:</span> {task.startTime}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400"><Clock className="w-3.5 h-3.5" /><span className="text-slate-500">结束:</span> {task.endTime}</div>
                      <div className="mt-1">{getTypeBadge(task.type)}</div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-purple-900/10 flex items-center justify-between">
                       <div className="text-[10px] text-slate-600 font-medium">操作控制</div>
                       <ActionButtons task={task} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filteredTasks.length === 0 && <div className="flex flex-col items-center justify-center py-20 bg-[#1b1429]/10 rounded-lg border border-dashed border-purple-900/20 backdrop-blur-sm"><Search className="w-12 h-12 text-slate-700 mb-4" /><p className="text-slate-500 text-sm">暂无匹配的任务数据</p></div>}
          </div>

          <div className="flex items-center justify-between mt-6 text-xs text-slate-500 shrink-0">
            <div>显示 1 到 {filteredTasks.length} 条，共 {filteredTasks.length} 条</div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 bg-white/5 rounded border border-purple-900/20 hover:text-white disabled:opacity-30 transition-colors" disabled><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded shadow-lg shadow-indigo-600/20">1</button>
              <button className="w-8 h-8 flex items-center justify-center bg-white/5 text-slate-400 hover:text-white rounded border border-purple-900/20 transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center bg-white/5 text-slate-400 hover:text-white rounded border border-purple-900/20 transition-colors">3</button>
              <button className="p-1.5 bg-white/5 rounded border border-purple-900/20 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
