import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-session-experience-section',
  imports: [RevealOnScrollDirective],
  template: `
    <section class="mada-section">
      <div class="mada-shell">
        <div appRevealOnScroll>
          <p class="mada-eyebrow">60-minute session</p>
          <h2 class="mt-4 text-4xl font-black">تجربة الجلسة</h2>
        </div>
        <div class="mada-timeline mt-9 grid gap-4 md:grid-cols-7" appRevealOnScroll revealTarget="article" [revealStagger]="0.07">
          @for (step of steps; track step.title; let index = $index) {
            <article class="mada-timeline-step mada-card mada-card-interactive p-4">
              <span class="grid size-12 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--mada-teal)_16%,var(--surface))] text-xl font-black text-[var(--mada-teal)]">{{ step.icon }}</span>
              <span class="mt-4 block font-mono text-xs font-black text-[var(--mada-amber)]">0{{ index + 1 }}</span>
              <h3 class="mt-1 font-black">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-[var(--muted)]">{{ step.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionExperienceSectionComponent {
  readonly steps = [
    { icon: '✦', title: 'Ice breaking', text: 'افتتاح خفيف وسؤال محفز.' },
    { icon: '{}', title: 'Knowledge', text: 'مفهوم واحد واضح.' },
    { icon: '▶', title: 'Game-Based', text: 'تعلم من خلال تحدي.' },
    { icon: '</>', title: 'Practice', text: 'تطبيق مباشر.' },
    { icon: '()', title: 'Puzzle', text: 'لغز تفكير منطقي.' },
    { icon: '→', title: 'Task', text: 'مهمة صغيرة قابلة للقياس.' },
    { icon: 'XP', title: 'XP Closing', text: 'تلخيص ونقاط إنجاز.' }
  ];
}
