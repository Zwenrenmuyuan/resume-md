import { buildDefaultHeaderRows } from '../utils/headerLayout';
import { newId } from '../utils/id';
import type { ResumeSchema } from '../types/schema';

export function buildDefaultSchema(): ResumeSchema {
  const headerItems = [
    {
      id: newId('h_'),
      label: '邮箱',
      kind: 'text' as const,
      value: 'zhangsan@example.com',
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
      value: 'github.com/zhangsan',
      href: 'https://github.com/zhangsan',
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
      name: '张三',
      avatarSrc: '',
      headerItems,
      headerRows: buildDefaultHeaderRows(headerItems),
      summary:
        '5 年全栈开发经验,擅长 React / Node.js,主导过日活 50 万级产品的前端架构。追求简洁、可维护的工程实践。',
    },
    sections: [
      {
        id: newId('s_'),
        type: 'timeline',
        title: '教育经历',
        items: [
          {
            id: newId('i_'),
            title: '复旦大学',
            subtitle: '计算机科学与技术 · 本科',
            start: '2017-09',
            end: '2021-06',
            description:
              '- GPA 3.7 / 4.0,专业排名前 15%\n- 主修课程:算法与数据结构、操作系统、计算机网络、数据库系统\n- 校优秀毕业生 / 国家奖学金(2019)',
          },
        ],
      },
      {
        id: newId('s_'),
        type: 'timeline',
        title: '工作经历',
        items: [
          {
            id: newId('i_'),
            title: 'XX 科技',
            subtitle: '高级前端工程师',
            start: '2023-06',
            end: '至今',
            description:
              '- 主导公司主站从 Vue 2 迁移至 React 18,构建产物体积下降 38%,首屏 LCP 从 3.2s 优化到 1.4s\n- 设计并落地组件库(30+ 通用组件),覆盖 5 条业务线,沉淀 80+ 篇内部文档\n- 推动单元测试覆盖率从 18% 提升至 76%,建立 PR 准入流水线',
          },
          {
            id: newId('i_'),
            title: 'YY 互联网',
            subtitle: '前端工程师',
            start: '2021-07',
            end: '2023-05',
            description:
              '- 负责电商交易链路前端,支撑双十一峰值 QPS 12k,活动期间零线上事故\n- 实现可视化埋点 SDK,被 4 个业务团队采用,节省人工埋点工时约 200h/季度',
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
            title: '开源项目 awesome-resume',
            subtitle: '个人项目',
            start: '2024',
            end: '',
            description:
              '- 一个基于 React 的简历生成器,支持 Markdown 编辑、PDF 导出\n- GitHub 1.2k stars,被多个求职社群推荐',
          },
          {
            id: newId('i_'),
            title: '公司内部低代码平台',
            subtitle: '主力开发',
            start: '2022',
            end: '',
            description:
              '- 拖拽生成表单/列表页,覆盖 60% 后台需求,单页面平均开发耗时从 2 天降到 2 小时\n- 设计了基于 JSON Schema 的组件协议,支持自定义扩展',
          },
        ],
      },
      {
        id: newId('s_'),
        type: 'freeform',
        title: '技能清单',
        body:
          '- **语言**:TypeScript / JavaScript / Python / Go(熟悉)\n' +
          '- **前端**:React、Vue、Vite、Webpack、TailwindCSS、CSS-in-JS\n' +
          '- **后端**:Node.js(Express / Nest)、PostgreSQL、Redis\n' +
          '- **工程化**:Monorepo(pnpm / Turborepo)、CI/CD(GitHub Actions)、单元测试(Vitest / Jest)\n' +
          '- **其他**:Linux、Docker、性能优化、可访问性(a11y)',
      },
      {
        id: newId('s_'),
        type: 'freeform',
        title: '自我评价',
        body:
          '热爱解决"难且正确"的问题,相信简洁的代码胜过聪明的代码。乐于分享,在团队内做过 10+ 次技术分享。业余时间维护开源项目,长期关注前端工程化和 DX 提升。',
      },
    ],
  };
}
