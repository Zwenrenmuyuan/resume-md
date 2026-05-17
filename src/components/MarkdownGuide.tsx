export function MarkdownGuide() {
  return (
    <div className="markdown-guide-page">
      <section className="markdown-guide-hero">
        <p className="markdown-guide-eyebrow">Markdown 模式说明</p>
        <h2>把简历当成一份 Markdown 文档来写</h2>
        <p>
          这里适合已经熟悉 Markdown、想直接控制简历结构和文字的人。说明页只覆盖 Markdown 写法、头像规则、保存和打印注意事项。
        </p>
      </section>

      <section className="markdown-guide-section">
        <h3>推荐完整骨架</h3>
        <p>
          这份结构和当前预览样式最匹配:姓名、联系方式、简介、经历区块、具体条目、成果列表。
        </p>
        <pre>{`# 张三
邮箱: zhangsan@example.com · 电话: 138-0000-0000 · GitHub: github.com/zhangsan · 上海

> 5 年全栈开发经验,擅长 React / Node.js,主导过日活 50 万级产品的前端架构。

## 工作经历

### XX 科技 — 高级前端工程师 *2023-06 - 至今*
- 主导公司主站从 Vue 2 迁移至 React 18,构建产物体积下降 38%
- 设计并落地组件库,覆盖 5 条业务线,沉淀 80+ 篇内部文档

### YY 互联网 — 前端工程师 *2021-07 - 2023-05*
- 负责电商交易链路前端,支撑双十一峰值 QPS 12k

## 项目经历

### 开源项目 awesome-resume *2024*
- 一个基于 React 的简历生成器,支持 Markdown 编辑、PDF 导出

## 技能清单

- **语言**: TypeScript / JavaScript / Python
- **前端**: React、Vue、Vite、Webpack`}</pre>
      </section>

      <section className="markdown-guide-section">
        <h3>标题层级和预览样式</h3>
        <div className="markdown-guide-table">
          <div><code># 姓名</code><span>简历主标题,通常只写一次,会居中显示。</span></div>
          <div><code># 后第一段</code><span>适合写邮箱、电话、链接、地点,会作为联系方式居中显示。</span></div>
          <div><code>&gt; 简介</code><span>适合写 1 到 2 句话的个人摘要,会显示为简介块。</span></div>
          <div><code>## 区块</code><span>用于教育经历、工作经历、项目经历、技能清单等大区块。</span></div>
          <div><code>### 条目 *时间*</code><span>用于公司、学校、项目;标题里的斜体时间会显示在右侧。</span></div>
          <div><code>- 成果</code><span>推荐每条只写一个职责、动作或结果,方便招聘方快速扫读。</span></div>
        </div>
      </section>

      <section className="markdown-guide-section">
        <h3>常用语法写法</h3>
        <div className="markdown-guide-examples">
          <div>
            <strong>强调关键词</strong>
            <code>主导 **React 18 迁移**,首屏 LCP 从 3.2s 优化到 1.4s</code>
          </div>
          <div>
            <strong>项目或作品链接</strong>
            <code>[GitHub](https://github.com/you/project)</code>
          </div>
          <div>
            <strong>成果列表</strong>
            <code>- 建设组件库,覆盖 5 条业务线</code>
          </div>
          <div>
            <strong>技能分组</strong>
            <code>- **前端**: React、Vue、Vite、Webpack</code>
          </div>
          <div>
            <strong>分隔线</strong>
            <code>---</code>
          </div>
          <div>
            <strong>表格</strong>
            <code>| 技能 | 熟练度 |</code>
          </div>
        </div>
        <p className="markdown-guide-note">
          支持 GFM 表格,但简历中建议谨慎使用。表格内容过宽时,打印成 PDF 更容易换行或溢出。
        </p>
      </section>

      <section className="markdown-guide-section">
        <h3>头像规则</h3>
        <ul>
          <li>头像通过顶部“上传头像”按钮处理,支持 JPEG、PNG、WebP。</li>
          <li>上传后会压缩为 JPEG data URL,并自动写入 Markdown 第一行。</li>
          <li>Markdown 模式只识别第一行的 <code>![头像](...)</code> 作为头像。</li>
          <li>头像行在编辑器中会被折叠成头像卡片,可以点“展开源码”查看原始内容。</li>
          <li>如果手动编辑头像语法,不要在它前面添加空行、标题或正文。</li>
        </ul>
        <pre>{`![头像](data:image/jpeg;base64,...)

# 张三`}</pre>
      </section>

      <section className="markdown-guide-section">
        <h3>写作建议</h3>
        <ul>
          <li>优先写量化结果,例如“体积下降 38%”“覆盖 5 条业务线”。</li>
          <li>每条列表控制在一行到两行内,避免大段叙述。</li>
          <li>经历条目建议保持“公司/项目 + 角色 + 时间 + 成果列表”的固定结构。</li>
          <li>链接文字尽量短,长 URL 放进链接地址里,不要直接铺在正文中。</li>
          <li>不要滥用一级标题,否则简历层级会变乱。</li>
        </ul>
      </section>

      <section className="markdown-guide-section">
        <h3>导入、导出和保存</h3>
        <ul>
          <li>Markdown 内容会自动保存到浏览器 localStorage 的 <code>resumemd:content</code>。</li>
          <li>导入和下载使用 <code>.md</code> 文件,适合在本地版本管理或继续手写编辑。</li>
          <li>重置会把当前 Markdown 内容恢复为默认模板,操作前会弹确认框。</li>
          <li>如果需要长期备份,建议下载 <code>.md</code> 文件,不要只依赖浏览器缓存。</li>
        </ul>
      </section>

      <section className="markdown-guide-section">
        <h3>PDF 打印检查</h3>
        <ul>
          <li>导出 PDF 调用的是浏览器打印,不是服务端生成 PDF。</li>
          <li>打印前先看右侧预览,确认头像没有遮挡姓名或简介。</li>
          <li>检查长链接、表格、代码块是否过宽。</li>
          <li>如果分页不理想,优先缩短列表项或减少表格,不要依赖手动空行硬凑。</li>
        </ul>
      </section>
    </div>
  );
}
