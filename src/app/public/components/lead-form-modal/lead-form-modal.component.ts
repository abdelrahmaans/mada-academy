import { ChangeDetectionStrategy, Component, OnChanges, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadModalConfig, LeadReason } from '../../../core/models/lead.models';
import { LeadsService } from '../../../core/services/leads.service';

@Component({
  selector: 'app-lead-form-modal',
  imports: [ReactiveFormsModule],
  template: `
    @if (config()) {
      <div class="modal-open fixed inset-0 z-50 grid place-items-end bg-slate-950/70 p-0 sm:place-items-center sm:p-4" role="presentation" (click)="close.emit()">
        <section
          class="mada-card flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none p-0 sm:rounded-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-title"
          (click)="$event.stopPropagation()"
        >
          <div class="border-b border-[var(--line)] p-4 sm:p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="mada-eyebrow">طلب تواصل</p>
                <h2 id="lead-title" class="mt-3 text-2xl font-black leading-snug sm:text-3xl">خلينا نختار أنسب مسار لطفلك</h2>
                <p class="mt-2 text-sm leading-7 text-[var(--muted)]">املأ البيانات، وفريق مدى هيراجعها ويتواصل معاك قريبًا.</p>
              </div>
              <button type="button" class="mada-btn mada-btn-secondary size-11 shrink-0 p-0" (click)="close.emit()" aria-label="إغلاق النموذج">×</button>
            </div>
          </div>

          @if (success()) {
            <div class="grid gap-4 overflow-auto p-5 sm:p-7" role="status">
              <div class="rounded-lg border border-teal-300 bg-teal-50 p-5 text-teal-950 dark:border-teal-500/50 dark:bg-teal-400/10 dark:text-teal-100">
                <strong class="block text-xl">وصلنا طلبك بنجاح</strong>
                <p class="mt-2 leading-7">هنراجع البيانات ونتواصل معاك قريبًا لاختيار أنسب مسار لطفلك.</p>
              </div>
              <button class="mada-btn mada-btn-primary" type="button" (click)="close.emit()">تمام</button>
            </div>
          } @else {
            <form class="flex min-h-0 flex-1 flex-col" [formGroup]="form" (ngSubmit)="submit()">
              <div class="grid gap-4 overflow-auto p-4 sm:p-6">
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="grid gap-2 font-bold">
                    اسم ولي الأمر
                    <input class="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-3" formControlName="parent_name" autocomplete="name" required aria-describedby="parent-name-error" />
                    @if (showError('parent_name')) {
                      <span id="parent-name-error" class="text-sm font-bold text-red-700 dark:text-red-300">اكتب اسم ولي الأمر.</span>
                    }
                  </label>
                  <label class="grid gap-2 font-bold">
                    رقم الهاتف
                    <input class="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-3" formControlName="phone" autocomplete="tel" inputmode="tel" required aria-describedby="phone-error" />
                    @if (showError('phone')) {
                      <span id="phone-error" class="text-sm font-bold text-red-700 dark:text-red-300">اكتب رقم هاتف صحيح للتواصل.</span>
                    }
                  </label>
                  <label class="grid gap-2 font-bold">
                    اسم الطفل
                    <input class="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-3" formControlName="child_name" autocomplete="off" />
                  </label>
                  <label class="grid gap-2 font-bold">
                    سن الطفل
                    <input class="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-3" formControlName="child_age" type="number" min="6" max="16" />
                  </label>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <label class="grid gap-2 font-bold">
                    المسار
                    <select class="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-3" formControlName="selected_track">
                      <option value="">لسه مش متأكد</option>
                      @for (track of tracks; track track.value) {
                        <option [value]="track.value">{{ track.label }}</option>
                      }
                    </select>
                  </label>
                  <label class="grid gap-2 font-bold">
                    سبب التواصل
                    <select class="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-3" formControlName="reason" required>
                      @for (reason of reasons; track reason.value) {
                        <option [value]="reason.value">{{ reason.label }}</option>
                      }
                    </select>
                  </label>
                </div>

                <label class="grid gap-2 font-bold">
                  رسالة اختيارية
                  <textarea class="min-h-28 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-3" formControlName="message"></textarea>
                </label>

                @if (error()) {
                  <p class="rounded-lg border border-red-300 bg-red-50 p-3 text-red-800 dark:border-red-500/50 dark:bg-red-400/10 dark:text-red-100" role="alert">{{ error() }}</p>
                }
              </div>

              <div class="sticky bottom-0 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-4 backdrop-blur sm:p-5">
                <button class="mada-btn mada-btn-primary w-full" type="submit" [disabled]="loading()">
                  {{ loadingLabel() }}
                </button>
              </div>
            </form>
          }
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadFormModalComponent implements OnChanges {
  private readonly leads = inject(LeadsService);
  readonly config = input<LeadModalConfig | null>(null);
  readonly close = output<void>();
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly error = signal('');
  readonly loadingLabel = computed(() => (this.loading() ? 'جاري الإرسال...' : 'إرسال الطلب'));
  readonly tracks = [
    { value: 'mada-tiny', label: 'Mada Tiny 6-7' },
    { value: 'mada-explore', label: 'Mada Explore 8-10' },
    { value: 'mada-build', label: 'Mada Build 11-13' },
    { value: 'mada-code', label: 'Mada Code 14-16' },
    { value: 'mada-web', label: 'Mada Web 11-16' }
  ];
  readonly reasons: { value: LeadReason; label: string }[] = [
    { value: 'start_track', label: 'بدء مسار' },
    { value: 'free_workshop', label: 'ورشة مجانية' },
    { value: 'ask_question', label: 'سؤال عام' },
    { value: 'pricing', label: 'الأسعار' },
    { value: 'partnership', label: 'شراكة' },
    { value: 'other', label: 'أخرى' }
  ];

  readonly form = new FormGroup({
    parent_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    child_name: new FormControl('', { nonNullable: true }),
    child_age: new FormControl<number | null>(null),
    selected_track: new FormControl('', { nonNullable: true }),
    reason: new FormControl<LeadReason>('start_track', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true })
  });

  ngOnChanges(): void {
    const config = this.config();
    if (!config) {
      return;
    }

    this.success.set(false);
    this.error.set('');
    this.form.patchValue({
      selected_track: config.selectedTrack ?? '',
      reason: config.reason
    });
  }

  showError(controlName: 'parent_name' | 'phone'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  async submit(): Promise<void> {
    const config = this.config();
    if (this.form.invalid || !config) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const value = this.form.getRawValue();
    const result = await this.leads.createLead({
      parent_name: value.parent_name,
      phone: value.phone,
      child_name: value.child_name,
      child_age: value.child_age,
      selected_track: value.selected_track,
      reason: value.reason,
      message: value.message,
      source_page: config.sourcePage,
      source_section: config.sourceSection
    });
    this.loading.set(false);

    if (!result.ok) {
      this.error.set(result.message ?? 'حصل خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
      return;
    }

    this.success.set(true);
    this.form.reset({
      parent_name: '',
      phone: '',
      child_name: '',
      child_age: null,
      selected_track: config.selectedTrack ?? '',
      reason: config.reason,
      message: ''
    });
  }
}
