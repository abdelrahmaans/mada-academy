import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-about-section',
  imports: [RevealOnScrollDirective],
  template: `
    <section class="mada-section bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]">
      <div class="mada-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]" appRevealOnScroll revealTarget=".about-motion" [revealStagger]="0.1">
        <div class="about-motion">
          <p class="mada-eyebrow">What we do</p>
          <h2 class="mt-4 text-4xl font-black">مدى مش كورس برمجة وخلاص</h2>
        </div>
        <div class="about-motion grid gap-4">
          <p class="mada-lead">مدى بتبني أطفال يقدروا يفكروا بمنطق، يحللوا المشكلة، يجربوا، يغلطوا بأمان، ويحولوا الفكرة لمشروع حقيقي.</p>
          <div class="mada-grid mada-grid-3">
            @for (card of cards; track card.title) {
              <article class="mada-card mada-card-interactive p-5">
                <span class="text-2xl" aria-hidden="true">{{ card.icon }}</span>
                <h3 class="mt-3 text-xl font-black">{{ card.title }}</h3>
                <p class="mt-2 leading-7 text-[var(--muted)]">{{ card.text }}</p>
              </article>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutSectionComponent {
  readonly cards = [
    { icon: '{}', title: 'تفكير منطقي', text: 'الطفل يتعلم يرتب خطوات الحل ويفهم السبب قبل النتيجة.' },
    { icon: '</>', title: 'حل مشكلات', text: 'كل تحدي يتحول لسؤال واضح وتجربة قابلة للتعديل.' },
    { icon: 'XP', title: 'مشاريع حقيقية', text: 'نهاية كل مرحلة فيها شيء الطفل فخور إنه بناه بنفسه.' },
    { icon: '★', title: 'إبداع وثقة', text: 'بيئة تشجع التجربة، العرض، وتقبل الخطأ كجزء من التعلم.' },
    { icon: '∞', title: 'مهارات مستقبل', text: 'تواصل، صبر، نقد ذاتي، وطريقة تفكير تصلح لأي مجال.' }
  ];
}
