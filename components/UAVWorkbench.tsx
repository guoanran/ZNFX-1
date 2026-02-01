
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Upload, 
  History, 
  Video,
  X,
  Plus,
  Car,
  Zap,
  ChevronRight,
  ChevronLeft,
  Search,
  Maximize,
  Play,
  Settings,
  Scissors,
  Wrench,
  Activity,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  RefreshCcw,
  ChevronDown as ChevronDownIcon,
  Check,
  ArrowLeft,
  CloudUpload
} from 'lucide-react';

const UAVWorkbench: React.FC = () => {
  const [leftTab, setLeftTab] = useState<'hot' | 'upload' | 'results' | 'live'>('hot');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedLiveStream, setSelectedLiveStream] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('uav-task-1');
  
  // New states for task creation
  const [isCreateTaskPanelOpen, setIsCreateTaskPanelOpen] = useState(false);
  const [selectedToolName, setSelectedToolName] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

  // States for selection flows
  const [isDataSelectorOpen, setIsDataSelectorOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedDataId, setSelectedDataId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  
  // Filter tab state for data selector
  const [dataFilterTab, setDataFilterTab] = useState<'hot' | 'imported'>('hot');

  const uavModels = [
    'YOLOv8-L (General)',
    'RetinaNet (Aerial)',
    'Faster R-CNN (ResNet-50)',
    'CenterNet (Keypoint)',
    'PVT v2 (Transformer)'
  ];

  const hotVideos = [
    { id: 'v1', name: '工程车辆监测视频', date: '2023-10-15', thumbnail: 'https://picsum.photos/seed/uav1/200/120' },
    { id: 'v2', name: '普通车辆交通视频', date: '2023-10-20', thumbnail: 'https://picsum.photos/seed/uav2/200/120' },
    { id: 'v3', name: '光伏板异常监测...', date: '2023-10-05', thumbnail: 'https://picsum.photos/seed/uav3/200/120' },
    { id: 'v4', name: '挖掘机作业监测...', date: '2023-10-10', thumbnail: 'https://picsum.photos/seed/uav4/200/120' },
    { id: 'v5', name: '吊车作业监测视频', date: '2023-10-08', thumbnail: 'https://picsum.photos/seed/uav5/200/120' },
    { id: 'v6', name: '货运车辆运输视频', date: '2023-10-12', thumbnail: 'https://picsum.photos/seed/uav6/200/120' },
  ];

  const uploadedVideos = [
    { id: 'up1', name: '自建-物流园巡检_20231101', date: '2023-11-01', thumbnail: 'https://picsum.photos/seed/up1/200/120' },
    { id: 'up2', name: '自建-河道排污监测_20231103', date: '2023-11-03', thumbnail: 'https://picsum.photos/seed/up2/200/120' }
  ];

  const liveStreams = [
    { id: 'live-1', name: '实时监控', updateTime: '刚刚', thumbnail: 'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?auto=format&fit=crop&q=80&w=400' }
  ];

  const analysisTasks = [
    {
      id: 'uav-task-1',
      name: '无人机视频车辆识别',
      status: 'completed',
      date: '2023-07-15',
      tagCount: 12,
      thumbnail: 'https://picsum.photos/seed/uav-res1/160/100',
      results: [
        { label: '挖掘机', value: '3 台', color: 'text-indigo-400' },
        { label: '吊车', value: '2 台', color: 'text-indigo-400' },
      ]
    },
    {
      id: 'uav-task-2',
      name: '建筑施工区域安全监测',
      status: 'completed',
      date: '2023-07-10',
      tagCount: 8,
      thumbnail: 'https://picsum.photos/seed/uav-res2/160/100',
      results: [
        { label: '未戴安全帽', value: '2 人', color: 'text-red-400' },
        { label: '越界警示', value: '1 次', color: 'text-orange-400' },
      ]
    },
    {
      id: 'uav-task-3',
      name: '光伏电站组件异常检测',
      status: 'running',
      date: '2023-07-20',
      progress: '65%',
      results: []
    }
  ];

  const toolCategories = [
    {
      title: '普通车辆识别',
      icon: <Car className="w-4 h-4" />,
      items: ['普通车', '小汽车', '公交车', '卡车', '摩托车']
    },
    {
      title: '工程车辆识别',
      icon: <Wrench className="w-4 h-4" />,
      items: ['工程车', '推土机', '起重机', '挖掘机', '搅拌车', '压路机', '塔吊']
    },
    {
      title: '光伏板异常检测',
      icon: <Zap className="w-4 h-4" />,
      items: ['异物检测', '热斑检测']
    }
  ];

  const handleSelectLiveStream = (id: string) => {
    setSelectedLiveStream(id);
    setSelectedVideo(null);
  };

  const handleSelectHotVideo = (id: string) => {
    setSelectedVideo(id);
    setSelectedLiveStream(null);
  };

  const handleToolClick = (toolName: string, categoryName: string) => {
    setSelectedToolName(toolName);
    setSelectedCategoryName(categoryName);
    
    // Auto-select data based on what is currently in the center viewport
    if (selectedVideo) {
      setSelectedDataId(selectedVideo);
    } else if (selectedLiveStream) {
      setSelectedDataId(selectedLiveStream);
    } else {
      setSelectedDataId(null);
    }

    // Auto-select default model if not set
    if (!selectedModelId && uavModels.length > 0) {
      setSelectedModelId(uavModels[0]);
    }

    setIsCreateTaskPanelOpen(true);
    setIsDataSelectorOpen(false); // Ensure selector is closed initially
  };

  const handleDataSelect = (id: string) => {
    setSelectedDataId(id);
    setIsDataSelectorOpen(false);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModelId(model);
    setIsModelDropdownOpen(false);
  };

  const getDataName = (id: string | null) => {
    if (!id) return '选择视频数据...';
    const video = hotVideos.find(v => v.id === id) || uploadedVideos.find(v => v.id === id) || liveStreams.find(v => v.id === id);
    return video ? video.name : '未知数据';
  };

  return (
    <div className="flex h-full w-full relative bg-transparent">
      {/* Left Sidebar */}
      <aside className={`bg-transparent border-r border-purple-900/20 flex transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-72'}`}>
        {/* Slim Icon Bar */}
        <div className="w-16 border-r border-purple-900/20 flex flex-col items-center py-4 gap-6 shrink-0 bg-[#1b1429]/40 backdrop-blur-md">
          <button 
            onClick={() => setLeftTab('hot')} 
            className={`p-2 rounded-lg transition-colors ${leftTab === 'hot' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}
            title="热门推荐数据"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setLeftTab('upload')} 
            className={`p-2 rounded-lg transition-colors ${leftTab === 'upload' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}
            title="导入数据列表"
          >
            <Upload className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setLeftTab('results')} 
            className={`p-2 rounded-lg transition-colors ${leftTab === 'results' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}
            title="分析数据结果"
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setLeftTab('live')} 
            className={`p-2 rounded-lg transition-colors ${leftTab === 'live' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}
            title="实时视频推流"
          >
            <Video className="w-5 h-5" />
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#151221]/40 backdrop-blur-sm">
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-sm text-slate-200">
                    {leftTab === 'hot' ? '热门推荐数据' : leftTab === 'upload' ? '导入数据列表' : leftTab === 'results' ? '分析任务列表' : '实时推流视频'}
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {leftTab === 'hot' ? '精选推荐无人机视频数据' : leftTab === 'results' ? '已完成和解译中的任务' : leftTab === 'live' ? '实时监控视频流展示' : '查看并拉选分析数据'}
                  </p>
                </div>
                <button onClick={() => setSidebarCollapsed(true)} className="p-1 hover:bg-white/5 rounded text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <div className="space-y-3">
                  {leftTab === 'hot' && hotVideos.map(video => (
                    <div 
                      key={video.id} 
                      onClick={() => handleSelectHotVideo(video.id)}
                      className={`group cursor-pointer rounded-lg overflow-hidden bg-white/5 border transition-all p-2 flex gap-3 ${selectedVideo === video.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-purple-900/10 hover:border-indigo-500/50'}`}
                    >
                      <img src={video.thumbnail} alt={video.name} className="w-16 h-12 rounded object-cover opacity-80 group-hover:opacity-100 transition-opacity shrink-0" />
                      <div className="min-w-0 flex flex-col justify-center">
                        <p className="text-[11px] font-medium truncate text-slate-200 group-hover:text-indigo-400">{video.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{video.date}</p>
                      </div>
                    </div>
                  ))}

                  {leftTab === 'live' && liveStreams.map(stream => (
                    <div 
                      key={stream.id} 
                      onClick={() => handleSelectLiveStream(stream.id)}
                      className={`cursor-pointer rounded-lg overflow-hidden bg-white/5 border transition-all ${selectedLiveStream === stream.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-purple-900/10 hover:border-indigo-500/30'}`}
                    >
                      <div className="p-2">
                        <div className="relative aspect-video rounded-md overflow-hidden bg-black mb-3">
                          <img src={stream.thumbnail} className="w-full h-full object-cover opacity-60" alt="Stream Preview" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                              <Video className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-slate-200">{stream.name}</p>
                            <p className="text-[10px] text-slate-500">更新于: {stream.updateTime}</p>
                          </div>
                          <button className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-md hover:bg-indigo-500/20 transition-all">
                            <RefreshCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {leftTab === 'results' && analysisTasks.map(task => (
                    <div key={task.id} className="bg-white/5 border border-purple-900/10 rounded-lg overflow-hidden transition-all">
                      <div 
                        className="p-3 cursor-pointer flex items-center justify-between group"
                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-medium text-slate-300 truncate group-hover:text-indigo-400 transition-colors">{task.name}</span>
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500">
                            <span>开始于: {task.date}</span>
                            {task.tagCount && <span>标签数量: {task.tagCount}</span>}
                            {task.progress && <span>进度: {task.progress}</span>}
                          </div>
                        </div>
                        {expandedTaskId === task.id ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                      </div>

                      {expandedTaskId === task.id && (
                        <div className="px-3 pb-3 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                           {task.thumbnail && (
                             <div className="relative group/thumb rounded overflow-hidden border border-purple-900/20">
                               <img src={task.thumbnail} className="w-full h-24 object-cover opacity-80 group-hover/thumb:opacity-100 transition-opacity" alt="Task imagery" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                  <button className="text-[10px] text-white flex items-center gap-1">
                                    <Play className="w-3 h-3 fill-current" /> 查看视频回放
                                  </button>
                                </div>
                             </div>
                           )}

                           {task.results.length > 0 && (
                             <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">识别结果</span>
                                   <EyeOff className="w-3.5 h-3.5 text-slate-600 cursor-pointer hover:text-slate-400" />
                                </div>
                                <div className="space-y-1.5">
                                   {task.results.map((res, i) => (
                                     <div key={i} className="flex items-center justify-between text-[11px]">
                                       <div className="flex items-center gap-2">
                                         <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                                         <span className="text-slate-400">{res.label}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <span className={`font-medium ${res.color}`}>{res.value}</span>
                                          <Eye className="w-3 h-3 text-slate-700 hover:text-indigo-400 cursor-pointer" />
                                       </div>
                                     </div>
                                   ))}
                                </div>
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {leftTab === 'upload' && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Plus className="w-10 h-10 text-purple-900/30 mb-3" />
                      <p className="text-xs text-slate-500">暂无导入数据</p>
                      <button className="mt-4 px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-md text-[11px] hover:bg-indigo-600/30 transition-all">
                        立即上传视频
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {sidebarCollapsed && (
          <div className="absolute left-16 top-1/2 -translate-y-1/2 z-20">
             <button onClick={() => setSidebarCollapsed(false)} className="p-1 bg-[#151221] border border-purple-900/20 rounded-r-md text-slate-500 hover:text-white shadow-xl">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Center Viewport */}
      <section className="flex-1 bg-transparent relative flex flex-col items-center justify-center overflow-hidden">
        {selectedVideo || selectedLiveStream ? (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative bg-black flex items-center justify-center">
              {/* Only show "Live" badge when the live tab is active and a stream is selected */}
              {leftTab === 'live' && selectedLiveStream && (
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <div className="bg-orange-600/90 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] text-white font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    实时直播中
                  </div>
                </div>
              )}
              
              {selectedVideo && (
                <img 
                  src={hotVideos.find(v => v.id === selectedVideo)?.thumbnail} 
                  className="w-full h-full object-contain opacity-60 blur-sm" 
                  alt="Selected background"
                />
              )}
              {selectedLiveStream && (
                 <img 
                  src={liveStreams.find(s => s.id === selectedLiveStream)?.thumbnail} 
                  className="w-full h-full object-cover" 
                  alt="Live background"
                />
              )}

              {/* Only show center play button for non-live streams */}
              {selectedVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <button className="w-16 h-16 bg-indigo-600/90 rounded-full flex items-center justify-center text-white shadow-2xl transform hover:scale-110 transition-all">
                      <Play className="w-8 h-8 fill-current ml-1" />
                   </button>
                </div>
              )}
            </div>
            
            {/* Playback Controls - only for recorded video */}
            {selectedVideo && (
              <div className="h-12 bg-[#1b1429]/80 border-t border-purple-900/20 flex items-center px-4 justify-between backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <Play className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
                  <div className="w-96 h-1 bg-purple-900/30 rounded-full relative">
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-indigo-500 rounded-full"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 tabular-nums">03:12 / 09:45</span>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <Maximize className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center opacity-50">
            <Video className="w-16 h-16 text-purple-900/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-500">请从左侧拉选数据</h3>
          </div>
        )}
      </section>

      {/* Right Tool Sidebar */}
      <aside className="w-80 bg-transparent border-l border-purple-900/20 flex flex-col overflow-hidden backdrop-blur-[2px]">
        {isDataSelectorOpen ? (
          /* Data Selector Drawer */
          <div className="flex flex-col h-full bg-[#151221]/80 backdrop-blur-lg animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-purple-900/20 flex items-center gap-3 bg-[#1b1429]/60">
              <button onClick={() => setIsDataSelectorOpen(false)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-semibold text-slate-200">选择视频数据</h2>
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
                 hotVideos.length > 0 ? (
                    hotVideos.map(video => (
                      <div 
                        key={video.id} 
                        onClick={() => handleDataSelect(video.id)}
                        className={`group cursor-pointer rounded-lg overflow-hidden border p-2 flex gap-3 transition-all ${selectedDataId === video.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-white/5 border-purple-900/10 hover:border-indigo-500/50'}`}
                      >
                        <img src={video.thumbnail} className="w-14 h-10 rounded object-cover shrink-0" alt={video.name} />
                        <div className="min-w-0 flex flex-col justify-center">
                          <p className="text-[11px] font-medium text-slate-200 truncate group-hover:text-indigo-400">{video.name}</p>
                          <p className="text-[10px] text-slate-500">{video.date}</p>
                        </div>
                        {selectedDataId === video.id && <div className="ml-auto flex items-center"><Check className="w-4 h-4 text-indigo-400" /></div>}
                      </div>
                    ))
                 ) : (
                    <div className="px-4 py-3 text-xs text-slate-500 text-center">暂无热门数据</div>
                 )
              ) : (
                 uploadedVideos.length > 0 ? (
                    uploadedVideos.map(video => (
                      <div 
                        key={video.id} 
                        onClick={() => handleDataSelect(video.id)}
                        className={`group cursor-pointer rounded-lg overflow-hidden border p-2 flex gap-3 transition-all ${selectedDataId === video.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-white/5 border-purple-900/10 hover:border-indigo-500/50'}`}
                      >
                        <img src={video.thumbnail} className="w-14 h-10 rounded object-cover shrink-0" alt={video.name} />
                        <div className="min-w-0 flex flex-col justify-center">
                          <p className="text-[11px] font-medium text-slate-200 truncate group-hover:text-indigo-400">{video.name}</p>
                          <p className="text-[10px] text-slate-500">{video.date}</p>
                        </div>
                        {selectedDataId === video.id && <div className="ml-auto flex items-center"><Check className="w-4 h-4 text-indigo-400" /></div>}
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
              <button 
                onClick={() => setIsCreateTaskPanelOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Analysis Type */}
              <section className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">分析类型</h3>
                <div className="flex items-center justify-between px-3 py-2.5 bg-purple-900/10 rounded-lg border border-purple-900/20">
                  <span className="text-xs text-slate-200 font-medium">{selectedToolName}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded uppercase tracking-tighter">{selectedCategoryName}</span>
                </div>
              </section>

              {/* Data Selection */}
              <section className="space-y-3 relative">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">选择数据</h3>
                <div 
                  onClick={() => setIsDataSelectorOpen(true)}
                  className="relative group cursor-pointer"
                >
                  <div className="w-full px-3 py-2.5 bg-white/5 border border-purple-900/10 rounded-lg flex items-center justify-between group-hover:border-indigo-500/50 transition-all">
                    <span className={`text-xs truncate ${selectedDataId ? 'text-slate-200' : 'text-slate-500'}`}>
                      {getDataName(selectedDataId)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              </section>

              {/* Model Selection */}
              <section className="space-y-3 relative">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">选择识别模型</h3>
                <div 
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="relative group cursor-pointer"
                >
                  <div className="w-full px-3 py-2.5 bg-white/5 border border-purple-900/10 rounded-lg flex items-center justify-between group-hover:border-indigo-500/50 transition-all">
                    <span className={`text-xs truncate ${selectedModelId ? 'text-slate-200' : 'text-slate-500'}`}>
                      {selectedModelId || '选择识别模型...'}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-600 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {isModelDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-[60] bg-[#1a1429] border border-purple-900/30 rounded-lg shadow-2xl py-1 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
                    {uavModels.map(model => (
                      <button 
                        key={model} 
                        onClick={() => handleModelSelect(model)} 
                        className="w-full px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 text-left flex items-center justify-between transition-colors"
                      >
                        {model} 
                        {selectedModelId === model && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="p-4 bg-[#1b1429]/80 border-t border-purple-900/30 flex items-center gap-2 backdrop-blur-md">
              <button 
                onClick={() => setIsCreateTaskPanelOpen(false)}
                className="flex-1 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/5 border border-purple-900/10 hover:bg-white/10 hover:text-white transition-all"
              >
                取消
              </button>
              <button 
                onClick={() => setIsCreateTaskPanelOpen(false)}
                className="flex-[2] py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
              >
                创建分析任务
              </button>
            </div>
          </div>
        ) : (
          /* Default Toolbox View */
          <>
            <div className="p-4 border-b border-purple-900/20 bg-[#1b1429]/40 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-slate-200">分析工具箱</h2>
              </div>
              <button className="text-slate-500 hover:text-white">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {toolCategories.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-indigo-400">{category.icon}</span>
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map(item => (
                      <button 
                        key={item}
                        onClick={() => handleToolClick(item, category.title)}
                        className="px-3 py-2 text-[11px] bg-white/5 border border-purple-900/10 hover:border-indigo-500/50 hover:bg-white/10 rounded text-slate-400 transition-all"
                      >
                        {item}
                      </button>
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
                    选中分析工具并拖拽到视频区域开始实时推理。系统将自动标记检测目标并记录轨迹。
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Collapsed Bottom Handle */}
      <div className="absolute bottom-4 right-84 z-10 flex items-center gap-2">
         <button className="p-1.5 bg-white/5 border border-purple-900/20 rounded-md text-slate-500 hover:text-white backdrop-blur-sm">
           <ChevronLeft className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

export default UAVWorkbench;
