import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { AnimatedTimelineComponent, TimelineStep } from '../visual-system/animated-timeline.component';

@Component({
  selector: 'app-session-experience-section',
  imports: [RevealOnScrollDirective, AnimatedTimelineComponent],
  template: `
    <section class="mada-section">
      <div class="mada-shell">
        <div appRevealOnScroll>
          <p class="mada-eyebrow">60-minute session</p>
          <h2 class="mt-4 text-4xl font-black">تجربة الجلسة</h2>
        </div>
        <app-animated-timeline [steps]="steps" />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionExperienceSectionComponent {
  readonly steps: TimelineStep[] = [
    { icon: '✦', title: 'Ice breaking', text: 'افتتاح خفيف وسؤال محفز.' },
    { icon: '{}', title: 'Knowledge', text: 'مفهوم واحد واضح.' },
    { icon: '▶', title: 'Game-Based', text: 'تعلم من خلال تحدي.' },
    { icon: '</>', title: 'Practice', text: 'تطبيق مباشر.' },
    { icon: '()', title: 'Puzzle', text: 'لغز تفكير منطقي.' },
    { icon: '→', title: 'Task', text: 'مهمة صغيرة قابلة للقياس.' },
    { icon: 'XP', title: 'XP Closing', text: 'تلخيص ونقاط إنجاز.' }
  ];
}
