import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LeadModalConfig } from '../../../core/models/lead.models';
import { Track } from '../../../core/models/track.models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { SectionBlobComponent } from '../visual-system/section-blob.component';
import { TrackIconVisualComponent } from '../visual-system/track-icon-visual.component';

@Component({
  selector: 'app-tracks-section',
  imports: [RevealOnScrollDirective, SectionBlobComponent, TrackIconVisualComponent],
  template: `
    <section id="tracks" class="mada-section relative overflow-hidden bg-[color-mix(in_srgb,var(--mada-mint)_28%,transparent)]">
      <app-section-blob tone="amber" />
      <div class="mada-shell relative">
        <div class="max-w-3xl" appRevealOnScroll>
          <p class="mada-eyebrow">Learning tracks</p>
          <h2 class="mt-4 text-4xl font-black">مسارات مناسبة لكل سن وطريقة تفكير</h2>
          <p class="mada-lead mt-4">كل مسار له أدواته ومخرجاته، لكن الهدف ثابت: طفل يفكر ويصمم ويبني.</p>
        </div>
        <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5" appRevealOnScroll revealTarget="article" [revealStagger]="0.09">
          @for (track of tracks(); track track.slug) {
            <article class="mada-card mada-card-interactive flex min-h-[390px] flex-col p-5" [style.--track-color]="trackVisual(track.slug).color">
              <div class="flex items-start justify-between gap-3">
                <app-track-icon-visual [slug]="track.slug" [alt]="track.title + ' visual'" />
                <span class="w-max rounded-full bg-[var(--mada-navy)] px-3 py-1 text-sm font-black text-white">{{ track.age }} سنة</span>
              </div>
              <h3 class="mt-4 text-2xl font-black">{{ track.title }}</h3>
              <p class="mt-2 text-sm font-bold text-[var(--track-color)]">{{ track.focus }}</p>
              <p class="mt-3 leading-7 text-[var(--muted)]">{{ track.description }}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                @for (tool of track.tools; track tool) {
                  <span class="rounded-full bg-[color-mix(in_srgb,var(--track-color)_14%,var(--surface))] px-3 py-1 text-xs font-black text-[var(--track-color)]">{{ tool }}</span>
                }
              </div>
              <p class="mt-auto pt-4 text-sm font-black">المخرج: {{ track.outcome }}</p>
              <button class="mada-btn mada-btn-primary mt-4 w-full" type="button" (click)="openLead.emit({ sourcePage: 'home', sourceSection: 'tracks', reason: 'start_track', selectedTrack: track.slug })">ابدأ هذا المسار</button>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TracksSectionComponent {
  readonly tracks = input.required<Track[]>();
  readonly openLead = output<LeadModalConfig>();

  trackVisual(slug: string): { color: string } {
    if (slug.includes('tiny')) {
      return { color: '#0d9488' };
    }

    if (slug.includes('explore')) {
      return { color: '#0d9488' };
    }

    if (slug.includes('build')) {
      return { color: '#0f172a' };
    }

    if (slug.includes('code')) {
      return { color: '#111827' };
    }

    if (slug.includes('web')) {
      return { color: '#f59e0b' };
    }

    return { color: '#0d9488' };
  }
}
