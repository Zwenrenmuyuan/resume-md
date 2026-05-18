import { buildDefaultHeaderRows } from '../utils/headerLayout';
import { newId } from '../utils/id';
import type { ResumeSchema } from '../types/schema';

export function buildDefaultSchema(): ResumeSchema {
  const headerItems = [
    {
      id: newId('h_'),
      label: '邮箱',
      kind: 'text' as const,
      value: 'username@example.com',
      showLabel: false,
    },
    {
      id: newId('h_'),
      label: '电话',
      kind: 'text' as const,
      value: '138-0000-0000',
      showLabel: false,
    },
    {
      id: newId('h_'),
      label: 'GitHub',
      kind: 'link' as const,
      value: 'github.com/username',
      href: 'https://github.com/username',
      showLabel: false,
    },
    {
      id: newId('h_'),
      label: '地点',
      kind: 'text' as const,
      value: '上海',
      showLabel: false,
    },
  ];

  return {
    profile: {
      name: 'XXX',
      avatarSrc: '',
      headerItems,
      headerRows: buildDefaultHeaderRows(headerItems),
      summary:
        '2026 届数据科学与大数据技术本科生，熟悉 Python / SQL / 数据分析基础，关注数据产品、前端可视化与工程化实践。',
    },
    sections: [
      {
        id: newId('s_'),
        type: 'timeline',
        title: '教育经历',
        items: [
          {
            id: newId('i_'),
            title: 'XX大学',
            subtitle: '数据科学与大数据技术 · 本科',
            start: '2022.09',
            end: '2026.06',
            description:
              '- GPA 3.7 / 4.0，专业排名前 15%\n- 主修课程：概率论与数理统计、数据库系统、数据挖掘、机器学习、数据可视化\n- 参与校内数据分析竞赛与课程项目，负责数据清洗、建模分析和结果展示',
          },
        ],
      },
      {
        id: newId('s_'),
        type: 'timeline',
        title: '实习经历',
        items: [
          {
            id: newId('i_'),
            title: 'XX 科技',
            subtitle: '数据分析实习生',
            start: '2025.06',
            end: '2025.09',
            description:
              '- 协助整理业务数据口径，使用 SQL 完成数据提取、清洗和基础统计分析\n- 基于 Python 生成周报数据表，减少手动整理时间，提升数据复盘效率\n- 参与数据看板需求梳理，输出指标说明和异常数据排查记录',
          },
          {
            id: newId('i_'),
            title: 'XX 信息技术',
            subtitle: '前端开发实习生',
            start: '2024.07',
            end: '2024.09',
            description:
              '- 参与后台管理页面开发，完成列表筛选、表单录入和基础可视化组件\n- 配合后端完成接口联调，整理常见字段校验和错误提示规则\n- 根据反馈优化页面交互细节，提升表单填写和数据查看体验',
          },
        ],
      },
      {
        id: newId('s_'),
        type: 'timeline',
        title: '项目经历',
        items: [
          {
            id: newId('i_'),
            title: '课程项目：学生成绩分析系统',
            subtitle: '课程项目',
            start: '2025',
            end: '',
            description:
              '- 使用 Python 对模拟成绩数据进行清洗、分组统计和趋势分析\n- 设计可视化图表展示课程通过率、成绩分布和重点关注学生名单\n- 输出分析报告，说明数据处理流程、结论和改进建议',
          },
          {
            id: newId('i_'),
            title: '课程项目：校园服务数据看板',
            subtitle: '课程项目',
            start: '2024',
            end: '',
            description:
              '- 使用 React 搭建数据看板页面，展示访问量、服务分类和用户反馈趋势\n- 设计筛选、搜索和明细查看功能，支持按时间范围和服务类型查看数据\n- 使用组件化方式拆分页面模块，便于后续扩展图表和指标卡片',
          },
        ],
      },
      {
        id: newId('s_'),
        type: 'freeform',
        title: '技能清单',
        body:
          '- **语言**：Python / SQL / TypeScript / JavaScript\n' +
          '- **数据分析**：Pandas、NumPy、Matplotlib、基础机器学习建模\n' +
          '- **数据库**：MySQL、PostgreSQL、数据库设计与常用查询优化\n' +
          '- **前端**：React、Vite、ECharts、HTML / CSS\n' +
          '- **其他**：Git、Linux 基础、Markdown 文档写作',
      },
      {
        id: newId('s_'),
        type: 'freeform',
        title: '自我评价',
        body:
          '学习主动，重视数据分析过程中的口径一致性和结果可解释性。能够独立完成资料整理、问题拆解和文档输出，也愿意在项目中承担沟通协调和落地实现工作。',
      },
    ],
  };
}
