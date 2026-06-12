import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-blob',
  template: `
    <div
      class="mada-section-blob"
      [class.mada-section-blob-amber]="tone() === 'amber'"
      [class.mada-section-blob-navy]="tone() === 'navy'"
      aria-hidden="true"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionBlobComponent {
  readonly tone = input<'teal' | 'amber' | 'navy'>('teal');
}
