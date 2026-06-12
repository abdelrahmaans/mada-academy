import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-project-screenshot-card',
  imports: [NgOptimizedImage],
  template: `
    <!-- Add real project screenshots through CMS/Supabase Storage; this fallback lives in src/assets/showcase/projects. -->
    <figure class="mada-card mada-card-interactive mada-image-zoom overflow-hidden">
      <button class="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-start" type="button" [attr.aria-label]="actionLabel()">
        <img [ngSrc]="imageUrl() || fallbackUrl" [alt]="altText()" fill [sizes]="sizes()" class="object-cover" />
        <figcaption class="mada-gallery-overlay">
          <span class="rounded-full bg-white/18 px-3 py-1 text-xs font-black text-white">{{ category() }}</span>
          <strong class="mt-3 block text-lg">{{ title() }}</strong>
        </figcaption>
      </button>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectScreenshotCardComponent {
  readonly title = input.required<string>();
  readonly imageUrl = input<string | null>(null);
  readonly altText = input('Project screenshot');
  readonly category = input('project');
  readonly actionLabel = input('عرض المشروع');
  readonly sizes = input('(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw');
  readonly fallbackUrl = 'assets/showcase/projects/project-placeholder.svg';
}
