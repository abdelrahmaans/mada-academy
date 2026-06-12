import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LeadStats } from '../../../core/models/lead.models';
import { ContentService } from '../../../core/services/content.service';
import { LeadsService } from '../../../core/services/leads.service';

@Component({
  selector: 'app-dashboard-page',
  template: `
    <section>
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-black text-teal-700">Dashboard</p>
          <h1 class="mt-2 text-3xl font-black">نظرة عامة</h1>
        </div>
        <button class="mada-btn mada-btn-primary" type="button" (click)="load()">تحديث</button>
      </div>

      @if (error()) {
        <p class="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 font-bold text-red-800" role="alert">{{ error() }}</p>
      }

      <div class="mt-6 grid gap-4 md:grid-cols-4" [attr.aria-busy]="loading()">
        @for (metric of metrics(); track metric.label) {
          <article class="rounded-lg bg-white p-5 shadow-sm">
            <p class="text-sm font-black text-slate-500">{{ metric.label }}</p>
            <strong class="mt-3 block text-3xl">{{ metric.value }}</strong>
          </article>
        }
      </div>

      <div class="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section class="rounded-lg bg-white p-5 shadow-sm">
          <h2 class="text-xl font-black">آخر 5 طلبات</h2>
          <div class="mt-4 grid gap-3">
            @for (lead of stats()?.latestLeads ?? []; track lead.id) {
              <div class="rounded-lg border border-slate-200 p-3">
                <strong>{{ lead.parent_name }}</strong>
                <p class="text-sm text-slate-500">{{ lead.phone }} · {{ lead.selected_track || 'بدون مسار' }}</p>
              </div>
            } @empty {
              <p class="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
                {{ loading() ? 'جاري تحميل الطلبات...' : 'لا توجد طلبات بعد.' }}
              </p>
            }
          </div>
        </section>

        <section class="rounded-lg bg-white p-5 shadow-sm">
          <h2 class="text-xl font-black">إحصائيات المحتوى</h2>
          <div class="mt-4 grid gap-3">
            <p class="rounded-lg bg-slate-100 p-3 font-bold">المعرض: {{ galleryCount() }}</p>
            <p class="rounded-lg bg-slate-100 p-3 font-bold">الريلز والمحتوى: {{ contentCount() }}</p>
          </div>
        </section>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage {
  private readonly leadsService = inject(LeadsService);
  private readonly content = inject(ContentService);
  readonly stats = signal<LeadStats | null>(null);
  readonly galleryCount = signal(0);
  readonly contentCount = signal(0);
  readonly loading = signal(false);
  readonly error = signal('');

  constructor() {
    void this.load();
  }

  metrics(): { label: string; value: string | number }[] {
    const stats = this.stats();
    return [
      { label: 'إجمالي الطلبات', value: stats?.totalLeads ?? 0 },
      { label: 'طلبات جديدة', value: stats?.newLeads ?? 0 },
      { label: 'طلبات هذا الأسبوع', value: stats?.leadsThisWeek ?? 0 },
      { label: 'أكثر مسار مطلوب', value: stats?.mostRequestedTrack ?? '-' }
    ];
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const [stats, gallery, content] = await Promise.all([
        this.leadsService.getLeadStats(),
        this.content.gallery(),
        this.content.contentItems()
      ]);
      this.stats.set(stats);
      this.galleryCount.set(gallery.length);
      this.contentCount.set(content.length);
    } catch {
      this.error.set('تعذر تحميل إحصائيات لوحة التحكم. تأكد من تسجيل الدخول بحساب إداري.');
    } finally {
      this.loading.set(false);
    }
  }
}
