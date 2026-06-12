import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Track } from '../../../core/models/track.models';
import { ContentService } from '../../../core/services/content.service';

interface TrackForm {
  id: string;
  slug: string;
  title: string;
  age: string;
  focus: string;
  tools: string;
  outcome: string;
  description: string;
  sort_order: number;
  is_published: boolean;
}

@Component({
  selector: 'app-tracks-manager-page',
  imports: [FormsModule],
  template: `
    <section class="grid gap-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">Tracks</p>
          <h1 class="mt-2 text-3xl font-black">إدارة المسارات</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="startCreate()">مسار جديد</button>
      </div>

      @if (error()) { <p class="rounded-lg bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p> }

      @if (editing()) {
        <form class="grid gap-4 rounded-lg bg-white p-5 shadow-sm" (ngSubmit)="save()">
          <div class="grid gap-4 md:grid-cols-3">
            <label class="grid gap-2 font-black">الاسم <input class="rounded-lg border border-slate-300 px-3 py-3" name="title" [(ngModel)]="form.title" required /></label>
            <label class="grid gap-2 font-black">Slug <input class="rounded-lg border border-slate-300 px-3 py-3" name="slug" [(ngModel)]="form.slug" required /></label>
            <label class="grid gap-2 font-black">السن <input class="rounded-lg border border-slate-300 px-3 py-3" name="age" [(ngModel)]="form.age" required /></label>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <label class="grid gap-2 font-black">التركيز <input class="rounded-lg border border-slate-300 px-3 py-3" name="focus" [(ngModel)]="form.focus" required /></label>
            <label class="grid gap-2 font-black">الأدوات <input class="rounded-lg border border-slate-300 px-3 py-3" name="tools" [(ngModel)]="form.tools" placeholder="Scratch, Python" /></label>
            <label class="grid gap-2 font-black">ترتيب العرض <input class="rounded-lg border border-slate-300 px-3 py-3" name="sort_order" [(ngModel)]="form.sort_order" type="number" /></label>
          </div>
          <label class="grid gap-2 font-black">المخرج <input class="rounded-lg border border-slate-300 px-3 py-3" name="outcome" [(ngModel)]="form.outcome" required /></label>
          <label class="grid gap-2 font-black">الوصف <textarea class="min-h-28 rounded-lg border border-slate-300 px-3 py-3" name="description" [(ngModel)]="form.description" required></textarea></label>
          <label class="flex items-center gap-3 font-black"><input type="checkbox" name="is_published" [(ngModel)]="form.is_published" /> منشور</label>
          <div class="flex flex-wrap gap-3">
            <button class="mada-btn mada-btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'جاري الحفظ...' : 'حفظ' }}</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="cancel()">إلغاء</button>
          </div>
        </form>
      }

      <div class="rounded-lg bg-white shadow-sm" [attr.aria-busy]="loading()">
        @if (loading()) {
          <p class="p-6 text-slate-500">جاري تحميل المسارات...</p>
        } @else if (tracks().length === 0) {
          <p class="p-6 text-slate-500">لا توجد مسارات بعد.</p>
        } @else {
          <div class="grid gap-3 p-4">
            @for (track of tracks(); track track.id) {
              <article class="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-xl font-black">{{ track.title }}</h2>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{{ track.sort_order }}</span>
                    <span class="rounded-full px-3 py-1 text-xs font-black" [class]="track.is_published ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-700'">{{ track.is_published ? 'منشور' : 'مسودة' }}</span>
                  </div>
                  <p class="mt-2 text-slate-600">{{ track.age }} · {{ track.focus }}</p>
                  <p class="mt-2 text-sm font-bold text-slate-500">{{ track.tools.join('، ') }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="edit(track)">تعديل</button>
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="toggle(track)">{{ track.is_published ? 'تحويل لمسودة' : 'نشر' }}</button>
                  <button class="mada-btn bg-red-600 text-white" type="button" (click)="remove(track.id)">حذف</button>
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
export class TracksManagerPage {
  private readonly content = inject(ContentService);
  readonly tracks = signal<Track[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  form: TrackForm = this.blank();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.tracks.set(await this.content.getTracksAdmin());
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تحميل المسارات.'));
    } finally {
      this.loading.set(false);
    }
  }

  startCreate(): void {
    this.form = this.blank();
    this.editing.set(true);
  }

  edit(track: Track): void {
    this.form = { ...track, tools: track.tools.join(', ') };
    this.editing.set(true);
  }

  cancel(): void {
    this.editing.set(false);
    this.form = this.blank();
  }

  async save(): Promise<void> {
    this.saving.set(true);
    this.error.set('');
    try {
      await this.content.saveTrack({
        id: this.form.id || undefined,
        slug: this.form.slug,
        title: this.form.title,
        age: this.form.age,
        focus: this.form.focus,
        tools: this.form.tools.split(','),
        outcome: this.form.outcome,
        description: this.form.description,
        sort_order: Number(this.form.sort_order) || 0,
        is_published: this.form.is_published
      });
      this.cancel();
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حفظ المسار.'));
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(track: Track): Promise<void> {
    try {
      await this.content.toggleTrack(track.id, !track.is_published);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تغيير حالة النشر.'));
    }
  }

  async remove(id: string): Promise<void> {
    if (!window.confirm('هل تريد حذف هذا المسار؟')) {
      return;
    }

    try {
      await this.content.deleteTrack(id);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حذف المسار.'));
    }
  }

  private blank(): TrackForm {
    return {
      id: '',
      slug: '',
      title: '',
      age: '',
      focus: '',
      tools: '',
      outcome: '',
      description: '',
      sort_order: 0,
      is_published: true
    };
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
