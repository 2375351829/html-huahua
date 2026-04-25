// 图表生成器模块
import * as d3 from 'd3';
import { Table, Relationship } from './sqlParser';

export type ChartType = 'er' | 'use-case' | 'function' | 'flow' | 'sequence' | 'data-flow';

interface ChartOptions {
  width: number;
  height: number;
}

export function generateChart(
  type: ChartType,
  tables: Table[],
  relationships: Relationship[],
  container: HTMLElement,
  options: ChartOptions
) {
  // 清空容器
  container.innerHTML = '';

  switch (type) {
    case 'er':
      generateERDiagram(tables, relationships, container, options);
      break;
    case 'use-case':
      generateUseCaseDiagram(tables, container, options);
      break;
    case 'function':
      generateFunctionDiagram(tables, container, options);
      break;
    case 'flow':
      generateFlowDiagram(tables, container, options);
      break;
    case 'sequence':
      generateSequenceDiagram(tables, container, options);
      break;
    case 'data-flow':
      generateDataFlowDiagram(tables, container, options);
      break;
  }
}

// 生成ER图
function generateERDiagram(
  tables: Table[],
  relationships: Relationship[],
  container: HTMLElement,
  options: ChartOptions
) {
  const { width, height } = options;

  // 创建SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .call(d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      })
    );

  // 创建一个包含所有元素的g元素，用于缩放
  const g = svg.append('g');

  // 创建力导向图
  const simulation = d3.forceSimulation(tables as any)
    .force('link', d3.forceLink(relationships as any).id((d: any) => d.name).distance(200))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(100));

  // 绘制关系线
  const link = g.append('g')
    .selectAll('line')
    .data(relationships as any)
    .enter()
    .append('line')
    .attr('stroke', '#1E88E5')
    .attr('stroke-width', 2);

  // 绘制表节点
  const node = g.append('g')
    .selectAll('.node')
    .data(tables)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag<SVGGElement, Table>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    );

  // 绘制表框
  node.append('rect')
    .attr('width', 200)
    .attr('height', (d) => Math.max(60, d.columns.length * 20 + 40))
    .attr('x', -100)
    .attr('y', -30)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('fill', '#F5F5F5')
    .attr('stroke', '#1E88E5')
    .attr('stroke-width', 2);

  // 绘制表名
  node.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text((d) => d.name);

  // 绘制列
  node.each(function(d) {
    d3.select(this).selectAll('.column')
      .data(d.columns)
      .enter()
      .append('text')
      .attr('class', 'column')
      .attr('x', -90)
      .attr('y', (_, i) => 10 + i * 20)
      .attr('font-size', '12px')
      .text((column) => {
        const primaryKey = d.primaryKeys.includes(column.name) ? 'PK ' : '';
        return `${primaryKey}${column.name}: ${column.type}${column.nullable ? '' : ' NOT NULL'}`;
      });
  });

  // 更新力导向图
  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    node
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
  });

  // 拖拽函数
  function dragstarted(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event: any, d: any) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// 生成用例图
function generateUseCaseDiagram(
  tables: Table[],
  container: HTMLElement,
  _options: ChartOptions
) {
  // 使用mermaid.js生成用例图
  const mermaidCode = `
graph TD
  User[用户]
  ${tables.map(table => `${table.name}[${table.name}]`).join('\n  ')}
  ${tables.map(table => `User --> ${table.name}`).join('\n  ')}
`;

  container.innerHTML = `
    <div class="mermaid">
      ${mermaidCode}
    </div>
  `;

  // 初始化mermaid
  if (typeof window !== 'undefined' && (window as any).mermaid) {
    (window as any).mermaid.init();
  }
}

// 生成功能模块图
function generateFunctionDiagram(
  tables: Table[],
  container: HTMLElement,
  _options: ChartOptions
) {
  // 使用mermaid.js生成功能模块图
  const mermaidCode = `
graph TD
  System[系统]
  ${tables.map(table => `${table.name}[${table.name}]`).join('\n  ')}
  ${tables.map(table => `System --> ${table.name}`).join('\n  ')}
`;

  container.innerHTML = `
    <div class="mermaid">
      ${mermaidCode}
    </div>
  `;

  // 初始化mermaid
  if (typeof window !== 'undefined' && (window as any).mermaid) {
    (window as any).mermaid.init();
  }
}

// 生成流程图
function generateFlowDiagram(
  tables: Table[],
  container: HTMLElement,
  _options: ChartOptions
) {
  // 使用mermaid.js生成流程图
  const mermaidCode = `
graph LR
  ${tables.map(table => `${table.name}[${table.name}]`).join('\n  ')}
  ${tables.map((table, index) => {
    if (index < tables.length - 1) {
      return `${table.name} --> ${tables[index + 1].name}`;
    }
    return '';
  }).filter(Boolean).join('\n  ')}
`;

  container.innerHTML = `
    <div class="mermaid">
      ${mermaidCode}
    </div>
  `;

  // 初始化mermaid
  if (typeof window !== 'undefined' && (window as any).mermaid) {
    (window as any).mermaid.init();
  }
}

// 生成时序图
function generateSequenceDiagram(
  tables: Table[],
  container: HTMLElement,
  _options: ChartOptions
) {
  // 使用mermaid.js生成时序图
  const mermaidCode = `
sequenceDiagram
  participant Client as 客户端
  ${tables.map(table => `participant ${table.name} as ${table.name}`).join('\n  ')}
  Client->>${tables[0].name}: 请求数据
  ${tables.map((table, index) => {
    if (index < tables.length - 1) {
      return `${table.name}->>${tables[index + 1].name}: 传递数据`;
    }
    return `${table.name}-->>Client: 返回数据`;
  }).join('\n  ')}
`;

  container.innerHTML = `
    <div class="mermaid">
      ${mermaidCode}
    </div>
  `;

  // 初始化mermaid
  if (typeof window !== 'undefined' && (window as any).mermaid) {
    (window as any).mermaid.init();
  }
}

// 生成数据流图
function generateDataFlowDiagram(
  tables: Table[],
  container: HTMLElement,
  _options: ChartOptions
) {
  // 使用mermaid.js生成数据流图
  const mermaidCode = `
graph TD
  External[外部系统]
  ${tables.map(table => `${table.name}[${table.name}]`).join('\n  ')}
  External --> ${tables[0].name}
  ${tables.map((table, index) => {
    if (index < tables.length - 1) {
      return `${table.name} --> ${tables[index + 1].name}`;
    }
    return `${table.name} --> External`;
  }).filter(Boolean).join('\n  ')}
`;

  container.innerHTML = `
    <div class="mermaid">
      ${mermaidCode}
    </div>
  `;

  // 初始化mermaid
  if (typeof window !== 'undefined' && (window as any).mermaid) {
    (window as any).mermaid.init();
  }
}
