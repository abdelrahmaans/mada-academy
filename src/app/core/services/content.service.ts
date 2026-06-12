import { Injectable, inject } from '@angular/core';
import { ContentItem, Faq, GalleryItem, SiteSetting, Testimonial } from '../models/content.models';
import { StarStudent, Track } from '../models/track.models';
import { SupabaseService } from './supabase.service';
import { madaContent, madaFaqs, madaGallery, madaStars, madaTestimonials, madaTracks } from './mada-seed.data';

type CmsTable = 'tracks' | 'stars_board' | 'content_items' | 'gallery_items' | 'testimonials' | 'faqs';
type PublishableCmsItem = { id: string; is_published: boolean; sort_order?: number };
type CmsItem = Track | StarStudent | ContentItem | GalleryItem | Testimonial | Faq;
type CmsInput = TrackInput | StarStudentInput | ContentItemInput | GalleryItemInput | TestimonialInput | FaqInput;

export type TrackInput = Omit<Track, 'id'> & { id?: string };
export type StarStudentInput = Omit<StarStudent, 'id'> & { id?: string };
export type ContentItemInput = Omit<ContentItem, 'id'> & { id?: string };
export type GalleryItemInput = Omit<GalleryItem, 'id'> & { id?: string };
export type TestimonialInput = Omit<Testimonial, 'id'> & { id?: string };
export type FaqInput = Omit<Faq, 'id'> & { id?: string };

