import React, { useState } from 'react';

const Docs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('guide');

  // 常见问题数据
  const faqItems = [
    {
      question: '什么是SQL转ER图工具？',
      answer: 'SQL转ER图工具是一款在线工具，可以将SQL建表语句自动转换为实体关系图(ER图)，帮助开发者直观地理解数据库结构。通过可视化的方式展示表之间的关系，使数据库设计更加清晰。'
    },
    {
      question: 'SQL建表语句的格式要求是什么？',
      answer: '为了确保正确生成ER图，SQL建表语句需要遵循以下格式规范：\n1. 表名和字段名：使用反引号(\`\`)包围，例如：\`user_info\`、\`user_id\`\n2. 字段定义：明确指定字段类型和长度，如：VARCHAR(50)、INT(11)；使用NOT NULL或NULL声明是否允许为空；可以使用DEFAULT设置默认值；建议为每个字段添加COMMENT注释\n3. 主键定义：使用PRIMARY KEY在字段列表最后声明，例如：PRIMARY KEY (\`id\`) USING BTREE\n4. 外键关系：使用CONSTRAINT和FOREIGN KEY定义表之间的关系，例如：CONSTRAINT \`fk_user_role\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE\n5. 表注释：在表定义的最后使用COMMENT添加表说明，例如：ENGINE = InnoDB COMMENT = \'用户表\';'
    },
    {
      question: '能否自定义ER图的样式？',
      answer: '是的，点击右上角的"图表样式"按钮，可以自定义ER图的多种样式，包括：\n- 全局背景颜色和字体设置\n- 节点大小（实体、属性和关系节点的尺寸）\n- 节点颜色和形状\n- 连接线颜色\n- 布局紧凑度\n这些设置会实时应用到图表上，帮助您创建符合个人喜好的ER图。您可以调整节点大小来优化图表的整体布局和可读性。'
    },
    {
      question: '生成的ER图不符合预期？',
      answer: '生成的图片不符合预期时，可以尝试调整图片样式，比如是否开启了表关联显示，如果没有相关配置选项，请反馈。在开启表关联显示下，如果SQL中有外键，请确保外键关联的表也存在。比如学生关联班级，请确保学生表和班级表同时出现。如果学生表中有外键关联班级表，班级表不存在则无法生成。如果解析成功但没有生成图片，可尝试右上角的重置按钮，然后重新解析。'
    },
    {
      question: '常见的SQL格式错误',
      answer: '1. 使用中文逗号或分号\n2. 每张表定义的末尾没有分号\n3. 最后一个字段定义多了个逗号\n4. 索引没有命名\n5. 使用了PostgreSQL语法\n6. 外键定义格式错误'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">SQL转ER图在线生成工具</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="text-dark hover:text-primary">首页</a></li>
              <li><a href="/docs" className="text-primary font-medium">文档</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* 标签页 */}
          <div className="mb-6">
            <ul className="flex space-x-4 border-b">
              <li>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`py-2 px-4 border-b-2 ${activeTab === 'guide' ? 'border-primary text-primary' : 'border-transparent text-dark hover:text-primary'}`}
                >
                  使用指南
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`py-2 px-4 border-b-2 ${activeTab === 'faq' ? 'border-primary text-primary' : 'border-transparent text-dark hover:text-primary'}`}
                >
                  常见问题
                </button>
              </li>
            </ul>
          </div>

          {/* 内容区域 */}
          <div className="prose max-w-none">
            {activeTab === 'guide' ? (
              <div>
                <h2 className="text-xl font-bold mb-4">如何使用在线SQL转ER图工具</h2>
                
                <h3 className="text-lg font-semibold mb-2">1. SQL生成ER图</h3>
                <p className="mb-4">在输入区粘贴您的SQL建表语句，或点击云图标直接上传SQL文件，系统将立即开启sql生成er图流程。无论是多表关联还是复杂的约束，这款er图生成工具都能精准识别并渲染出标准的数据库er图作品。</p>
                
                <h3 className="text-lg font-semibold mb-2">2. AI生成ER图与手动调整</h3>
                <p className="mb-4">如果您只有模糊的想法，可以使用ai生成er图功能。输入中文需求，AI将为您自动设计并绘制初步的实体关系图。随后您可以通过"手动输入"模式，利用er图在线绘制功能对细节进行微调。遇到没有外键的SQL？点击"关联关系"页签下的"AI智能添加关系"瞬间补全连线。字段命名不规范？"AI文本优化"帮您一键润色。</p>
                
                <h3 className="text-lg font-semibold mb-2">3. ER图在线绘制与交互</h3>
                <p className="mb-4">我们的在线er图工具支持自由拖拽和节点交互。当您在进行er图在线生成时，可以随时修改实体名称、增删字段，所有的变动都会实时反馈在画布上，让er图绘制变得像搭积木一样简单。</p>
                
                <h3 className="text-lg font-semibold mb-2">4. 智能排版与布局</h3>
                <p className="mb-4">图表太乱，担心er图怎么画才好看？点击"美化排版"一键自动整理。需要精细调整时，利用"隐藏属性"功能排除干扰，专注于实体位置摆放；调整完毕后点击"智能显示属性"，属性节点会自动以最优美观的方式围绕实体排列。</p>
                
                <h3 className="text-lg font-semibold mb-2">5. 个性化定制与导出</h3>
                <p className="mb-4">通过"修改样式"自定义节点大小、颜色、字体及主键显示方式等。制作完成后，支持导出PNG、JPEG、SVG及Drawio格式。一张原本可能需要画一整天的ER图，现在通过这款专业的er图绘制工具瞬间即可完成。</p>
                
                <h2 className="text-xl font-bold mb-4">ER图绘制工具使用小贴士</h2>
                <ul className="list-disc pl-5 mb-4">
                  <li>确保SQL语句尽量标准，支持MySQL语法</li>
                  <li>使用"AI文本优化"功能，自动修复不规范命名，让ER图更专业</li>
                  <li>善用AI生成ER图功能，可以快速为您构思复杂的数据库er图原型</li>
                  <li>结合"美化排版"与"智能显示属性"功能，快速调整节点位置，获得完美布局</li>
                  <li>导出SVG格式可获得最高清晰度，Drawio格式方便在其他专业软件中二次编辑</li>
                  <li>如果觉得工具好用，别忘了分享给你的伙伴哦！</li>
                </ul>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">常见问题</h2>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                      <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center">
                        <span className="font-medium">{item.question}</span>
                        <span className="text-gray-500">+</span>
                      </button>
                      <div className="p-4 bg-white">
                        <p className="whitespace-pre-line">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default Docs;