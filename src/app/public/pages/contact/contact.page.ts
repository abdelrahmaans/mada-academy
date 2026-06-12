import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LeadModalConfig } from '../../../core/models/lead.models';
import { ContentService } from '../../../core/services/content.service';
import { LeadFormModalComponent } from '../../components/lead-form-modal/lead-form-modal.component';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-contact-page',
  imports: [LeadFormModalComponent, RevealOnScrollDirective],
  template: `
    <main class="mada-section">
      <section class="mada-shell grid gap-6 lg:grid-cols-[1fr_0.8fr]" appRevealOnScroll revealTarget=".contact-motion" [revealStagger]="0.1">
        <div class="contact-motion">
          <p class="mada-eyebrow">Contact</p>
          <h1 class="mada-title">تواصل مع فريق مدى</h1>
          <p class="mada-lead mt-5">عندك سؤال عن المسارات، الأسعار، أو أنسب بداية لطفلك؟ سيب بياناتك وهنرجعلك بسرعة.</p>
          <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button class="mada-btn mada-btn-primary" type="button" (click)="open()">ابدأ التواصل</button>
            <a class="mada-btn mada-btn-secondary" [href]="whatsappLink()" target="_blank" rel="noopener">واتساب</a>
          </div>
        </div>
        <aside class="contact-motion mada-card mada-card-interactive p-6">
          <h2 class="text-2xl font-black">معلومات سريعة</h2>
          <p class="mt-4 leading-8 text-[var(--muted)]">اللغة الأساسية: العربية. الفئة العمرية: 6 إلى 16. طريقة التعلم: مشاريع وتحديات.</p>
        </aside>
      </section>
      <app-lead-form-modal [config]="leadConfig()" (close)="leadConfig.set(null)" />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPage {
  private readonly content = inject(ContentService);
  readonly leadConfig = signal<LeadModalConfig | null>(null);
  readonly settings = signal<Record<string, string>>({});

  constructor() {
    void this.content.siteSettings().then((settings) => this.settings.set(settings));
  }

  open(): void {
    this.leadConfig.set({ sourcePage: 'contact', sourceSection: 'contact_page', reason: 'ask_question' });
  }

  whatsappLink(): string {
    return `https://wa.me/${(this.settings()['whatsapp_number'] ?? '+201000000000').replace(/[^\d+]/g, '')}`;
  }
}
