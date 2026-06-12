export interface ContentItem {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string | null;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'blog';
  external_link: string;
  is_published: boolean;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  alt_text: string;
  item_type: 'photo' | 'project' | 'certificate';
  is_published: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  role: string;
  quote: string;
  image_url: string | null;
  rating: number;
  is_published: boolean;
  sort_order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  body: string;
  is_enabled: boolean;
  sort_order: number;
}

export interface MediaLibraryItem {
  id: string;
  file_name: string;
  public_url: string;
  bucket: string;
  path: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}
