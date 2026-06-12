import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-topbar',
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="flex min-h-16 items-center justify-between gap-4 px-4 md:px-8">
        <nav class="flex gap-2 overflow-x-auto lg:hidden" aria-label="تنقل الإدارة المختصر">
          <a class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-black no-underline" routerLink="/admin/dashboard">الرئيسية</a>
          <a class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-black no-underline" routerLink="/admin/leads">Leads</a>
        </nav>
        <p class="hidden font-black text-slate-600 md:block">إدارة Mada Academy</p>
        <button class="mada-btn mada-btn-secondary" type="button" (click)="auth.signOut()">تسجيل الخروج</button>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminTopbarComponent {
  readonly auth = inject(AuthService);
}
