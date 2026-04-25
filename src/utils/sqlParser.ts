// SQL解析器模块

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  comment?: string;
}

export interface Table {
  name: string;
  columns: Column[];
  primaryKeys: string[];
}

export interface Relationship {
  sourceTable: string;
  targetTable: string;
  sourceColumns: string[];
  targetColumns: string[];
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

interface ParserState {
  tables: Table[];
  currentTable: Table | null;
  relationships: Relationship[];
}

export function parseSQL(sql: string, databaseType: 'mysql' | 'postgresql' | 'sqlite'): { tables: Table[]; relationships: Relationship[] } {
  const state: ParserState = {
    tables: [],
    currentTable: null,
    relationships: []
  };

  // 简单的SQL解析逻辑，实际项目中可能需要更复杂的解析器
  const statements = sql.split(';').filter(s => s.trim());

  for (const statement of statements) {
    const trimmedStatement = statement.trim().toLowerCase();

    if (trimmedStatement.startsWith('create table')) {
      parseCreateTable(trimmedStatement, state, databaseType);
    } else if (trimmedStatement.startsWith('alter table')) {
      parseAlterTable(trimmedStatement, state, databaseType);
    }
  }

  return {
    tables: state.tables,
    relationships: state.relationships
  };
}

function parseCreateTable(statement: string, state: ParserState, databaseType: 'mysql' | 'postgresql' | 'sqlite') {
  // 提取表名
  const tableNameMatch = statement.match(/create table\s+(?:if not exists)?\s*([\w_]+)/i);
  if (!tableNameMatch) return;

  const tableName = tableNameMatch[1];
  const table: Table = {
    name: tableName,
    columns: [],
    primaryKeys: []
  };

  // 提取表结构
  const columnsMatch = statement.match(/\(([\s\S]*?)\)/);
  if (columnsMatch) {
    const columnsPart = columnsMatch[1];
    const columnDefinitions = columnsPart.split(',').map(c => c.trim()).filter(c => c);

    for (const columnDef of columnDefinitions) {
      if (columnDef.toLowerCase().startsWith('primary key')) {
        // 处理主键定义
        const primaryKeyMatch = columnDef.match(/primary key\s*\(([^)]+)\)/i);
        if (primaryKeyMatch) {
          const primaryKeys = primaryKeyMatch[1].split(',').map(k => k.trim());
          table.primaryKeys.push(...primaryKeys);
        }
      } else if (columnDef.toLowerCase().startsWith('foreign key')) {
        // 处理外键定义
        parseForeignKey(columnDef, table.name, state);
      } else {
        // 处理列定义
        const column = parseColumnDefinition(columnDef, databaseType);
        if (column) {
          table.columns.push(column);
        }
      }
    }
  }

  state.tables.push(table);
  state.currentTable = table;
}

function parseAlterTable(statement: string, state: ParserState, _databaseType: 'mysql' | 'postgresql' | 'sqlite') {
  // 提取表名
  const tableNameMatch = statement.match(/alter table\s+([\w_]+)/i);
  if (!tableNameMatch) return;

  const tableName = tableNameMatch[1];
  const table = state.tables.find(t => t.name === tableName);
  if (!table) return;

  // 处理添加外键
  if (statement.includes('foreign key')) {
    const foreignKeyMatch = statement.match(/add\s+([\s\S]*?foreign key[\s\S]*?)/i);
    if (foreignKeyMatch) {
      parseForeignKey(foreignKeyMatch[1], tableName, state);
    }
  }
}

function parseColumnDefinition(columnDef: string, _databaseType: 'mysql' | 'postgresql' | 'sqlite'): Column | null {
  // 简单的列定义解析
  const parts = columnDef.split(/\s+/).filter(p => p);
  if (parts.length < 2) return null;

  const name = parts[0];
  let type = parts[1];
  let nullable = true;
  let defaultValue: string | undefined;
  let comment: string | undefined;

  // 处理NULL/NOT NULL
  for (let i = 2; i < parts.length; i++) {
    const part = parts[i].toLowerCase();
    if (part === 'not' && i + 1 < parts.length && parts[i + 1].toLowerCase() === 'null') {
      nullable = false;
      i++;
    } else if (part === 'default') {
      defaultValue = parts[i + 1];
      i++;
    } else if (part === 'comment') {
      // 处理注释
      const commentMatch = columnDef.match(/comment\s+'([^']+)'/i);
      if (commentMatch) {
        comment = commentMatch[1];
      }
    }
  }

  return {
    name,
    type,
    nullable,
    defaultValue,
    comment
  };
}

function parseForeignKey(foreignKeyDef: string, sourceTable: string, state: ParserState) {
  // 简单的外键解析
  const foreignKeyMatch = foreignKeyDef.match(/foreign key\s*\(([^)]+)\)\s*references\s*([\w_]+)\s*\(([^)]+)\)/i);
  if (!foreignKeyMatch) return;

  const sourceColumns = foreignKeyMatch[1].split(',').map(c => c.trim());
  const targetTable = foreignKeyMatch[2];
  const targetColumns = foreignKeyMatch[3].split(',').map(c => c.trim());

  // 推断关系类型
  let type: 'one-to-one' | 'one-to-many' | 'many-to-many' = 'one-to-many';

  state.relationships.push({
    sourceTable,
    targetTable,
    sourceColumns,
    targetColumns,
    type
  });
}
