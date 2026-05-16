export type HeaderItemKind = 'text' | 'link';

export interface HeaderItem {
  id: string;
  label: string;
  kind: HeaderItemKind;
  value: string;
  href?: string;
  showLabel: boolean;
}

export interface Profile {
  name: string;
  avatarSrc: string;
  headerItems: HeaderItem[];
  headerRows: string[][];
  summary: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  start: string;
  end: string;
  description: string;
}

export interface TimelineSection {
  id: string;
  type: 'timeline';
  title: string;
  items: TimelineItem[];
}

export interface FreeformSection {
  id: string;
  type: 'freeform';
  title: string;
  body: string;
}

export type Section = TimelineSection | FreeformSection;

export interface ResumeSchema {
  profile: Profile;
  sections: Section[];
}
