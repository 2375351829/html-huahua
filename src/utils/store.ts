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
  parseSql: (sql) => {
    // 简单的 SQL 解析逻辑，实际项目中可能需要更复杂的解析器
    const tables: Table[] = [];
    const tableRegex = /CREATE\s+TABLE\s+`?([^`]+)`?\s*\(([\s\S]*?)\)\s*(?:ENGINE\s*=\s*[^\s,]+)?\s*(?:COMMENT\s*=\s*['"]([^'"]*)['"])?/gi;
    
    let match;
    while ((match = tableRegex.exec(sql)) !== null) {
      const tableName = match[1].trim();
      const tableComment = match[3] || '';
      const tableContent = match[2];
      
      // 解析字段
      const fields: Field[] = [];
      const fieldRegex = /`?([^`]+)`?\s+([^\s,]+)\s*(NOT\s+NULL|NULL)?\s*(DEFAULT\s+[^,]+)?\s*(COMMENT\s*['"]([^'"]*)['"])?/gi;
      
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(tableContent)) !== null) {
        const fieldName = fieldMatch[1].trim();
        const fieldType = fieldMatch[2].trim();
        const isNullable = fieldMatch[3] !== 'NOT NULL';
        const defaultValue = fieldMatch[4] ? fieldMatch[4].replace('DEFAULT ', '').trim() : null;
        const fieldComment = fieldMatch[5] || '';
        
        fields.push({
          id: `${tables.length + 1}-${fields.length + 1}`,
          name: fieldName,
          type: fieldType,
          isPrimaryKey: false,
          isNullable,
          defaultValue,
          comment: fieldComment,
        });
      }
      
      // 解析主键
      const primaryKeyRegex = /PRIMARY\s+KEY\s*\((`?([^`]+)`?)\)/i;
      const primaryKeyMatch = primaryKeyRegex.exec(tableContent);
      if (primaryKeyMatch) {
        const primaryKeyField = primaryKeyMatch[2];
        const field = fields.find(f => f.name === primaryKeyField);
        if (field) {
          field.isPrimaryKey = true;
        }
      }
      
      // 解析外键
      const relationships: Relationship[] = [];
      const foreignKeyRegex = /FOREIGN\s+KEY\s*\((`?([^`]+)`?)\)\s*REFERENCES\s+`?([^`]+)`?\s*\((`?([^`]+)`?)\)/gi;
      
      let foreignKeyMatch;
      while ((foreignKeyMatch = foreignKeyRegex.exec(tableContent)) !== null) {
        const sourceField = foreignKeyMatch[2];
        const targetTable = foreignKeyMatch[3];
        const targetField = foreignKeyMatch[5];
        
        // 确定关系类型
        let relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many' = 'many-to-many';
        
        // 简单判断：如果源字段是唯一的，可能是一对一关系
        const sourceFieldDef = fieldRegex.exec(tableContent);
        if (sourceFieldDef) {
          // 这里可以根据字段定义进一步判断关系类型
        }
        
        relationships.push({
          id: `r${tables.length + 1}-${relationships.length + 1}`,
          sourceTable: tableName,
          sourceField,
          targetTable,
          targetField,
          type: relationshipType,
        });
      }
      
      tables.push({
        id: `${tables.length + 1}`,
        name: tableName,
        comment: tableComment,
        fields,
        relationships,
      });
    }
    
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
              type: 'many-to-many',
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