import { useState, useRef, useEffect } from 'react'
import { parseSQL } from './utils/sqlParser'
import { generateChart } from './utils/chartGenerator'
import { exportAsPNG, exportAsPDF } from './utils/exportUtil'
import { sampleSQLs } from './utils/sampleSQLs'

function App() {
  const [sql, setSql] = useState('')
  const [databaseType, setDatabaseType] = useState<'mysql' | 'postgresql' | 'sqlite'>('mysql')
  const [chartType, setChartType] = useState<'er' | 'use-case' | 'function' | 'flow' | 'sequence' | 'data-flow'>('er')
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<any[]>([])
  const [relationships, setRelationships] = useState<any[]>([])
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const handleConvert = () => {
    setIsParsing(true)
    setError(null)
    
    try {
      const result = parseSQL(sql, databaseType)
      setTables(result.tables)
      setRelationships(result.relationships)
    } catch (err) {
      setError('SQL解析错误: ' + (err as Error).message)
    } finally {
      setIsParsing(false)
    }
  }

  const handleClear = () => {
    setSql('')
    setError(null)
    setTables([])
    setRelationships([])
  }

  const handleExport = async (format: 'png' | 'pdf') => {
    if (!chartContainerRef.current) return;
    
    try {
      const filename = `er-diagram-${Date.now()}`;
      if (format === 'png') {
        await exportAsPNG(chartContainerRef.current, filename);
      } else {
        await exportAsPDF(chartContainerRef.current, filename);
      }
    } catch (error) {
      setError('导出失败: ' + (error as Error).message);
    }
  }

  const handleLoadSample = (sampleName: string) => {
    const sample = sampleSQLs.find(s => s.name === sampleName);
    if (sample) {
      setSql(sample.sql);
      setDatabaseType(sample.databaseType);
    }
  }

  useEffect(() => {
    if (chartContainerRef.current && tables.length > 0) {
      const container = chartContainerRef.current
      const width = container.clientWidth
      const height = container.clientHeight
      
      generateChart(chartType, tables, relationships, container, { width, height })
    }
  }, [tables, relationships, chartType])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">SQL转ER图在线工具</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* SQL输入区域 */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">SQL输入</h2>
              <button 
                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                onClick={handleClear}
              >
                清空
              </button>
            </div>
            <textarea
              className="w-full h-96 p-3 border border-gray-300 rounded font-mono text-sm"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="请输入SQL建表语句..."
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                数据库类型
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={databaseType}
                onChange={(e) => setDatabaseType(e.target.value as any)}
              >
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>
          </div>

          {/* 图表展示区域 */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">图表展示</h2>
            <div 
              ref={chartContainerRef}
              className="h-96 border border-gray-300 rounded bg-white"
            >
              {isParsing ? (
                <div className="h-full flex items-center justify-center text-gray-500">解析中...</div>
              ) : error ? (
                <div className="h-full flex items-center justify-center text-red-500">{error}</div>
              ) : tables.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">请输入SQL语句并点击转换</div>
              ) : null}
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">
              图表类型
            </label>
            <select
              className="p-2 border border-gray-300 rounded"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
            >
              <option value="er">ER图</option>
              <option value="use-case">用例图</option>
              <option value="function">功能模块图</option>
              <option value="flow">流程图</option>
              <option value="sequence">时序图</option>
              <option value="data-flow">数据流图</option>
            </select>
          </div>

          <button
            className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
            onClick={handleConvert}
            disabled={isParsing}
          >
            {isParsing ? '转换中...' : '转换'}
          </button>

          <div className="flex items-center gap-2">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow"
              onClick={() => handleExport('png')}
            >
              导出PNG
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow"
              onClick={() => handleExport('pdf')}
            >
              导出PDF
            </button>
          </div>
        </div>

        {/* 示例库 */}
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">示例库</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              onClick={() => handleLoadSample('电商系统')}
            >
              电商系统
            </button>
            <button 
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              onClick={() => handleLoadSample('博客系统')}
            >
              博客系统
            </button>
            <button 
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              onClick={() => handleLoadSample('学生管理系统')}
            >
              学生管理系统
            </button>
            <button 
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              onClick={() => handleLoadSample('医院管理系统')}
            >
              医院管理系统
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 px-6 mt-8 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © 2026 SQL转ER图在线工具
        </div>
      </footer>
    </div>
  )
}

export default App