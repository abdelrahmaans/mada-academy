import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LeadStatus } from '../../../core/models/lead.models';

@Component({
  selector: 'app-status-badge',
  template: `
    <span class="inline-flex rounded-full px-3 py-1 text-xs font-black" [class]="className()">{{ label() }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadgeComponent {
  readonly status = input.required<LeadStatus>();

  label(): string {
    return {
      new: 'جديد',
      contacted: 'تم التواصل',
      qualified: 'مؤهل',
      enrolled: 'مشترك',
      closed: 'مغلق'
    }[this.status()];
  }

  className(): string {
    return {
      new: 'bg-amber-100 text-amber-900',
      contacted: 'bg-sky-100 text-sky-900',
      qualified: 'bg-indigo-100 text-indigo-900',
      enrolled: 'bg-teal-100 text-teal-900',
      closed: 'bg-slate-200 text-slate-700'
    }[this.status()];
  }
}