const fallbackSettings: Record<string, string> = {
  primary_cta_link: '#lead-hero',
  workshop_cta_link: '#lead-final',
  final_cta_link: '#lead-final',
  whatsapp_number: '+201000000000',
  instagram_url: 'https://instagram.com',
  youtube_url: 'https://youtube.com'
};

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly supabase = inject(SupabaseService);
  private fallbackTracks = [...madaTracks];
  private fallbackStars = [...madaStars];
  private fallbackContent = [...madaContent];
  private fallbackGallery = [...madaGallery];
  private fallbackTestimonials = [...madaTestimonials];
  private fallbackFaqs = [...madaFaqs];

  async tracks(): Promise<Track[]> {
    return this.publicList('tracks', madaTracks);
  }

  async stars(): Promise<StarStudent[]> {
    return this.publicList('stars_board', madaStars);
  }

  async contentItems(): Promise<ContentItem[]> {
    return this.publicList('content_items', madaContent);
  }

  async gallery(): Promise<GalleryItem[]> {
    return this.publicList('gallery_items', madaGallery);
  }

  async testimonials(): Promise<Testimonial[]> {
    return this.publicList('testimonials', madaTestimonials);
  }

  async faqs(): Promise<Faq[]> {
    return this.publicList('faqs', madaFaqs);
  }

  async siteSettings(): Promise<Record<string, string>> {
    if (!this.supabase.isConfigured) {
      return fallbackSettings;
    }

    const { data, error } = await this.supabase.client.from('site_settings').select('key,value');
    if (error || !data) {
      return fallbackSettings;
    }

    return data.reduce<Record<string, string>>((settings, item) => {
      settings[item.key] = item.value;
      return settings;
    }, { ...fallbackSettings });
  }

  async getTracksAdmin(): Promise<Track[]> {
    return this.adminList('tracks', madaTracks);
  }

  async saveTrack(track: TrackInput): Promise<void> {
    const payload = { ...track, tools: this.normalizeTools(track.tools) };
    await this.upsert('tracks', payload);
  }

  async deleteTrack(id: string): Promise<void> {
    await this.remove('tracks', id);
  }

  async toggleTrack(id: string, isPublished: boolean): Promise<void> {
    await this.togglePublished('tracks', id, isPublished);
  }

  async getStarsAdmin(): Promise<StarStudent[]> {
    return this.adminList('stars_board', madaStars);
  }

  async saveStar(star: StarStudentInput): Promise<void> {
    await this.upsert('stars_board', star);
  }

  async deleteStar(id: string): Promise<void> {
    await this.remove('stars_board', id);
  }

  async toggleStar(id: string, isPublished: boolean): Promise<void> {
    await this.togglePublished('stars_board', id, isPublished);
  }

  async getContentItemsAdmin(): Promise<ContentItem[]> {
    return this.adminList('content_items', madaContent);
  }

  async saveContentItem(item: ContentItemInput): Promise<void> {
    await this.upsert('content_items', item);
  }

  async deleteContentItem(id: string): Promise<void> {
    await this.remove('content_items', id);
  }

  async toggleContentItem(id: string, isPublished: boolean): Promise<void> {
    await this.togglePublished('content_items', id, isPublished);
  }

  async getGalleryAdmin(): Promise<GalleryItem[]> {
    return this.adminList('gallery_items', madaGallery);
  }

  async saveGalleryItem(item: GalleryItemInput): Promise<void> {
    await this.upsert('gallery_items', item);
  }

  async deleteGalleryItem(id: string): Promise<void> {
    await this.remove('gallery_items', id);
  }

  async toggleGalleryItem(id: string, isPublished: boolean): Promise<void> {
    await this.togglePublished('gallery_items', id, isPublished);
  }

  async getTestimonialsAdmin(): Promise<Testimonial[]> {
    return this.adminList('testimonials', madaTestimonials);
  }

  async saveTestimonial(testimonial: TestimonialInput): Promise<void> {
    await this.upsert('testimonials', testimonial);
  }

  async deleteTestimonial(id: string): Promise<void> {
    await this.remove('testimonials', id);
  }

  async toggleTestimonial(id: string, isPublished: boolean): Promise<void> {
    await this.togglePublished('testimonials', id, isPublished);
  }

  async getFaqsAdmin(): Promise<Faq[]> {
    return this.adminList('faqs', madaFaqs);
  }

  async saveFaq(faq: FaqInput): Promise<void> {
    await this.upsert('faqs', faq);
  }

  async deleteFaq(id: string): Promise<void> {
    await this.remove('faqs', id);
  }

  async toggleFaq(id: string, isPublished: boolean): Promise<void> {
    await this.togglePublished('faqs', id, isPublished);
  }

  async getSettingsAdmin(): Promise<SiteSetting[]> {
    if (!this.supabase.isConfigured) {
      return Object.entries(fallbackSettings).map(([key, value]) => ({ key, value }));
    }

    const { data, error } = await this.supabase.client.from('site_settings').select('*').order('key');
    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async saveSetting(setting: SiteSetting): Promise<void> {
    if (!this.supabase.isConfigured) {
      fallbackSettings[setting.key] = setting.value;
      return;
    }

    const { error } = await this.supabase.client.from('site_settings').upsert(setting, { onConflict: 'key' });
    if (error) {
      throw new Error(error.message);
    }
  }

  async deleteSetting(key: string): Promise<void> {
    if (!this.supabase.isConfigured) {
      delete fallbackSettings[key];
      return;
    }

    const { error } = await this.supabase.client.from('site_settings').delete().eq('key', key);
    if (error) {
      throw new Error(error.message);
    }
  }

  private async publicList<T extends { is_published?: boolean; sort_order?: number }>(
    table: CmsTable,
    fallback: T[]
  ): Promise<T[]> {
    if (!this.supabase.isConfigured) {
      return this.localList(table)
        .filter((item) => item.is_published !== false)
        .sort(this.bySortOrder) as unknown as T[];
    }

    const { data, error } = await this.supabase.client
      .from(table)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      return fallback.filter((item) => item.is_published !== false).sort(this.bySortOrder);
    }

    return data as unknown as T[];
  }

  private async adminList<T extends { sort_order?: number }>(table: CmsTable, fallback: T[]): Promise<T[]> {
    if (!this.supabase.isConfigured) {
      return this.localList(table).sort(this.bySortOrder) as unknown as T[];
    }

    const { data, error } = await this.supabase.client
      .from(table)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data as unknown as T[];
  }

  private async upsert(table: 'tracks', item: TrackInput): Promise<void>;
  private async upsert(table: 'stars_board', item: StarStudentInput): Promise<void>;
  private async upsert(table: 'content_items', item: ContentItemInput): Promise<void>;
  private async upsert(table: 'gallery_items', item: GalleryItemInput): Promise<void>;
  private async upsert(table: 'testimonials', item: TestimonialInput): Promise<void>;
  private async upsert(table: 'faqs', item: FaqInput): Promise<void>;
  private async upsert(
    table: CmsTable,
    item: TrackInput | StarStudentInput | ContentItemInput | GalleryItemInput | TestimonialInput | FaqInput
  ): Promise<void> {
    if (!this.supabase.isConfigured) {
      this.localUpsert(table, item);
      return;
    }

    const { error } = await this.upsertByTable(table, item);
    if (error) {
      throw new Error(error.message);
    }
  }

  private upsertByTable(
    table: CmsTable,
    item: TrackInput | StarStudentInput | ContentItemInput | GalleryItemInput | TestimonialInput | FaqInput
  ) {
    switch (table) {
      case 'tracks':
        return this.supabase.client.from('tracks').upsert(item as TrackInput);
      case 'stars_board':
        return this.supabase.client.from('stars_board').upsert(item as StarStudentInput);
      case 'content_items':
        return this.supabase.client.from('content_items').upsert(item as ContentItemInput);
      case 'gallery_items':
        return this.supabase.client.from('gallery_items').upsert(item as GalleryItemInput);
      case 'testimonials':
        return this.supabase.client.from('testimonials').upsert(item as TestimonialInput);
      case 'faqs':
        return this.supabase.client.from('faqs').upsert(item as FaqInput);
    }
  }

  private async remove(table: CmsTable, id: string): Promise<void> {
    if (!this.supabase.isConfigured) {
      this.setLocalList(
        table,
        this.localList(table).filter((item) => item.id !== id)
      );
      return;
    }

    const { error } = await this.supabase.client.from(table).delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }

  private async togglePublished(table: CmsTable, id: string, isPublished: boolean): Promise<void> {
    if (!this.supabase.isConfigured) {
      this.setLocalList(
        table,
        this.localList(table).map((item) => (item.id === id ? { ...item, is_published: isPublished } : item))
      );
      return;
    }

    const patch: Pick<PublishableCmsItem, 'is_published'> = { is_published: isPublished };
    const { error } = await this.supabase.client.from(table).update(patch).eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }

  private normalizeTools(tools: string[]): string[] {
    return tools.map((tool) => tool.trim()).filter(Boolean);
  }

  private localUpsert(table: CmsTable, item: CmsInput): void {
    const list = this.localList(table);
    const itemWithId = { ...item, id: item.id || crypto.randomUUID() } as CmsItem;
    const existingIndex = list.findIndex((entry) => entry.id === itemWithId.id);
    const next = [...list];

    if (existingIndex >= 0) {
      next[existingIndex] = itemWithId;
    } else {
      next.unshift(itemWithId);
    }

    this.setLocalList(table, next);
  }

  private localList(table: CmsTable): CmsItem[] {
    switch (table) {
      case 'tracks':
        return this.fallbackTracks;
      case 'stars_board':
        return this.fallbackStars;
      case 'content_items':
        return this.fallbackContent;
      case 'gallery_items':
        return this.fallbackGallery;
      case 'testimonials':
        return this.fallbackTestimonials;
      case 'faqs':
        return this.fallbackFaqs;
    }
  }

  private setLocalList(table: CmsTable, items: CmsItem[]): void {
    switch (table) {
      case 'tracks':
        this.fallbackTracks = items as Track[];
        return;
      case 'stars_board':
        this.fallbackStars = items as StarStudent[];
        return;
      case 'content_items':
        this.fallbackContent = items as ContentItem[];
        return;
      case 'gallery_items':
        this.fallbackGallery = items as GalleryItem[];
        return;
      case 'testimonials':
        this.fallbackTestimonials = items as Testimonial[];
        return;
      case 'faqs':
        this.fallbackFaqs = items as Faq[];
        return;
    }
  }

  private bySortOrder<T extends { sort_order?: number }>(a: T, b: T): number {
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  }
}
