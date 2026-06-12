import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lead, LeadReason, LeadStatus } from '../../../core/models/lead.models';
import { LeadsService } from '../../../core/services/leads.service';
import { LeadDetailsDrawerComponent } from '../../components/lead-details-drawer/lead-details-drawer.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-leads-page',
  imports: [FormsModule, StatusBadgeComponent, LeadDetailsDrawerComponent],
  template: `
    <section>
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">Leads</p>
          <h1 class="mt-2 text-3xl font-black">إدارة العملاء المحتملين</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="load()">تحديث</button>
      </div>

      @if (error()) {
        <p class="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p>
      }

      <form class="mt-6 grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-5" (ngSubmit)="load()">
        <select class="rounded-lg border border-slate-300 px-3 py-3" name="status" [(ngModel)]="statusFilter" aria-label="فلترة حسب الحالة">
          <option value="">كل الحالات</option>
          @for (status of statuses; track status.value) { <option [value]="status.value">{{ status.label }}</option> }
        </select>
        <select class="rounded-lg border border-slate-300 px-3 py-3" name="reason" [(ngModel)]="reasonFilter" aria-label="فلترة حسب سبب التواصل">
          <option value="">كل الأسباب</option>
          @for (reason of reasons; track reason.value) { <option [value]="reason.value">{{ reason.label }}</option> }
        </select>
        <input class="rounded-lg border border-slate-300 px-3 py-3" name="track" [(ngModel)]="trackFilter" placeholder="المسار" aria-label="فلترة حسب المسار" />
        <input class="rounded-lg border border-slate-300 px-3 py-3" name="from" [(ngModel)]="fromFilter" type="date" aria-label="من تاريخ" />
        <button class="mada-btn mada-btn-secondary" type="submit">تطبيق الفلاتر</button>
      </form>

      <div class="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm" [attr.aria-busy]="loading()">
        <table class="w-full min-w-[940px] border-collapse text-right">
          <thead class="bg-slate-50 text-sm text-slate-500">
            <tr>
              @for (column of columns; track column) { <th class="px-4 py-3 font-black">{{ column }}</th> }
            </tr>
          </thead>
          <tbody>
            @for (lead of leads(); track lead.id) {
              <tr class="border-t border-slate-100">
                <td class="px-4 py-3 font-black">{{ lead.parent_name }}</td>
                <td class="px-4 py-3">{{ lead.phone }}</td>
                <td class="px-4 py-3">{{ lead.child_name || '-' }}</td>
                <td class="px-4 py-3">{{ lead.child_age || '-' }}</td>
                <td class="px-4 py-3">{{ lead.selected_track || '-' }}</td>
                <td class="px-4 py-3">{{ reasonLabel(lead.reason) }}</td>
                <td class="px-4 py-3"><app-status-badge [status]="lead.status" /></td>
                <td class="px-4 py-3">{{ formatDate(lead.created_at) }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button class="mada-btn mada-btn-secondary min-h-10 px-3 py-1" type="button" (click)="selectedLead.set(lead)">عرض</button>
                    <a class="mada-btn mada-btn-primary min-h-10 px-3 py-1" [href]="whatsapp(lead)" target="_blank" rel="noopener">WhatsApp</a>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td class="px-4 py-8 text-center text-slate-500" colspan="9">
                  {{ loading() ? 'جاري تحميل الطلبات...' : 'لا توجد بيانات مطابقة.' }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <app-lead-details-drawer
        [lead]="selectedLead()"
        (close)="selectedLead.set(null)"
        (statusChange)="updateStatus($event.id, $event.status)"
        (notesChange)="updateNotes($event.id, $event.notes)"
      />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadsPage {
  private readonly leadsService = inject(LeadsService);
  readonly leads = signal<Lead[]>([]);
  readonly selectedLead = signal<Lead | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  statusFilter: LeadStatus | '' = '';
  reasonFilter: LeadReason | '' = '';
  trackFilter = '';
  fromFilter = '';
  readonly columns = ['ولي الأمر', 'الهاتف', 'الطفل', 'السن', 'المسار', 'السبب', 'الحالة', 'التاريخ', 'إجراءات'];
  readonly statuses: { value: LeadStatus; label: string }[] = [
    { value: 'new', label: 'جديد' },
    { value: 'contacted', label: 'تم التواصل' },
    { value: 'qualified', label: 'مؤهل' },
    { value: 'enrolled', label: 'مشترك' },
    { value: 'closed', label: 'مغلق' }
  ];
  readonly reasons: { value: LeadReason; label: string }[] = [
    { value: 'start_track', label: 'بدء مسار' },
    { value: 'free_workshop', label: 'ورشة مجانية' },
    { value: 'ask_question', label: 'سؤال' },
    { value: 'pricing', label: 'أسعار' },
    { value: 'partnership', label: 'شراكة' },
    { value: 'other', label: 'أخرى' }
  ];

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const leads = await this.leadsService.getLeads({
        status: this.statusFilter,
        reason: this.reasonFilter,
        selected_track: this.trackFilter,
        from: this.fromFilter
      });
      this.leads.set(leads);
    } catch {
      this.error.set('تعذر تحميل الطلبات. تأكد من تسجيل الدخول بحساب إداري لديه صلاحية قراءة جدول leads.');
    } finally {
      this.loading.set(false);
    }
  }

  async updateStatus(id: string, status: LeadStatus): Promise<void> {
    const ok = await this.leadsService.updateLeadStatus(id, status);
    if (!ok) {
      this.error.set('تعذر تحديث الحالة.');
      return;
    }

    await this.reloadSelectedLead(id);
  }

  async updateNotes(id: string, notes: string): Promise<void> {
    const ok = await this.leadsService.updateLeadNotes(id, notes);
    if (!ok) {
      this.error.set('تعذر تحديث الملاحظات.');
      return;
    }

    await this.reloadSelectedLead(id);
  }

  whatsapp(lead: Lead): string {
    return this.leadsService.whatsappUrl(
      lead.phone,
      `أهلًا ${lead.parent_name}، معاك فريق Mada Academy. وصلنا طلبك بخصوص ${lead.selected_track ?? 'مسارات مدى'} وهنساعدك تختار الأنسب لطفلك.`
    );
  }

  reasonLabel(reason: LeadReason): string {
    return this.reasons.find((item) => item.value === reason)?.label ?? reason;
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString('ar-EG');
  }

  private async reloadSelectedLead(id: string): Promise<void> {
    await this.load();
    this.selectedLead.set(this.leads().find((lead) => lead.id === id) ?? null);
  }
}
