import { NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentItem } from '../../../core/models/content.models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

interface SwiperContainerElement extends HTMLElement {
  swiper?: {
    autoplay?: {
      start(): void;
      stop(): void;
    };
  };
}

@Component({
  selector: 'app-reels-section',
  imports: [NgOptimizedImage, RevealOnScrollDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="mada-section">
      <div class="mada-shell">
        <div appRevealOnScroll>
          <p class="mada-eyebrow">Content Hub</p>
          <h2 class="mt-4 text-4xl font-black">ريلز ومحتوى يساعد ولي الأمر والطفل</h2>
        </div>

        @if (items().length) {
          <swiper-container
            class="mada-swiper mt-8"
            autoplay='{"delay":3600,"disableOnInteraction":false,"pauseOnMouseEnter":true}'
            loop="true"
            pagination="true"
            slides-per-view="1"
            space-between="16"
            breakpoints='{"768":{"slidesPerView":2,"spaceBetween":18},"1024":{"slidesPerView":3,"spaceBetween":20}}'
            (mouseenter)="pause($event)"
            (mouseleave)="play($event)"
          >
            @for (item of items(); track item.id; let first = $first) {
              <swiper-slide>
                <article class="mada-card mada-card-interactive min-h-72 overflow-hidden" [class.border-teal-400]="first">
                  @if (item.thumbnail_url) {
                    <div class="mada-image-zoom relative aspect-video overflow-hidden bg-slate-100">
                      <img [ngSrc]="item.thumbnail_url" [alt]="item.title" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" class="object-cover" />
                      <span class="mada-play-chip absolute start-4 top-4" aria-hidden="true">▶</span>
                    </div>
                  } @else {
                    <div class="relative grid aspect-video place-items-center bg-[var(--mada-navy)] text-white">
                      <span class="font-mono text-3xl">{{ item.platform }}</span>
                      <span class="mada-play-chip absolute start-4 top-4" aria-hidden="true">▶</span>
                    </div>
                  }
                  <div class="p-5">
                    <div class="flex flex-wrap items-center gap-2">
                      @if (first) {
                        <span class="rounded-full bg-[var(--mada-amber)] px-3 py-1 text-xs font-black text-slate-950">Featured Reel</span>
                      }
                      <span class="rounded-full bg-[color-mix(in_srgb,var(--mada-mint)_70%,white)] px-3 py-1 text-xs font-black text-teal-900">{{ item.platform }}</span>
                      <span class="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-black text-[var(--muted)]">{{ item.category }}</span>
                    </div>
                    <h3 class="mt-4 text-2xl font-black">{{ item.title }}</h3>
                    <a class="mada-btn mada-btn-secondary mt-8" [href]="item.external_link" target="_blank" rel="noopener">افتح المحتوى</a>
                  </div>
                </article>
              </swiper-slide>
            }
          </swiper-container>
        } @else {
          <div class="mt-8 grid gap-4 md:grid-cols-3" aria-hidden="true">
            <div class="mada-skeleton"></div>
            <div class="mada-skeleton"></div>
            <div class="mada-skeleton"></div>
          </div>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReelsSectionComponent {
  readonly items = input.required<ContentItem[]>();

  pause(event: Event): void {
    (event.currentTarget as SwiperContainerElement).swiper?.autoplay?.stop();
  }

  play(event: Event): void {
    (event.currentTarget as SwiperContainerElement).swiper?.autoplay?.start();
  }
}
