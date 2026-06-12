import { ChangeDetectionStrategy, Component, OnChanges, OnDestroy, input, signal } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-xp-count',
  template: `{{ display() }} XP`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XpCountComponent implements OnChanges, OnDestroy {
  readonly value = input.required<number>();
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
      duration: 1.15,
      ease: 'power2.out',
      onUpdate: () => this.display.set(Math.round(counter.value))
    });
  }

  ngOnDestroy(): void {
    this.tween?.kill();
  }
}
