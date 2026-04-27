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
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
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
  parseSql: (sql) => {
    console.log('开始解析 SQL:', sql.substring(0, 500));
    const tables: Table[] = [];
    
    // 提取所有 CREATE TABLE 语句
    const createTableRegex = /CREATE\s+TABLE\s*(?:IF\s+NOT\s+EXISTS\s+)?`?([^`]+)`?\s*\(([\s\S]*?)\)\s*(?:ENGINE\s*=\s*[^\s,]+)?\s*(?:DEFAULT\s+CHARSET\s*=\s*[^\s,]+)?\s*(?:COLLATE\s*=\s*[^\s,]+)?\s*(?:COMMENT\s*=\s*['"]([^'"]*)['"])?\s*(?:ROW_FORMAT\s*=\s*[^\s,]+)?\s*;/gi;
    
    let tableMatch;
    let tableIndex = 1;
    
    while ((tableMatch = createTableRegex.exec(sql)) !== null) {
      const tableName = tableMatch[1].trim();
      const tableContent = tableMatch[2];
      const tableComment = tableMatch[3] || '';
      
      console.log('解析表:', tableName);
      console.log('表内容长度:', tableContent.length);
      
      // 解析字段
      const fields: Field[] = [];
      
      // 字段正则表达式
      const fieldRegex = /`?([^`]+)`?\s+([^\s,]+)(?:\s*\([^)]*\))?\s*(NOT\s+NULL|NULL)?\s*(DEFAULT\s+[^,]+)?\s*(COMMENT\s*['"]([^'"]*)['"])?,?/g;
      
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(tableContent)) !== null) {
        const fieldName = fieldMatch[1].trim();
        const fieldType = fieldMatch[2].trim();
        const isNullable = fieldMatch[3] !== 'NOT NULL';
        const fieldComment = fieldMatch[5] || '';
        
        // 检查是否是主键
        const isPrimaryKey = false; // 后续单独处理
        
        fields.push({
          id: `${tableIndex}-${fields.length + 1}`,
          name: fieldName,
          type: fieldType,
          isPrimaryKey,
          isNullable,
          defaultValue: null,
          comment: fieldComment,
        });
      }
      
      // 解析主键
      const primaryKeyRegex = /PRIMARY\s+KEY\s*\((?:`?([^`]+)`?)\)/i;
      const primaryKeyMatch = primaryKeyRegex.exec(tableContent);
      if (primaryKeyMatch) {
        const primaryKeyField = primaryKeyMatch[1].trim();
        const field = fields.find(f => f.name === primaryKeyField);
        if (field) {
          field.isPrimaryKey = true;
        }
      }
      
      // 解析外键
      const relationships: Relationship[] = [];
      
      // 外键正则表达式
      const foreignKeyRegex = /CONSTRAINT\s+`?[^`]+`?\s+FOREIGN\s+KEY\s*\((?:`?([^`]+)`?)\)\s*REFERENCES\s+`?([^`]+)`?\s*\((?:`?([^`]+)`?)\)/gi;
      
      let foreignKeyMatch;
      while ((foreignKeyMatch = foreignKeyRegex.exec(tableContent)) !== null) {
        const sourceField = foreignKeyMatch[1].trim();
        const targetTable = foreignKeyMatch[2].trim();
        const targetField = foreignKeyMatch[3].trim();
        
        console.log('找到关系:', tableName, sourceField, '->', targetTable, targetField);
        
        relationships.push({
          id: `r${tableIndex}-${relationships.length + 1}`,
          sourceTable: tableName,
          sourceField,
          targetTable,
          targetField,
          type: 'many-to-one',
        });
      }
      
      tables.push({
        id: `${tableIndex}`,
        name: tableName,
        comment: tableComment,
        fields,
        relationships,
      });
      
      tableIndex++;
    }
    
    console.log('解析完成，共找到', tables.length, '个表');
    console.log('关系数量:', tables.reduce((sum, t) => sum + t.relationships.length, 0));
    
    // 如果没有解析到表，使用默认表结构
    if (tables.length === 0) {
      tables.push(
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
              type: 'many-to-one',
            },
          ],
        }
      );
    }
    
    set({ tables });
  },
  
  // 生成图表
  generateChart: (type) => {
    set({ chartConfig: { type, parameters: {} } });
  },
}));

export type { Field, Relationship, Table, ChartConfig };