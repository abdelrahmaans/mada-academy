import { NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { GalleryItem } from '../../../core/models/content.models';
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
  selector: 'app-gallery-section',
  imports: [NgOptimizedImage, RevealOnScrollDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="mada-section bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]">
      <div class="mada-shell">
        <div appRevealOnScroll>
          <p class="mada-eyebrow">Gallery</p>
          <h2 class="mt-4 text-4xl font-black">لقطات من المشاريع والتجربة</h2>
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
            @for (item of items(); track item.id) {
              <swiper-slide>
                <figure class="mada-card mada-card-interactive mada-image-zoom overflow-hidden">
                  <button class="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-start" type="button" (click)="selected.set(item)" [attr.aria-label]="'عرض صورة ' + item.title">
                    <img [ngSrc]="item.image_url" [alt]="item.alt_text" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" class="object-cover" />
                    <figcaption class="mada-gallery-overlay">
                      <span class="rounded-full bg-white/18 px-3 py-1 text-xs font-black text-white">{{ item.item_type }}</span>
                      <strong class="mt-3 block text-lg">{{ item.title }}</strong>
                    </figcaption>
                  </button>
                </figure>
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

      @if (selected(); as item) {
        <div class="modal-open fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4" role="presentation" (click)="selected.set(null)">
          <figure class="mada-card w-full max-w-4xl overflow-hidden" role="dialog" aria-modal="true" [attr.aria-label]="item.title" (click)="$event.stopPropagation()">
            <div class="relative aspect-[16/10] bg-slate-900">
              <img [ngSrc]="item.image_url" [alt]="item.alt_text" fill sizes="100vw" class="object-contain" />
            </div>
            <figcaption class="flex items-center justify-between gap-3 p-4">
              <strong>{{ item.title }}</strong>
              <button class="mada-btn mada-btn-secondary" type="button" (click)="selected.set(null)">إغلاق</button>
            </figcaption>
          </figure>
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GallerySectionComponent {
  readonly items = input.required<GalleryItem[]>();
  readonly selected = signal<GalleryItem | null>(null);

  pause(event: Event): void {
    (event.currentTarget as SwiperContainerElement).swiper?.autoplay?.stop();
  }

  play(event: Event): void {
    (event.currentTarget as SwiperContainerElement).swiper?.autoplay?.start();
  }
}
