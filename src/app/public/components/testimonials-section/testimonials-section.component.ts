import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Testimonial } from '../../../core/models/content.models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { ParentMessageCardComponent } from '../visual-system/parent-message-card.component';

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
  imports: [RevealOnScrollDirective, ParentMessageCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="mada-section">
      <div class="mada-shell">
        <div appRevealOnScroll>
          <p class="mada-eyebrow">Parent Messages</p>
          <h2 class="mt-4 text-4xl font-black">رسائل ثقة من أولياء الأمور</h2>
        </div>

        @if (testimonials().length) {
          <swiper-container
            class="mada-swiper mt-8"
            autoplay='{"delay":5200,"disableOnInteraction":false,"pauseOnMouseEnter":true}'
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
                <app-parent-message-card [testimonial]="testimonial" />
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
