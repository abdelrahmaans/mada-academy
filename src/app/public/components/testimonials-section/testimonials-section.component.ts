import { NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Testimonial } from '../../../core/models/content.models';
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
  selector: 'app-testimonials-section',
  imports: [NgOptimizedImage, RevealOnScrollDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="mada-section">
      <div class="mada-shell">
        <div appRevealOnScroll>
          <p class="mada-eyebrow">Testimonials</p>
          <h2 class="mt-4 text-4xl font-black">آراء أولياء الأمور والطلاب</h2>
        </div>

        @if (testimonials().length) {
          <swiper-container
            class="mada-swiper mt-8"
            autoplay='{"delay":5000,"disableOnInteraction":false,"pauseOnMouseEnter":true}'
            loop="true"
            pagination="true"
            slides-per-view="1"
            space-between="16"
            breakpoints='{"768":{"slidesPerView":2,"spaceBetween":18}}'
            (mouseenter)="pause($event)"
            (mouseleave)="play($event)"
          >
            @for (testimonial of testimonials(); track testimonial.id) {
              <swiper-slide>
                <article class="mada-card mada-card-interactive h-full p-6">
                  <div class="flex items-center gap-3">
                    <div class="relative grid size-12 place-items-center overflow-hidden rounded-lg bg-[var(--mada-mint)] font-black text-teal-900">
                      @if (testimonial.image_url) {
                        <img [ngSrc]="testimonial.image_url" [alt]="'صورة ' + testimonial.author_name" fill sizes="48px" class="object-cover" />
                      } @else {
                        {{ testimonial.author_name.slice(0, 1) }}
                      }
                    </div>
                    <div>
                      <p class="font-black">{{ testimonial.author_name }}</p>
                      <p class="text-sm text-[var(--muted)]">{{ testimonial.role }}</p>
                    </div>
                  </div>
                  <div class="mt-5 text-amber-500" [attr.aria-label]="'تقييم ' + testimonial.rating + ' من 5'">★★★★★</div>
                  <blockquote class="mt-4 text-xl font-bold leading-9">"{{ testimonial.quote }}"</blockquote>
                </article>
              </swiper-slide>
            }
          </swiper-container>
        } @else {
          <div class="mt-8 grid gap-4 md:grid-cols-2" aria-hidden="true">
            <div class="mada-skeleton"></div>
            <div class="mada-skeleton"></div>
          </div>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsSectionComponent {
  readonly testimonials = input.required<Testimonial[]>();

  pause(event: Event): void {
    (event.currentTarget as SwiperContainerElement).swiper?.autoplay?.stop();
  }

  play(event: Event): void {
    (event.currentTarget as SwiperContainerElement).swiper?.autoplay?.start();
  }
}
