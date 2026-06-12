import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Testimonial } from '../../../core/models/content.models';
import { ContentService } from '../../../core/services/content.service';
import { MediaUploaderComponent } from '../../components/media-uploader/media-uploader.component';

type TestimonialForm = Omit<Testimonial, 'id'> & { id: string };

@Component({
  selector: 'app-testimonials-manager-page',
  imports: [FormsModule, MediaUploaderComponent],
  template: `
    <section class="grid gap-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">Testimonials</p>
          <h1 class="mt-2 text-3xl font-black">إدارة آراء العملاء</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="startCreate()">رأي جديد</button>
      </div>

      @if (error()) { <p class="rounded-lg bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p> }

      @if (editing()) {
        <form class="grid gap-4 rounded-lg bg-white p-5 shadow-sm" (ngSubmit)="save()">
          <div class="grid gap-4 md:grid-cols-4">
            <label class="grid gap-2 font-black">الاسم <input class="rounded-lg border border-slate-300 px-3 py-3" name="author_name" [(ngModel)]="form.author_name" required /></label>
            <label class="grid gap-2 font-black">الصفة <input class="rounded-lg border border-slate-300 px-3 py-3" name="role" [(ngModel)]="form.role" required /></label>
            <label class="grid gap-2 font-black">التقييم <input class="rounded-lg border border-slate-300 px-3 py-3" name="rating" [(ngModel)]="form.rating" type="number" min="1" max="5" /></label>
            <label class="grid gap-2 font-black">ترتيب العرض <input class="rounded-lg border border-slate-300 px-3 py-3" name="sort_order" [(ngModel)]="form.sort_order" type="number" /></label>
          </div>
          <label class="grid gap-2 font-black">الرأي <textarea class="min-h-28 rounded-lg border border-slate-300 px-3 py-3" name="quote" [(ngModel)]="form.quote" required></textarea></label>
          <label class="flex items-center gap-3 font-black"><input type="checkbox" name="is_published" [(ngModel)]="form.is_published" /> منشور</label>
          <app-media-uploader label="رفع صورة صاحب الرأي" folder="testimonials" (uploaded)="form.image_url = $event" />
          @if (form.image_url) { <p class="text-sm font-bold text-slate-500">{{ form.image_url }}</p> }
          <div class="flex flex-wrap gap-3">
            <button class="mada-btn mada-btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'جاري الحفظ...' : 'حفظ' }}</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="cancel()">إلغاء</button>
          </div>
        </form>
      }

      <div class="rounded-lg bg-white shadow-sm" [attr.aria-busy]="loading()">
        @if (loading()) {
          <p class="p-6 text-slate-500">جاري تحميل الآراء...</p>
        } @else if (testimonials().length === 0) {
          <p class="p-6 text-slate-500">لا توجد آراء بعد.</p>
        } @else {
          <div class="grid gap-3 p-4">
            @for (testimonial of testimonials(); track testimonial.id) {
              <article class="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-xl font-black">{{ testimonial.author_name }}</h2>
                    <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">{{ testimonial.rating }}/5</span>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{{ testimonial.sort_order }}</span>
                    <span class="rounded-full px-3 py-1 text-xs font-black" [class]="testimonial.is_published ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-700'">{{ testimonial.is_published ? 'منشور' : 'مسودة' }}</span>
                  </div>
                  <p class="mt-2 text-slate-500">{{ testimonial.role }}</p>
                  <p class="mt-2 leading-7">{{ testimonial.quote }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="edit(testimonial)">تعديل</button>
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="toggle(testimonial)">{{ testimonial.is_published ? 'تحويل لمسودة' : 'نشر' }}</button>
                  <button class="mada-btn bg-red-600 text-white" type="button" (click)="remove(testimonial.id)">حذف</button>
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
export class TestimonialsManagerPage {
  private readonly content = inject(ContentService);
  readonly testimonials = signal<Testimonial[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  form: TestimonialForm = this.blank();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.testimonials.set(await this.content.getTestimonialsAdmin());
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تحميل الآراء.'));
    } finally {
      this.loading.set(false);
    }
  }

  startCreate(): void {
    this.form = this.blank();
    this.editing.set(true);
  }

  edit(testimonial: Testimonial): void {
    this.form = { ...testimonial };
    this.editing.set(true);
  }

  cancel(): void {
    this.form = this.blank();
    this.editing.set(false);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.content.saveTestimonial({ ...this.form, id: this.form.id || undefined });
      this.cancel();
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حفظ الرأي.'));
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(testimonial: Testimonial): Promise<void> {
    try {
      await this.content.toggleTestimonial(testimonial.id, !testimonial.is_published);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تغيير حالة النشر.'));
    }
  }

  async remove(id: string): Promise<void> {
    if (!window.confirm('هل تريد حذف هذا الرأي؟')) {
      return;
    }

    try {
      await this.content.deleteTestimonial(id);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حذف الرأي.'));
    }
  }

  private blank(): TestimonialForm {
    return {
      id: '',
      author_name: '',
      role: '',
      quote: '',
      image_url: null,
      rating: 5,
      is_published: true,
      sort_order: 0
    };
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
