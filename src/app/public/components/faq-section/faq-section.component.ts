import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Faq } from '../../../core/models/content.models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-faq-section',
  imports: [RevealOnScrollDirective],
  template: `
    <section class="mada-section bg-[color-mix(in_srgb,var(--mada-mint)_28%,transparent)]">
      <div class="mada-shell max-w-4xl">
        <div appRevealOnScroll>
          <p class="mada-eyebrow">FAQ</p>
          <h2 class="mt-4 text-4xl font-black">أسئلة متكررة</h2>
        </div>
        <div class="mt-8 grid gap-3" appRevealOnScroll revealTarget="details" [revealStagger]="0.08">
          @for (faq of faqs(); track faq.id) {
            <details class="mada-card mada-card-interactive p-5">
              <summary class="cursor-pointer text-xl font-black">{{ faq.question }}</summary>
              <div class="faq-answer">
                <div>
                  <p class="mt-3 leading-8 text-[var(--muted)]">{{ faq.answer }}</p>
                </div>
              </div>
            </details>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqSectionComponent {
  readonly faqs = input.required<Faq[]>();
}
