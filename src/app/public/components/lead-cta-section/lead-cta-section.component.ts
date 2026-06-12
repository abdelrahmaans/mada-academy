import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { LeadModalConfig } from '../../../core/models/lead.models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { FloatingCodeSymbolsComponent } from '../visual-system/floating-code-symbols.component';
import { MadaGridBackgroundComponent } from '../visual-system/mada-grid-background.component';

@Component({
  selector: 'app-lead-cta-section',
  imports: [RevealOnScrollDirective, FloatingCodeSymbolsComponent, MadaGridBackgroundComponent],
  template: `
    <section id="lead-final" class="mada-section">
      <div class="mada-shell relative overflow-hidden rounded-lg bg-[var(--mada-navy)] p-8 text-white shadow-2xl md:p-12" appRevealOnScroll>
        <app-mada-grid-background />
        <app-floating-code-symbols [symbols]="ctaSymbols" />
        <div class="relative grid items-center gap-8 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <p class="mada-eyebrow">ابدأ من هنا</p>
            <h2 class="mt-4 text-4xl font-black">مش عارف تبدأ منين؟</h2>
            <p class="mt-4 max-w-2xl text-lg leading-9 text-slate-200">سيب بياناتك، وهنساعدك نختار أنسب مسار لطفلك.</p>
            <button class="mada-btn mt-8 bg-[var(--mada-amber)] text-slate-950 shadow-[0_18px_44px_rgb(245_158_11_/_28%)]" type="button" (click)="openLead.emit({ sourcePage: 'home', sourceSection: 'final_cta', reason: 'free_workshop' })">خلينا نرشحلك المسار المناسب</button>
          </div>

          <aside class="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
            <p class="text-sm font-black text-teal-100">ابدأ المسار المناسب لطفلك</p>
            <div class="mt-4 grid gap-3">
              <div class="rounded-lg bg-white/10 p-3">
                <span class="text-xs text-slate-300">Track match</span>
                <strong class="mt-1 block">Mada Build</strong>
              </div>
              <div class="rounded-lg bg-white/10 p-3">
                <span class="text-xs text-slate-300">Next step</span>
                <strong class="mt-1 block">Free discovery call</strong>
              </div>
              <div class="rounded-lg bg-teal-400/15 p-3 font-mono text-sm text-teal-100">{{ '{' }} ready: true, xp: +120 {{ '}' }}</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadCtaSectionComponent {
  readonly openLead = output<LeadModalConfig>();
  readonly ctaSymbols = [
    { label: '{}', x: '7%', y: '12%', delay: '0s' },
    { label: '</>', x: '82%', y: '16%', delay: '0.8s' },
    { label: 'XP', x: '76%', y: '74%', delay: '1.2s' }
  ];
}
