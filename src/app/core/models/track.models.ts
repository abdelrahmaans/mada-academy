export interface Track {
  id: string;
  slug: string;
  title: string;
  age: string;
  focus: string;
  tools: string[];
  outcome: string;
  description: string;
  is_published: boolean;
  sort_order: number;
}

export interface StarStudent {
  id: string;
  student_name: string;
  avatar_url: string | null;
  track: string;
  badge: string;
  xp: number;
  project: string;
  quote: string;
  highlight_reason: string;
  is_published: boolean;
  sort_order: number;
}
