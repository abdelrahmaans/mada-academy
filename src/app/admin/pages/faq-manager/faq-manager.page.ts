import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Faq } from '../../../core/models/content.models';
import { ContentService } from '../../../core/services/content.service';

type FaqForm = Omit<Faq, 'id'> & { id: string };

@Component({
  selector: 'app-faq-manager-page',
  imports: [FormsModule],
  template: `
    <section class="grid gap-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">FAQ</p>
          <h1 class="mt-2 text-3xl font-black">إدارة الأسئلة المتكررة</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="startCreate()">سؤال جديد</button>
      </div>

      @if (error()) { <p class="rounded-lg bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p> }

      @if (editing()) {
        <form class="grid gap-4 rounded-lg bg-white p-5 shadow-sm" (ngSubmit)="save()">
          <div class="grid gap-4 md:grid-cols-[1fr_180px]">
            <label class="grid gap-2 font-black">السؤال <input class="rounded-lg border border-slate-300 px-3 py-3" name="question" [(ngModel)]="form.question" required /></label>
            <label class="grid gap-2 font-black">ترتيب العرض <input class="rounded-lg border border-slate-300 px-3 py-3" name="sort_order" [(ngModel)]="form.sort_order" type="number" /></label>
          </div>
          <label class="grid gap-2 font-black">الإجابة <textarea class="min-h-28 rounded-lg border border-slate-300 px-3 py-3" name="answer" [(ngModel)]="form.answer" required></textarea></label>
          <label class="flex items-center gap-3 font-black"><input type="checkbox" name="is_published" [(ngModel)]="form.is_published" /> منشور</label>
          <div class="flex flex-wrap gap-3">
            <button class="mada-btn mada-btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'جاري الحفظ...' : 'حفظ' }}</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="cancel()">إلغاء</button>
          </div>
        </form>
      }

      <div class="rounded-lg bg-white shadow-sm" [attr.aria-busy]="loading()">
        @if (loading()) {
          <p class="p-6 text-slate-500">جاري تحميل الأسئلة...</p>
        } @else if (faqs().length === 0) {
          <p class="p-6 text-slate-500">لا توجد أسئلة بعد.</p>
        } @else {
          <div class="grid gap-3 p-4">
            @for (faq of faqs(); track faq.id) {
              <article class="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-xl font-black">{{ faq.question }}</h2>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{{ faq.sort_order }}</span>
                    <span class="rounded-full px-3 py-1 text-xs font-black" [class]="faq.is_published ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-700'">{{ faq.is_published ? 'منشور' : 'مسودة' }}</span>
                  </div>
                  <p class="mt-2 leading-7 text-slate-600">{{ faq.answer }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="edit(faq)">تعديل</button>
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="toggle(faq)">{{ faq.is_published ? 'تحويل لمسودة' : 'نشر' }}</button>
                  <button class="mada-btn bg-red-600 text-white" type="button" (click)="remove(faq.id)">حذف</button>
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
export class FaqManagerPage {
  private readonly content = inject(ContentService);
  readonly faqs = signal<Faq[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  form: FaqForm = this.blank();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.faqs.set(await this.content.getFaqsAdmin());
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تحميل الأسئلة.'));
    } finally {
      this.loading.set(false);
    }
  }

  startCreate(): void {
    this.form = this.blank();
    this.editing.set(true);
  }

  edit(faq: Faq): void {
    this.form = { ...faq };
    this.editing.set(true);
  }

  cancel(): void {
    this.form = this.blank();
    this.editing.set(false);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.content.saveFaq({ ...this.form, id: this.form.id || undefined });
      this.cancel();
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حفظ السؤال.'));
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(faq: Faq): Promise<void> {
    try {
      await this.content.toggleFaq(faq.id, !faq.is_published);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تغيير حالة النشر.'));
    }
  }

  async remove(id: string): Promise<void> {
    if (!window.confirm('هل تريد حذف هذا السؤال؟')) {
      return;
    }

    try {
      await this.content.deleteFaq(id);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حذف السؤال.'));
    }
  }

  private blank(): FaqForm {
    return {
      id: '',
      question: '',
      answer: '',
      is_published: true,
      sort_order: 0
    };
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
