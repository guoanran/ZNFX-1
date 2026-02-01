
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Upload, 
  History, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  MousePointer2, 
  Square, 
  Scissors,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  CloudUpload,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  ChevronUp,
  Square as SquareIcon,
  Pentagon,
  Trash2,
  ChevronDown as ChevronDownIcon,
  Check,
  ArrowLeft,
  Activity
} from 'lucide-react';
import { Imagery } from '../types';

const SatelliteWorkbench: React.FC = () => {
  const [leftTab, setLeftTab] = useState<'hot' | 'upload' | 'history'>('hot');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVectorUploadModalOpen, setIsVectorUploadModalOpen] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>('h1');
  const [hiddenResults, setHiddenResults] = useState<Set<string>>(new Set());
  
  // State for hover tooltips
  const [hoverTooltip, setHoverTooltip] = useState<{id: string, text: string} | null>(null);
  
  const [isCreateTaskPanelOpen, setIsCreateTaskPanelOpen] = useState(false);
  const [selectedToolName, setSelectedToolName] = useState<string | null>(null);

  // States for selection flows
  const [isDataSelectorOpen, setIsDataSelectorOpen] = useState(false);
  const [dataFilterTab, setDataFilterTab] = useState<'hot' | 'imported'>('hot');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
  // Data selection states
  const [selectedImagery, setSelectedImagery] = useState<Imagery | null>(null);
  const [selectedPreImagery, setSelectedPreImagery] = useState<Imagery | null>(null);
  const [selectedPostImagery, setSelectedPostImagery] = useState<Imagery | null>(null);
  const [dataSelectionTarget, setDataSelectionTarget] = useState<'single' | 'pre' | 'post'>('single');

  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const models = [
    'DeepLab v3+ (ResNet-101)',
    'HRNet-W48 (OCR)',
    'Swin Transformer-T',
    'U-Net (Attention)',
    'SegFormer-B5'
  ];

  const hotImagery: Imagery[] = [
    { id: '1', name: '青藏高原地形影像', date: '2023-05-12', thumbnail: 'https://picsum.photos/seed/geo1/200/120', type: 'hot' },
    { id: '2', name: '长三角城市群影像', date: '2023-06-20', thumbnail: 'https://picsum.photos/seed/geo2/200/120', type: 'hot' },
    { id: '3', name: '塔克拉玛干沙漠变迁', date: '2023-04-05', thumbnail: 'https://picsum.photos/seed/geo3/200/120', type: 'hot' },
    { id: '4', name: '南极冰川变化影像', date: '2023-02-18', thumbnail: 'https://picsum.photos/seed/geo4/200/120', type: 'hot' },
  ];

  const uploadedImagery: Imagery[] = [
    { id: 'u1', name: '上海市中心区域卫星影像', date: '2023-06-20', thumbnail: 'https://picsum.photos/seed/sh/200/120', type: 'personal' },
  ];

  const historyTasks = [
    {
      id: 'h1',
      name: '城市扩张监测解译',
      status: 'completed',
      date: '2023-07-15',
      area: '450 km²',
      results: [
        { label: '耕地', value: '125.3 km²', color: 'text-emerald-400' },
        { label: '林地', value: '89.7 km²', color: 'text-green-500' },
        { label: '草地', value: '64.2 km²', color: 'text-yellow-500' },
        { label: '园地', value: '32.5 km²', color: 'text-orange-400' },
      ],
      thumbnail: 'https://picsum.photos/seed/task1/100/100'
    },
    {
      id: 'h2',
      name: '耕地变化检测解译',
      status: 'running',
      date: '2023-07-20',
      area: '210 km²',
      results: [],
      thumbnail: null
    }
  ];

  const toolbox = [
    { 
      title: '地物分类', 
      items: ['全要素', '耕地', '林地', '草地', '园地', '裸地', '居民地', '水系', '道路', '建筑物', '光伏板', '大棚', '体育场'] 
    },
    { 
      title: '作物识别', 
      items: ['水稻', '小麦', '玉米', '油菜', '棉花', '大豆'] 
    },
    { 
      title: '变化检测', 
      items: ['耕地变化监测'] 
    }
  ];

  const handleToolClick = (itemName: string) => {
    setSelectedToolName(itemName);
    
    if (itemName === '耕地变化监测') {
      // Default selections for change detection demo if not already set
      if (!selectedPreImagery && hotImagery.length >= 2) {
        setSelectedPreImagery(hotImagery[2]); 
      }
      if (!selectedPostImagery && hotImagery.length >= 2) {
        setSelectedPostImagery(hotImagery[1]);
      }
    } else {
      // Auto-select imagery if none selected for single mode
      if (!selectedImagery && hotImagery.length > 0) {
        setSelectedImagery(hotImagery[0]);
      }
    }
    
    // Auto-select default model (first in list)
    if (models.length > 0) {
      setSelectedModel(models[0]);
    }

    setIsCreateTaskPanelOpen(true);
    setIsDataSelectorOpen(false); // Reset selector
  };

  const handleSelectImagery = (imagery: Imagery) => {
    if (dataSelectionTarget === 'pre') {
      setSelectedPreImagery(imagery);
    } else if (dataSelectionTarget === 'post') {
      setSelectedPostImagery(imagery);
    } else {
      setSelectedImagery(imagery);
    }
    setIsDataSelectorOpen(false);
  };

  const isCurrentSelection = (item: Imagery) => {
    if (dataSelectionTarget === 'pre') return selectedPreImagery?.id === item.id;
    if (dataSelectionTarget === 'post') return selectedPostImagery?.id === item.id;
    return selectedImagery?.id === item.id;
  };

  const handleSelectModel = (model: string) => {
    setSelectedModel(model);
    setIsModelDropdownOpen(false);
  };

  const toggleResultVisibility = (taskId: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${taskId}-${index}`;
    setHiddenResults(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="flex h-full w-full relative bg-transparent">
      {/* Left Sidebar */}
      <aside className={`bg-transparent border-r border-purple-900/20 flex transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-72'} relative`}>
        {/* Slim Icon Bar */}
        <div className="w-16 border-r border-purple-900/20 flex flex-col items-center py-4 gap-6 shrink-0 bg-[#1b1429]/40 backdrop-blur-md">
          <button onClick={() => setLeftTab('hot')} title="热门推荐" className={`p-2 rounded-lg transition-colors ${leftTab === 'hot' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}>
            <TrendingUp className="w-5 h-5" />
          </button>
          <button onClick={() => setLeftTab('upload')} title="导入数据" className={`p-2 rounded-lg transition-colors ${leftTab === 'upload' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}>
            <Upload className="w-5 h-5" />
          </button>
          <button onClick={() => setLeftTab('history')} title="分析任务" className={`p-2 rounded-lg transition-colors ${leftTab === 'history' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}>
            <History className="w-5 h-5" />
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#151221]/40 backdrop-blur-sm">
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="font-semibold text-sm text-slate-200">{leftTab === 'hot' ? '热门推荐影像' : leftTab === 'upload' ? '导入数据列表' : '分析任务列表'}</h2>
                </div>
                <button onClick={() => setSidebarCollapsed(true)} className="p-1 hover:bg-white/5 rounded text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
              </div>

              {leftTab === 'upload' && (
                <button onClick={() => setIsUploadModalOpen(true)} className="mt-4 mb-4 flex items-center justify-center gap-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 py-2 rounded-md text-xs font-medium hover:bg-indigo-600/30 transition-all">
                  <Plus className="w-3.5 h-3.5" /> 导入新数据
                </button>
              )}

              <div className="flex-1 overflow-y-auto pr-1 mt-4">
                <div className="space-y-3">
                  {leftTab === 'history' ? (
                    historyTasks.map(task => (
                      <div key={task.id} className="bg-white/5 border border-purple-900/10 rounded-lg overflow-hidden transition-all">
                        <div className="p-3 cursor-pointer flex items-center justify-between group" onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[11px] font-medium text-slate-300 truncate group-hover:text-indigo-400 transition-colors">{task.name}</span>
                            {task.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0"></div>}
                          </div>
                          {expandedTask === task.id ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                        </div>
                        {expandedTask === task.id && (
                          <div className="px-3 pb-3 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="text-[10px] text-slate-500">开始于: {task.date}</div>
                            {task.thumbnail && <img src={task.thumbnail} className="w-16 h-12 rounded border border-purple-900/20 object-cover" alt="Task imagery" />}
                            {task.results.length > 0 && (
                              <div className="space-y-1.5">
                                {task.results.map((res, i) => {
                                  const isHidden = hiddenResults.has(`${task.id}-${i}`);
                                  return (
                                    <div key={i} className="flex items-center justify-between text-[10px]">
                                      <div className="flex items-center gap-2">
                                        <button 
                                          onClick={(e) => toggleResultVisibility(task.id, i, e)}
                                          className="text-slate-500 hover:text-indigo-400 transition-colors"
                                          title={isHidden ? "显示结果" : "隐藏结果"}
                                        >
                                          {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        </button>
                                        <span className={`text-slate-400 ${isHidden ? 'opacity-50' : ''}`}>{res.label}</span>
                                      </div>
                                      <span className={`font-medium ${res.color} ${isHidden ? 'opacity-50' : ''}`}>{res.value}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    (leftTab === 'hot' ? hotImagery : uploadedImagery).map(item => (
                      <div key={item.id} className="group cursor-pointer rounded-lg overflow-hidden bg-white/5 border border-purple-900/10 hover:border-indigo-500/50 transition-all p-2 flex gap-3">
                        <img src={item.thumbnail} alt={item.name} className="w-16 h-12 rounded object-cover opacity-80 group-hover:opacity-100 transition-opacity shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium truncate text-slate-200 group-hover:text-indigo-400">{item.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{item.date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Expand Button when collapsed */}
        {sidebarCollapsed && (
          <div className="absolute left-16 top-1/2 -translate-y-1/2 z-20">
            <button 
              onClick={() => setSidebarCollapsed(false)} 
              className="p-1.5 bg-[#1a1429] border border-purple-900/20 rounded-r-md text-slate-500 hover:text-white shadow-xl backdrop-blur-md transition-all group"
              title="打开侧边栏"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </aside>

      {/* Center Map Area */}
      <section className="flex-1 bg-transparent relative overflow-hidden flex">
        {selectedToolName === '耕地变化监测' ? (
          <>
              <div className="flex-1 relative border-r border-purple-900/50 overflow-hidden group">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${selectedPreImagery?.thumbnail || 'https://images.unsplash.com/photo-1559586616-361e18714958?auto=format&fit=crop&q=80&w=1000'})` }}></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-6 left-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-200 border border-white/10 shadow-lg z-10 animate-in fade-in duration-300">
                    <span className="text-slate-400 mr-2">前时相 (T1):</span>
                    {selectedPreImagery ? selectedPreImagery.date : '未选择'}
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${selectedPostImagery?.thumbnail || 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1000'})` }}></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-200 border border-white/10 shadow-lg z-10 animate-in fade-in duration-300">
                    <span className="text-slate-400 mr-2">后时相 (T2):</span>
                    {selectedPostImagery ? selectedPostImagery.date : '未选择'}
                </div>
              </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000)' }}>
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}

        <div className="absolute top-6 left-6 flex flex-col gap-2 bg-[#1b1429]/80 backdrop-blur-md border border-purple-900/20 p-1.5 rounded-lg shadow-2xl z-20">
          <button className="p-2 hover:bg-white/10 rounded-md text-slate-300"><ZoomIn className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-white/10 rounded-md text-slate-300"><ZoomOut className="w-4 h-4" /></button>
          <div className="h-[1px] bg-purple-900/30 mx-1"></div>
          <button className="p-2 hover:bg-white/10 rounded-md text-slate-300"><Maximize className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-white/10 rounded-md text-slate-300"><MousePointer2 className="w-4 h-4" /></button>
        </div>

        {isUploadModalOpen && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1429] border border-purple-900/30 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-purple-900/30"><h3 className="text-sm font-semibold text-slate-200">个人云盘</h3><button onClick={() => setIsUploadModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button></div>
              <div className="p-6">
                <div className="border-2 border-dashed border-purple-900/20 rounded-xl p-10 flex flex-col items-center justify-center bg-purple-950/20 hover:bg-purple-950/30 transition-colors cursor-pointer group">
                  <CloudUpload className="w-10 h-10 text-slate-600 group-hover:text-indigo-400 transition-colors mb-4" />
                  <p className="text-sm text-slate-300 mb-1">拖放文件到此处或点击上传</p>
                  <p className="text-[10px] text-slate-500">备注：影像数据小于1G，矢量数据小于1Mb</p>
                </div>
              </div>
              <div className="p-4 bg-[#1b1429] border-t border-purple-900/30 flex justify-end gap-3">
                <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">取消</button>
                <button onClick={() => setIsUploadModalOpen(false)} className="px-5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all">确认导入</button>
              </div>
            </div>
          </div>
        )}

        {isVectorUploadModalOpen && (
          <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1429] border border-purple-900/30 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-purple-900/30">
                <h3 className="text-sm font-semibold text-slate-200">上传矢量范围</h3>
                <button onClick={() => setIsVectorUploadModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-purple-900/20 rounded-xl p-10 flex flex-col items-center justify-center bg-purple-950/20 hover:bg-purple-950/30 transition-colors cursor-pointer group">
                  <CloudUpload className="w-10 h-10 text-slate-600 group-hover:text-indigo-400 transition-colors mb-4" />
                  <p className="text-sm text-slate-300 mb-1">拖放 SHP/GeoJSON 文件到此处</p>
                  <p className="text-[10px] text-slate-500">支持 .shp, .geojson, .kml 格式</p>
                </div>
              </div>
              <div className="p-4 bg-[#1b1429] border-t border-purple-900/30 flex justify-end gap-3">
                <button onClick={() => setIsVectorUploadModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">取消</button>
                <button onClick={() => setIsVectorUploadModalOpen(false)} className="px-5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all">确认上传</button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Right Tool Sidebar */}
      <aside className="w-80 bg-transparent border-l border-purple-900/20 flex flex-col overflow-hidden relative backdrop-blur-[2px]">
        {isDataSelectorOpen ? (
          /* Imagery Data Selector Sidebar (Drawer) */
          <div className="flex flex-col h-full bg-[#151221]/80 backdrop-blur-lg animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-purple-900/20 flex items-center gap-3 bg-[#1b1429]/60">
              <button onClick={() => setIsDataSelectorOpen(false)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-semibold text-slate-200">选择影像数据</h2>
            </div>

            <div className="flex items-center border-b border-purple-900/30 bg-[#151221]">
                <button 
                  onClick={() => setDataFilterTab('hot')}
                  className={`flex-1 py-3 text-xs font-medium transition-colors ${dataFilterTab === 'hot' ? 'text-indigo-400 bg-white/5 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  热门推荐
                </button>
                <button 
                  onClick={() => setDataFilterTab('imported')}
                  className={`flex-1 py-3 text-xs font-medium transition-colors ${dataFilterTab === 'imported' ? 'text-indigo-400 bg-white/5 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  导入数据
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {dataFilterTab === 'hot' ? (
                 hotImagery.map(item => (
                   <div 
                     key={item.id} 
                     onClick={() => handleSelectImagery(item)}
                     className={`group cursor-pointer rounded-lg overflow-hidden border p-2 flex gap-3 transition-all ${isCurrentSelection(item) ? 'bg-indigo-600/10 border-indigo-500' : 'bg-white/5 border-purple-900/10 hover:border-indigo-500/50'}`}
                   >
                     <img src={item.thumbnail} className="w-14 h-10 rounded object-cover shrink-0" alt={item.name} />
                     <div className="min-w-0 flex flex-col justify-center">
                       <p className="text-[11px] font-medium text-slate-200 truncate group-hover:text-indigo-400">{item.name}</p>
                       <p className="text-[10px] text-slate-500">{item.date}</p>
                     </div>
                     {isCurrentSelection(item) && <div className="ml-auto flex items-center"><Check className="w-4 h-4 text-indigo-400" /></div>}
                   </div>
                 ))
              ) : (
                 uploadedImagery.length > 0 ? (
                    uploadedImagery.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => handleSelectImagery(item)}
                        className={`group cursor-pointer rounded-lg overflow-hidden border p-2 flex gap-3 transition-all ${isCurrentSelection(item) ? 'bg-indigo-600/10 border-indigo-500' : 'bg-white/5 border-purple-900/10 hover:border-indigo-500/50'}`}
                      >
                        <img src={item.thumbnail} className="w-14 h-10 rounded object-cover shrink-0" alt={item.name} />
                        <div className="min-w-0 flex flex-col justify-center">
                          <p className="text-[11px] font-medium text-slate-200 truncate group-hover:text-indigo-400">{item.name}</p>
                          <p className="text-[10px] text-slate-500">{item.date}</p>
                        </div>
                        {isCurrentSelection(item) && <div className="ml-auto flex items-center"><Check className="w-4 h-4 text-indigo-400" /></div>}
                      </div>
                    ))
                 ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-xs">
                      <CloudUpload className="w-8 h-8 opacity-30 mb-2" />
                      暂无导入数据
                    </div>
                 )
              )}
            </div>
          </div>
        ) : isCreateTaskPanelOpen ? (
          /* Create Analysis Task View */
          <div className="flex flex-col h-full bg-[#151221]/80 backdrop-blur-lg animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-purple-900/20 flex items-center justify-between bg-[#1b1429]/60">
              <h2 className="text-sm font-semibold text-slate-200">创建分析任务</h2>
              <button onClick={() => setIsCreateTaskPanelOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <section className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">分析类型</h3>
                <div className="flex items-center justify-between px-3 py-2 bg-purple-900/10 rounded-lg border border-purple-900/20">
                  <span className="text-xs text-slate-200">{selectedToolName || '全要素'}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">自然资源</span>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">选择数据</h3>
                {selectedToolName === '耕地变化监测' ? (
                  <div className="space-y-2">
                    <div onClick={() => { setDataSelectionTarget('pre'); setIsDataSelectorOpen(true); }} className="relative group cursor-pointer">
                      <div className="w-full px-3 py-2.5 bg-white/5 border border-purple-900/10 rounded-lg flex items-center justify-between group-hover:border-indigo-500/50 transition-all">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[9px] text-slate-500">前时相 (T1)</span>
                          <span className={`text-xs truncate ${selectedPreImagery ? 'text-slate-200' : 'text-slate-500'}`}>{selectedPreImagery?.name || '选择前时相数据...'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                    <div onClick={() => { setDataSelectionTarget('post'); setIsDataSelectorOpen(true); }} className="relative group cursor-pointer">
                      <div className="w-full px-3 py-2.5 bg-white/5 border border-purple-900/10 rounded-lg flex items-center justify-between group-hover:border-indigo-500/50 transition-all">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[9px] text-slate-500">后时相 (T2)</span>
                          <span className={`text-xs truncate ${selectedPostImagery ? 'text-slate-200' : 'text-slate-500'}`}>{selectedPostImagery?.name || '选择后时相数据...'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => { setDataSelectionTarget('single'); setIsDataSelectorOpen(true); }} className="relative group cursor-pointer">
                    <div className="w-full px-3 py-2.5 bg-white/5 border border-purple-900/10 rounded-lg flex items-center justify-between group-hover:border-indigo-500/50 transition-all">
                      <span className={`text-xs truncate ${selectedImagery ? 'text-slate-200' : 'text-slate-500'}`}>{selectedImagery?.name || '选择影像数据...'}</span>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-2 relative">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">选择模型</h3>
                <div onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)} className="relative group cursor-pointer">
                  <div className="w-full px-3 py-2.5 bg-white/5 border border-purple-900/10 rounded-lg flex items-center justify-between group-hover:border-indigo-500/50 transition-all">
                    <span className={`text-xs truncate ${selectedModel ? 'text-slate-200' : 'text-slate-500'}`}>{selectedModel || '选择解译模型...'}</span>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-600 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {isModelDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-[60] bg-[#1a1429] border border-purple-900/30 rounded-lg shadow-2xl py-1 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
                    {models.map(m => (
                      <button key={m} onClick={() => handleSelectModel(m)} className="w-full px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 text-left flex items-center justify-between transition-colors">
                        {m} {selectedModel === m && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">分析范围</h3>
                <div className="grid grid-cols-2 gap-2">
                   <div className="relative">
                     <button 
                       onMouseEnter={() => setHoverTooltip({id: 'rect', text: '请在地图上拖动鼠标绘制矩形范围'})}
                       onMouseLeave={() => setHoverTooltip(null)}
                       className="w-full flex items-center gap-1.5 justify-center py-2 bg-white/5 border border-purple-900/10 rounded-lg text-[10px] text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
                     >
                       <SquareIcon className="w-3.5 h-3.5 text-indigo-400" /> 矩形
                     </button>
                     {hoverTooltip?.id === 'rect' && (
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-indigo-600 text-white text-[10px] px-2 py-1.5 rounded-md shadow-xl z-10 pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-center leading-tight border border-indigo-400/30">
                         {hoverTooltip.text}
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600"></div>
                       </div>
                     )}
                   </div>
                   
                   <div className="relative">
                     <button 
                       onMouseEnter={() => setHoverTooltip({id: 'poly', text: '请在地图上点击绘制多边形节点'})}
                       onMouseLeave={() => setHoverTooltip(null)}
                       className="w-full flex items-center gap-1.5 justify-center py-2 bg-white/5 border border-purple-900/10 rounded-lg text-[10px] text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
                     >
                       <Pentagon className="w-3.5 h-3.5 text-indigo-400" /> 多边形
                     </button>
                     {hoverTooltip?.id === 'poly' && (
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-indigo-600 text-white text-[10px] px-2 py-1.5 rounded-md shadow-xl z-10 pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-center leading-tight border border-indigo-400/30">
                         {hoverTooltip.text}
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600"></div>
                       </div>
                     )}
                   </div>

                   <div className="relative">
                     <button 
                       onClick={() => setIsVectorUploadModalOpen(true)}
                       onMouseEnter={() => setHoverTooltip({id: 'upload', text: '支持上传 SHP/GeoJSON/KML 格式'})}
                       onMouseLeave={() => setHoverTooltip(null)}
                       className="w-full flex items-center gap-1.5 justify-center py-2 bg-white/5 border border-purple-900/10 rounded-lg text-[10px] text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
                     >
                       <Upload className="w-3.5 h-3.5 text-indigo-400" /> 上传
                     </button>
                     {hoverTooltip?.id === 'upload' && (
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-indigo-600 text-white text-[10px] px-2 py-1.5 rounded-md shadow-xl z-10 pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-center leading-tight border border-indigo-400/30">
                         {hoverTooltip.text}
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600"></div>
                       </div>
                     )}
                   </div>

                   <div className="relative">
                     <button 
                       onMouseEnter={() => setHoverTooltip({id: 'delete', text: '当前选中的分析范围已清除'})}
                       onMouseLeave={() => setHoverTooltip(null)}
                       className="w-full flex items-center gap-1.5 justify-center py-2 bg-white/5 border border-purple-900/10 rounded-lg text-[10px] text-slate-400 hover:text-white hover:border-red-500/40 hover:bg-red-500/10 transition-all group"
                     >
                       <Trash2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 transition-colors" /> 清除
                     </button>
                     {hoverTooltip?.id === 'delete' && (
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-indigo-600 text-white text-[10px] px-2 py-1.5 rounded-md shadow-xl z-10 pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-center leading-tight border border-indigo-400/30">
                         {hoverTooltip.text}
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600"></div>
                       </div>
                     )}
                   </div>
                </div>
              </section>
            </div>

            <div className="p-4 bg-[#1b1429]/80 border-t border-purple-900/30 flex items-center gap-2 backdrop-blur-md">
              <button onClick={() => setIsCreateTaskPanelOpen(false)} className="flex-1 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/5 border border-purple-900/10 hover:bg-white/10 hover:text-white transition-all">取消</button>
              <button onClick={() => setIsCreateTaskPanelOpen(false)} className="flex-[2] py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all">创建分析任务</button>
            </div>
          </div>
        ) : (
          /* Default Toolbox View */
          <>
            <div className="p-4 border-b border-purple-900/20 bg-[#1b1429]/40 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-200">分析工具箱</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {toolbox.map((group, idx) => (
                <div key={idx}>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-1 h-1 bg-indigo-500 rounded-full"></span>{group.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map(item => (
                      <button key={item} onClick={() => handleToolClick(item)} className="px-3 py-2 text-[11px] bg-white/5 border border-purple-900/10 hover:border-indigo-500/50 hover:bg-white/10 rounded text-slate-400 transition-all text-left truncate">{item}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-[#1b1429]/60 border-t border-purple-900/20 backdrop-blur-md">
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/30 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase flex items-center gap-1.5">
                       <Activity className="w-3 h-3 animate-pulse" />
                       AI 识别状态
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-1.5 py-0.5 rounded animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.3)]">READY</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    当前AI模型已预加载，请选择分析工具并框选感兴趣区域即可开始解译
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default SatelliteWorkbench;
    