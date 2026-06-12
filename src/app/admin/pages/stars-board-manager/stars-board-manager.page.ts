import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StarStudent } from '../../../core/models/track.models';
import { ContentService } from '../../../core/services/content.service';
import { MediaUploaderComponent } from '../../components/media-uploader/media-uploader.component';

type StarForm = Omit<StarStudent, 'id'> & { id: string };

@Component({
  selector: 'app-stars-board-manager-page',
  imports: [FormsModule, MediaUploaderComponent],
  template: `
    <section class="grid gap-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">Stars Board</p>
          <h1 class="mt-2 text-3xl font-black">إدارة لوحة الإنجازات</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="startCreate()">طالب جديد</button>
      </div>

      @if (error()) { <p class="rounded-lg bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p> }

      @if (editing()) {
        <form class="grid gap-4 rounded-lg bg-white p-5 shadow-sm" (ngSubmit)="save()">
          <div class="grid gap-4 md:grid-cols-3">
            <label class="grid gap-2 font-black">اسم الطالب <input class="rounded-lg border border-slate-300 px-3 py-3" name="student_name" [(ngModel)]="form.student_name" required /></label>
            <label class="grid gap-2 font-black">المسار <input class="rounded-lg border border-slate-300 px-3 py-3" name="track" [(ngModel)]="form.track" required /></label>
            <label class="grid gap-2 font-black">الشارة <input class="rounded-lg border border-slate-300 px-3 py-3" name="badge" [(ngModel)]="form.badge" required /></label>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <label class="grid gap-2 font-black">XP <input class="rounded-lg border border-slate-300 px-3 py-3" name="xp" [(ngModel)]="form.xp" type="number" /></label>
            <label class="grid gap-2 font-black">ترتيب العرض <input class="rounded-lg border border-slate-300 px-3 py-3" name="sort_order" [(ngModel)]="form.sort_order" type="number" /></label>
            <label class="flex items-center gap-3 pt-8 font-black"><input type="checkbox" name="is_published" [(ngModel)]="form.is_published" /> منشور</label>
          </div>
          <label class="grid gap-2 font-black">المشروع <input class="rounded-lg border border-slate-300 px-3 py-3" name="project" [(ngModel)]="form.project" required /></label>
          <label class="grid gap-2 font-black">اقتباس الطالب <textarea class="min-h-24 rounded-lg border border-slate-300 px-3 py-3" name="quote" [(ngModel)]="form.quote" required></textarea></label>
          <label class="grid gap-2 font-black">سبب التميز <textarea class="min-h-24 rounded-lg border border-slate-300 px-3 py-3" name="highlight_reason" [(ngModel)]="form.highlight_reason" required></textarea></label>
          <app-media-uploader label="رفع صورة الطالب" folder="stars" (uploaded)="form.avatar_url = $event" />
          @if (form.avatar_url) { <p class="text-sm font-bold text-slate-500">{{ form.avatar_url }}</p> }
          <div class="flex flex-wrap gap-3">
            <button class="mada-btn mada-btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'جاري الحفظ...' : 'حفظ' }}</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="cancel()">إلغاء</button>
          </div>
        </form>
      }

      <div class="rounded-lg bg-white shadow-sm" [attr.aria-busy]="loading()">
        @if (loading()) {
          <p class="p-6 text-slate-500">جاري تحميل لوحة الإنجازات...</p>
        } @else if (stars().length === 0) {
          <p class="p-6 text-slate-500">لا توجد إنجازات بعد.</p>
        } @else {
          <div class="grid gap-3 p-4">
            @for (star of stars(); track star.id) {
              <article class="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-xl font-black">{{ star.student_name }}</h2>
                    <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">{{ star.xp }} XP</span>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{{ star.sort_order }}</span>
                    <span class="rounded-full px-3 py-1 text-xs font-black" [class]="star.is_published ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-700'">{{ star.is_published ? 'منشور' : 'مسودة' }}</span>
                  </div>
                  <p class="mt-2 text-slate-600">{{ star.track }} · {{ star.badge }} · {{ star.project }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="edit(star)">تعديل</button>
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="toggle(star)">{{ star.is_published ? 'تحويل لمسودة' : 'نشر' }}</button>
                  <button class="mada-btn bg-red-600 text-white" type="button" (click)="remove(star.id)">حذف</button>
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
export class StarsBoardManagerPage {
  private readonly content = inject(ContentService);
  readonly stars = signal<StarStudent[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  form: StarForm = this.blank();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.stars.set(await this.content.getStarsAdmin());
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تحميل لوحة الإنجازات.'));
    } finally {
      this.loading.set(false);
    }
  }

  startCreate(): void {
    this.form = this.blank();
    this.editing.set(true);
  }

  edit(star: StarStudent): void {
    this.form = { ...star };
    this.editing.set(true);
  }

  cancel(): void {
    this.form = this.blank();
    this.editing.set(false);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.content.saveStar({ ...this.form, id: this.form.id || undefined });
      this.cancel();
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حفظ الطالب.'));
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(star: StarStudent): Promise<void> {
    try {
      await this.content.toggleStar(star.id, !star.is_published);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تغيير حالة النشر.'));
    }
  }

  async remove(id: string): Promise<void> {
    if (!window.confirm('هل تريد حذف هذا الطالب من لوحة الإنجازات؟')) {
      return;
    }

    try {
      await this.content.deleteStar(id);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حذف الطالب.'));
    }
  }

  private blank(): StarForm {
    return {
      id: '',
      student_name: '',
      avatar_url: null,
      track: '',
      badge: '',
      xp: 0,
      project: '',
      quote: '',
      highlight_reason: '',
      is_published: true,
      sort_order: 0
    };
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
