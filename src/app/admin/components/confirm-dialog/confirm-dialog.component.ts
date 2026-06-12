import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
        <section class="w-full max-w-md rounded-lg bg-white p-6" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <h2 id="confirm-title" class="text-2xl font-black">{{ title() }}</h2>
          <p class="mt-3 text-slate-600">{{ message() }}</p>
          <div class="mt-6 flex gap-3">
            <button class="mada-btn mada-btn-primary" type="button" (click)="confirm.emit()">تأكيد</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="cancel.emit()">إلغاء</button>
          </div>
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('تأكيد الإجراء');
  readonly message = input('هل أنت متأكد؟');
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
