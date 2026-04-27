import React from 'react';
import { Handle, Position } from 'reactflow';
import { Field, Table } from '../utils/store';

interface TableNodeProps {
  data: {
    table: Table;
  };
}

const TableNode: React.FC<TableNodeProps> = ({ data }) => {
  const { table } = data;

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm w-64">
      {/* 表名 */}
      <div className="bg-primary text-white p-2 rounded-t-md font-medium">
        {table.name}
        {table.comment && <span className="text-xs opacity-80 ml-2">({table.comment})</span>}
      </div>
      
      {/* 字段列表 */}
      <div className="max-h-64 overflow-y-auto">
        {table.fields.map((field: Field) => (
          <div key={field.id} className="p-2 border-b border-gray-100 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium">{field.name}</span>
              {field.isPrimaryKey && (
                <span className="text-xs bg-primary text-white px-1 rounded">PK</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {field.type} {field.isNullable ? 'NULL' : 'NOT NULL'}
              {field.defaultValue && ` DEFAULT ${field.defaultValue}`}
            </div>
            {field.comment && (
              <div className="text-xs text-gray-400 mt-1">{field.comment}</div>
            )}
          </div>
        ))}
      </div>
      
      {/* 连接点 */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${table.id}-source`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${table.id}-target`}
      />
    </div>
  );
};

export default TableNode;