import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Testimonial } from '../../../core/models/content.models';

@Component({
  selector: 'app-parent-message-card',
  imports: [NgOptimizedImage],
  template: `
    <!-- Upload approved testimonial screenshots to Supabase Storage; keep public names anonymized unless explicitly approved. -->
    <article class="mada-card mada-card-interactive h-full p-6">
      <div class="flex items-center gap-3">
        <div class="relative grid size-12 place-items-center overflow-hidden rounded-lg bg-[var(--mada-mint)] font-black text-teal-900">
          @if (testimonial().image_url) {
            <img [ngSrc]="testimonial().image_url ?? ''" alt="رسالة ولي أمر" fill sizes="48px" class="object-cover" />
          } @else {
            و
          }
        </div>
        <div>
          <p class="font-black">ولي أمر — {{ testimonial().role }}</p>
          <p class="text-sm text-[var(--muted)]">Mada Academy</p>
        </div>
      </div>
      <div class="mt-5 text-amber-500" [attr.aria-label]="'تقييم ' + testimonial().rating + ' من 5'">★★★★★</div>
      <blockquote class="mt-4 text-xl font-bold leading-9">"{{ testimonial().quote }}"</blockquote>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentMessageCardComponent {
  readonly testimonial = input.required<Testimonial>();
}
