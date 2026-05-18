export interface ResumeSettings {
  profileFontSize: number; // 个人信息字号(以姓名 h1 为基准),px
  headingFontSize: number; // 标题字号(以 h2 为基准),px
  bodyFontSize: number; // 正文字号,px
  sectionGap: number; // h2 上边距,px
  paragraphGap: number; // p 上下边距,px
  listItemGap: number; // li 上下边距,px
  lineHeight: number; // 整体行高,无单位
}

export const DEFAULT_SETTINGS: ResumeSettings = {
  profileFontSize: 30,
  headingFontSize: 16,
  bodyFontSize: 14,
  sectionGap: 26,
  paragraphGap: 8,
  listItemGap: 3,
  lineHeight: 1.7,
};

export const SETTINGS_RANGE = {
  profileFontSize: { min: 22, max: 40, step: 1, unit: 'px', label: '个人信息字号' },
  headingFontSize: { min: 12, max: 22, step: 0.5, unit: 'px', label: '标题字号' },
  bodyFontSize: { min: 12, max: 18, step: 0.5, unit: 'px', label: '正文字号' },
  sectionGap: { min: 8, max: 48, step: 1, unit: 'px', label: '块之间间距' },
  paragraphGap: { min: 2, max: 24, step: 1, unit: 'px', label: '段落间距' },
  listItemGap: { min: 0, max: 14, step: 1, unit: 'px', label: '列表项间距' },
  lineHeight: { min: 1.3, max: 2.2, step: 0.05, unit: '', label: '行高' },
} as const;

export function applySettingsToCss(s: ResumeSettings) {
  const root = document.documentElement.style;
  root.setProperty('--resume-profile-size', `${s.profileFontSize}px`);
  root.setProperty('--resume-heading-size', `${s.headingFontSize}px`);
  root.setProperty('--resume-body-size', `${s.bodyFontSize}px`);
  root.setProperty('--resume-section-gap', `${s.sectionGap}px`);
  root.setProperty('--resume-paragraph-gap', `${s.paragraphGap}px`);
  root.setProperty('--resume-list-item-gap', `${s.listItemGap}px`);
  root.setProperty('--resume-line-height', String(s.lineHeight));
}
