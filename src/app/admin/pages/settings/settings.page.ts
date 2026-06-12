import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SiteSetting } from '../../../core/models/content.models';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-settings-page',
  imports: [FormsModule],
  template: `
    <section class="grid gap-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">Settings</p>
          <h1 class="mt-2 text-3xl font-black">إعدادات الموقع</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="startCreate()">إعداد جديد</button>
      </div>

      @if (error()) { <p class="rounded-lg bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p> }

      @if (editing()) {
        <form class="grid gap-4 rounded-lg bg-white p-5 shadow-sm md:grid-cols-[1fr_1.4fr_auto]" (ngSubmit)="save()">
          <label class="grid gap-2 font-black">المفتاح <input class="rounded-lg border border-slate-300 px-3 py-3" name="key" [(ngModel)]="form.key" required /></label>
          <label class="grid gap-2 font-black">القيمة <input class="rounded-lg border border-slate-300 px-3 py-3" name="value" [(ngModel)]="form.value" required /></label>
          <div class="flex items-end gap-2">
            <button class="mada-btn mada-btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'جاري الحفظ...' : 'حفظ' }}</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="cancel()">إلغاء</button>
          </div>
        </form>
      }

      <section class="rounded-lg bg-white p-5 shadow-sm">
        <h2 class="text-xl font-black">مفاتيح مقترحة</h2>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          @for (preset of presets; track preset.key) {
            <button class="rounded-lg border border-slate-200 p-4 text-right hover:bg-teal-50" type="button" (click)="usePreset(preset)">
              <strong class="block">{{ preset.key }}</strong>
              <span class="mt-1 block text-sm text-slate-500">{{ preset.description }}</span>
            </button>
          }
        </div>
      </section>

      <div class="rounded-lg bg-white shadow-sm" [attr.aria-busy]="loading()">
        @if (loading()) {
          <p class="p-6 text-slate-500">جاري تحميل الإعدادات...</p>
        } @else if (settings().length === 0) {
          <p class="p-6 text-slate-500">لا توجد إعدادات بعد.</p>
        } @else {
          <div class="grid gap-3 p-4">
            @for (setting of settings(); track setting.key) {
              <article class="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <h2 class="font-mono text-lg font-black">{{ setting.key }}</h2>
                  <p class="mt-2 break-all text-slate-600">{{ setting.value }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button class="mada-btn mada-btn-secondary" type="button" (click)="edit(setting)">تعديل</button>
                  <button class="mada-btn bg-red-600 text-white" type="button" (click)="remove(setting.key)">حذف</button>
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
export class SettingsPage {
  private readonly content = inject(ContentService);
  readonly settings = signal<SiteSetting[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  readonly presets = [
    { key: 'primary_cta_link', value: '#lead-hero', description: 'رابط CTA الأساسي في الهيدر' },
    { key: 'workshop_cta_link', value: '#lead-final', description: 'رابط ورشة مجانية' },
    { key: 'final_cta_link', value: '#lead-final', description: 'رابط CTA الأخير' },
    { key: 'whatsapp_number', value: '+201000000000', description: 'رقم واتساب الرسمي' },
    { key: 'instagram_url', value: 'https://instagram.com', description: 'رابط إنستجرام' },
    { key: 'youtube_url', value: 'https://youtube.com', description: 'رابط يوتيوب' }
  ];
  form: SiteSetting = { key: '', value: '' };

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.settings.set(await this.content.getSettingsAdmin());
    } catch (error) {
      this.error.set(this.message(error, 'تعذر تحميل الإعدادات.'));
    } finally {
      this.loading.set(false);
    }
  }

  startCreate(): void {
    this.form = { key: '', value: '' };
    this.editing.set(true);
  }

  usePreset(preset: SiteSetting & { description: string }): void {
    this.form = { key: preset.key, value: this.settings().find((setting) => setting.key === preset.key)?.value ?? preset.value };
    this.editing.set(true);
  }

  edit(setting: SiteSetting): void {
    this.form = { ...setting };
    this.editing.set(true);
  }

  cancel(): void {
    this.form = { key: '', value: '' };
    this.editing.set(false);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.content.saveSetting(this.form);
      this.cancel();
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حفظ الإعداد.'));
    } finally {
      this.saving.set(false);
    }
  }

  async remove(key: string): Promise<void> {
    if (!window.confirm('هل تريد حذف هذا الإعداد؟')) {
      return;
    }

    try {
      await this.content.deleteSetting(key);
      await this.load();
    } catch (error) {
      this.error.set(this.message(error, 'تعذر حذف الإعداد.'));
    }
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
