export interface ResumeSettings {
  sectionGap: number; // h2 上边距,px
  paragraphGap: number; // p 上下边距,px
  listItemGap: number; // li 上下边距,px
  lineHeight: number; // 整体行高,无单位
}

export const DEFAULT_SETTINGS: ResumeSettings = {
  sectionGap: 26,
  paragraphGap: 8,
  listItemGap: 3,
  lineHeight: 1.7,
};

export const SETTINGS_RANGE = {
  sectionGap: { min: 8, max: 48, step: 1, unit: 'px', label: '块之间间距' },
  paragraphGap: { min: 2, max: 24, step: 1, unit: 'px', label: '段落间距' },
  listItemGap: { min: 0, max: 14, step: 1, unit: 'px', label: '列表项间距' },
  lineHeight: { min: 1.3, max: 2.2, step: 0.05, unit: '', label: '行高' },
} as const;

export function applySettingsToCss(s: ResumeSettings) {
  const root = document.documentElement.style;
  root.setProperty('--resume-section-gap', `${s.sectionGap}px`);
  root.setProperty('--resume-paragraph-gap', `${s.paragraphGap}px`);
  root.setProperty('--resume-list-item-gap', `${s.listItemGap}px`);
  root.setProperty('--resume-line-height', String(s.lineHeight));
}
