import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, inject, output } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LeadModalConfig } from '../../../core/models/lead.models';
import { AchievementBadgeVisualComponent } from '../visual-system/achievement-badge-visual.component';
import { AnimatedMetricCardComponent } from '../visual-system/animated-metric-card.component';
import { CodeWindowVisualComponent } from '../visual-system/code-window-visual.component';
import { FloatingCodeSymbolsComponent } from '../visual-system/floating-code-symbols.component';
import { MadaGridBackgroundComponent } from '../visual-system/mada-grid-background.component';
import { OrbitalBadgesComponent } from '../visual-system/orbital-badges.component';
import { SectionBlobComponent } from '../visual-system/section-blob.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero-section',
  imports: [
    AchievementBadgeVisualComponent,
    AnimatedMetricCardComponent,
    CodeWindowVisualComponent,
    FloatingCodeSymbolsComponent,
    MadaGridBackgroundComponent,
    OrbitalBadgesComponent,
    SectionBlobComponent
  ],
  template: `
    <section id="lead-hero" class="mada-section relative overflow-hidden">
      <app-section-blob />
      <app-mada-grid-background />
      <app-floating-code-symbols />

      <div class="mada-shell relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p class="mada-eyebrow hero-copy">Premium Arabic-first coding academy</p>
          <h1 class="mada-title hero-copy">مش بنعلّم برمجة بس... بنبني طريقة تفكير</h1>
          <p class="mada-lead hero-copy mt-6">
            مدى أكاديمي بتساعد الأطفال من 6 لـ 16 سنة يتعلموا البرمجة كأداة لبناء التفكير، الإبداع، وحل المشكلات.
          </p>
          <div class="hero-copy mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button class="mada-btn mada-btn-primary" type="button" (click)="openLead.emit({ sourcePage: 'home', sourceSection: 'hero', reason: 'start_track' })">ابدأ مسار طفلك</button>
            <button class="mada-btn mada-btn-secondary" type="button" (click)="openLead.emit({ sourcePage: 'home', sourceSection: 'hero', reason: 'ask_question' })">احجز مكالمة تعريفية</button>
          </div>
          <div class="hero-copy mt-8 grid gap-3 sm:grid-cols-3">
            <app-animated-metric-card [value]="6" suffix="-16" label="سنوات" />
            <app-animated-metric-card [value]="60" label="دقيقة جلسة" />
            <app-animated-metric-card [value]="5" label="مسارات" />
          </div>
        </div>

        <div class="hero-visual relative min-h-[480px] sm:min-h-[540px]">
          <div class="absolute inset-4 rounded-full bg-[color-mix(in_srgb,var(--mada-mint)_42%,transparent)] blur-2xl" aria-hidden="true"></div>
          <div class="absolute inset-[8%] hidden sm:block">
            <app-orbital-badges />
          </div>

          <div class="hero-panel absolute inset-x-0 top-14 mx-auto w-[min(92%,430px)]">
            <!-- Replace hero abstract/screenshots in src/assets/visuals/hero or CMS when final brand artwork is ready. -->
            <app-code-window-visual
              title="mada-path.ts"
              code='const path = mada
  .discover(child)
  .pickTrack("logic")
  .buildProject();

award.badge("Thinker");
xp.add(120);'
            />
          </div>

          <div class="hero-badge-card absolute start-0 top-6 hidden sm:block">
            <app-achievement-badge-visual icon="XP" title="Session Sprint" [xp]="120" />
          </div>

          <div class="hero-badge-card absolute end-0 top-[58%]">
            <app-achievement-badge-visual icon="★" title="Logic Builder" [xp]="420" />
          </div>

          <div class="hero-badge-card absolute bottom-4 start-[10%] rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-4 shadow-xl backdrop-blur">
            <p class="text-xs font-black text-[var(--mada-teal)]">Track preview</p>
            <div class="mt-3 grid gap-2">
              @for (track of ['Tiny', 'Explore', 'Build']; track track) {
                <span class="rounded-lg bg-[color-mix(in_srgb,var(--mada-mint)_58%,transparent)] px-3 py-2 text-sm font-black text-teal-900">{{ track }}</span>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private context?: gsap.Context;

  readonly openLead = output<LeadModalConfig>();

  ngAfterViewInit(): void {
    if (this.prefersReducedMotion()) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.context = gsap.context(() => {
        gsap.from('.hero-copy', {
          autoAlpha: 0,
          y: 24,
          duration: 0.82,
          ease: 'power2.out',
          stagger: 0.09
        });

        gsap.from('.hero-panel, .hero-badge-card', {
          autoAlpha: 0,
          y: 18,
          scale: 0.98,
          duration: 0.86,
          ease: 'power2.out',
          stagger: 0.08
        });

        gsap.to('.hero-badge-card', {
          y: -12,
          duration: 4.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.42
        });

        gsap.to('.hero-visual', {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: this.elementRef.nativeElement,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8
          }
        });
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
