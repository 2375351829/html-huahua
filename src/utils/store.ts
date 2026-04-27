import { create } from 'zustand';

// 定义类型
interface Field {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNullable: boolean;
  defaultValue: string | null;
  comment: string;
}

interface Relationship {
  id: string;
  sourceTable: string;
  sourceField: string;
  targetTable: string;
  targetField: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

interface Table {
  id: string;
  name: string;
  comment: string;
  fields: Field[];
  relationships: Relationship[];
}

interface ChartConfig {
  type: 'three-line-table' | 'use-case' | 'function-module' | 'flow' | 'sequence' | 'data-flow';
  parameters: Record<string, any>;
}

interface Store {
  // SQL 输入
  sqlInput: string;
  setSqlInput: (input: string) => void;
  
  // 解析结果
  tables: Table[];
  setTables: (tables: Table[]) => void;
  
  // ER 图布局
  erGraphLayout: Record<string, { x: number; y: number }>;
  setErGraphLayout: (layout: Record<string, { x: number; y: number }>) => void;
  
  // 样式配置
  styleConfig: {
    nodeSize: number;
    nodeColor: string;
    lineColor: string;
    fontSize: number;
  };
  setStyleConfig: (config: Partial<Store['styleConfig']>) => void;
  
  // 图表生成配置
  chartConfig: ChartConfig | null;
  setChartConfig: (config: ChartConfig | null) => void;
  
  // 导出设置
  exportConfig: {
    format: 'png' | 'svg' | 'jpeg' | 'drawio';
    quality: number;
  };
  setExportConfig: (config: Partial<Store['exportConfig']>) => void;
  
  // 解析 SQL
  parseSql: (sql: string) => void;
  
  // 生成图表
  generateChart: (type: ChartConfig['type']) => void;
}

// 创建 store
export const useStore = create<Store>((set) => ({
  // SQL 输入
  sqlInput: '',
  setSqlInput: (input) => set({ sqlInput: input }),
  
  // 解析结果
  tables: [],
  setTables: (tables) => set({ tables }),
  
  // ER 图布局
  erGraphLayout: {},
  setErGraphLayout: (layout) => set({ erGraphLayout: layout }),
  
  // 样式配置
  styleConfig: {
    nodeSize: 120,
    nodeColor: '#165DFF',
    lineColor: '#4E5969',
    fontSize: 14,
  },
  setStyleConfig: (config) => set((state) => ({ styleConfig: { ...state.styleConfig, ...config } })),
  
  // 图表生成配置
  chartConfig: null,
  setChartConfig: (config) => set({ chartConfig: config }),
  
  // 导出设置
  exportConfig: {
    format: 'png',
    quality: 0.9,
  },
  setExportConfig: (config) => set((state) => ({ exportConfig: { ...state.exportConfig, ...config } })),
  
  // 解析 SQL
  parseSql: (_sql) => {
    // 这里只是一个简单的模拟，实际项目中需要实现真实的 SQL 解析
    const tables: Table[] = [
      {
        id: '1',
        name: 'users',
        comment: '用户表',
        fields: [
          {
            id: '1-1',
            name: 'id',
            type: 'INT',
            isPrimaryKey: true,
            isNullable: false,
            defaultValue: null,
            comment: '用户ID',
          },
          {
            id: '1-2',
            name: 'name',
            type: 'VARCHAR(50)',
            isPrimaryKey: false,
            isNullable: false,
            defaultValue: null,
            comment: '用户名',
          },
          {
            id: '1-3',
            name: 'email',
            type: 'VARCHAR(100)',
            isPrimaryKey: false,
            isNullable: false,
            defaultValue: null,
            comment: '邮箱',
          },
        ],
        relationships: [],
      },
      {
        id: '2',
        name: 'posts',
        comment: '文章表',
        fields: [
          {
            id: '2-1',
            name: 'id',
            type: 'INT',
            isPrimaryKey: true,
            isNullable: false,
            defaultValue: null,
            comment: '文章ID',
          },
          {
            id: '2-2',
            name: 'title',
            type: 'VARCHAR(100)',
            isPrimaryKey: false,
            isNullable: false,
            defaultValue: null,
            comment: '标题',
          },
          {
            id: '2-3',
            name: 'content',
            type: 'TEXT',
            isPrimaryKey: false,
            isNullable: false,
            defaultValue: null,
            comment: '内容',
          },
          {
            id: '2-4',
            name: 'user_id',
            type: 'INT',
            isPrimaryKey: false,
            isNullable: false,
            defaultValue: null,
            comment: '用户ID',
          },
        ],
        relationships: [
          {
            id: 'r1',
            sourceTable: 'posts',
            sourceField: 'user_id',
            targetTable: 'users',
            targetField: 'id',
            type: 'many-to-many',
          },
        ],
      },
    ];
    set({ tables });
  },
  
  // 生成图表
  generateChart: (type) => {
    set({ chartConfig: { type, parameters: {} } });
  },
}));

export type { Field, Relationship, Table, ChartConfig };