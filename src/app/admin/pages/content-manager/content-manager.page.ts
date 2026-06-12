import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentItem } from '../../../core/models/content.models';
import { ContentService } from '../../../core/services/content.service';
import { MediaUploaderComponent } from '../../components/media-uploader/media-uploader.component';

type Platform = ContentItem['platform'];
type ContentForm = Omit<ContentItem, 'id'> & { id: string };

@Component({
  selector: 'app-content-manager-page',
  imports: [FormsModule, MediaUploaderComponent],
  template: `
    <section class="grid gap-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">Content</p>
          <h1 class="mt-2 text-3xl font-black">إدارة الريلز والمحتوى</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="startCreate()">محتوى جديد</button>
      </div>

      @if (error()) { <p class="rounded-lg bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p> }

      @if (editing()) {
        <form class="grid gap-4 rounded-lg bg-white p-5 shadow-sm" (ngSubmit)="save()">
          <div class="grid gap-4 md:grid-cols-3">
            <label class="grid gap-2 font-black">العنوان <input class="rounded-lg border border-slate-300 px-3 py-3" name="title" [(ngModel)]="form.title" required /></label>
            <label class="grid gap-2 font-black">التصنيف <input class="rounded-lg border border-slate-300 px-3 py-3" name="category" [(ngModel)]="form.category" required /></label>
            <label class="grid gap-2 font-black">
              المنصة
              <select class="rounded-lg border border-slate-300 px-3 py-3" name="platform" [(ngModel)]="form.platform">
                @for (platform of platforms; track platform) { <option [value]="platform">{{ platform }}</option> }
              </select>
            </label>
          </div>
          <div class="grid gap-4 md:grid-cols-[1fr_180px]">
            <label class="grid gap-2 font-black">الرابط الخارجي <input class="rounded-lg border border-slate-300 px-3 py-3" name="external_link" [(ngModel)]="form.external_link" required /></label>
            <label class="grid gap-2 font-black">ترتيب العرض <input class="rounded-lg border border-slate-300 px-3 py-3" name="sort_order" [(ngModel)]="form.sort_order" type="number" /></label>
          </div>
          <label class="flex items-center gap-3 font-black"><input type="checkbox" name="is_published" [(ngModel)]="form.is_published" /> منشور</label>
          <app-media-uploader label="رفع صورة مصغرة" folder="content-thumbnails" (uploaded)="form.thumbnail_url = $event" />
          @if (form.thumbnail_url) { <p class="text-sm font-bold text-slate-500">{{ form.thumbnail_url }}</p> }
          <div class="flex flex-wrap gap-3">
            <button class="mada-btn mada-btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'جاري الحفظ...' : 'حفظ' }}</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="cancel()">إلغاء</button>
          </div>
        </form>
      }

      <div class="rounded-lg bg-white shadow-sm" [attr.aria-busy]="loading()">
        @if (loading()) {
          <p class="p-6 text-slate-500">جاري تحميل المحتوى...</p>
        } @else if (items().length === 0) {
          <p class="p-6 text-slate-500">لا توجد عناصر محتوى بعد.</p>
        } @else {
          <div class="grid gap-3 p-4">
            @for (item of items(); track item.id) {
              <article class="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-xl font-black">{{ item.title }}</h2>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{{ item.platform }}</span>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{{ item.sort_order }}</span>
                    <span class="rounded-full px-3 py-1 text-xs font-black" [class]="item.is_published ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-700'">{{ item.is_published ? 'منشور' : 'مسودة' }}</span>
                  </div>
                  <p class="mt-2 text-slate-600">{{ item.category }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="edit(item)">تعديل</button>
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="toggle(item)">{{ item.is_published ? 'تحويل لمسودة' : 'نشر' }}</button>
                  <button class="mada-btn bg-red-600 text-white" type="button" (click)="remove(item.id)">حذف</button>
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
export class ContentManagerPage {
  private readonly content = inject(ContentService);
  readonly items = signal<ContentItem[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  readonly platforms: Platform[] = ['instagram', 'tiktok', 'youtube', 'blog'];
  form: ContentForm = this.blank();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.items.set(await this.content.getContentItemsAdmin());
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تحميل المحتوى.'));
    } finally {
      this.loading.set(false);
    }
  }

  startCreate(): void {
    this.form = this.blank();
    this.editing.set(true);
  }

  edit(item: ContentItem): void {
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
      await this.content.saveContentItem({ ...this.form, id: this.form.id || undefined });
      this.cancel();
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حفظ المحتوى.'));
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(item: ContentItem): Promise<void> {
    try {
      await this.content.toggleContentItem(item.id, !item.is_published);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تغيير حالة النشر.'));
    }
  }

  async remove(id: string): Promise<void> {
    if (!window.confirm('هل تريد حذف عنصر المحتوى؟')) {
      return;
    }

    try {
      await this.content.deleteContentItem(id);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حذف المحتوى.'));
    }
  }

  private blank(): ContentForm {
    return {
      id: '',
      title: '',
      category: '',
      thumbnail_url: null,
      platform: 'instagram',
      external_link: '',
      is_published: true,
      sort_order: 0
    };
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
