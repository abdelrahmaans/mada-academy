import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const trackIcons: Record<string, string> = {
  tiny: 'assets/icons/tracks/tiny.svg',
  explore: 'assets/icons/tracks/explore.svg',
  build: 'assets/icons/tracks/build.svg',
  code: 'assets/icons/tracks/code.svg',
  web: 'assets/icons/tracks/web.svg'
};

@Component({
  selector: 'app-track-icon-visual',
  imports: [NgOptimizedImage],
  template: `
    <!-- Replace static track icons in src/assets/icons/tracks when custom brand icons are ready. -->
    <span class="mada-track-visual">
      <img [ngSrc]="iconPath()" [alt]="alt()" width="38" height="38" />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackIconVisualComponent {
  readonly slug = input.required<string>();
  readonly alt = input('Track visual');
  readonly iconPath = computed(() => {
    const slug = this.slug();
    const key = Object.keys(trackIcons).find((item) => slug.includes(item)) ?? 'tiny';
    return trackIcons[key];
  });
}
