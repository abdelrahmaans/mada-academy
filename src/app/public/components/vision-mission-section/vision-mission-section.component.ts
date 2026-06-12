import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-vision-mission-section',
  imports: [RevealOnScrollDirective],
  template: `
    <section class="mada-section">
      <div class="mada-shell">
        <div class="mada-grid mada-grid-2" appRevealOnScroll revealTarget="article" [revealStagger]="0.12">
          <article class="mada-card mada-card-interactive p-7">
            <p class="mada-eyebrow">الرؤية</p>
            <h2 class="mt-4 text-3xl font-black">جيل عربي يبني التكنولوجيا بثقة</h2>
            <p class="mt-4 leading-8 text-[var(--muted)]">نريد أن يرى الطفل البرمجة كطريقة للتفكير وصناعة الأثر، لا كمادة صعبة أو لغة بعيدة.</p>
          </article>
          <article class="mada-card mada-card-interactive border-[color-mix(in_srgb,var(--mada-amber)_55%,var(--line))] p-7">
            <p class="mada-eyebrow">الرسالة</p>
            <h2 class="mt-4 text-3xl font-black">تعلم عملي منظم وممتع</h2>
            <p class="mt-4 leading-8 text-[var(--muted)]">نصمم جلسات قصيرة الإيقاع، عالية القيمة، تقود الطفل من الفضول إلى بناء مشروع قابل للعرض.</p>
          </article>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisionMissionSectionComponent {}
