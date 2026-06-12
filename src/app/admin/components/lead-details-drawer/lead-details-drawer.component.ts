import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Lead, LeadStatus } from '../../../core/models/lead.models';

@Component({
  selector: 'app-lead-details-drawer',
  template: `
    @if (lead(); as currentLead) {
      <div class="fixed inset-0 z-50 bg-slate-950/50" role="presentation" (click)="close.emit()">
        <aside class="ms-auto h-full w-full max-w-xl overflow-auto bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="lead-drawer-title" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-black text-teal-700">{{ currentLead.reason }}</p>
              <h2 id="lead-drawer-title" class="mt-1 text-3xl font-black">{{ currentLead.parent_name }}</h2>
              <p class="mt-1 text-slate-500">{{ currentLead.phone }}</p>
            </div>
            <button class="mada-btn mada-btn-secondary size-11 p-0" type="button" (click)="close.emit()" aria-label="إغلاق التفاصيل">×</button>
          </div>

          <dl class="mt-6 grid gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-2">
            @for (item of detailItems(currentLead); track item.label) {
              <div>
                <dt class="text-xs font-black text-slate-500">{{ item.label }}</dt>
                <dd class="mt-1 font-bold">{{ item.value || '-' }}</dd>
              </div>
            }
          </dl>

          <label class="mt-6 grid gap-2 font-black">
            الحالة
            <select class="rounded-lg border border-slate-300 px-3 py-3" [value]="currentLead.status" (change)="changeStatus($event, currentLead.id)">
              @for (status of statuses; track status.value) {
                <option [value]="status.value">{{ status.label }}</option>
              }
            </select>
          </label>

          <label class="mt-4 grid gap-2 font-black">
            ملاحظات داخلية
            <textarea class="min-h-32 rounded-lg border border-slate-300 px-3 py-3" [value]="currentLead.internal_notes ?? ''" (change)="changeNotes($event, currentLead.id)"></textarea>
          </label>
        </aside>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadDetailsDrawerComponent {
  readonly lead = input<Lead | null>(null);
  readonly close = output<void>();
  readonly statusChange = output<{ id: string; status: LeadStatus }>();
  readonly notesChange = output<{ id: string; notes: string }>();
  readonly statuses: { value: LeadStatus; label: string }[] = [
    { value: 'new', label: 'جديد' },
    { value: 'contacted', label: 'تم التواصل' },
    { value: 'qualified', label: 'مؤهل' },
    { value: 'enrolled', label: 'مشترك' },
    { value: 'closed', label: 'مغلق' }
  ];

  changeStatus(event: Event, id: string): void {
    const status = (event.target as HTMLSelectElement).value;
    if (this.isLeadStatus(status)) {
      this.statusChange.emit({ id, status });
    }
  }

  changeNotes(event: Event, id: string): void {
    this.notesChange.emit({ id, notes: (event.target as HTMLTextAreaElement).value });
  }

  detailItems(lead: Lead): { label: string; value: string | number | null }[] {
    return [
      { label: 'اسم الطفل', value: lead.child_name },
      { label: 'السن', value: lead.child_age },
      { label: 'المسار', value: lead.selected_track },
      { label: 'المصدر', value: `${lead.source_page ?? '-'} / ${lead.source_section ?? '-'}` },
      { label: 'الرسالة', value: lead.message },
      { label: 'تاريخ الإنشاء', value: new Date(lead.created_at).toLocaleDateString('ar-EG') }
    ];
  }

  private isLeadStatus(value: string): value is LeadStatus {
    return this.statuses.some((status) => status.value === value);
  }
}
