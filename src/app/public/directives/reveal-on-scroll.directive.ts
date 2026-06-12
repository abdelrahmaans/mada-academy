import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, inject, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appRevealOnScroll]',
  host: {
    class: 'motion-reveal'
  }
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private context?: gsap.Context;

  readonly revealStagger = input(0.08);
  readonly revealY = input(28);
  readonly revealTarget = input<':scope' | string>(':scope');

  ngAfterViewInit(): void {
    if (this.prefersReducedMotion()) {
      this.elementRef.nativeElement.classList.add('motion-ready');
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.context = gsap.context(() => {
        const target = this.revealTarget();
        const elements =
          target === ':scope'
            ? [this.elementRef.nativeElement]
            : gsap.utils.toArray<HTMLElement>(target, this.elementRef.nativeElement);

        gsap.fromTo(
          elements,
          { autoAlpha: 0, y: this.revealY() },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power2.out',
            stagger: this.revealStagger(),
            scrollTrigger: {
              trigger: this.elementRef.nativeElement,
              start: 'top 82%',
              once: true
            }
          }
        );
      }, this.elementRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.context?.revert();
  }

  private prefersReducedMotion(): boolean {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}
