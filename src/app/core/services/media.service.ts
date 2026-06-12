import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly supabase = inject(SupabaseService);

  async uploadImage(file: File, bucket = 'mada-media', folder = 'cms'): Promise<{ url: string | null; error: string | null }> {
    if (!this.supabase.isConfigured) {
      return { url: URL.createObjectURL(file), error: null };
    }

    const safeName = file.name.replace(/[^\w.-]+/g, '-').toLowerCase();
    const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await this.supabase.client.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data } = this.supabase.client.storage.from(bucket).getPublicUrl(path);
    await this.supabase.client.from('media_library').insert({
      file_name: file.name,
      public_url: data.publicUrl,
      bucket,
      path,
      mime_type: file.type,
      size_bytes: file.size
    });

    return { url: data.publicUrl, error: null };
  }
}
