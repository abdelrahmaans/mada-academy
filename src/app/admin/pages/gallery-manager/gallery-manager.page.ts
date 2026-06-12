import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GalleryItem } from '../../../core/models/content.models';
import { ContentService } from '../../../core/services/content.service';
import { MediaUploaderComponent } from '../../components/media-uploader/media-uploader.component';

type GalleryForm = Omit<GalleryItem, 'id'> & { id: string };

@Component({
  selector: 'app-gallery-manager-page',
  imports: [FormsModule, MediaUploaderComponent, NgOptimizedImage],
  template: `
    <section class="grid gap-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">Gallery</p>
          <h1 class="mt-2 text-3xl font-black">إدارة المعرض</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="startCreate()">عنصر جديد</button>
      </div>

      @if (error()) { <p class="rounded-lg bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p> }

      @if (editing()) {
        <form class="grid gap-4 rounded-lg bg-white p-5 shadow-sm" (ngSubmit)="save()">
          <div class="grid gap-4 md:grid-cols-3">
            <label class="grid gap-2 font-black">العنوان <input class="rounded-lg border border-slate-300 px-3 py-3" name="title" [(ngModel)]="form.title" required /></label>
            <label class="grid gap-2 font-black">
              النوع
              <select class="rounded-lg border border-slate-300 px-3 py-3" name="item_type" [(ngModel)]="form.item_type">
                <option value="photo">صورة</option>
                <option value="project">مشروع</option>
                <option value="certificate">شهادة</option>
              </select>
            </label>
            <label class="grid gap-2 font-black">ترتيب العرض <input class="rounded-lg border border-slate-300 px-3 py-3" name="sort_order" [(ngModel)]="form.sort_order" type="number" /></label>
          </div>
          <label class="grid gap-2 font-black">وصف بديل للصورة <input class="rounded-lg border border-slate-300 px-3 py-3" name="alt_text" [(ngModel)]="form.alt_text" required /></label>
          <label class="grid gap-2 font-black">رابط الصورة <input class="rounded-lg border border-slate-300 px-3 py-3" name="image_url" [(ngModel)]="form.image_url" required /></label>
          <label class="flex items-center gap-3 font-black"><input type="checkbox" name="is_published" [(ngModel)]="form.is_published" /> منشور</label>
          <app-media-uploader label="رفع صورة للمعرض" folder="gallery" (uploaded)="form.image_url = $event" />
          <div class="flex flex-wrap gap-3">
            <button class="mada-btn mada-btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'جاري الحفظ...' : 'حفظ' }}</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="cancel()">إلغاء</button>
          </div>
        </form>
      }

      <div class="rounded-lg bg-white shadow-sm" [attr.aria-busy]="loading()">
        @if (loading()) {
          <p class="p-6 text-slate-500">جاري تحميل المعرض...</p>
        } @else if (items().length === 0) {
          <p class="p-6 text-slate-500">لا توجد صور بعد.</p>
        } @else {
          <div class="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            @for (item of items(); track item.id) {
              <article class="overflow-hidden rounded-lg border border-slate-200">
                <div class="relative aspect-[4/3] bg-slate-100">
                  <img [ngSrc]="item.image_url" [alt]="item.alt_text" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" class="object-cover" />
                </div>
                <div class="grid gap-3 p-4">
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-lg font-black">{{ item.title }}</h2>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{{ item.sort_order }}</span>
                    <span class="rounded-full px-3 py-1 text-xs font-black" [class]="item.is_published ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-700'">{{ item.is_published ? 'منشور' : 'مسودة' }}</span>
                  </div>
                  <p class="text-sm text-slate-500">{{ item.item_type }}</p>
                  <div class="flex flex-wrap gap-2">
                    <button class="mada-btn mada-btn-secondary" type="button" (click)="edit(item)">تعديل</button>
                    <button class="mada-btn mada-btn-secondary" type="button" (click)="toggle(item)">{{ item.is_published ? 'تحويل لمسودة' : 'نشر' }}</button>
                    <button class="mada-btn bg-red-600 text-white" type="button" (click)="remove(item.id)">حذف</button>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryManagerPage {
  private readonly content = inject(ContentService);
  readonly items = signal<GalleryItem[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  form: GalleryForm = this.blank();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.items.set(await this.content.getGalleryAdmin());
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تحميل المعرض.'));
    } finally {
      this.loading.set(false);
    }
  }

  startCreate(): void {
    this.form = this.blank();
    this.editing.set(true);
  }

  edit(item: GalleryItem): void {
    this.form = { ...item };
    this.editing.set(true);
  }

  cancel(): void {
    this.form = this.blank();
    this.editing.set(false);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.content.saveGalleryItem({ ...this.form, id: this.form.id || undefined });
      this.cancel();
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حفظ عنصر المعرض.'));
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(item: GalleryItem): Promise<void> {
    try {
      await this.content.toggleGalleryItem(item.id, !item.is_published);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تغيير حالة النشر.'));
    }
  }

  async remove(id: string): Promise<void> {
    if (!window.confirm('هل تريد حذف عنصر المعرض؟')) {
      return;
    }

    try {
      await this.content.deleteGalleryItem(id);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حذف عنصر المعرض.'));
    }
  }

  private blank(): GalleryForm {
    return {
      id: '',
      title: '',
      image_url: '',
      alt_text: '',
      item_type: 'photo',
      is_published: true,
      sort_order: 0
    };
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
