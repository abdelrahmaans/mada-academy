import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../admin/components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../../admin/components/admin-topbar/admin-topbar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebarComponent, AdminTopbarComponent],
  template: `
    <main class="min-h-dvh bg-slate-100 text-slate-950" dir="rtl">
      <div class="grid min-h-dvh lg:grid-cols-[280px_1fr]">
        <app-admin-sidebar />
        <section class="min-w-0">
          <app-admin-topbar />
          <div class="p-4 md:p-8">
            <router-outlet />
          </div>
        </section>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {}
