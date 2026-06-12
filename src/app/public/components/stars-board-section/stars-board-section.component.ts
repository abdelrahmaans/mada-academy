import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StarStudent } from '../../../core/models/track.models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { XpCountComponent } from '../xp-count/xp-count.component';
import { MadaGridBackgroundComponent } from '../visual-system/mada-grid-background.component';

@Component({
  selector: 'app-stars-board-section',
  imports: [NgOptimizedImage, RevealOnScrollDirective, XpCountComponent, MadaGridBackgroundComponent],
  template: `
    <section class="mada-section relative overflow-hidden bg-[var(--mada-navy)] text-white">
      <app-mada-grid-background />
      <div class="mada-shell relative">
        <div class="flex flex-wrap items-end justify-between gap-4" appRevealOnScroll>
          <div>
            <p class="mada-eyebrow">Mada Stars Board</p>
            <h2 class="mt-4 text-4xl font-black">لوحة إنجازات مدى</h2>
          </div>
          <div class="rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-teal-100">achievement.wall()</div>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3" appRevealOnScroll revealTarget="article" [revealStagger]="0.12">
          @for (student of stars(); track student.id; let index = $index) {
            <article class="mada-card-interactive rounded-lg border border-white/10 bg-white/5 p-5" [class.mada-top-star-card]="index < 3">
              <div class="flex items-center gap-3">
                <div class="relative grid size-14 place-items-center overflow-hidden rounded-lg bg-teal-400/20 text-xl font-black">
                  @if (student.avatar_url) {
                    <img [ngSrc]="student.avatar_url" [alt]="'صورة ' + student.student_name" fill sizes="56px" class="object-cover" />
                  } @else {
                    {{ student.student_name.slice(0, 1) }}
                  }
                </div>
                <div>
                  <h3 class="text-xl font-black">{{ student.student_name }}</h3>
                  <p class="text-sm text-slate-300">{{ student.track }}</p>
                </div>
              </div>
              <div class="mt-5 flex items-center justify-between rounded-lg bg-black/20 p-3">
                <span class="mada-badge-shine rounded-full bg-amber-300/15 px-3 py-1 font-black text-amber-300">{{ index < 3 ? 'Top ' + (index + 1) + ' · ' : '' }}{{ student.badge }}</span>
                <span class="font-mono"><app-xp-count [value]="student.xp" /></span>
              </div>
              <p class="mt-4 font-black">{{ student.project }}</p>
              <blockquote class="mt-3 leading-7 text-slate-200">"{{ student.quote }}"</blockquote>
              <p class="mt-3 text-sm text-teal-100">{{ student.highlight_reason }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarsBoardSectionComponent {
  readonly stars = input.required<StarStudent[]>();
}
