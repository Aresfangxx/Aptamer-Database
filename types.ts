export type Language = 'en' | 'cn';

export interface ContentText {
  hero: {
    title: string;
    subtitle: string[];
    timeline: { year: string; event: string }[];
  };
  mission: {
    title: string;
    body: string;
  };
  search: {
    title: string;
    placeholder: string;
    buttons: string[];
  };
  stats: {
    items: { value: string; label: string }[];
    footer: string;
  };
  education: {
    title: string;
    body: string;
  };
  ai: {
    title: string;
    body: string;
  };
  history: {
    items: { year: string; title: string }[];
  };
}