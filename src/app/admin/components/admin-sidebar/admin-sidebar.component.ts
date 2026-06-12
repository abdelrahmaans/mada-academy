import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="hidden border-l border-slate-200 bg-white p-5 lg:block">
      <a routerLink="/admin/dashboard" class="flex items-center gap-3 text-slate-950 no-underline">
        <span class="grid size-11 place-items-center rounded-lg bg-slate-950 font-black text-white">مدى</span>
        <span>
          <strong class="block">Mada CMS</strong>
          <span class="text-xs font-bold text-slate-500">Admin workspace</span>
        </span>
      </a>
      <nav class="mt-8 grid gap-1" aria-label="إدارة الموقع">
        @for (item of items; track item.href) {
          <a
            class="rounded-lg px-3 py-3 text-sm font-black text-slate-600 no-underline hover:bg-teal-50 hover:text-teal-800"
            routerLinkActive="bg-teal-100 text-teal-900"
            [routerLink]="item.href"
          >{{ item.label }}</a>
        }
      </nav>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSidebarComponent {
  readonly items = [
    { href: '/admin/dashboard', label: 'لوحة التحكم' },
    { href: '/admin/leads', label: 'العملاء المحتملون' },
    { href: '/admin/homepage-editor', label: 'تحرير الرئيسية' },
    { href: '/admin/tracks-manager', label: 'إدارة المسارات' },
    { href: '/admin/stars-board-manager', label: 'Stars Board' },
    { href: '/admin/content-manager', label: 'المحتوى' },
    { href: '/admin/gallery-manager', label: 'المعرض' },
    { href: '/admin/testimonials-manager', label: 'آراء العملاء' },
    { href: '/admin/faq-manager', label: 'الأسئلة' },
    { href: '/admin/settings', label: 'الإعدادات' }
  ];
}
