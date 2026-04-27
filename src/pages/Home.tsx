import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, Upload, Download, Settings, Layout, RefreshCw, BarChart3 } from 'lucide-react';
import { useStore } from '../utils/store';

const Home: React.FC = () => {
  const { sqlInput, setSqlInput, tables, parseSql, generateChart } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeTab, setActiveTab] = useState('er-diagram');

  // 处理 SQL 解析
  const handleParseSql = () => {
    parseSql(sqlInput);
    // 生成 ER 图节点和边
    setTimeout(generateErGraph, 100); // 延迟执行，确保 tables 已经更新
  };

  // 生成 ER 图
  const generateErGraph = () => {
    const newNodes: any[] = [];
    const newEdges: any[] = [];
    const nodePositions: Record<string, { x: number; y: number }> = {};
    const spacing = 200;
    const initialX = 100;
    const initialY = 100;

    // 生成表节点（矩形）
    tables.forEach((table, tableIndex) => {
      const x = initialX + (tableIndex % 2) * spacing * 2;
      const y = initialY + Math.floor(tableIndex / 2) * spacing * 2;
      nodePositions[table.id] = { x, y };

      // 表节点（矩形）
      newNodes.push({
        id: table.id,
        data: { label: `${table.name}\n${table.comment || ''}` },
        position: { x, y },
        style: { 
          width: 150, 
          height: 80, 
          backgroundColor: '#165DFF', 
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center'
        },
      });

      // 生成字段节点（椭圆）
      table.fields.forEach((field, fieldIndex) => {
        const fieldId = `${table.id}-field-${fieldIndex}`;
        const fieldX = x + (fieldIndex % 2) * 120 - 60;
        const fieldY = y + 120 + Math.floor(fieldIndex / 2) * 60;
        
        newNodes.push({
          id: fieldId,
          data: { 
            label: `${field.name}\n${field.type}\n${field.comment || ''}` 
          },
          position: { x: fieldX, y: fieldY },
          style: { 
            width: 100, 
            height: 60, 
            backgroundColor: '#F5F7FA', 
            color: '#4E5969',
            borderRadius: '50%',
            textAlign: 'center'
          },
        });

        // 连接表和字段
        newEdges.push({
          id: `${table.id}-to-${fieldId}`,
          source: table.id,
          target: fieldId,
          style: { stroke: '#4E5969' },
        });
      });
    });

    // 生成关系节点（菱形）和连线
    tables.forEach((table) => {
      table.relationships.forEach((rel, relIndex) => {
        const sourceTable = tables.find(t => t.name === rel.sourceTable);
        const targetTable = tables.find(t => t.name === rel.targetTable);
        
        if (sourceTable && targetTable) {
          const sourcePos = nodePositions[sourceTable.id];
          const targetPos = nodePositions[targetTable.id];
          
          if (sourcePos && targetPos) {
            // 关系节点（菱形）
            const relId = `rel-${rel.id}`;
            const relX = (sourcePos.x + targetPos.x) / 2;
            const relY = (sourcePos.y + targetPos.y) / 2;
            
            // 关系类型显示
            const getRelationshipLabel = (type: string) => {
              switch (type) {
                case 'one-to-one': return '一对一';
                case 'one-to-many': return '一对多';
                case 'many-to-many': return '多对多';
                default: return type;
              }
            };
            
            newNodes.push({
              id: relId,
              data: { label: getRelationshipLabel(rel.type) },
              position: { x: relX, y: relY },
              style: { 
                width: 80, 
                height: 80, 
                backgroundColor: '#FF9800', 
                color: 'white',
                borderRadius: '4px',
                textAlign: 'center',
                transform: 'rotate(45deg)',
                fontSize: '12px'
              },
            });

            // 连接源表和关系
            newEdges.push({
              id: `${sourceTable.id}-to-${relId}`,
              source: sourceTable.id,
              target: relId,
              style: { stroke: '#4E5969' },
            });

            // 连接关系和目标表
            newEdges.push({
              id: `${relId}-to-${targetTable.id}`,
              source: relId,
              target: targetTable.id,
              style: { stroke: '#4E5969' },
            });
          }
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  // 处理图表生成
  const handleGenerateChart = (type: any) => {
    generateChart(type);
    setActiveTab('chart');
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSqlInput(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">SQL转ER图在线生成工具</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="text-primary font-medium">首页</a></li>
              <li><a href="/docs" className="text-dark hover:text-primary">文档</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SQL 输入区 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-dark">SQL输入</h2>
                <div className="flex space-x-2">
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      accept=".sql"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e)}
                    />
                    <button
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="p-2 text-dark hover:text-primary"
                    >
                      <Upload size={18} />
                    </button>
                  </div>
                  <button className="p-2 text-dark hover:text-primary">
                    <Save size={18} />
                  </button>
                </div>
              </div>
              <Editor
                height="400px"
                language="sql"
                value={sqlInput}
                onChange={(value) => setSqlInput(value || '')}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleParseSql}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  解析SQL
                </button>
                <button className="bg-white border border-primary text-primary py-2 px-4 rounded-md hover:bg-primary/10 transition-colors">
                  AI生成
                </button>
              </div>
            </div>
          </div>

          {/* 右侧区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标签页 */}
            <div className="bg-white rounded-t-lg shadow-sm p-4">
              <ul className="flex space-x-4">
                <li>
                  <button
                    onClick={() => setActiveTab('er-diagram')}
                    className={`py-2 px-4 rounded-t-md ${activeTab === 'er-diagram' ? 'bg-primary text-white' : 'text-dark hover:text-primary'}`}
                  >
                    ER图
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('chart')}
                    className={`py-2 px-4 rounded-t-md ${activeTab === 'chart' ? 'bg-primary text-white' : 'text-dark hover:text-primary'}`}
                  >
                    图表生成
                  </button>
                </li>
              </ul>
            </div>

            {/* 内容区域 */}
            <div className="bg-white rounded-b-lg shadow-sm p-4 min-h-[500px]">
              {activeTab === 'er-diagram' ? (
                <div className="h-[500px]">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
                  >
                    <Background gap={12} size={1} />
                    <Controls />
                    <MiniMap />
                  </ReactFlow>
                </div>
              ) : (
                <div className="h-[500px] flex flex-col">
                  <h3 className="text-lg font-semibold text-dark mb-4">选择图表类型</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleGenerateChart('three-line-table')}
                      className="border border-gray-200 rounded-md p-4 hover:bg-primary/10 transition-colors flex flex-col items-center"
                    >
                      <BarChart3 size={24} className="text-primary mb-2" />
                      <span>三线表</span>
                    </button>
                    <button
                      onClick={() => handleGenerateChart('use-case')}
                      className="border border-gray-200 rounded-md p-4 hover:bg-primary/10 transition-colors flex flex-col items-center"
                    >
                      <BarChart3 size={24} className="text-primary mb-2" />
                      <span>用例图</span>
                    </button>
                    <button
                      onClick={() => handleGenerateChart('function-module')}
                      className="border border-gray-200 rounded-md p-4 hover:bg-primary/10 transition-colors flex flex-col items-center"
                    >
                      <BarChart3 size={24} className="text-primary mb-2" />
                      <span>功能模块图</span>
                    </button>
                    <button
                      onClick={() => handleGenerateChart('flow')}
                      className="border border-gray-200 rounded-md p-4 hover:bg-primary/10 transition-colors flex flex-col items-center"
                    >
                      <BarChart3 size={24} className="text-primary mb-2" />
                      <span>流程图</span>
                    </button>
                    <button
                      onClick={() => handleGenerateChart('sequence')}
                      className="border border-gray-200 rounded-md p-4 hover:bg-primary/10 transition-colors flex flex-col items-center"
                    >
                      <BarChart3 size={24} className="text-primary mb-2" />
                      <span>时序图</span>
                    </button>
                    <button
                      onClick={() => handleGenerateChart('data-flow')}
                      className="border border-gray-200 rounded-md p-4 hover:bg-primary/10 transition-colors flex flex-col items-center"
                    >
                      <BarChart3 size={24} className="text-primary mb-2" />
                      <span>数据流图</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 功能操作区 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center space-x-1 bg-white border border-gray-200 py-2 px-4 rounded-md hover:bg-primary/10 transition-colors">
                  <Layout size={16} />
                  <span>美化排版</span>
                </button>
                <button className="flex items-center space-x-1 bg-white border border-gray-200 py-2 px-4 rounded-md hover:bg-primary/10 transition-colors">
                  <RefreshCw size={16} />
                  <span>智能显示属性</span>
                </button>
                <button className="flex items-center space-x-1 bg-white border border-gray-200 py-2 px-4 rounded-md hover:bg-primary/10 transition-colors">
                  <Settings size={16} />
                  <span>修改样式</span>
                </button>
                <button className="flex items-center space-x-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                  <Download size={16} />
                  <span>导出图片</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="bg-white shadow-sm mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-dark/60">
          <p>SQL转ER图在线生成工具 © 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;