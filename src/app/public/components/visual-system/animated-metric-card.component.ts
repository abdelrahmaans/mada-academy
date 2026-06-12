import { ChangeDetectionStrategy, Component, OnChanges, OnDestroy, input, signal } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-animated-metric-card',
  template: `
    <div class="mada-card mada-card-interactive p-4">
      <strong class="block text-2xl text-[var(--mada-teal)]">{{ prefix() }}{{ display() }}{{ suffix() }}</strong>
      <span class="text-sm font-bold text-[var(--muted)]">{{ label() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimatedMetricCardComponent implements OnChanges, OnDestroy {
  readonly value = input.required<number>();
  readonly label = input.required<string>();
  readonly prefix = input('');
  readonly suffix = input('');
  readonly display = signal(0);
  private tween?: gsap.core.Tween;

  ngOnChanges(): void {
    this.tween?.kill();
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.display.set(this.value());
      return;
    }

    const counter = { value: 0 };
    this.tween = gsap.to(counter, {
      value: this.value(),
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => this.display.set(Math.round(counter.value))
    });
  }

  ngOnDestroy(): void {
    this.tween?.kill();
  }
}
