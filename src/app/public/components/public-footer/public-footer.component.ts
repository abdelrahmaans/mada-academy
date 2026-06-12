import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-public-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t border-[var(--line)] bg-[var(--mada-navy)] text-white">
      <div class="mada-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:py-12">
        <div>
          <strong class="text-2xl">Mada Academy</strong>
          <p class="mt-3 max-w-md leading-8 text-slate-300">مش بنعلّم برمجة بس، بنبني طريقة تفكير. أكاديمية عربية للأطفال من 6 إلى 16 سنة.</p>
        </div>
        <nav class="grid content-start gap-3" aria-label="روابط سريعة">
          <a routerLink="/tracks" class="text-slate-200 no-underline transition hover:text-white">المسارات</a>
          <a routerLink="/content" class="text-slate-200 no-underline transition hover:text-white">المحتوى</a>
          <a routerLink="/gallery" class="text-slate-200 no-underline transition hover:text-white">المعرض</a>
          <a [href]="whatsappLink()" class="text-slate-200 no-underline transition hover:text-white" target="_blank" rel="noopener">واتساب</a>
        </nav>
        <div>
          <p class="font-black text-[var(--mada-amber)]">لا حدود للمدى</p>
          <p class="mt-3 text-sm text-slate-300">© 2026 Mada Academy. كل الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicFooterComponent {
  private readonly content = inject(ContentService);
  readonly settings = signal<Record<string, string>>({});

  constructor() {
    void this.content.siteSettings().then((settings) => this.settings.set(settings));
  }

  whatsappLink(): string {
    return `https://wa.me/${(this.settings()['whatsapp_number'] ?? '+201000000000').replace(/[^\d+]/g, '')}`;
  }
}
