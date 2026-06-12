import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-floating-code-symbols',
  template: `
    <div class="mada-visual-layer" aria-hidden="true">
      @for (symbol of symbols(); track symbol.label) {
        <span
          class="mada-floating-symbol"
          [style.inset-inline-start]="symbol.x"
          [style.top]="symbol.y"
          [style.animation-delay]="symbol.delay"
        >
          {{ symbol.label }}
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatingCodeSymbolsComponent {
  readonly symbols = input([
    { label: '{}', x: '8%', y: '16%', delay: '0s' },
    { label: '</>', x: '78%', y: '12%', delay: '0.7s' },
    { label: '()', x: '12%', y: '78%', delay: '1.1s' },
    { label: '•••', x: '86%', y: '70%', delay: '1.5s' },
    { label: '★', x: '50%', y: '8%', delay: '2s' }
  ]);
}
