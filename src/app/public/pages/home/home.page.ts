import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContentItem, Faq, GalleryItem, Testimonial } from '../../../core/models/content.models';
import { LeadModalConfig } from '../../../core/models/lead.models';
import { StarStudent, Track } from '../../../core/models/track.models';
import { ContentService } from '../../../core/services/content.service';
import { AboutSectionComponent } from '../../components/about-section/about-section.component';
import { FaqSectionComponent } from '../../components/faq-section/faq-section.component';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { LeadCtaSectionComponent } from '../../components/lead-cta-section/lead-cta-section.component';
import { LeadFormModalComponent } from '../../components/lead-form-modal/lead-form-modal.component';
import { ReelsSectionComponent } from '../../components/reels-section/reels-section.component';
import { SessionExperienceSectionComponent } from '../../components/session-experience-section/session-experience-section.component';
import { StarsBoardSectionComponent } from '../../components/stars-board-section/stars-board-section.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';
import { TracksSectionComponent } from '../../components/tracks-section/tracks-section.component';
import { VisionMissionSectionComponent } from '../../components/vision-mission-section/vision-mission-section.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HeroSectionComponent,
    AboutSectionComponent,
    VisionMissionSectionComponent,
    TracksSectionComponent,
    SessionExperienceSectionComponent,
    StarsBoardSectionComponent,
    ReelsSectionComponent,
    GallerySectionComponent,
    TestimonialsSectionComponent,
    FaqSectionComponent,
    LeadCtaSectionComponent,
    LeadFormModalComponent
  ],
  template: `
    <main>
      <app-hero-section (openLead)="openLead($event)" />
      <app-about-section />
      <app-vision-mission-section />
      <app-tracks-section [tracks]="tracks()" (openLead)="openLead($event)" />
      <app-session-experience-section />
      <app-stars-board-section [stars]="stars()" />
      <app-reels-section [items]="contentItems()" />
      <app-gallery-section [items]="gallery()" />
      <app-testimonials-section [testimonials]="testimonials()" />
      <app-faq-section [faqs]="faqs()" />
      <app-lead-cta-section (openLead)="openLead($event)" />
      <app-lead-form-modal [config]="leadConfig()" (close)="leadConfig.set(null)" />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  private readonly content = inject(ContentService);
  readonly tracks = signal<Track[]>([]);
  readonly stars = signal<StarStudent[]>([]);
  readonly contentItems = signal<ContentItem[]>([]);
  readonly gallery = signal<GalleryItem[]>([]);
  readonly testimonials = signal<Testimonial[]>([]);
  readonly faqs = signal<Faq[]>([]);
  readonly leadConfig = signal<LeadModalConfig | null>(null);

  constructor() {
    void this.load();
  }

  openLead(config: LeadModalConfig): void {
    this.leadConfig.set(config);
  }

  private async load(): Promise<void> {
    const [tracks, stars, contentItems, gallery, testimonials, faqs] = await Promise.all([
      this.content.tracks(),
      this.content.stars(),
      this.content.contentItems(),
      this.content.gallery(),
      this.content.testimonials(),
      this.content.faqs()
    ]);

    this.tracks.set(tracks);
    this.stars.set(stars);
    this.contentItems.set(contentItems);
    this.gallery.set(gallery);
    this.testimonials.set(testimonials);
    this.faqs.set(faqs);
  }
}
