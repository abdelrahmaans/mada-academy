import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, inject, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

gsap.registerPlugin(ScrollTrigger);

export interface TimelineStep {
  icon: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-animated-timeline',
  imports: [RevealOnScrollDirective],
  template: `
    <div class="mada-timeline mt-9 grid gap-4 md:grid-cols-7" appRevealOnScroll revealTarget="article" [revealStagger]="0.07">
      @for (step of steps(); track step.title; let index = $index) {
        <article class="mada-timeline-step mada-card mada-card-interactive p-4">
          <span class="grid size-12 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--mada-teal)_16%,var(--surface))] text-xl font-black text-[var(--mada-teal)]">{{ step.icon }}</span>
          <span class="mt-4 block font-mono text-xs font-black text-[var(--mada-amber)]">0{{ index + 1 }}</span>
          <h3 class="mt-1 font-black">{{ step.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--muted)]">{{ step.text }}</p>
        </article>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimatedTimelineComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private context?: gsap.Context;
  readonly steps = input.required<TimelineStep[]>();

  ngAfterViewInit(): void {
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.context = gsap.context(() => {
        const timeline = this.elementRef.nativeElement.querySelector<HTMLElement>('.mada-timeline');
        if (!timeline) {
          return;
        }

        gsap.fromTo(
          timeline,
          { '--timeline-progress': 0 },
          {
            '--timeline-progress': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timeline,
              start: 'top 82%',
              end: 'bottom 58%',
              scrub: 0.7
            }
          }
        );
      }, this.elementRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.context?.revert();
  }
}
