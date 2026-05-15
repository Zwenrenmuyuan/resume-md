export interface Link {
  id: string;
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: Link[];
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
